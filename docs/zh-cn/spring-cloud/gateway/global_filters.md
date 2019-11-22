---
title: 全局过滤器
keywords: docs，jcohy-docs,全局过滤器,filter,GlobalFilter,gateway
description: 全局过滤器
---

# 6. 全局过滤器

`GlobalFilter` 接口具有与 `GatewayFilter`  接口都只有一个相同的方法，这些特殊的过滤器可以有条件的应用于所有的路由。（这些接口和用法在以后的版本中可能会被修改）。 

### 6.1 Combined Global Filter and GatewayFilter Ordering(过滤器的执行顺序)

 当一个请求到达一个Gateway的路由时，Filtering Web Handler会加载所有的GlobalFilter实例以及这个路由上配置的所有的GatewayFilter过滤器，然后组成一个完整的过滤链。这个过滤链中过滤器使用`org.springframework.core.Ordered` 接口进行排序，可以通过实现 `Ordered` 接口中的 `getOrder()` 方法或直接使用 `@Order`注解修改过滤器的顺序。

 由于Spring Cloud Gateway分开执行“pre”和“post”的过滤器，（可以参考前面讲Gateway如何工作的章节），因此，优先级高的过滤器将先执行“pre”类型的过滤器，最后执行“post”类型的的过滤器 

 **ExampleConfiguration.java.**  

```java
@Bean
@Order(-1)
public GlobalFilter a() {
    return (exchange, chain) -> {
        log.info("first pre filter");
        return chain.filter(exchange).then(Mono.fromRunnable(() -> {
            log.info("third post filter");
        }));
    };
}

@Bean
@Order(0)
public GlobalFilter b() {
    return (exchange, chain) -> {
        log.info("second pre filter");
        return chain.filter(exchange).then(Mono.fromRunnable(() -> {
            log.info("second post filter");
        }));
    };
}

@Bean
@Order(1)
public GlobalFilter c() {
    return (exchange, chain) -> {
        log.info("third pre filter");
        return chain.filter(exchange).then(Mono.fromRunnable(() -> {
            log.info("first post filter");
        }));
    };
}
```

 上面例子陆续会打印的是： 

```
first pre filter
second pre filter
third pre filter
first post filter
second post filter
third post filter
```



## 6.2 Forward Routing Filter

`ForwardRoutingFilter` 会查看exchange的属性 `ServerWebExchangeUtils.GATEWAY_REQUEST_URL_ATTR` 的URI内容，如果url的scheme是 `forward` ，比如：`forward://localendpoint` ，则它会使用Spirng的`DispatcherHandler` 来处理这个请求。

 请求URL的部分路径会被转发URL中的路径覆盖。 未经修改的原始URL会附加到`ServerWebExchangeUtils.GATEWAY_ORIGINAL_REQUEST_URL_ATTR` 属性中的列表中。

## 6.3 LoadBalancerClient Filter

