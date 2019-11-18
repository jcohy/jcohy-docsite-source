---
title: Java12 新特性
keywords: docs,jcohy-docs,java12,feature
description: Java12 中文文档
---

## jdk12新特性一览

Java 12 已如期于 3 月 19 日正式发布，此次更新是 Java 11 这一长期支持版本发布之后的一次常规更新，截至目前，Java 半年为发布周期，并且不会跳票承诺的发布模式，已经成功运行一年多了。通过这样的方式，Java 开发团队能够将一些重要特性尽早的合并到 Java Release 版本中，以便快速得到开发者的反馈，避免出现类似 Java 9 发布时的两次延期的情况。

Java 12 早在 2018 年 12 月便进入了 Rampdown Phase One 阶段，这意味着该版本所有新的功能特性被冻结，不会再加入更多的 JEP。该阶段将持续大概一个月，主要修复 P1-P3 级错误。主要时间节点如下：

2018-12-13 Rampdown 第一阶段 ( 从主线分离 )
2019-01-17 Rampdown 第二阶段
2019-02-07 发布候选阶段
2019-03-19 正式发布
本文主要针对 Java 12 中的新特性展开介绍，让您快速了解 Java 12 带来的变化。


资料来源： http://openjdk.java.net/projects/jdk/12/

| 新特性 | 翻译 |
| ------------------------------------------------------------ | ---- |
| 189:  [Shenandoah: A Low-Pause-Time Garbage Collector (Experimental)](http://openjdk.java.net/jeps/189) |Shenandoah：一个低停顿垃圾收集器（实验阶段）|
| 230:  [Microbenchmark Suite](http://openjdk.java.net/jeps/230) |微基准套件|
| 325:[Switch Expressions (Preview)](http://openjdk.java.net/jeps/325) | Switch 表达式扩展 |
| 334:[JVM Constants API](http://openjdk.java.net/jeps/334) | 引入 JVM 常量 API |
| 340:[One AArch64 Port, Not Two](http://openjdk.java.net/jeps/340) | 只保留一个AArch64实现 |
| 341:[Default CDS Archives](http://openjdk.java.net/jeps/341) | 默认类数据共享（CDS）存档 |
| 344:[Abortable Mixed Collections for G1](http://openjdk.java.net/jeps/344) | 可中止的G1 Mixed GC |
| 346:[Promptly Return Unused Committed Memory from G1](http://openjdk.java.net/jeps/346) | G1及时返回未使用的已分配内存 |
