---
title: 配置
keywords: docs，jcohy-docs,gateway,配置
description: 配置
---

# 8. 配置

 Spring Cloud Gateway是通过一系列的`RouteDefinitionLocator`接口配置的，接口如下： 

**RouteDefinitionLocator.java.** 

```java
public interface RouteDefinitionLocator {
	Flux<RouteDefinition> getRouteDefinitions();
}
```

 默认情况下，`PropertiesRouteDefinitionLocator` 会通过Spring Boot的 `@ConfigurationProperties` 机制来加载路由配置 

 上面的所有配置示例都使用一种快捷配置，该快捷配置使用位置参数而不是命名参数。以下两个示例是等效的： 

**application.yml.** 

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: setstatus_route
        uri: https://example.org
        filters:
        - name: SetStatus
          args:
            status: 401
      - id: setstatusshortcut_route
        uri: https://example.org
        filters:
        - SetStatus=401
```

 通常情况下，properties的配置就已经够用的了，但也有一些人的需求是从外部源来加载配置文件，比如数据库等，所以官方也承诺未来的版本会基于Spring Data Repositories 实现 Redis, MongoDB 和 Cassandra 版本的`RouteDefinitionLocator` 。 

## 8.1 基于流式API的 Java 配置 路由

 除了上面的配置文件配置外，也可以通过 `RouteLocatorBuilder` 的流式API来进行java实现配置。 

**GatewaySampleApplication.java.** 

```java
// static imports from GatewayFilters and RoutePredicates
@Bean
public RouteLocator customRouteLocator(RouteLocatorBuilder builder, ThrottleGatewayFilterFactory throttle) {
    return builder.routes()
            .route(r -> r.host("**.abc.org").and().path("/image/png")
                .filters(f ->
                        f.addResponseHeader("X-TestHeader", "foobar"))
                .uri("http://httpbin.org:80")
            )
            .route(r -> r.path("/image/webp")
                .filters(f ->
                        f.addResponseHeader("X-AnotherHeader", "baz"))
                .uri("http://httpbin.org:80")
            )
            .route(r -> r.order(-1)
                .host("**.throttle.org").and().path("/get")
                .filters(f -> f.filter(throttle.apply(1,
                        1,
                        10,
                        TimeUnit.SECONDS)))
                .uri("http://httpbin.org:80")
            )
            .build();
}
```

 这种用法就可以通过实行 `Predicate` 接口来定义更复杂的匹配规则，也可以用 `and()`、`or()` 和 `negate()` 来组合不同的匹配规则，灵活性会更大一点。 

## 8.2 DiscoveryClient 自动定位路由

 通过服务发现客户端 `DiscoveryClient` ，gateway可以基于注册了的服务自动创建路由。 

 要启用此功能，请设置 `spring.cloud.gateway.discovery.locator.enabled = true` 并确保在类路径上启用了 DiscoveryClien t实现（例如 Netflix Eureka，Consul 或 Zookeeper ）。 

### 8.2.1  为DiscoveryClient 路由配置 predicate 和 filter  

 默认情况下gateway中的 `GatewayDiscoveryClientAutoConfiguration` 以及定义了一个 predicate 和 filter 的了。 

 默认的predicate是配置了 `/serviceId/**` 路径的path predicate，当然 `serviceId` 是 `DiscoveryClient` 里面的服务id。
默认的filter是配置了匹配参数 `/serviceId/(?.*)` 和替换参数 `/${remaining}` 的rewrite path filter，目的是将serviceId从path中去除掉，因为下游是不需要的。 

 你也可以自定义`DiscoveryClient`路由的 predicate 和 filter ，只需要设置`spring.cloud.gateway.discovery.locator.predicates[x]` 和`spring.cloud.gateway.discovery.locator.filters[y]` 即可。

这样做时，如果要保留该功能，则需要确保在上面包含默认 predicate  和 filter 。 以下是此示例的示例。 

**application.properties.** 

```properties
spring.cloud.gateway.discovery.locator.predicates[0].name: Path
spring.cloud.gateway.discovery.locator.predicates[0].args[pattern]: "'/'+serviceId+'/**'"
spring.cloud.gateway.discovery.locator.predicates[1].name: Host
spring.cloud.gateway.discovery.locator.predicates[1].args[pattern]: "'**.foo.com'"
spring.cloud.gateway.discovery.locator.filters[0].name: Hystrix
spring.cloud.gateway.discovery.locator.filters[0].args[name]: serviceId
spring.cloud.gateway.discovery.locator.filters[1].name: RewritePath
spring.cloud.gateway.discovery.locator.filters[1].args[regexp]: "'/' + serviceId + '/(?<remaining>.*)'"
spring.cloud.gateway.discovery.locator.filters[1].args[replacement]: "'/${remaining}'"
```