`LoadBalancerClientFilter`会查看exchange的属性`ServerWebExchangeUtils.GATEWAY_REQUEST_URL_ATTR`的URI内容，如果url的scheme是`lb`，比如：`lb://myservice`，或者是`ServerWebExchangeUtils.GATEWAY_SCHEME_PREFIX_ATTR`属性的内容是`lb`，则它会使用Spring Cloud的`LoadBalancerClient`来将host转化为实际的host和port，并以此替换属性`ServerWebExchangeUtils.GATEWAY_REQUEST_URL_ATTR`的内容，原来的URL则会被添加到`ServerWebExchangeUtils.GATEWAY_ORIGINAL_REQUEST_URL_ATTR`属性的列表中。

 **application.yml.**  

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: myRoute
        uri: lb://service
        predicates:
        - Path=/service/**
```

> 默认情况下，如果`LoadBalancer`找不到服务实例，则会返回HTTP状态码`503`，你也可以通过修改`spring.cloud.gateway.loadbalancer.use404=true`配置修改为返回状态码`404`。
>
> 从LoadBalancer返回的服务实例的isSecure值将覆盖对网关的请求中指定的方案。 例如，如果请求通过HTTPS进入网关，但服务实例指示它是不安全的，则下游请求将通过HTTP发出。 相反的情况也可以适用。 但是，如果在网关配置中为路由指定了 `GATEWAY_SCHEME_PREFIX_ATTR`，则前缀将被删除，并且路由URL产生的方案将覆盖服务实例配置。

## 6.4 Netty Routing Filter

如果 `ServerWebExchangeUtils.GATEWAY_REQUEST_URL_ATTR` 属性中的url的scheme是`http` 或 `https` ，则Netty Routing Filter 才会执行，并使用 Netty 作为 http 请求客户端对下游进行代理请求。请求的响应会放在exchange的`ServerWebExchangeUtils.CLIENT_RESPONSE_ATTR` 属性中，以便后面的filter做进一步的处理。

## 6.5 Netty Write Response Filter

如果 `NettyWriteResponseFilter` 发现exchange的 `ServerWebExchangeUtils.CLIENT_RESPONSE_ATTR` 属性中存在Netty的 `HttpClientResponse` 类型实例，在所有过滤器都执行完毕后，它会将响应写回到gateway客户端的响应中。

## 6.6 RouteToRequestUrl Filter

如果exchange的 `ServerWebExchangeUtils.GATEWAY_ROUTE_ATTR` 属性存放了 `Route` 对象，则 `RouteToRequestUrlFilter` 会根据基于请求的URI创建新的URI，新的URI会更新到 `ServerWebExchangeUtils.GATEWAY_REQUEST_URL_ATTR` 属性中。

如果URI有scheme前缀，比如： `lb:ws://serviceid` ， `lb` scheme截取出来放到 `ServerWebExchangeUtils.GATEWAY_SCHEME_PREFIX_ATTR` 属性中，方便后面的filter使用。

## 6.7 Websocket Routing Filter

 如果请求URL的scheme是 `ws` 或 `wss` 的话，那么Websocket Routing Filter就会使用Spring Web Socket底层来处理对下游的请求转发。 

Websocket可以通过为URI加上lb前缀来实现负载平衡，例如 `lb:ws://serviceid`。

>  如果在客户端使用了  [SockJS](https://github.com/sockjs)  ，那么应该配置一个普通的Http路由 。

 **application.yml.**  

```yaml
spring:
  cloud:
    gateway:
      routes:
      # SockJS route
      - id: websocket_sockjs_route
        uri: http://localhost:3001
        predicates:
        - Path=/websocket/info/**
      # Normwal Websocket route
      - id: websocket_route
        uri: ws://localhost:3001
        predicates:
        - Path=/websocket/**
```

##  6.8 Gateway Metrics Filter

 这个全局过滤器的实现类是：GatewayMetricsFilter，它用来统计一些网关的性能指标。需要添加 `spring-boot-starter-actuator` 的项目依赖，  默认情况下，只要 `spring.cloud.gateway.metrics.enabled` 设置不是 `false`，这个过滤器就生效。这个过滤器会添加一个名字为 `gateway.requests`和 `tags` 为如下的 `timer metric`: 

- `routeId`:  路由的id 
- `routeUri`:  被路由的URI 
- `outcome`:  被  [HttpStatus.Series](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/http/HttpStatus.Series.html) 标记的结果
- `status`:  返回给客户端的http状态码 
- `httpStatusCode`: 返回给客户端的http状态码 
- `httpMethod`: 请求的HTTP方法

 这些指标可以通过 `/actuator/metrics/gateway.requests` 查看，并且可以轻松地将它们与Prometheus集成以创建 [Grafana](https://cloud.spring.io/spring-cloud-static/spring-cloud-gateway/2.1.3.RELEASE/single/images/gateway-grafana-dashboard.jpeg) [dashboard](https://cloud.spring.io/spring-cloud-static/spring-cloud-gateway/2.1.3.RELEASE/single/gateway-grafana-dashboard.json). 。

> 要启用Prometheus端点，请添加 micrometer-registry-prometheus 作为项目依赖项。

## 6.9 Marking An Exchange As Routed

网关路由 `ServerWebExchange`之后，它将通过 `gatewayAlreadyRouted` 的 exchange 属性来将该  exchange 标记为 “已路由” 。 将请求标记为已路由后，其他路由过滤器将不会再次路由该请求，会跳过该过滤器。 有两个方便的方法，你可以使用它们标记已路由过或检测是否已路由过 

- `ServerWebExchangeUtils.isAlreadyRouted`  ：接收 `ServerWebExchange` 对象，并检查其是否已“路由”
- `ServerWebExchangeUtils.setAlreadyRouted` : 接受 `ServerWebExchange` 对象，并将其标记为“已路由”
