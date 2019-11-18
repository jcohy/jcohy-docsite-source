---
title: 其他特性
keywords: docs,jcohy-docs,其他特性，java12
description: 其他特性
---

## 其他特性

### 支持unicode 11
>JDK 12版本包括对Unicode 11.0.0的支持。在发布支持Unicode 10.0.0的JDK 11之后，Unicode 11.0.0引
入了以下JDK 12中包含的新功能：
	684 new characters
	11 new blocks
	7 new scripts.
其中：
	684个新字符，包含以下重要内容：
	66个表情符号字符（66 emoji characters）
	Copyleft符号（Copyleft symbol）
评级系统的半星（Half stars for rating systems）
额外的占星符号（Additional astrological symbols）
象棋中国象棋符号（Xiangqi Chinese chess symbols）
7个新脚本：
	Hanifi Rohingya
	Old Sogdian
	Sogdian
	Dogra
	Gunjala Gondi
	Makasar
	Medefaidrin
11个新块，包括上面列出的新脚本的7个块和以下现有脚本的4个块：
	格鲁吉亚扩展（Georgian Extended）
	玛雅数字（Mayan Numerals）
	印度Siyaq数字（Indic Siyaq Numbers）
	国际象棋符号（Chess Symbols）
### 支持压缩数字格式化
NumberFormat 添加了对以紧凑形式格式化数字的支持。紧凑数字格式是指以简短或人类可读形式表示的数字。例如，在en_US语言环境中，1000可以格式化为“1K”，1000000可以格式化为“1M”，具体取决于指定的样式NumberFormat.Style。
```java
@Test
public void testCompactNumberFormat(){
    var cnf = NumberFormat.getCompactNumberInstance(Locale.CHINA,
                                                    NumberFormat.Style.SHORT);
    System.out.println(cnf.format(1_0000));
    System.out.println(cnf.format(1_9200));
    System.out.println(cnf.format(1_000_000));
    System.out.println(cnf.format(1L << 30));
    System.out.println(cnf.format(1L << 40));
    System.out.println(cnf.format(1L << 50));
}
```
输出
```java
1万
2万
100万
11亿
1兆
1126兆
```
### String新增方法
#### String#transform(Function)
JDK-8203442引入的一个小方法，它提供的函数作为输入提供给特定的String实例，并返回该函数返回的输出。
```java
var result = "foo".transform(input -> input + " bar");
System.out.println(result); // foo bar
```
或者
```java
var result = "foo"
    .transform(input -> input + " bar")
    .transform(String::toUpperCase)
    System.out.println(result); // FOO BAR
```

