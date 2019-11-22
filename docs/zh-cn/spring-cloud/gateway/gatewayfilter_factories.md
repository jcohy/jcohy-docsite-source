---
title: 网关过滤器工厂
keywords: docs，jcohy-docs,gateway,filter
description: 网关过滤器工厂
---

# 5.  网关过滤器工厂

路由过滤器允许以某种方式修改传入的HTTP请求或传出的HTTP响应。 路由过滤器适用于特定路由。 Spring Cloud Gateway包括许多内置的GatewayFilter工厂。

注意有关如何使用以下任何过滤器的更多详细示例，请看一下  [单元测试](https://github.com/spring-cloud/spring-cloud-gateway/tree/master/spring-cloud-gateway-core/src/test/java/org/springframework/cloud/gateway/filter/factory)。

## 5.1 AddRequestHeader  过滤器工厂

 输入两个参数：Header Name、Value，向下游请求地址添加 Header 信息，示例配置： 

application.yml

```
spring:
  cloud:
    gateway:
      routes:
      - id: add_request_header_route
        uri: https://example.org
        filters:
        - AddRequestHeader=X-Request-Foo, Bar
```

这会将 `X-Request-Foo：Bar` 请求头添加到所有匹配请求的下游请求的请求头中。

`AddRequestHeader`  结合 Path 或 Uri 路由，再添加 Header 信息，示例配置： 

application.yml

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: add_request_header_route
        uri: https://example.org
        predicates:
        - Path=/foo/{segment}
        filters:
        - AddRequestHeader=X-Request-Foo, Bar-{segment}
```

## 5.2 AddRequestParameter 过滤器工厂

 输入两个参数：Request Query Name、Value，向下游请求地址添加 URL 参数信息，示例配置： 

application.yml

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: add_request_parameter_route
        uri: https://example.org
        filters:
        - AddRequestParameter=foo, bar
```

这会将 `foo = bar` 添加到所有匹配请求的下游请求的查询字符串中。

`AddRequestParameter ` 结合 Path 或 Uri 路由， 再添加 URL 参数信息 ，示例配置： 

application.yml

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: add_request_parameter_route
        uri: https://example.org
        predicates:
        - Host: {segment}.myhost.org
        filters:
        - AddRequestParameter=foo, bar-{segment}
```

## 5.3 AddResponseHeader 过滤器工厂

 输入两个参数：Header Name、Value，下游请求完成后在 Response 添加 Header 信息，示例配置： 

application.yml

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: add_response_header_route
        uri: https://example.org
        filters:
        - AddResponseHeader=X-Response-Foo, Bar
```

 这会将 `X-Response-Foo:Bar` 请求头添加到所有匹配请求的下游响应头中。

AddResponseHeader 结合 Path 或 Uri 路由， 再添加 ResponseHeader 参数信息

application.yml

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: add_response_header_route
        uri: https://example.org
        predicates:
        - Host: {segment}.myhost.org
        filters:
        - AddResponseHeader=foo, bar-{segment}
```

## 5.4 DedupeResponseHeader 过滤器工厂

 输入两个参数：Header Name、Strategy【可选】，Header Name 可以多个请求头列表，用空格隔开，示例配置： 

application.yml

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: dedupe_response_header_route
        uri: https://example.org
        filters:
        - DedupeResponseHeader=Access-Control-Allow-Credentials Access-Control-Allow-Origin
```

如果 Spring Cloud Gateway  和 下游 都设置跨域时， 将在 Response Header 中移除重复的  `Access-Control-Allow-Credentials` 和`Access-Control-Allow-Origin` 。

DedupeResponseHeader 过滤器还接受可选的策略参数。 接受的值为 

- RETAIN_FIRST（默认值）： 保留第一个值【默认】 

- RETAIN_LAST ： 保留最后一个值 

- RETAIN_UNIQUE ： 保留所有唯一值，以它们第一次出现的顺序保留 

## 5.5 Hystrix 过滤器工厂

Hystrix是Netflix的一个库，用于实现断路器模式。 Hystrix 过滤器工厂允许您将断路器引入网关路由，保护您的服务免受级联故障的影响，并允许您在下游故障的情况下提供后备响应。

要在项目中启用Hystrix 过滤器工厂，请添加对Spring Cloud Netflix的 `spring-cloud-starter-netflix-hystrix` 的依赖。

Hystrix 过滤器工厂工厂需要一个 `name` 参数，即 `HystrixCommand` 的名称。

application.yml

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: hystrix_route
        uri: https://example.org
        filters:
        - Hystrix=myCommandName
```

 这会将其余的过滤器包装在名为 `myCommandName` 的 `HystrixCommand` 中。 

 Hystrix过滤器还可以接受可选的 `fallbackUri` 参数。当前，仅支持 `forward:`  的URI。如果调用失败，则请求将被转发到与URI相匹配的控制器 

application.yml

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: hystrix_route
        uri: lb://backing-service:8088
        predicates:
        - Path=/consumingserviceendpoint
        filters:
        - name: Hystrix
          args:
            name: fallbackcmd
            fallbackUri: forward:/incaseoffailureusethis
        - RewritePath=/consumingserviceendpoint, /backingserviceendpoint
```

 当调用 Hystrix fallback 时，它将转发到 `/incaseoffailureusethis` URI。请注意，此示例还通过目标URI上的lb前缀演示了（可选）Spring Cloud Netflix Ribbon负载平衡。 

 主要方案是将 `fallbackUri` 用于网关应用程序中的内部控制器或处理程序。但是，也可以将请求重新路由到外部应用程序中的控制器或处理程序，如下所示： 

application.yml

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: ingredients
        uri: lb://ingredients
        predicates:
        - Path=//ingredients/**
        filters:
        - name: Hystrix
          args:
            name: fetchIngredients
            fallbackUri: forward:/fallback
      - id: ingredients-fallback
        uri: http://localhost:9994
        predicates:
        - Path=/fallback
```

 在此示例中，网关应用程序中没有 调用失败的端点或处理程序，该应用程序在 `http://localhost:9994` 下注册。 

如果将请求调用失败，则Hystrix网关过滤器还会提供引起该请求的 Throwable。 它作为`ServerWebExchangeUtils.HYSTRIX_EXECUTION_EXCEPTION_ATTR` 属性添加到 `ServerWebExchange`，可在网关应用程序中处理后备时使用

 对于外部控制器/处理程序方案，可以添加带有异常详细信息的请求头。您可以在  [FallbackHeaders GatewayFilter Factory部分中](https://cloud.spring.io/spring-cloud-static/spring-cloud-gateway/2.1.3.RELEASE/single/spring-cloud-gateway.html#fallback-headers) 找到有关它的更多信息。 

Hystrix设置（例如超时）可以配置为全局默认值，也可以使用 [Hystrix wiki](https://github.com/Netflix/Hystrix/wiki/Configuration) 上说明的应用程序属性在逐条路由的基础上进行配置。

 要为上述示例路由设置5秒超时，将使用以下配置： 

application.yml

```yaml
hystrix.command.fallbackcmd.execution.isolation.thread.timeoutInMilliseconds: 5000
```

## 5.6 FallbackHeaders 过滤器工厂

 FallbackHeaders 过滤器工厂允许您在转发到外部应用程序中的 `fallbackUri` 的请求的请求头中添加 Hystrix 执行异常详细信息，如以下情况： 

application.yml

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: ingredients
        uri: lb://ingredients
        predicates:
        - Path=//ingredients/**
        filters:
        - name: Hystrix
          args:
            name: fetchIngredients
            fallbackUri: forward:/fallback
      - id: ingredients-fallback
        uri: http://localhost:9994
        predicates:
        - Path=/fallback
        filters:
        - name: FallbackHeaders
          args:
            executionExceptionTypeHeaderName: Test-Header
```

在此示例中，在运行 HystrixCommand时发生执行异常后，该请求将转发到在 `localhost：9994` 上运行的应用程序中的端点或处理程序。 具有异常类型，消息和-if available-根本原因异常类型和消息的请求头将由`FallbackHeaders` 过滤器添加到该请求中。

通过设置下面列出的参数的值及其默认值，可以在配置中覆盖请求头的名称：

- `executionExceptionTypeHeaderName` (`"Execution-Exception-Type"`)

- `executionExceptionMessageHeaderName` (`"Execution-Exception-Message"`)

- `rootCauseExceptionTypeHeaderName` (`"Root-Cause-Exception-Type"`)

- `rootCauseExceptionMessageHeaderName` (`"Root-Cause-Exception-Message"`)

  

您可以在 Hystrix 过滤器工厂部分中找到有关Hystrix如何与Gateway一起工作的更多信息。

## 5.7 MapRequestHeader 过滤器工厂

 输入两个参数：Header1、Header2，将上游 Header1 的值赋值到下游 Header2 

 如果输入请求头不存在，则过滤器不起作用。 如果新的请求头已经存在，则其值将使用新值进行扩充。

application.yml

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: map_request_header_route
        uri: https://example.org
        filters:
        - MapRequestHeader=Bar, X-Request-Foo
```

这会将上游请求头中 `Bar` 的值 赋值到 下游请求`X-Request-Foo：<values>` 中。

## 5.8 PrefixPath 过滤器工厂

 输入一个参数：prefix，在请求路径中添加前缀路径，示例配置： 

application.yml

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: prefixpath_route
        uri: https://example.org
        filters:
        - PrefixPath=/mypath
```

这会将 `/mypath` 作为所有匹配请求的路径的前缀。 因此，对 `/hello` 的请求将发送到 `/mypath/hello` 。

## 5.9 PreserveHostHeader 过滤器工厂

没有参数

此过滤器设置一个请求属性，路由过滤器将检查该请求属性以确定是否应发送原始主机请求，而不是由HTTP客户端确定的主机请求头。

application.yml

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: preserve_host_route
        uri: https://example.org
        filters:
        - PreserveHostHeader
```

##  5.10 RequestRateLimiter 过滤器工厂

RequestRateLimiter 过滤器工厂使用 RateLimiter 实现来确定是否允许当前请求继续进行。 如果不是，则会返回HTTP 429-太多请求（默认）状态。

输入两个参数： `keyResolver`（可选），特定于速率限制器的参数

`keyResolver` 是一个实现KeyResolver接口的bean。在配置中，使用SpEL按名称引用bean。 ＃{@ myKeyResolver}是一个SpEL表达式，它引用名为myKeyResolver的bean。

`KeyResolver` 的默认实现是 `PrincipalNameKeyResolver` ，它从 `ServerWebExchange `检索 `Principal ` 并调用`Principal.getName()`。

默认情况下，如果 `KeyResolver` 找不到 `key`，则请求将被拒绝。 可以使用 `spring.cloud.gateway.filter.request-rate-limiter.deny-empty-key` （true或false）和`spring.cloud.gateway.filter.request-rate-limiter.empty-key-status-code` 属性来调整此行为

无法通过“快捷方式”符号配置 `RequestRateLimiter`。 以下示例无效

application.yml

```
# 无效的快捷配置
spring.cloud.gateway.routes[0].filters[0]=RequestRateLimiter=2, 2, #{@userkeyresolver}
```

### 5.10.1 Redis RateLimiter

Redis的实现基于 [Stripe](https://stripe.com/blog/rate-limiters) 完成的工作。 它需要使用 `spring-boot-starter-data-redis-reactive` Spring Boot starter。

使用的算法是  [令牌桶算法](https://en.wikipedia.org/wiki/Token_bucket)。

 `redis-rate-limiter.replenishRate ` 是您希望用户每秒允许多少个请求，而没有任何丢弃的请求。 这是令牌桶被填充的速率。

` redis-rate-limiter.burstCapac `   是允许用户在一秒钟内执行的最大请求数。这是令牌桶可以容纳的令牌数。将此值设置为零将阻止所有请求。 

将 `replenishRate` 和 `burstCapacity` 设置为相同的值可以实现稳定的速率。 

`burstCapacity` 设置为高于`replenishRate`，可以允许临时突发。 在这种情况下，速率限制器需要在两次突发之间保留一段时间（根据 `replenishRate`），因为连续2次突发将导致请求丢弃（HTTP 429-太多请求）。

application.yml

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: requestratelimiter_route
        uri: https://example.org
        filters:
        - name: RequestRateLimiter
          args:
            redis-rate-limiter.replenishRate: 10
            redis-rate-limiter.burstCapacity: 20
```

 **Config.java.**  

```java
@Bean
KeyResolver userKeyResolver() {
    return exchange -> Mono.just(exchange.getRequest().getQueryParams().getFirst("user"));
}
```

 这定义了每个用户10的请求速率限制。允许20个突发，但是下一秒只有10个请求可用。 `KeyResolver` 是获取 `user` 请求参数的简单方法（注意：不建议在生产环境中使用）。 

 也可以自定义速率限制器，只需要实现 `RateLimiter` 接口 。使用SpEL按名称引用bean。

 **application.yml.**  

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: requestratelimiter_route
        uri: https://example.org
        filters:
        - name: RequestRateLimiter
          args:
            rate-limiter: "#{@myRateLimiter}"
            key-resolver: "#{@userKeyResolver}"
```

## 5.11 RedirectTo 过滤器工厂

 输入两个参数：Status Code、URL，

Status Code 应该是300系列重定向http代码 。例如301 

 URL应该是有效的URL ，将在 Response 中把 URL 赋值给 `Location` 属性 

 **application.yml.**  

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: prefixpath_route
        uri: https://example.org
        filters:
        - RedirectTo=302, https://acme.org
```

这将发送带有 `Location:https://acme.org` 请求头的 状态302以执行重定向。

## 5.12 RemoveHopByHopHeadersFilter 过滤器工厂

从转发的请求中删除请求头。 默认被删除的请求头列表来自   [IETF](https://tools.ietf.org/html/draft-ietf-httpbis-p1-messaging-14#section-7.1.3)。

默认删除的请求头

- Connection
- Keep-Alive
- Proxy-Authenticate
- Proxy-Authorization
- TE
- Trailer
- Transfer-Encoding
- Upgrade

要更改此设置，请将 `spring.cloud.gateway.filter.remove-non-proxy-headers.headers` 属性设置为要删除的请求头名称列表。

## 5.13 RemoveRequestHeader 过滤器工厂

 输入一个参数：Header Name，请求下游前移除指定 Header 

 **application.yml** 

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: removerequestheader_route
        uri: https://example.org
        filters:
        - RemoveRequestHeader=X-Request-Foo
```

在发送下游请求前删除 `X-Request-Foo` 请求头

## 5.14 RemoveResponseHeader 过滤器工厂

 输入一个参数：Header Name，下游请求完毕后移除 Response 指定 Header 

 **application.yml.**  

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: removeresponseheader_route
        uri: https://example.org
        filters:
        - RemoveResponseHeader=X-Response-Foo
```

这将从响应中删除 `X-Response-Foo` 请求头，然后将其返回到网关客户端。

要删除任何类型的敏感请求头，应为可能要配置的任何路由配置此过滤器。 另外，您可以使用`spring.cloud.gateway.default-filters` 一次配置此过滤器，并将其应用于所有路由。

## 5.15. RewritePath 过滤器工厂

 输入两个参数：正则表达式、替代值，匹配请求路径并按指定规则替换 

 **application.yml.**  

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: rewritepath_route
        uri: https://example.org
        predicates:
        - Path=/foo/**
        filters:
        - RewritePath=/foo/(?<segment>.*), /$\{segment}
```

对于 `/foo/bar` 的请求路径，这将在发出下游请求之前将路径设置为 `/bar`。 请注意，由于YAML规范，将 `$\`替换为 `$`。

## 5.16. RewriteLocationResponseHeader 过滤器工厂

 输入四个参数：`stripVersionMode`、`locationHeaderName`、`hostValue`、`protocolsRegex`，修改 Response Header 的 `Location` 

 **application.yml.**  

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: rewritelocationresponseheader_route
        uri: http://example.org
        filters:
        - RewriteLocationResponseHeader=AS_IN_REQUEST, Location, ,
```

 例如，请求为  `POST https://api.example.com/some/object/name`,  Response header 的值 `https://object-service.prod.example.net/v2/some/object/id` 将被改为`https://api.example.com/some/object/id`.

 参数 `stripVersionMode` 可选值如下： 

- `NEVER_STRIP`：版本信息不会被剥离，即使原始请求路径不包含版本

-  `AS_IN_REQUEST`：仅当原始请求路径不包含任何版本时，才会剥离版本【默认】

-  `ALWAYS_STRIP`：即使原始请求路径包含版本，也会剥离版本

 参数 `hostValue`，如果提供，会替换 Response Header `Location` 值中的 `host:port` 部分；如果不提供，则会使用 Request 的 `Host` 作为默认值 

 参数 `protocolRegex`，协议会与该值匹配，如果不匹配，过滤器不回做任何操作，默认值 `http|https|ftp|ftps` 

## 5.17. RewriteResponseHeader 过滤器工厂

 输入三个参数：Response Header Name、正则表达式、替换值，匹配指定 Response Header 的值并替换

 **application.yml.**  

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: rewriteresponseheader_route
        uri: https://example.org
        filters:
        - RewriteResponseHeader=X-Response-Foo, , password=[^&]+, password=***
```

假设 `X-Response-Foo` 值为 `/42?user=ford&password=omg!what&flag=true`，会被重置为 `/42?user=ford&password=***&flag=true`

## 5.18. SaveSession 过滤器工厂

在调用下游请求之前强制执行   `WebSession::save`  操作，这在将  [Spring Session](https://projects.spring.io/spring-session/)  之类的东西与惰性数据存储一起使用时特别有用，并且需要确保在进行转发之前已保存会话状态。

 **application.yml.**  

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: save_session
        uri: https://example.org
        predicates:
        - Path=/foo/**
        filters:
        - SaveSession
```

如果您将  [Spring Security](https://projects.spring.io/spring-security/)  与 Spring Session 集成在一起，并且想要确保安全性详细信息已转发到远程进程，那么这一点至关重要。

## 5.19. SecureHeaders 过滤器工厂

 依据 [Everything you need to know about HTTP security headers](https://links.jianshu.com/go?to=https%3A%2F%2Fblog.appcanary.com%2F2017%2Fhttp-security-headers.html) 这篇文章，该过滤器在 Response 中添加了一系列 Header 及默认值： 

添加了一下请求头（以及默认值）

- `X-Xss-Protection:1; mode=block`

- `Strict-Transport-Security:max-age=631138519`

- `X-Frame-Options:DENY`

- `X-Content-Type-Options:nosniff`

- `Referrer-Policy:no-referrer`

- `Content-Security-Policy:default-src 'self' https:; font-src 'self' https: data:; img-src 'self' https: data:; object-src 'none'; script-src https:; style-src 'self' https: 'unsafe-inline'`

- `X-Download-Options:noopen`

- `X-Permitted-Cross-Domain-Policies:none`

如需修改默认值，可以通过 spring.cloud.gateway.filter.secure-header 命名空间来设置：  

- `xss-protection-header`
- `strict-transport-security`
- `frame-options`
- `content-type-options`
- `referrer-policy`
- `content-security-policy`
- `download-options`
- `permitted-cross-domain-policies`

要禁用默认值，请设置属性 `spring.cloud.gateway.filter.secure-headers.disable` ，并用逗号分隔值。

 **Example:** `spring.cloud.gateway.filter.secure-headers.disable=frame-options,download-options` 

## 5.20. SetPath 过滤器工厂

 输入一个参数：template，匹配 Spring Framework URI 路径模板并修改，允许多个匹配

 **application.yml.**  

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: setpath_route
        uri: https://example.org
        predicates:
        - Path=/foo/{segment}
        filters:
        - SetPath=/{segment}
```

 如上所示，请求 `/foo/bar` 会被设置为 `/bar` 到下游 

## 5.21. SetRequestHeader 过滤器工厂

 输入两个参数：Header Name、Value，设置指定的 Request Header 信息，示例配置： 

 **application.yml.**  

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: setrequestheader_route
        uri: https://example.org
        filters:
        - SetRequestHeader=X-Request-Foo, Bar
```

 与 `AddRequestHeader GatewayFilter Factory` 不同的是，这是替换 Header 而不是添加 

 该GatewayFilter用给定的名称替换所有请求头，而不是添加。因此，如果下游服务器响应X-Request-Foo：1234，则将其替换为X-Request-Foo：Bar，这是下游服务将收到的信息。 

`SetRequestHeader `  结合 Path 或 Uri 路由，再添加 Header 信息，示例配置： 

 **application.yml.**  

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: setrequestheader_route
        uri: https://example.org
        predicates:
        - Host: {segment}.myhost.org
        filters:
        - SetRequestHeader=foo, bar-{segment}
```

## 5.22. SetResponseHeader 过滤器工厂

 输入两个参数：Header Name、Value，设置指定的 Response Header 信息 

 **application.yml.** 

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: setresponseheader_route
        uri: https://example.org
        filters:
        - SetResponseHeader=X-Response-Foo, Bar
```

 这是替换 Header 而不是添加 

`SetResponseHeader `  结合 Path 或 Uri 路由，再添加 Header 信息，示例配置： 

 **application.yml.**  

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: setresponseheader_route
        uri: https://example.org
        predicates:
        - Host: {segment}.myhost.org
        filters:
        - SetResponseHeader=foo, bar-{segment}
```

## 5.23. SetStatus 过滤器工厂

 输入一个参数：status， 它必须是有效的Spring HttpStatus。 它可以是整数值404或枚举NOT_FOUND的字符串表示形式。

 **application.yml.**  

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: setstatusstring_route
        uri: https://example.org
        filters:
        - SetStatus=BAD_REQUEST
      - id: setstatusint_route
        uri: https://example.org
        filters:
        - SetStatus=401
```

 无论哪种情况，响应的HTTP状态都将设置为401。 

## 5.24. StripPrefix 过滤器工厂

 输入一个参数：parts，parts 值为正整数，剥离部分请求路径

 **application.yml.**  

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: nameRoot
        uri: http://nameservice
        predicates:
        - Path=/name/**
        filters:
        - StripPrefix=2
```

 如上所示，请求路径 `/name/bar/foo`，会剥离前面 2 级路径 `/name/bar`，最终请求到  `http://nameservice/foo`

## 5.25. Retry 过滤器工厂

 该过滤器用于重试请求，支持如下参数的配置： 

- `retries`:  重试的次数 
- `statuses`:  应被重试的 HTTP Status Codes，参考 `org.springframework.http.HttpStatus` 
- `methods`:  应被重试的 HTTP Methods，参考`org.springframework.http.HttpMethod` 
- `series`:  应被重试的 Status Codes 系列，参考 `org.springframework.http.HttpStatus.Series` 
- `exceptions`: 应被重试的异常列表 
- `backoff`:  为重试配置指数级的 backoff。重试时间间隔的计算公式为 `firstBackoff * (factor ^ n)`，n 是重试的次数；如果设置了 `maxBackoff`，最大的 backoff 限制为 `maxBackoff`. 如果 `basedOnPreviousValue` 设置为 `true`, backoff 计算公式为 `prevBackoff * factor`.

如果 Retry filter 启用，默认配置如下：

- `retries` — 3 times
- `series` — 5XX series
- `methods` — GET method
- `exceptions` — `IOException` and `TimeoutException`
- `backoff` — disabled

application.yml. 

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: retry_test
        uri: http://localhost:8080/flakey
        predicates:
        - Host=*.retry.com
        filters:
        - name: Retry
          args:
            retries: 3
            statuses: BAD_GATEWAY
            backoff:
              firstBackoff: 10ms
              maxBackoff: 50ms
              factor: 2
              basedOnPreviousValue: false
```

> 重试过滤器当前不支持使用 body 重试（例如，使用主体进行POST或PUT请求）。 
>
> 当将重试过滤器与转发的前缀URL一起使用时，应仔细编写目标端点，以便在发生错误的情况下不会执行任何可能导致响应发送到客户端并提交的操作。 例如，如果目标端点是带注解的控制器，则目标控制器方法不应返回带有错误状态代码的ResponseEntity。 相反，它应该抛出Exception或发出错误信号，例如 通过Mono.error（ex）返回值，可以将重试过滤器配置为通过重试进行处理。

## 5.26. RequestSize 过滤器工厂

 限制请求到下游服务的 `RequestSize` 。过滤器将 `RequestSize` 作为参数，这是按字节定义的请求的允许大小限制。

当请求大小大于允许的限制时，RequestSize 过滤器工厂可以限制请求到达下游服务。

 **application.yml.**  

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: request_size_route
      uri: http://localhost:8080/upload
      predicates:
      - Path=/upload
      filters:
      - name: RequestSize
        args:
          maxSize: 5000000
```

当请求由于大小而被拒绝时，RequestSize GatewayFilter工厂将响应状态设置为   `413 Payload Too Large` ，并带有附加报头 `errorMessage`。 以下是此类 `errorMessage` 的示例。

如果未在路由定义中作为过滤器参数提供，则默认请求大小将设置为5 MB。

## 5.27. Modify Request Body 过滤器工厂

该过滤器被认为是BETA版本，API将来可能会更改

 此过滤器可用于在网关将请求主体发送到下游之前修改请求主体。 

> 只能使用Java DSL配置此过滤器 

```java
@Bean
public RouteLocator routes(RouteLocatorBuilder builder) {
    return builder.routes()
        .route("rewrite_request_obj", r -> r.host("*.rewriterequestobj.org")
            .filters(f -> f.prefixPath("/httpbin")
                .modifyRequestBody(String.class, Hello.class, MediaType.APPLICATION_JSON_VALUE,
                    (exchange, s) -> return Mono.just(new Hello(s.toUpperCase())))).uri(uri))
        .build();
}

static class Hello {
    String message;

    public Hello() { }

    public Hello(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
```

## 5.28. Modify Response Body 过滤器工厂

该过滤器被认为是BETA版本，API将来可能会更改

 此过滤器可用于在将响应正文发送回客户端之前对其进行修改。 

>  只能使用Java DSL配置此过滤器 

```java
@Bean
public RouteLocator routes(RouteLocatorBuilder builder) {
    return builder.routes()
        .route("rewrite_response_upper", r -> r.host("*.rewriteresponseupper.org")
            .filters(f -> f.prefixPath("/httpbin")
        		.modifyResponseBody(String.class, String.class,
        		    (exchange, s) -> Mono.just(s.toUpperCase()))).uri(uri)
        .build();
}
```

## 5.29. Default Filters   

 如果您想添加过滤器并将其应用于所有路由，则可以使用 `spring.cloud.gateway.default-filters`。该属性采用过滤器列表 

 **application.yml.**  

```yaml
spring:
  cloud:
    gateway:
      default-filters:
      - AddResponseHeader=X-Response-Default-Foo, Default-Bar
      - PrefixPath=/httpbin
```
