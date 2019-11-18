---
title: 语法改进
keywords: docs,jcohy-docs,java9,语法改进
description: 语法改进
---

## 语法改进

### 接口的私有方法

#### 官方Feature
213: Milling Project Coin

> Java 8中规定接口中的方法除了抽象方法之外，还可以定义静态方法和默认的方法。一定程度上，扩展了接口的功能，此时的接口更像是一个抽象类。
> 在Java 9中，接口更加的灵活和强大，连方法的访问权限修饰符都可以声明为private的了，此时方法将不会成为你对外暴露的API的一部分。

<p id="钻石操作符">

### 钻石操作符
> 我们将能够与匿名实现类共同使用钻石操作符（diamond operator）
在java 8中如下的操作是会报错的：
```java
    private List<String> flattenStrings(List<String>... lists) { 
        Set<String> set = new HashSet<>(){}; 
        for(List<String> list : lists) { 
            set.addAll(list); 
        } 
        return new ArrayList<>(set); 
    }
```
编译报错信息：'<>' cannot be used with anonymous classes

<p id="try语句">

### try语句
在java 8 之前，我们习惯于这样处理资源的关闭：
```java
InputStreamReader reader = null; 
try{ 
    reader = new InputStreamReader(System.in); 
    //流的操作 
    reader.read(); 
}catch (IOException e){ 
    e.printStackTrace(); 
}finally{ 
    if(reader != null){
        try {
            reader.close(); 
        } catch (IOException e) {
            e.printStackTrace(); 
        } 
    } 
}
```
java 8 中，可以实现资源的自动关闭，但是要求执行后必须关闭的所有资源必须在try子句中初始化，否则编译不通过。如下例所示：
```java
try(InputStreamReader reader = new InputStreamReader(System.in)){

}catch (IOException e){
    e.printStackTrace(); 
}
```
java 9 中，用资源语句编写try将更容易，我们可以在try子句中使用已经初始化过的资源，此时的资源是final的：
```java
public void test3(){
    //jdk 1.9
    InputStreamReader reader = new  InputStreamReader(System.in);
    OutputStreamWriter writer = new OutputStreamWriter(System.out);
    try(reader;writer){
        //reader是final的，不可再被赋值
        //reader = null;
    }catch (IOException e){
        e.printStackTrace();
    }
}
```
<p id="UnderScope">

### UnderScope（下划线使用的限制）
在java 8 中，标识符可以独立使用“_”来命名：
```java
String _ = "hello"; 
System.out.println(_);
```
但是，在java 9 中规定“_”不再可以单独命名标识符了，如果使用，会报错
