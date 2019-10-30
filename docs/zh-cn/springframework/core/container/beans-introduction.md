---
title: Spring IoC容器和bean的介绍
keywords: keywords: docs，jcohy-docs，spring,Spring IoC容器和bean的介绍
description: Spring  Framework 中文文档 》 Spring IoC容器和bean的介绍
---

# Spring  Framework 中文文档
### [](#beans-introduction)1.1. Spring IoC容器和bean的介绍

本章介绍Spring框架中控制反转 [Inversion of Control](https://github.com/DocsHome/spring-docs/blob/master/pages/overview/overview.md#background-ioc) 的实现. IOC与大家熟知的依赖注入同理，. 这是一个通过依赖注入对象的过程 也就是说，它们所使用的对象，是通过构造函数参数，工厂方法的参数或这是从工厂方法的构造函数或返回值的对象实例设置的属性，然后容器在创建bean时注入这些需要的依赖。 这个过程相对普通创建对象的过程是反向的（因此称之为IoC），bean本身通过直接构造类来控制依赖关系的实例化或位置，或提供诸如服务定位器模式之类的机制。

`org.springframework.beans` 和 `org.springframework.context` 是实现Spring IOC容器框架的基础. [`BeanFactory`](https://docs.spring.io/spring-framework/docs/5.1.3.BUILD-SNAPSHOT/javadoc-api/org/springframework/beans/factory/BeanFactory.html) 接口提供了一种更先进的配置机制来管理任意类型的对象. [`ApplicationContext`](https://docs.spring.io/spring-framework/docs/5.1.3.BUILD-SNAPSHOT/javadoc-api/org/springframework/context/ApplicationContext.html) 是`BeanFactory`的子接口. 他提供了:

*   更容易与Spring的AOP特性集成

*   消息资源处理(用于国际化)

*   事件发布

*   应用层特定的上下文，如用于web应用程序的`WebApplicationContext`.


简而言之，`BeanFactory`提供了配置框架的基本功能，`ApplicationContext`添加了更多特定于企业的功能。 `ApplicationContext`完全扩展了`BeanFactory`的功能，这些内容将在介绍Spring IoC容器的章节专门讲解。有关使用`BeanFactory`更多信息，请参见`BeanFactory`。

在Spring中，由Spring IOC容器管理的，构成程序的骨架的对象成为Bean。bean对象是指经过IoC容器实例化，组装和管理的对象。此外，bean就是应用程序中众多对象之一 。bean和bean的依赖由容器所使用的配置元数据反射而来。

<a id="beans-basics"></a>
