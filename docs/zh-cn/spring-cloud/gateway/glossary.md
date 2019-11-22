---
title: 概念
keywords: docs，jcohy-docs,概念,glossary
description: 概念
---

# 2.概念

*  **Route** (路由): 路由是网关的基本结构单元，它由ID，目标URI，断言集合和过滤器集合定义。 如果聚合断言为true，则匹配路由。
*  **Predicate（断言，也有人翻译为谓词。但本人更倾向于断言，因为它只有true和false。）** ：这是一个Java 8 Function Predicate。 输入类型是Spring Framework ServerWebExchange。 这使开发人员可以匹配HTTP请求中的所有内容，例如请求头或参数。
*  **Filter** ：这些是使用特定工厂构造的Spring Framework GatewayFilter实例。 可以在发送下游请求之前或之后修改请求和响应。
