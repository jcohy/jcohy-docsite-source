---
title: 使用Spring MVC或 Webflux 构建简单的网关
keywords: docs，jcohy-docs,gateway,webflux,spring mvc
description: 使用Spring MVC或 Webflux 构建简单的网关
---

# 14. 使用Spring MVC或 Webflux 构建简单的网关

Spring Cloud Gateway 提供了一个 `ProxyExchange` 的工具类，您可以在常规的Spring Web处理程序内部将其用作方法参数。它通过镜像HTTP动词的方法支持下游HTTP请求。 使用MVC，它还支持通过 `forward()`方法转发到本地处理程序。 要使用 `ProxyExchange`，只需在类路径中包含正确的模块（`spring-cloud-gateway-mvc`或`spring-cloud-gateway-webflux`）。

 MVC示例（将请求“代理”到远程服务器的下游“ /test”）： 

```java
@RestController
@SpringBootApplication
public class GatewaySampleApplication {

	@Value("${remote.home}")
	private URI home;

	@GetMapping("/test")
	public ResponseEntity<?> proxy(ProxyExchange<byte[]> proxy) throws Exception {
		return proxy.uri(home.toString() + "/image/png").get();
	}

}
```

使用  Webflux 

```java
@RestController
@SpringBootApplication
public class GatewaySampleApplication {

	@Value("${remote.home}")
	private URI home;

	@GetMapping("/test")
	public Mono<ResponseEntity<?>> proxy(ProxyExchange<byte[]> proxy) throws Exception {
		return proxy.uri(home.toString() + "/image/png").get();
	}

}
```

 ProxyExchange上有一些便利的方法可以处理 URI 的路径。例如，您可能希望提取路径的尾元素以将它们传递到下游 

```java
@GetMapping("/proxy/path/**")
public ResponseEntity<?> proxyPath(ProxyExchange<byte[]> proxy) throws Exception {
  String path = proxy.path("/proxy/path/");
  return proxy.uri(home.toString() + "/foos/" + path).get();
}
```

Gateway handler methods 可以使用Spring MVC或Webflux的所有功能。 因此，您可以注入请求头和查询参数，并且可以使用映射注解来约束传入的请求。 有关这些功能的更多详细信息，请参见Spring MVC中有关`@RequestMapping` 的文档。

 可以使用 ProxyExchange上的 `header()` 方法将请求头添加到下游响应中。 

 您还可以通过将  mapper  添加到 `get ()` 等方法来操纵响应头（以及响应中您喜欢的任何其他内容）。 mapper  是一个函数，它接收传入的 ResponseEntity 并将其转换为传出的实体。 

 为了不将一些敏感的请求头（ 默认情况下为 "cookie" and "authorization" ）传递到下游请求。以及为 "proxy" headers (`x-forwarded-*`) 提供了支持。