对应源码
```java
/**
* This method allows the application of a function to {@code this}
* string. The function should expect a single String argument
* and produce an {@code R} result.
* <p>
* Any exception thrown by {@code f()} will be propagated to the
* caller.
*
* @param f functional interface to a apply
*
* @param <R> class of the result
*
* @return the result of applying the function to this string
*
* @see java.util.function.Function
*
* @since 12
*/
public <R> R transform(Function<? super String, ? extends R> f) {
    return f.apply(this);
}
```
传入一个函数式接口 Function，接受一个值，返回一个值，参考：Java 8 新特性之函数式接口。
在某种情况下，该方法应该被称为map()。
举例：
```java
private static void testTransform() {
    System.out.println("======test java 12 transform======");
    List<String> list1 = List.of("Java", " Python", " C++ ");
    List<String> list2 = new ArrayList<>();
    list1.forEach(element -> list2.add(element.transform(String::strip)
                                       .transform(String::toUpperCase)
                                       .transform((e) -> "Hi," + e))
                 );
    list2.forEach(System.out::println);
}
```
结果输出
```java
======test java 12 transform======
    Hi,JAVA
    Hi,PYTHON
    Hi,C++
```
示例是对一个字符串连续转换了三遍，代码很简单。如果使用Java 8的Stream特性，可以如下实现：
```java
private static void testTransform1() {
    System.out.println("======test before java 12 ======");
    List<String> list1 = List.of("Java ", " Python", " C++ ");
    Stream<String> stringStream = list1.stream().map(element ->
                                                     element.strip()).map(String::toUpperCase).map(element -> "Hello," + element);
    List<String> list2 = stringStream.collect(Collectors.toList());
    list2.forEach(System.out::println);
}
```
#### String#indent
该方法允许我们调整String实例的缩进。
举例：
```java
private static void testIndent() {
    System.out.println("======test java 12 indent======");
    String result = "Java\n Python\nC++".indent(3);
    System.out.println(result);
}
```
结果输出：
```java
======test java 12 indent======
Java
	Python
C++
```
换行符 \n 后向前缩进 n 个空格，为 0 或负数不缩进。
以下是 indent 的核心源码：
```java
/**
* Adjusts the indentation of each line of this string based on the value of
* {@code n}, and normalizes line termination characters.
* <p>
* This string is conceptually separated into lines using
* {@link String#lines()}. Each line is then adjusted as described below
* and then suffixed with a line feed {@code "\n"} (U+000A). The resulting
* lines are then concatenated and returned.
* ...略...
*
* @since 12
*/
public String indent(int n) {
    if (isEmpty()) {
        return "";
    }
    Stream<String> stream = lines();
    if (n > 0) {
        final String spaces = " ".repeat(n);
        stream = stream.map(s -> spaces + s);
    } else if (n == Integer.MIN_VALUE) {
        stream = stream.map(s -> s.stripLeading());
    } else if (n < 0) {
        stream = stream.map(s -> s.substring(Math.min(-n,
                                                      s.indexOfNonWhitespace())));
    }
    return stream.collect(Collectors.joining("\n", "", "\n"));
}
```
其实就是调用了 lines() 方法来创建一个 Stream，然后再往前拼接指定数量的空格。

#### Files新增mismatch方法
```java
@Test
public void testFilesMismatch() throws IOException {
    FileWriter fileWriter = new FileWriter("tmp\\a.txt");
    fileWriter.write("a");
    fileWriter.write("b");
    fileWriter.write("c");
    fileWriter.close();
    FileWriter fileWriterB = new FileWriter("tmp\\b.txt");
    fileWriterB.write("a");
    fileWriterB.write("1");
    fileWriterB.write("c");
    fileWriterB.close();
    System.out.println(Files.mismatch(Path.of("tmp/a.txt"),Path.of("tmp/b.txt")));
}
```
#### 其他
* Collectors新增teeing方法用于聚合两个downstream的结果
* CompletionStage新增exceptionallyAsync、exceptionallyComposeAsync方法，允许方法体在异步线程执行，同时新增了exceptionallyCompose方法支持在exceptionally的时候构建新的CompletionStage。
* ZGC: Concurrent Class Unloading
  * ZGC在JDK11的时候还不支持class unloading，JDK12对ZGC支持了Concurrent Class Unloading，默认是开启，使用-XX:-ClassUnloading可以禁用
* 新增-XX:+ExtensiveErrorReports
  * -XX:+ExtensiveErrorReports可以用于在jvm crash的时候收集更多的报告信息到hs_err.log文件中，product builds中默认是关闭的，要开启的话，需要自己添加-XX:+ExtensiveErrorReports参数
* 新增安全相关的改进
  * 支持java.security.manager系统属性，当设置为disallow的时候，则不使用SecurityManager以提升性能，如果此时调用System.setSecurityManager则会抛出UnsupportedOperationExceptionkeytool新增-groupname选项允许在生成key pair的时候指定一个named group新增PKCS12 KeyStore配置属性用于自定义PKCS12 keystores的生成Java Flight Recorder新增了security-related的event支持ChaCha20 and Poly1305 TLS Cipher Suites

#### 移除项
- 移除com.sun.awt.SecurityWarnin；
- 移除FileInputStream、FileOutputStream、- Java.util.ZipFile/Inflator/Deflator的finalize方法；
- 移除GTE CyberTrust Global Root；
- 移除javac的-source, -target对6及1.6的支持，同时移除--release选项；

#### 废弃项
- 废弃的API列表见deprecated-list
- 废弃-XX:+/-MonitorInUseLists选项
- 废弃Default Keytool的-keyalg值
