---
title: BeanFactory
keywords: keywords: docs，jcohy-docs，spring,BeanFactory
description: Spring  Framework 中文文档 》 BeanFactory
---

# Spring  Framework 中文文档
### [](#beans-beanfactory)1.16.`BeanFactory`

`BeanFactory` API为Spring的IoC功能提供了基础。 它的特定契约主要用于与Spring的其他部分和相关的第三方框架集成其`DefaultListableBeanFactory`实现是更高级别`GenericApplicationContext`容器中的密钥委托。

`BeanFactory`和相关接口（例如`BeanFactoryAware`, `InitializingBean`，`DisposableBean`）是其他框架组件的重要集成点。 通过不需要任何注解或甚至反射，它们允许容器与其组件之间的非常有效的交互。 应用程序级bean可以使用相同的回调接口，但通常更喜欢通过注解或通过编程配置进行声明性依赖注入。

请注意，核心`BeanFactory` API级别及其 `DefaultListableBeanFactory`实现不会对配置格式或要使用的任何组件注解做出假设。 所有这些风格都通过扩展（例如`XmlBeanDefinitionReader`和`AutowiredAnnotationBeanPostProcessor`）进行，并作为核心元数据表示在共享`BeanDefinition`对象上运行。 这是使Spring的容器如此灵活和可扩展的本质。

<a id="context-introduction-ctx-vs-beanfactory"></a>

#### [](#context-introduction-ctx-vs-beanfactory)1.16.1. 选择`BeanFactory`还是`ApplicationContext`?

本节介绍`BeanFactory`和`ApplicationContext`容器级别之间的差异以及影响。

您应该使用`ApplicationContext`，除非您有充分的理由不这样做，使用`GenericApplicationContext`及其子类`AnnotationConfigApplicationContext`作为自定义引导的常见实现。 这些是Spring用于所有常见目的的核心容器的主要入口点：加载配置文件，触发类路径扫描，以编程方式注册bean定义和带注解的类，以及（从5.0开始）注册功能bean定义。

因为`ApplicationContext`包括`BeanFactory`的所有功能，和`BeanFactory`相比更值得推荐，除了一些特定的场景，例如在资源受限的设备上运行的内嵌的应用。 在`ApplicationContext`（例如`GenericApplicationContext`实现）中，按照约定（即通过bean名称或bean类型 - 特别是后处理器）检测到几种bean， 而普通的`DefaultListableBeanFactory`对任何特殊bean都是不可知的。

对于许多扩展容器功能，例如注解处理和AOP代理， [`BeanPostProcessor`扩展点是必不可少的。如果仅使用普通的`DefaultListableBeanFactory`，则默认情况下不会检测到并激活此类后置处理器。 这种情况可能令人困惑，因为您的bean配置实际上没有任何问题。 相反，在这种情况下，容器需要至少得多一些额外的处理。](#beans-factory-extension-bpp)

下表列出了`BeanFactory`和`ApplicationContext`接口和实现提供的功能。

Table 9.特性矩阵  

| Feature                              | `BeanFactory` | `ApplicationContext` |
| ------------------------------------ | ------------- | -------------------- |
| Bean Bean实例化/装配                 | Yes           | Yes                  |
| 集成的生命周期管理                   | No            | Yes                  |
| 自动注册 `BeanPostProcessor`         | No            | Yes                  |
| 自动注册 `BeanFactoryPostProcessor`  | No            | Yes                  |
| 便利的 `MessageSource` 访问 (国际化) | No            | Yes                  |
| 内置`ApplicationEvent` 发布机制      | No            | Yes                  |


要使用 `DefaultListableBeanFactory`显式注册bean的后置处理器，您需要以编程方式调用 `addBeanPostProcessor`，如以下示例所示：

```java
DefaultListableBeanFactory factory = new DefaultListableBeanFactory();
// populate the factory with bean definitions

// now register any needed BeanPostProcessor instances
factory.addBeanPostProcessor(new AutowiredAnnotationBeanPostProcessor());
factory.addBeanPostProcessor(new MyBeanPostProcessor());

// now start using the factory
```

```kotlin
val factory = DefaultListableBeanFactory()
// populate the factory with bean definitions

// now register any needed BeanPostProcessor instances
factory.addBeanPostProcessor(AutowiredAnnotationBeanPostProcessor())
factory.addBeanPostProcessor(MyBeanPostProcessor())

// now start using the factory
```

要将`BeanFactoryPostProcessor` 应用于普通的`DefaultListableBeanFactory`，需要调用其`postProcessBeanFactory`方法，如以下示例所示：

```java
DefaultListableBeanFactory factory = new DefaultListableBeanFactory();
XmlBeanDefinitionReader reader = new XmlBeanDefinitionReader(factory);
reader.loadBeanDefinitions(new FileSystemResource("beans.xml"));

// bring in some property values from a Properties file
PropertyPlaceholderConfigurer cfg = new PropertyPlaceholderConfigurer();
cfg.setLocation(new FileSystemResource("jdbc.properties"));

// now actually do the replacement
cfg.postProcessBeanFactory(factory);
```

```kotlin
val factory = DefaultListableBeanFactory()
val reader = XmlBeanDefinitionReader(factory)
reader.loadBeanDefinitions(FileSystemResource("beans.xml"))

// bring in some property values from a Properties file
val cfg = PropertySourcesPlaceholderConfigurer()
cfg.setLocation(FileSystemResource("jdbc.properties"))

// now actually do the replacement
cfg.postProcessBeanFactory(factory)
```

在这两种情况下，显示注册步骤都不方便，这就是为什么各种`ApplicationContext`变体优先于Spring支持的应用程序中的普通`DefaultListableBeanFactory`， 尤其是在典型企业设置中依赖`BeanFactoryPostProcessor` 和 `BeanPostProcessor`实例来扩展容器功能时。

`AnnotationConfigApplicationContext`具有注册的所有常见注解后置处理器，并且可以通过配置注解（例如`@EnableTransactionManagement`）在封面下引入其他处理器。 在Spring的基于注解的配置模型的抽象级别，bean的后置处理器的概念变成仅仅是内部容器细节。
