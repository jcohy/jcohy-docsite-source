---
title: Java8新特性
keywords: docs,jcohy-docs,java8,其他新特性
description: 其他新特性
---


## 8.其他新特性

#### 重复注解与类型注解

Java 8对注解处理提供了两点改进：可重复的注解及可用于类型的注解。

```java
@Target({TYPE, FIELD,METHOD,PARAMETER,CONSTRUCTOR,LOCAL_VARIABLE})
@Retention(RetentionPolicy.RUNTIME)
public @interface MyAnnotations {
    MyAnnotation[] value();
}

```

```java
@Repeatable(MyAnnotations.class)
@Target({TYPE, FIELD,METHOD,PARAMETER,CONSTRUCTOR,LOCAL_VARIABLE})
@Retention(RetentionPolicy.RUNTIME)
public @interface MyAnnotation {

    String value();
}

```

```java
public class TestAnnotation {

    @Test
    public void test1() throws NoSuchMethodException {
        Class<TestAnnotation> clazz = TestAnnotation.class;
        Method m1 = clazz.getMethod("show");
        MyAnnotation[] myAnnotations = m1.getAnnotationsByType(MyAnnotation.class);
        for(MyAnnotation myAnnotation: myAnnotations){
            System.out.println(myAnnotation);
        }
    }

    @MyAnnotation("hello")
    @MyAnnotation("world")
    public void show(){

    }
}

```

最后附上所有代码地址  ![Java8 Code](https://github.com/jiachao23/jcohy-study-sample/tree/master/jcohy-study-java/src/main/java/com/jcohy/study/java8)
