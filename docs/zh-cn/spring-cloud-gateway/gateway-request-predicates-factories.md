---
title: 
keywords: docs，jcohy-docs,
description: 
---

# 4. 路由断言工厂

Spring Cloud Gateway将路由匹配作为Spring WebFlux HandlerMapping基础架构的一部分。 Spring Cloud Gateway包括许多内置的路由断言工厂。 所有这些断言都与HTTP请求的不同属性匹配。 多个路由断言工厂可以合并，也可以通过逻辑和进行合并。

## 4.1  After路由断言工厂（After Route Predicate Factory）
After Route Predicate Factory采用时间参数， 匹配在当前日期时间之后发生的请求。

application.yml

```yml
spring:
  cloud:
    gateway:
      routes:
      - id: after_route
        uri: https://example.org
        predicates:
        - After=2017-01-20T17:42:47.789-07:00[America/Denver]
```

此路由匹配 `Jan 20, 2017 17:42 Mountain Time (Denver) `之后的所有请求。

## 4.2 Before 路由断言工厂（Before Route Predicate Factory）

 Before 路由断言工厂 采用时间参数，匹配当前日期时间之前发生的请求。

application.yml

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: before_route
        uri: https://example.org
        predicates:
        - Before=2017-01-20T17:42:47.789-07:00[America/Denver]
```

此断言匹配    `Jan 20, 2017 17:42 Mountain Time (Denver) ` 之前的请求

## 4.3 Between 路由断言工厂（Between Route Predicate Factory）

Between 由于断言工厂有两个时间参数，datetime1和datetime2。 匹配在datetime1至datetime2之间发生的请求。 datetime2参数必须在datetime1之后。

application.yml

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: between_route
        uri: https://example.org
        predicates:
        - Between=2017-01-20T17:42:47.789-07:00[America/Denver], 2017-01-21T17:42:47.789-07:00[America/Denver]
```

此路由匹配  ` Jan 20, 2017 17:42 Mountain Time (Denver) `   和   `Jan 21, 2017 17:42 Mountain Time (Denver) ` 之间的所有请求

## 4.4 Cookie 路由断言工厂（Cookie Route Predicate Factory）

Cookie 路由断言工厂 采用两个参数，即cookie名称和正则表达式。 匹配具有给定名称的cookie，并且值匹配正则表达式的所有请求。

application.yml

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: cookie_route
        uri: https://example.org
        predicates:
        - Cookie=chocolate, ch.p
```


此路由匹配名为 `Chocolate` 的 `cookie` ，其值与 `ch.p` 正则表达式匹配的所有请求

## 4.5 Header 路由断言工厂（Header Route Predicate Factory）

Header 路由断言工厂采用两个参数，请求头名称和正则表达式。 匹配具有给定名称的请求头，并且值与正则表达式匹配的所有请求。

application.yml

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: header_route
        uri: https://example.org
        predicates:
        - Header=X-Request-Id, \d+
```

此路由匹配 请求头为 `X-Request-Id` ，并且值匹配  `\d+ ` 的正则表达式的所有请求

## 4.6  Host 路由断言工厂（Host Route Predicate Factory）

Host 路由断言工厂采用一个参数：主机名模式列表。 主机名可以是Ant风格的模式。 以 `.` 作为分隔符 ， 该断言与匹配模式的 `Host` 请求头匹配。

application.yml

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: host_route
        uri: https://example.org
        predicates:
        - Host=**.somehost.org,**.anotherhost.org
```

还支持URI模板变量，例如 `{sub}.myhost.org`。

如果请求的 Host 请求头具有值 `www.somehost.org` 或 `beta.somehost.org` 或 `www.anotherhost.org`，则此路由将匹配。

该断言提取 URI 模板变量（如上例中定义的 `sub` ）作为名称和值的映射，并使用 `ServerWebExchangeUtils.URI_TEMPLATE_VARIABLES_ATTRIBUTE` 中定义的键将其放置在 `ServerWebExchange.getAttributes（）` 中。 这些值可供 `GatewayFilter工厂`使用。

## 4.7 Method 路由断言工厂 (Method Route Predicate Factory)

Method 路由断言工厂使用一个参数：要匹配的HTTP方法。

application.yml

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: method_route
        uri: https://example.org
        predicates:
        - Method=GET
```

此路由匹配请求方法为 `get` 的所有请求

## 4.8  Path 路由断言工厂 （Path Route Predicate Factory）

