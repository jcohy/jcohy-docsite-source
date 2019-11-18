---
title: 多版本兼容jar包
keywords: docs,jcohy-docs,java9,多版本兼容jar包
description: 多版本兼容jar包
---

## 多版本兼容jar包

### 官方Feature
* 238: Multi-Release JAR Files

> 当一个新版本的Java出现的时候，你的库用户要花费数年时间才会切换到这个新的版本。这就意味着库得去向后兼容你想要支持的最老的Java版本（许多情况下就是Java 6 或者 Java7）。这实际上意味着未来的很长一段时间，你都不能在库中运用Java 9所提供的新特性。幸运的是，多版本兼容jar功能能让你创建仅在特定版本的Java环境中运行库程序选择使用的class版本。

### 概述
```java
jar root
  - A.class
  - B.class
  - C.class
  - D.class
  - META-INF
     - versions
        - 9
           - A.class
           - B.class
        - 10
           - A.class
```
说明：
在上述场景中， root.jar 可以在 Java 9 中使用, 不过 A或B 类使用的不是顶层的 root.A或root.B 这两个class, 而是处在“META-INF/versions/9”下面的这两个。这是特别为 Java 9 准备的 class 版本，可以运用 Java 9 所提供的特性和库。在将来的支持Java 10 JDK上，它将看到A的jdk 10特定版本和B的jdk 9特定版本；同时，在早期的 Java 诸版本中使用这个 JAR 也是能运行的，因为较老版本的 Java 只会看到顶层的A类或 B 类。

### 使用

1、创建一个类,使用java 9 版本语法
```java
import java.util.Set;
/**
 * Created by jiac on 2017/12/28 0028.
 */
public class Generator {
        
    public Set<String> createStrings() {
        return Set.of("Java", "9");
    }

}
```
2、创建一个同名类,使用java 8版本语法
```java
import java.util.Set;
import java.util.HashSet;

public class Generator {
    public Set<String> createStrings() {
        Set<String> strings = new HashSet<String>();
        strings.add("Java");
        strings.add("8");
        return strings;
    }
}
```
3、创建测试类
```java
public class Application {
   public static void testMultiJar(){
      Generator gen = new Generator();
      System.out.println("Generated strings: " + gen.createStrings());
   }
}
```
4、打包
```shell
javac -d build --release 8 src/main/java/com/jcohy/study/*.java
javac -d build9 --release 9 src/main/java9/com/jcohy/study/*.java
jar --create --main-class=Application --file multijar.jar -C build . --release 9 -C build9 .
```
