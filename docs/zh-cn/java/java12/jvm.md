---
title: 引入 JVM 常量 API
keywords: docs,jcohy-docs,jvm，java12
description: 引入 JVM 常量 API
---

## 引入 JVM 常量 API
Java 12 中引入 JVM 常量 API，用来更容易地对关键类文件 (key class-file) 和运行时构件（artefact）的名义描述(nominal description) 进行建模，特别是对那些从常量池加载的常量，这是一项非常技术性的变化，能够以更简单、标准的方式处理可加载常量。
具体来说就是java.base模块新增了java.lang.constant包（而非 java.lang.invoke.constant ）。包中定义了一系列基于值的符号引用（JVMS 5.1）类型，它们能够描述每种可加载常量。
> 官方api链接地址：
http://cr.openjdk.java.net/~iris/se/12/latestSpec/api/java.base/java/lang/constant/pack
age-summary.html

> Java SE > Java SE Specifications > Java Virtual Machine Specification下的第5章：
Chapter 5. Loading, Linking, and Initializing
https://docs.oracle.com/javase/specs/jvms/se7/html/jvms-5.html

引入了ConstantDesc接口( ClassDesc、MethodTypeDesc、MethodHandleDesc这几个接口直接继承了ConstantDesc接口)以及Constable接口；ConstantDesc接口定义了resolveConstantDesc方法，Constable接口定义了describeConstable方法；String、Integer、Long、Float、Double均实现了这两个接口，而EnumDesc实现了ConstantDesc接口。

![image-20191031183927168](https://github.com/jiachao23/jcohy-study-sample/blob/master/jcohy-study-java/images/java12-1.png)

符号引用以纯 nominal 形式描述可加载常量，与类加载或可访问性上下文区分开。有些类可以作为自己的符号引用（例如 String）。而对于可链接常量，另外定义了一系列符号引用类型，具体包括： ClassDesc (Class 的可加载常量标称描述符) ，MethodTypeDesc(方法类型常量标称描述符) ，MethodHandleDesc (方法句柄常量标称描述符) 和DynamicConstantDesc (动态常量标称描述符) ，它们包含描述这些常量的 nominal 信息。此 API 对于操作类和方法的工具很有帮助。

#### String 实现了 Constable 接口：
```java
public final class String implements java.io.Serializable, Comparable<String>,
CharSequence,Constable, ConstantDesc {
```
java.lang.constant.Constable接口定义了抽象方法：
```java
public interface Constable {
	Optional<? extends ConstantDesc> describeConstable();
}
```
Java 12 String 的实现源码：
```java
@Override
public Optional<String> describeConstable() {
	return Optional.of(this);
}
```
很简单，其实就是调用 Optional.of 方法返回一个 Optional 类型，Optional不懂的可以参考Java 8的新特性
#### String#describeConstable和resolveConstantDesc
一个非常有趣的方法来自新引入的接口java.lang.constant.Constable - 它用于标记constable类型，这意味着这类型的值是常量，可以在JVMS 4.4常量池中定义。
> Java SE > Java SE Specifications > Java Virtual Machine Specification下的第4章：
Chapter 4. The class File Format
https://docs.oracle.com/javase/specs/jvms/se7/html/jvms-4.html

String的源码：
```java
/**
* Returns an {@link Optional} containing the nominal descriptor for this
* instance, which is the instance itself.
*
* @return an {@link Optional} describing the {@linkplain String} instance
* @since 12
*/
@Override
public Optional<String> describeConstable() {
    return Optional.of(this);
}
/**
* Resolves this instance as a {@link ConstantDesc}, the result of which is
* the instance itself.
*
* @param lookup ignored
* @return the {@linkplain String} instance
* @since 12
*/
@Override
public String resolveConstantDesc(MethodHandles.Lookup lookup) {
    return this;
}
```
举例：
```java
private static void testDescribeConstable() {
	System.out.println("======test java 12 describeConstable======");
	String name = "hello world!";
	Optional<String> optional = name.describeConstable();
	System.out.println(optional.get());
}
```
结果输出：
```java
======test java 12 describeConstable======
hello world!
```