Path 路由断言工厂 有两个参数，具有 `Spring PathMatcher` 规则的列表和与 `matchOptionalTrailingSeparator` 匹配的可选标志。

application.yml

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: host_route
        uri: https://example.org
        predicates:
        - Path=/foo/{segment},/bar/{segment}
```

如果请求路径为  `/foo/1` or `/foo/bar` or `/bar/baz`. 该路由将匹配

该断言提取 URI 模板变量（如上面示例中定义的段）作为名称和值的映射，并使用 `ServerWebExchangeUtils.URI_TEMPLATE_VARIABLES_ATTRIBUTE` 中定义的键将其放置在 `ServerWebExchange.getAttributes()` 中。 这些值可供 `GatewayFilter` 工厂使用。

可以使用实用的方法来简化对这些变量的访问。

```java
Map<String, String> uriVariables = ServerWebExchangeUtils.getPathPredicateVariables(exchange);

String segment = uriVariables.get("segment");
```

## 4.9 Query 路由断言工厂 (Query Route Predicate Factory)

Query 路由断言工厂有两个参数，必须的参数和可选的正则表达式

application.yml

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: query_route
        uri: https://example.org
        predicates:
        - Query=baz
```

如果请求包含 `baz` 参数，路由匹配

application.yml

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: query_route
        uri: https://example.org
        predicates:
        - Query=foo, ba.
```

如果请求值包含 `foo` 参数，并且其值与 `ba.` 正则匹配。所以，  `bar` and `baz` 都路由匹配。

##   4.10 RemoteAddr 路由断言工厂（ RemoteAddr Route Predicate Factory） 

RemoteAddr 路由断言工厂采用 `CIDR-notation`（IPv4或IPv6）字符串的列表（最小大小为1），例如： 192.168.0.1/16（其中192.168.0.1是IP地址，而16是子网掩码）。

application.yml

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: remoteaddr_route
        uri: https://example.org
        predicates:
        - RemoteAddr=192.168.1.1/24
```

如果请求的远程地址为192.168.1.10，则此路由将匹配。

### 4.10.1 修改远程地址的解析方式

默认情况下，RemoteAddr 路由断言工厂使用传入请求中的远程地址。 如果Spring Cloud Gateway位于代理层后面，则此地址可能与实际的客户端IP地址不匹配。

您可以通过设置自定义的 `RemoteAddressResolver` 来自定义解析远程地址的方式。Spring Cloud Gateway提供了一个基于 `X-Forwarded-For` 请求头 `XForwardedRemoteAddressResolver` 的非默认远程地址解析器。

`XForwardedRemoteAddressResolver` 具有两个静态构造方法，这些方法采用不同的安全性方法：

`XForwardedRemoteAddressResolver :: trustAll` 返回一个 `RemoteAddressResolver` ，该地址始终采用 `X-Forwarded-For` 请求头中找到的第一个IP地址。 这种方法容易受到欺骗的攻击，因为恶意客户端可能会为 `X-Forwarded-For` 设置初始值，该初始值将被解析程序接受。

`XForwardedRemoteAddressResolver :: maxTrustedIndex` 获取一个索引，该索引与在Spring Cloud Gateway前面运行的受信任基础结构的数量相关。 例如，如果只能通过 `HAProxy` 访问Spring Cloud Gateway，则应使用值1。 如果在访问Spring Cloud Gateway之前需要两跳可信基础架构，则应使用值2。

给定一下请求头

```
X-Forwarded-For: 0.0.0.1, 0.0.0.2, 0.0.0.3
```

下面的 `maxTrustedIndex` 值将产生以下远程地址。

| maxTrustedIndex          | 结果                                             |
| ------------------------ | ------------------------------------------------ |
| [`Integer.MIN_VALUE`,0]  | （无效，在初始化期间为IllegalArgumentException） |
| 1                        | 0.0.0.3                                          |
| 2                        | 0.0.0.2                                          |
| 3                        | 0.0.0.1                                          |
| [4, `Integer.MAX_VALUE`] | 0.0.0.1                                          |

使用 Java Config

 GatewayConfig.java 

```yaml
RemoteAddressResolver resolver = XForwardedRemoteAddressResolver
    .maxTrustedIndex(1);

...

.route("direct-route",
    r -> r.remoteAddr("10.1.1.1", "10.10.1.1/24")
        .uri("https://downstream1")
.route("proxied-route",
    r -> r.remoteAddr(resolver,  "10.10.1.1", "10.10.1.1/24")
        .uri("https://downstream2")
)
```
