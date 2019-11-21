---
title: 
keywords: docs，jcohy-docs,
description: 
---

### [](#resources-resourceloaderaware)2.5. `ResourceLoaderAware` 接口

`ResourceLoaderAware`是一个特殊的标识接口，用来提供`ResourceLoader`引用的对象。以下清单显示了`ResourceLoaderAware`接口的定义：

```java
public interface ResourceLoaderAware {

    void setResourceLoader(ResourceLoader resourceLoader);
}
```

当类实现`ResourceLoaderAware`并部署到应用程序上下文（作为Spring管理的bean）时，它被应用程序上下文识别为`ResourceLoaderAware`。 然后，应用程序上下文调用`setResourceLoader(ResourceLoader)`，将其自身作为参数提供（请记住，Spring中的所有应用程序上下文都实现了`ResourceLoader`接口）。

由于`ApplicationContext`实现了`ResourceLoader`，因此bean还可以实现 `ApplicationContextAware` 接口并直接使用提供的应用程序上下文来加载资源。 但是，通常情况下，如果您需要，最好使用专用的`ResourceLoader`接口。 代码只能耦合到资源加载接口（可以被认为是实用程序接口），而不能耦合到整个Spring `ApplicationContext`接口。

从Spring 2.5开始，除了实现`ResourceLoaderAware`接口，还可以采取另外一种替代方案-依赖`ResourceLoader`的自动装配。 “传统”构造函数和byType [自动装配](#beans-factory-autowire)模式都支持对`ResourceLoader`的装配。 前者是以构造参数的形式装配，后者作为setter方法的参数参与装配。如果为了获得更大的灵活性（包括属性注入的能力和多参方法），可以考虑使用基于注解的新型注入方式。 使用注解`@Autowired`标识`ResourceLoader`变量，便可将其注入到成员属性、构造参数或方法参数中。这些参数需要ResourceLoader类型。 有关更多信息，请参阅使用[Using `@Autowired`](#beans-autowired-annotation)。
