---
title: Java8新特性
keywords: docs,jcohy-docs,java8,方法引用与构造器引用
description: 方法引用与构造器引用
---

## 3.方法引用与构造器引用

#### 方法引用

当要传递给Lambda体的操作，已经有实现的方法了，可以使用方法引用！（**实现抽象方法的参数列表，必须与方法引用方法的参数列表保持一致！**）方法引用：使用操作符“::” 将方法名和对象或类的名字分隔开来。
如下三种主要使用情况：

- 对象::实例方法
- 类::静态方法
- 类::实例方法

```java
//例如
	Consumer<String> com = (x) -> System.out.println(x);
//等同于
	Consumer<String> com = System.out::println

//例如：
	BinaryOperator<Double> bo = (x,y) ->Math.pow(x,y);
//等同于：
	BinaryOperator<Double> bo = Math::pow;
	
//例如：
	Comparator<Integer> com = (x, y) -> Integer.compare(x, y);	
//等同于
	Comparator<Integer> com2 = Integer::compare;
```



#### 构造器引用

**格式：ClassName::new**
与函数式接口相结合，自动与函数式接口中方法兼容。
**可以把构造器引用赋值给定义的方法，与构造器参数列表要与接口中抽象方法的参数列表一致！**

```java
//例如：
	 Function<Integer,MyClass> fun = (n) -> new MyClass(n);
//等同于
	Function<Integer,MyClass> fun = (n) -> MyClass::new;
```



#### 数组引用

**格式：type[] :: new**

```java
例如：
	 Function<Integer,Integer[]> fun = (n) -> new Integer[n];
等同于
	Function<Integer,Integer[]> fun = Integer[]::new;
```
