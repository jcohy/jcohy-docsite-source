---
title: TLS / SSL
keywords: docs，jcohy-docs,gateway,tls,ssl
description: TLS / SSL
---

# 7. TLS / SSL

 Spring Cloud Gateway使用HTTPS，是和普通的Spring boot服务配置是一样的 ，来监听http请求

 **application.yml.**  

```yaml
server:
  ssl:
    enabled: true
    key-alias: scg
    key-store-password: scg1234
    key-store: classpath:scg-keystore.p12
    key-store-type: PKCS12
```

 Spring Cloud Gateway都可以路由转给给http和HTTPS的下游后端服务，如果是路由去HTTPS后端服务，gateway像下面一样配置信任所有下游服务： 

 **application.yml.**  

```yaml
spring:
  cloud:
    gateway:
      httpclient:
        ssl:
          useInsecureTrustManager: true
```

 当然这种配置，线上生成环境还是不太适合的，所以gateway可以配置自己的信任的证书列表: 

 **application.yml.** 

```yaml
spring:
  cloud:
    gateway:
      httpclient:
        ssl:
          trustedX509Certificates:
          - cert1.pem
          - cert2.pem
```

 Spring Cloud Gateway如果没有配置信任证书列表，则会拿系统默认的证书库（可以通过system property的`javax.net.ssl.trustStore` 属性来修改系统默认证书库）。 

## 7.1 TLS Handshake

 当是用HTTPS来通讯时，http客户端就需要初始化TLS握手连接了，所以就需要配置握手连接时的超时配置： 

**application.yml.** 

```yaml
spring:
  cloud:
    gateway:
      httpclient:
        ssl:
          handshake-timeout-millis: 10000
          close-notify-flush-timeout-millis: 3000
          close-notify-read-timeout-millis: 0
```
