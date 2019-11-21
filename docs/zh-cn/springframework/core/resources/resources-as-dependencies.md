---
title: 
keywords: docs，jcohy-docs,
description: 
---


### [](#resources-as-dependencies)2.6. 资源依赖

如果bean本身要通过某种动态过程来确定和提供资源路径，那么bean使用`ResourceLoader`接口来加载资源就变得更有意义了。假如需要加载某种类型的模板，其中所需的特定资源取决于用户的角色 。如果资源是静态的，那么完全可以不使用`ResourceLoader`接口，只需让bean公开它需要的`Resource`属性，并按照预期注入属性即可。

是什么使得注入这些属性变得如此简单？是因为所有应用程序上下文注册和使用一个特殊的`PropertyEditor` JavaBean，它可以将 `String` paths转换为`Resource`对象。 因此，如果`myBean`有一个类型为`Resource`的模板属性，它可以用一个简单的字符串配置该资源。如下所示：

```xml
<bean id="myBean" class="...">
    <property name="template" value="some/resource/path/myTemplate.txt"/>
</bean>
```

请注意，资源路径没有前缀。 因此，因为应用程序上下文本身将用作`ResourceLoader`， 所以资源本身通过`ClassPathResource`，`FileSystemResource`或`ServletContextResource`加载，具体取决于上下文的确切类型。

如果需要强制使用特定的 `Resource`类型，则可以使用前缀。 以下两个示例显示如何强制`ClassPathResource`和`UrlResource`（后者用于访问文件系统文件）：

```xml
<property name="template" value="classpath:some/resource/path/myTemplate.txt">

<property name="template" value="file:///some/resource/path/myTemplate.txt"/>
```
