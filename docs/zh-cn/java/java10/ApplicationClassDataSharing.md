---
title: 应用程序类数据共享
keywords: docs,jcohy-docs,java10,应用程序类数据共享
description: 应用程序类数据共享
---

## 应用程序类数据共享
在 Java 5 中就已经引入了类数据共享机制 (Class Data Sharing，简称 CDS)，允许将一组类预处理为共享归档文件，以便在运行时能够进行内存映射以减少 Java 程序的启动时间，当多个 Java 虚拟机（JVM）共享相同的归档文件时，还可以减少动态内存的占用量，同时减少多个虚拟机在同一个物理或虚拟的机器上运行时的资源占用。简单来说，Java 安装程序会把 rt.jar 中的核心类提前转化成内部表示，转储到一个共享存档（shared archive）中。多个 Java 进程（或者说 JVM 实例）可以共享这部分数据。为改善启动和占用空间，Java 10 在现有的 CDS 功能基础上再次拓展，以允许应用类放置在共享存档中。

CDS 特性在原来的 bootstrap 类基础之上，扩展加入了应用类的 CDS (Application Class-Data Sharing) 支持。

其原理为：在启动时记录加载类的过程，写入到文本文件中，再次启动时直接读取此启动文本并加载。设想如果应用环境没有大的变化，启动速度就会得到提升。

可以想像为类似于操作系统的休眠过程，合上电脑时把当前应用环境写入磁盘，再次使用时就可以快速恢复环境。

对大型企业应用程序的内存使用情况的分析表明，此类应用程序通常会将数以万计的类加载到应用程序类加载器中，如果能够将 AppCDS 应用于这些应用，将为每个 JVM 进程节省数十乃至数百兆字节的内存。另外对于云平台上的微服务分析表明，许多服务器在启动时会加载数千个应用程序类，AppCDS 可以让这些服务快速启动并改善整个系统响应时间。