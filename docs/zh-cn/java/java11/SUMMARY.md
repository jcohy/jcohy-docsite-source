---
title: Java11 新特性
keywords: docs,jcohy-docs,java11,feature
description: Java11 中文文档
---

## jdk11新特性一览

Java 11 已于 2018 年 9 月 25 日正式发布，之前在 Java 10 新特性介绍中介绍过，为了加快的版本迭代、跟进社区反馈，Java 的版本发布周期调整为每六个月一次——即每半年发布一个大版本，每个季度发布一个中间特性版本，并且做出不会跳票的承诺。通过这样的方式，Java 开发团队能够将一些重要特性尽早的合并到 Java Release 版本中，以便快速得到开发者的反馈，避免出现类似 Java 9 发布时的两次延期的情况。

按照官方介绍，新的版本发布周期将会严格按照时间节点，于每年的 3 月和 9 月发布，Java 11 发布的时间节点也正好处于 Java 8 免费更新到期的前夕。与 Java 9 和 Java 10 这两个被称为"功能性的版本"不同，Java 11 仅将提供长期支持服务（LTS, Long-Term-Support），还将作为 Java 平台的默认支持版本，并且会提供技术支持直至 2023 年 9 月，对应的补丁和安全警告等支持将持续至 2026 年。

本文主要针对 Java 11 中的新特性展开介绍，让您快速了解 Java 11 带来的变化。


资料来源： http://openjdk.java.net/projects/jdk/11/

| 新特性 | 翻译 |
| ------------------------------------------------------------ | ---- |
| 181: [Nest-Based Access Control](http://openjdk.java.net/jeps/181) | 基于嵌套的访问控制 |
| 309: [Dynamic Class-File Constants](http://openjdk.java.net/jeps/309) | 动态类文件常量 |
| 315: [Improve Aarch64 Intrinsics](http://openjdk.java.net/jeps/315) | 改善Aarch64本征 |
| 318: [Epsilon: A No-Op Garbage Collector](http://openjdk.java.net/jeps/318) | Epsilon：低开销垃圾回收器 |
| 320: [Remove the Java EE and CORBA Modules](http://openjdk.java.net/jeps/320) | 删除Java EE和CORBA模块 |
| 321: [HTTP Client (Standard)](http://openjdk.java.net/jeps/321) | 标准 HTTP Client |
| 323: [Local-Variable Syntax for Lambda Parameters](http://openjdk.java.net/jeps/323) | 用于 Lambda 参数的局部变量语法 |
| 324: [Key Agreement with Curve25519 and Curve448](http://openjdk.java.net/jeps/324) | Curve25519 和 Curve448的关键协议 |
| 327: [Unicode 10](http://openjdk.java.net/jeps/327) | Unicode 10 |
| 328: [Flight Recorder](http://openjdk.java.net/jeps/328) | 飞行记录器 |
| 329: [ChaCha20 and Poly1305 Cryptographic Algorithms](http://openjdk.java.net/jeps/329) | ChaCha20和Poly1305加密算法 |
| 330: [Launch Single-File Source-Code Programs](http://openjdk.java.net/jeps/330) | 简化启动单个源代码文件 |
| 331: [Low-Overhead Heap Profiling](http://openjdk.java.net/jeps/331) | 低开销的 Heap Profiling |
| 332: [Transport Layer Security (TLS) 1.3](http://openjdk.java.net/jeps/332) | 支持 TLS 1.3 协议 |
| 333: [ZGC: A Scalable Low-Latency Garbage Collector(Experimental)](http://openjdk.java.net/jeps/333) | ZGC：可伸缩低延迟垃圾收集器 |
| 335: [Deprecate the Nashorn JavaScript Engine](http://openjdk.java.net/jeps/335) | 废除Nashorn javascript引擎 |
| 336: [Deprecate the Pack200 Tools and API](http://openjdk.java.net/jeps/336) | 废除Pack200 |
