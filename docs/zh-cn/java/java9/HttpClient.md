---
title: 全新的HTTP客户端API
keywords: docs,jcohy-docs,java9,全新的HTTP客户端API
description: 全新的HTTP客户端API
---

## 全新的HTTP客户端API
### 官方Feature
* 110: HTTP 2 Client
> HTTP/1.1和HTTP/2的主要区别是如何在客户端和服务器之间构建和传输数据。HTTP/1.1依赖于请求/响应周期。 HTTP/2允许服务器“push”数据：它可以发送比客户端请求更多的数据。 这使得它可以优先处理并发送对于首先加载网页至关重要的数据。
> Java 9中有新的方式来处理HTTP调用。它提供了一个新的HTTP客户端（HttpClient），它将替代仅适用于blocking模式的HttpURLConnection （HttpURLConnection是在HTTP 1.0的时代创建的，并使用了协议无关的方法），并提供对WebSocket 和 HTTP/2的支持。
> 此外，HTTP客户端还提供API来处理HTTP/2的特性，比如流和服务器推送等功能。
> 全新的HTTP客户端API可以从jdk.incubator.httpclient模块中获取。因为在默认情况下，这个模块是不能根据classpath获取的，需要使用add modules命令选项配置这个模块，将这个模块添加到classpath中。
### 使用

