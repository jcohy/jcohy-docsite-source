---
title: Jshell
keywords: docs,jcohy-docs,java9,jshell
description: Jshell
---


## Jshell

### 官方Feature
* 222: jshell: The Java Shell (Read-Eval-Print Loop)

> jshell 是 Java 9 新增的一个实用工具。jshell 为 Java 增加了类似 NodeJS 和 Python 中的读取-求值-打印循环（ Read-Evaluation-Print Loop ） 。 在 jshell 中 可以直接 输入表达式并查看其执行结果。当需要测试一个方法的运行效果，或是快速的对表达式进行求值时，jshell 都非常实用。只需要通过 jshell 命令启动 jshell，然后直接输入表达式即可。每个表达式的结果会被自动保存下来 ，以数字编号作为引用，类似 $1 和$2 这样的名称 。可以在后续的表达式中引用之前语句的运行结果。 在 jshell 中 ，除了表达式之外，还可以创建 Java 类和方法。jshell 也有基本的代码完成功能。

### 使用举例

1、调出jshell

```shell
jshell
```

2、获取帮助

```shell
jshell> /help intro
```

3、基本使用

```shell
jshell> int add(int x, int y) { 
    ...> return x + y; 
    ...> } 
 | 已创建 方法 add(int,int)
```
接着就可以在 jshell 中直接使用这个方法 

```shell
jshell> add(1, 2) 
$19 ==> 3
```

4、导入包

```shell
jshell> import java.util.*
```

5、查看默认导入的包

```shell
jshell> /imports
```
6、代码补全
	TAB键
7、列出当前 session 里所有有效的代码片段

```shell
jshell> /list
```
8、查看当前 session 下所有创建过的变量

```shell
jshell> /var
```

9、查看当前 session 下所有创建过的方法

```shell
jshell> /methods
```
10、从外部文件加载源代码
```shell
jshell> /open E:\hello.java
```
11、没有受检异常（编译时异常）
```shell
jshell> URL url = new URL("http://www.baidu.com");
url ==> http://www.baidu.com
```
说明：本来应该强迫我们捕获一个IOException，但却没有出现。因为jShell在后台为我们隐藏了。
12、退出Jshell
```shell
jshell> /exit
 | 再见
```
