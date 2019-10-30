---
title: 使用JSR 330标准注解
keywords: keywords: docs，jcohy-docs，spring,使用JSR 330标准注解
description: Spring  Framework 中文文档 》 使用JSR 330标准注解
---

# Spring  Framework 中文文档
### [](#beans-standard-annotations)1.11. 使用JSR 330标准注解

从Spring 3.0开始，Spring提供对JSR-330标准注解（依赖注入）的支持。 这些注解的扫描方式与Spring注解相同。 要使用它们，您需要在类路径中包含相关的jar。

如果使用Maven工具，那么`@javax.inject.Inject`可以在Maven中央仓库中找到( [https://repo1.maven.org/maven2/javax/inject/javax.inject/1/](https://repo1.maven.org/maven2/javax/inject/javax.inject/1/)). 您可以将以下依赖项添加到文件pom.xml：:

```xml
<dependency>
    <groupId>javax.inject</groupId>
    <artifactId>javax.inject</artifactId>
    <version>1</version>
</dependency>
```

<a id="beans-inject-named"></a>

#### [](#beans-inject-named)1.11.1. 使用`@Inject` 和 `@Named`注解实现依赖注入

`@javax.inject.Inject`可以使用以下的方式来替代`@Autowired`注解:

```java
import javax.inject.Inject;

public class SimpleMovieLister {

    private MovieFinder movieFinder;

    @Inject
    public void setMovieFinder(MovieFinder movieFinder) {
        this.movieFinder = movieFinder;
    }

    public void listMovies() {
        this.movieFinder.findMovies(...);
        ...
    }
}
```

kotlin:

```kotlin
import javax.inject.Inject

class SimpleMovieLister {

    @Inject
    lateinit var movieFinder: MovieFinder


    fun listMovies() {
        movieFinder.findMovies(...)
        // ...
    }
}
```

与 `@Autowired`一样，您可以在字段，方法和构造函数参数级别使用`@Inject`注解。此外，还可以将注入点声明为`Provider`。 它允许按需访问作用域较小的bean或通过`Provider.get()`调用对其他bean进行延迟访问。以下示例提供了前面示例的变体：

```java
import javax.inject.Inject;
import javax.inject.Provider;

public class SimpleMovieLister {

    private Provider<MovieFinder> movieFinder;

    @Inject
    public void setMovieFinder(Provider<MovieFinder> movieFinder) {
        this.movieFinder = movieFinder;
    }

    public void listMovies() {
        this.movieFinder.get().findMovies(...);
        ...
    }
}
```

```kotlin
import javax.inject.Inject

class SimpleMovieLister {

    @Inject
    lateinit var movieFinder: MovieFinder


    fun listMovies() {
        movieFinder.findMovies(...)
        // ...
    }
}
```

如果想要为注入的依赖项使用限定名称，则应该使用`@Named`注解。如下所示：

```java
import javax.inject.Inject;
import javax.inject.Named;

public class SimpleMovieLister {

    private MovieFinder movieFinder;

    @Inject
    public void setMovieFinder(@Named("main") MovieFinder movieFinder) {
        this.movieFinder = movieFinder;
    }

    // ...
}
```

kotlin:

```kotlin
import javax.inject.Inject
import javax.inject.Named

class SimpleMovieLister {

    private lateinit var movieFinder: MovieFinder

    @Inject
    fun setMovieFinder(@Named("main") movieFinder: MovieFinder) {
        this.movieFinder = movieFinder
    }

    // ...
}
```

与`@Autowired`一样，`@Inject` 也可以与`java.util.Optional`或`@Nullable`一起使用。 这在这里用更适用，因为`@Inject`没有`required`的属性。 以下一对示例显示了如何使用`@Inject`和`@Nullable`:

```java
public class SimpleMovieLister {

    @Inject
    public void setMovieFinder(Optional<MovieFinder> movieFinder) {
        ...
    }
}

public class SimpleMovieLister {

    @Inject
    public void setMovieFinder(@Nullable MovieFinder movieFinder) {
        ...
    }
}
```

```kotlin
public class SimpleMovieLister {

    @Inject
    public void setMovieFinder(Optional<MovieFinder> movieFinder) {
        // ...
    }
}
```

<a id="beans-named"></a>

#### [](#beans-named)1.11.2. `@Named` 和 `@ManagedBean`注解: 标准与 `@Component` 注解相同

`@javax.inject.Named` 或 `javax.annotation.ManagedBean`可以使用下面的方式来替代`@Component`注解：

```java
import javax.inject.Inject;
import javax.inject.Named;

@Named("movieListener")  // @ManagedBean("movieListener") could be used as well
public class SimpleMovieLister {

    private MovieFinder movieFinder;

    @Inject
    public void setMovieFinder(MovieFinder movieFinder) {
        this.movieFinder = movieFinder;
    }

    // ...
}
```

```kotlin
import javax.inject.Inject
import javax.inject.Named

@Named("movieListener")  // @ManagedBean("movieListener") could be used as well
class SimpleMovieLister {

    @Inject
    lateinit var movieFinder: MovieFinder

    // ...
}
```

在不指定组件名称的情况下使用`@Component`是很常见的。 `@Named`可以以类似的方式使用，如下例所示：

```java
import javax.inject.Inject;
import javax.inject.Named;

@Named
public class SimpleMovieLister {

    private MovieFinder movieFinder;

    @Inject
    public void setMovieFinder(MovieFinder movieFinder) {
        this.movieFinder = movieFinder;
    }

    // ...
}
```

```kotlin
import javax.inject.Inject
import javax.inject.Named

@Named
class SimpleMovieLister {

    @Inject
    lateinit var movieFinder: MovieFinder

    // ...
}
```

当使用`@Named` 或 `@ManagedBean`时，可以与Spring注解完全相同的方式使用component-scanning组件扫描。 如以下示例所示:

```java
@Configuration
@ComponentScan(basePackages = "org.example")
public class AppConfig  {
    ...
}
```

```kotlin
@Configuration
@ComponentScan(basePackages = ["org.example"])
class AppConfig  {
    // ...
}
```

与`@Component`相反，JSR-330 `@Named` 和 JSR-250 `ManagedBean`注解不可组合。 请使用Spring的原型模型（stereotype mode)来构建自定义组件注解。

<a id="beans-standard-annotations-limitations"></a>

#### [](#beans-standard-annotations-limitations)1.11.3. 使用 JSR-330标准注解的限制

使用标准注解时，需要知道哪些重要功能是不可用的。如下表所示：

Table 6. Spring的组件模型元素 vs JSR-330 变量

| Spring              | javax.inject.*        | javax.inject restrictions / comments                         |
| ------------------- | --------------------- | ------------------------------------------------------------ |
| @Autowired          | @Inject               | `@Inject` 没有'required'属性。 可以与Java 8的 `Optional`一起使用。 |
| @Component          | @Named / @ManagedBean | JSR-330不提供可组合模型，只是一种识别命名组件的方法。        |
| @Scope("singleton") | @Singleton            | JSR-330的默认作用域就像Spring的`prototype`。 但是，为了使其与Spring的一般默认值保持一致，默认情况下，Spring容器中声明的JSR-330 bean是一个 `singleton`。 为了使用除 `singleton`之外的范围，您应该使用Spring的`@Scope`注解。 `javax.inject`还提供了[@Scope](https://download.oracle.com/javaee/6/api/javax/inject/Scope.html)注解。 然而，这个仅用于创建自己的注解。 |
| @Qualifier          | @Qualifier / @Named   | `javax.inject.Qualifier` 只是用于构建自定义限定符的元注解。 可以通过`javax.inject.Named`创建与Spring中`@Qualifier`一样的限定符。 |
| @Value              | -                     | 无                                                           |
| @Required           | -                     | 无                                                           |
| @Lazy               | -                     | 无                                                           |
| ObjectFactory       | Provider              | `javax.inject.Provider` avax.inject.Provider是Spring的`ObjectFactory`的直接替代品， 仅仅使用简短的`get()`方法即可。 它也可以与Spring的`@Autowired`结合使用，也可以与非注解的构造函数和setter方法结合使用。 |
