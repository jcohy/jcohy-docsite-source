---
title: 
keywords: docs，jcohy-docs,
description: 
---

### [](#resources-resourceloader)2.4.`ResourceLoader`

`ResourceLoader`接口用于加载`Resource`对象，换句话说，就是当一个对象需要获取`Resource`实例时，可以选择实现`ResourceLoader`接口，以下清单显示了`ResourceLoader`接口定义：。

```java
public interface ResourceLoader {

    Resource getResource(String location);

}
```

所有应用程序上下文都实现`ResourceLoader`接口。 因此，可以使用所有应用程序上下文来获取 `Resource`实例。

当在特殊的应用上下文中调用`getResource()`方法以及指定的路径没有特殊前缀时，将返回适合该特定应用程序上下文的`Resource`类型。 例如，假设针对`ClassPathXmlApplicationContext` 实例执行了以下代码片段：

    Resource template = ctx.getResource("some/resource/path/myTemplate.txt");

针对`ClassPathXmlApplicationContext`，该代码返回 `ClassPathResource`。如果对`FileSystemXmlApplicationContext` 实例执行相同的方法，它将返回`FileSystemResource`。 对于`WebApplicationContext`，它将返回`ServletContextResource`。 它同样会为每个上下文返回适当的对象。

因此，您可以以适合特定应用程序上下文的方式加载资源。

另一方面，您可以通过指定特殊的`classpath:`前缀来强制使用`ClassPathResource`，而不管应用程序上下文类型如何，如下例所示：

```java
Resource template = ctx.getResource("classpath:some/resource/path/myTemplate.txt");
```

同样，您可以通过指定任何标准`java.net.URL`前缀来强制使用`UrlResource` 。 以下对示例使用`file` 和 `http`前缀：

```java
Resource template = ctx.getResource("file:///some/resource/path/myTemplate.txt");

Resource template = ctx.getResource("http://myhost.com/resource/path/myTemplate.txt");
```

下表总结了将：`String`对象转换为`Resource`对象的策略:

Table 10.资源字符串

| 前缀       | 示例                                                 | 解释                                                         |
| ---------- | ---------------------------------------------------- | ------------------------------------------------------------ |
| classpath: | `classpath:com/myapp/config.xml`                     | 从类路径加载                                                 |
| file:      | [file:///data/config.xml](file:///data/config.xml)   | 从文件系统加载为`URL`。 另请参见[`FileSystemResource` 警告。](#resources-filesystemresource-caveats) |
| http:      | [http://myserver/logo.png](http://myserver/logo.png) | 作为`URL`加载。                                              |
| (none)     | `/data/config.xml`                                   | 取决于底层的`ApplicationContext`。                
