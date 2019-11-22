---
title: 跨域配置
keywords: docs，jcohy-docs,跨域配置,CORS
description: 跨域配置
---

# 10. 跨域配置



 gateway是支持CORS的配置 ，   可以通过   [Spring Framework `CorsConfiguration`](https://docs.spring.io/spring/docs/5.0.x/javadoc-api/org/springframework/web/cors/CorsConfiguration.html) URL模式 配置全局的跨域。

**application.yml.** 

```yaml
spring:
  cloud:
    gateway:
      globalcors:
        corsConfigurations:
          '[/**]':
            allowedOrigins: "https://docs.spring.io"
            allowedMethods:
            - GET
```

在上面的示例中，从docs.spring.io发出的所有GET请求都允许CORS跨域。

要为那些未经过网关断言处理的请求提供相同的跨域配置，请将属性 `spring.cloud.gateway.globalcors.add-to-simple-url-handler-mapping` 设置为 `true`。 当你的请求断言评估未匹配并且支持跨域请求时，这种做法很有用，因为http方法是可选项。

