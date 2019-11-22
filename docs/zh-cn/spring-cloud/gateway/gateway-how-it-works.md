---
title: 它是如何工作的
keywords: docs，jcohy-docs,gateway,work
description: 它是如何工作的
---

# 3. 它是如何工作的

![ Spring Cloud Gateway Diagram ]( https://raw.githubusercontent.com/spring-cloud/spring-cloud-gateway/master/docs/src/main/asciidoc/images/spring_cloud_gateway_diagram.png )

客户端向Spring Cloud Gateway发出请求。 如果 Gateway Handler Mapping 确定请求与路由匹配，则将其发送到网关Web处理程序。 该处理程序运行通过特定于请求的过滤器链发送请求。 过滤器由虚线分隔的原因是，过滤器可以在发送代理请求之前或之后执行逻辑。 执行所有“pre”过滤器逻辑，然后发出代理请求。 发出代理请求后，将执行“post”过滤器逻辑。

> 在没有端口的路由中定义的URI将分别将HTTP和HTTPS URI的默认端口分别设置为80和443。
