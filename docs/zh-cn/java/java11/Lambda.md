---
title: 用于 Lambda 参数的局部变量语法
keywords: docs,jcohy-docs,Lambda,java11
description: 用于 Lambda 参数的局部变量语法
---

## 用于 Lambda 参数的局部变量语法
在 Lambda 表达式中使用局部变量类型推断是 Java 11 引入的唯一与语言相关的特性，这一节，我们将探索这一新特性。

从 Java 10 开始，便引入了局部变量类型推断这一关键特性。类型推断允许使用关键字 var 作为局部变量的类型而不是实际类型，编译器根据分配给变量的值推断出类型。这一改进简化了代码编写、节省了开发者的工作时间，因为不再需要显式声明局部变量的类型，而是可以使用关键字 var，且不会使源代码过于复杂。

可以使用关键字 var 声明局部变量，如下所示：
```java
var s = "Hello Java 11";
System.out.println(s);
```
但是在 Java 10 中，还有下面几个限制：
* 只能用于局部变量上
* 声明时必须初始化
* 不能用作方法参数
* 不能在 Lambda 表达式中使用
Java 11 与 Java 10 的不同之处在于允许开发者在 Lambda 表达式中使用 var 进行参数声明。乍一看，这一举措似乎有点多余，因为在写代码过程中可以省略 Lambda 参数的类型，并通过类型推断确定它们。但是，添加上类型定义同时使用 @Nonnull 和 @Nullable 等类型注释还是很有用的，既能保持与局部变量的一致写法，也不丢失代码简洁。

Lambda 表达式使用隐式类型定义，它形参的所有类型全部靠推断出来的。隐式类型 Lambda 表达式如下：
```java
(x, y) -> x.process(y)
```
Java 10 为局部变量提供隐式定义写法如下：
```java
var x = new Foo();
for (var x : xs) { ... }
try (var x = ...) { ... } catch ...
```
为了 Lambda 类型表达式中正式参数定义的语法与局部变量定义语法的不一致，且为了保持与其他局部变量用法上的一致性，希望能够使用关键字 var 隐式定义 Lambda 表达式的形参：
```java
(var x, var y) -> x.process(y)
```
于是在 Java 11 中将局部变量和 Lambda 表达式的用法进行了统一，并且可以将注释应用于局部变量和 Lambda 表达式：
```java
@Nonnull var x = new Foo();
(@Nonnull var x, @Nullable var y) -> x.process(y)
```
