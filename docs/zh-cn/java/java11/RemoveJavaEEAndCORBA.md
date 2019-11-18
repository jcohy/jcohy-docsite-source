---
title: 删除 JavaEE 和 CORBA 模块
keywords: docs,jcohy-docs,JavaEE,CORBA,java11
description: 删除 JavaEE 和 CORBA 模块
---

## 删除 JavaEE 和 CORBA 模块
在java11中移除了不太使用的JavaEE模块和CORBA技术
CORBA来自于二十世纪九十年代，Oracle说，现在用CORBA开发现代Java应用程序已经没有意义了，维护CORBA的成本已经超过了保留它带来的好处。

但是删除CORBA将使得那些依赖于JDK提供部分CORBA API的CORBA实现无法运行。目前还没有第三方CORBA版本，也不确定是否会有第三方愿意接手CORBA API的维护工作。

在java11中将java9标记废弃的Java EE及CORBA模块移除掉，具体如下：
（1）	xml相关的，

```java
java.xml.ws, 
java.xml.bind，
java.xml.ws，
java.xml.ws.annotation，
jdk.xml.bind，
jdk.xml.ws被移除，
只剩下java.xml，java.xml.crypto,jdk.xml.dom这几个模块；
```


（2）	

```java
java.corba，
java.se.ee，
java.activation，
java.transaction被移除，
但是java11新增一个java.transaction.xa模块
```
