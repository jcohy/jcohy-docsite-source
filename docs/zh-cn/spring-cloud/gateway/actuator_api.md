---
title: Actuator API
keywords: docs，jcohy-docs,Actuator API,actuator,api,gateway
description: Actuator API
---

# 11. Actuator API

Spring Cloud Gateway应用程序允许监视 `/gateway` 端点 并与之交互。 为了可远程访问，必须在应用程序属性中通过HTTP或JMX启用和暴露端点。

**application.properties.** 

```properties
management.endpoint.gateway.enabled=true # default value
management.endpoints.web.exposure.include=gateway
```

## 11.1 详细的监控格式

一种新的，更详细的格式已添加到网关。 这为每个路由增加了更多细节，从而允许查看与每个路由关联的  predicates   和 filters  以及任何可用的配置。

 `/actuator/gateway/routes `

```json
[
  {
    "predicate": "(Hosts: [**.addrequestheader.org] && Paths: [/headers], match trailing slash: true)",
    "route_id": "add_request_header_test",
    "filters": [
      "[[AddResponseHeader X-Response-Default-Foo = 'Default-Bar'], order = 1]",
      "[[AddRequestHeader X-Request-Foo = 'Bar'], order = 1]",
      "[[PrefixPath prefix = '/httpbin'], order = 2]"
    ],
    "uri": "lb://testservice",
    "order": 0
  }
]
```

要启用此功能，请设置以下属性：

**application.properties.** 

```properties
spring.cloud.gateway.actuator.verbose.enabled=true
```

## 11.2 查看路由过滤器

### 11.2.1 全局过滤器

要检索   [global filters](https://cloud.spring.io/spring-cloud-static/spring-cloud-gateway/2.1.3.RELEASE/single/spring-cloud-gateway.html#) ，请向 `/actuator/gateway/globalfilters` 发出GET请求。 产生的响应类似于以下内容：

```json
{
  "org.springframework.cloud.gateway.filter.LoadBalancerClientFilter@77856cc5": 10100,
  "org.springframework.cloud.gateway.filter.RouteToRequestUrlFilter@4f6fd101": 10000,
  "org.springframework.cloud.gateway.filter.NettyWriteResponseFilter@32d22650": -1,
  "org.springframework.cloud.gateway.filter.ForwardRoutingFilter@106459d9": 2147483647,
  "org.springframework.cloud.gateway.filter.NettyRoutingFilter@1fbd5e0": 2147483647,
  "org.springframework.cloud.gateway.filter.ForwardPathFilter@33a71d23": 0,
  "org.springframework.cloud.gateway.filter.AdaptCachedBodyGlobalFilter@135064ea": 2147483637,
  "org.springframework.cloud.gateway.filter.WebsocketRoutingFilter@23c05889": 2147483646
}
```

该响应以字符串的形式展示全局过滤器的详细信息以及在过滤器链中的顺序

### 11.2.2 路由过滤器

要检索  [GatewayFilter factories](https://cloud.spring.io/spring-cloud-static/spring-cloud-gateway/2.1.3.RELEASE/single/spring-cloud-gateway.html#) ，请向 `/actuator/gateway/routefilters` 发出GET请求。 产生的响应类似于以下内容：

```json
{
  "[AddRequestHeaderGatewayFilterFactory@570ed9c configClass = AbstractNameValueGatewayFilterFactory.NameValueConfig]": null,
  "[SecureHeadersGatewayFilterFactory@fceab5d configClass = Object]": null,
  "[SaveSessionGatewayFilterFactory@4449b273 configClass = Object]": null
}
```

该响应以字符穿形式展示了应用于任何特定路由的   GatewayFilter factories  。 请注意， 后面的`null`是某些GatewayFilter factory实现问题，本来是用来展示`order`的，但是GatewayFilter factory没有实现，就返回`null`了。 

##  11.3 刷新路由

 使用 `POST` 请求gateway地址 `/actuator/gateway/refresh` ，并返回http状态码为200，标识刷新路由缓存成功。 

## 11.4 查看路由定义信息

 使用`GET`请求 gateway 地址`/actuator/gateway/routes`，获取类似下面的返回： 

```json
[{
  "route_id": "first_route",
  "route_object": {
    "predicate": "org.springframework.cloud.gateway.handler.predicate.PathRoutePredicateFactory$$Lambda$432/1736826640@1e9d7e7d",
    "filters": [
      "OrderedGatewayFilter{delegate=org.springframework.cloud.gateway.filter.factory.PreserveHostHeaderGatewayFilterFactory$$Lambda$436/674480275@6631ef72, order=0}"
    ]
  },
  "order": 0
},
{
  "route_id": "second_route",
  "route_object": {
    "predicate": "org.springframework.cloud.gateway.handler.predicate.PathRoutePredicateFactory$$Lambda$432/1736826640@cd8d298",
    "filters": []
  },
  "order": 0
}]
```

 该响应包含网关中定义的所有路由的详细信息。下表描述了响应的每个元素（即，路由）的结构。 

| Path                     | Type   | Description                                                  |
| ------------------------ | ------ | ------------------------------------------------------------ |
| `route_id`               | String | 路由id                                                       |
| `route_object.predicate` | Object | 路由 predicate                                               |
| `route_object.filters`   | Array  | [GatewayFilter factories](https://cloud.spring.io/spring-cloud-static/spring-cloud-gateway/2.1.3.RELEASE/single/spring-cloud-gateway.html#) |
| `order`                  | Number | 路由顺序                                                     |

## 11.5 查看指定路由信息

 使用`GET`请求 gateway 地址  `/actuator/gateway/routes/{id}` ，  (例如, `/actuator/gateway/routes/first_route`). 获取类似下面的返回： 

```json
{
  "id": "first_route",
  "predicates": [{
    "name": "Path",
    "args": {"_genkey_0":"/first"}
  }],
  "filters": [],
  "uri": "https://www.uri-destination.org",
  "order": 0
}]
```

 下表描述了响应的结构。 

| Path         | Type   | Description            |
| ------------ | ------ | ---------------------- |
| `id`         | String | 路由Id                 |
| `predicates` | Array  | 路由 `predicates` 集合 |
| `filters`    | Array  | 路由过滤器集合         |
| `uri`        | String | 路由的目标URI          |
| `order`      | Number | luyou shunxu           |

## 11.6 创建和删除指定路由

 创建路由，使用`POST`请求，并附带上一节中的类似 json body，到`/gateway/routes/{id_route_to_create}`即可。 

 删除路由，使用`DELETE`请求地址`/gateway/routes/{id_route_to_delete}`即可。 

## 11.7 Actuator API汇总

 下表总结了 Spring Cloud Gateway 端点。请注意，每个端点都将 `/actuator/gateway` 作为基本路径。 

| ID              | HTTP Method | Description                     |
| --------------- | ----------- | ------------------------------- |
| `globalfilters` | GET         | 展示global filters信息          |
| `routefilters`  | GET         | 展示GatewayFilter factories信息 |
| `refresh`       | POST        | 刷新路由缓存                    |
| `routes`        | GET         | 展示路由定义信息                |
| `routes/{id}`   | GET         | 展示单个路由信息                |
| `routes/{id}`   | POST        | 添加新的路由                    |
| `routes/{id}`   | DELETE      | 移除路由                        |

