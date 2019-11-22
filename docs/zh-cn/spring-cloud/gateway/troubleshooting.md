---
title: 故障排除
keywords: docs，jcohy-docs,故障排除
description: 故障排除
---

# 12. 故障排除

## 12.1 日志

 以下是一些有用的 日志记录，其中包含在  `DEBUG` 和`TRACE`  级别上有价值的故障排除信息。 

- `org.springframework.cloud.gateway`
- `org.springframework.http.server.reactive`
- `org.springframework.web.reactive`
- `org.springframework.boot.autoconfigure.web`
- `reactor.netty`
- `redisratelimiter`

## 12.2 监听

Reactor Netty `HttpClient` 和 `HttpServer ` 可以 通过 监听  `react.netty`  的  `DEBUG` 或 `TRACE`  日志记录来排查故障。  例如通过网络发送和接收的请求头和正文。 要启用此功能，请分别为 `HttpServer` 和 `HttpClient` 设置 `spring.cloud.gateway.httpserver.wiretap = true` 和/或 `spring.cloud.gateway.httpclient.wiretap = true`。

