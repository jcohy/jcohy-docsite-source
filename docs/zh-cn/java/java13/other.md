---
title: 其他特性
keywords: docs,jcohy-docs,其他特性,java13
description: 其他特性
---

## 其他特性
上面列出的是大方面的特性，除此之外还有一些api的更新及废弃，主要见 [https://jdk.java.net/13/release-notes](https://jdk.java.net/13/release-notes)，这里举几个例子

### 增加项
* 添加FileSystems.newFileSystem(Path, Map<String, ?>) Method
* 新的java.nio.ByteBuffer Bulk get/put Methods Transfer Bytes Without Regard to Buffer Position
* 支持Unicode 12.1
* 添加-XX:SoftMaxHeapSize Flag，目前仅仅对ZGC起作用
* ZGC的最大heap大小增大到16TB
### 移除项
* 移除awt.toolkit System Property
* 移除Runtime Trace Methods
* 移除-XX:+AggressiveOpts
* 移除Two Comodo Root CA Certificates、Two DocuSign Root CA Certificates
* 移除内部的com.sun.net.ssl包
### 废弃项
* 废弃-Xverify:none及-noverify
* 废弃rmic Tool并准备移除
* 废弃javax.security.cert并准备移除
### 已知问题
* 不再支持Windows 2019 Core Server
* 使用ZIP File System (zipfs) Provider来更新包含Uncompressed Entries的ZIP或JAR可能造成文件损坏
### 其他事项
* GraphicsEnvironment.getCenterPoint()及getMaximumWindowBounds()已跨平台统一
* 增强了JAR Manifest的Class-Path属性处理
* 针对Negatively Sized Argument，StringBuffer(CharSequence)及StringBuilder(CharSequence)会抛出NegativeArraySizeException
* linux的默认进程启动机制已经使用posix_spawn
* Lookup.unreflectSetter(Field)针对static final fields会抛出IllegalAccessException
* 使用了java.net.Socket.setSocketImplFactory及java.net.ServerSocket.setSocketFactory方法的要注意，要求客户端及服务端要一致，不能一端使用自定义的factory一端使用默认的factory
* SocketImpl的supportedOptions, getOption及setOption方法的默认实现发生了变化，默认的supportedOptions返回空，而默认的getOption,及setOption方法抛出UnsupportedOperationException
* JNI NewDirectByteBuffer创建的Direct Buffer为java.nio.ByteOrder.BIG_ENDIAN
* Base64.Encoder及Base64.Decoder可能抛出OutOfMemoryError
* 改进了Serial GC Young pause time report
* 改进了MaxRAM及UseCompressedOops参数的行为
