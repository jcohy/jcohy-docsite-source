---
title: bean定义的继承
keywords: keywords: docs，jcohy-docs，spring,bean定义的继承
description: Spring  Framework 中文文档 》 bean定义的继承
---

# Spring  Framework 中文文档
### [](#beans-child-bean-definitions)1.7. bean定义的继承

bean定义可以包含许多配置信息，包括构造函数参数，属性值和特定于容器的信息，例如初始化方法，静态工厂方法名称等。 子bean定义从父定义继承配置数据。 子定义可以覆盖某些值或根据需要添加其他值。 使用父子bean定义可以节省很多配置输入。 实际上，这是一种模板形式。

如果开发者编程式地使用`ApplicationContext`接口，子bean定义可以通过`ChildBeanDefinition`类来表示。很多开发者不会使用这个级别的方法， 而是会在类似于`ClassPathXmlApplicationContext`中声明式地配置bean定义。当你使用基于XML的配置时，你可以在子bean中使用parent属性，该属性的值用来识别父bean。 以下示例显示了如何执行此操作：

```xml
<bean id="inheritedTestBean" abstract="true"
        class="org.springframework.beans.TestBean">
    <property name="name" value="parent"/>
    <property name="age" value="1"/>
</bean>

<bean id="inheritsWithDifferentClass"
        class="org.springframework.beans.DerivedTestBean"
        parent="inheritedTestBean" init-method="initialize">  (1)
    <property name="name" value="override"/>
    <!-- the age property value of 1 will be inherited from parent -->
</bean>
```

**1**。请注意`parent`属性。

子bean如果没有指定class，它将使用父bean定义的class。但也可以进行重写。在后一种情况中，子bean必须与父bean兼容，也就是说，它必须接受父bean的属性值。

子bean定义从父类继承作用域、构造器参数、属性值和可重写的方法，除此之外，还可以增加新值。开发者指定任何作用域、初始化方法、销毁方法和/或者静态工厂方法设置都会覆盖相应的父bean设置。

剩下的设置会取子bean定义：依赖、自动注入模式、依赖检查、单例、延迟加载。

前面的示例通过使用`abstract`属性将父bean定义显式标记为`abstract`。 如果父定义未指定类，则需要将父bean定义显式标记为`abstract`，如以下示例所示：

```xml
<bean id="inheritedTestBeanWithoutClass" abstract="true">
    <property name="name" value="parent"/>
    <property name="age" value="1"/>
</bean>

<bean id="inheritsWithClass" class="org.springframework.beans.DerivedTestBean"
        parent="inheritedTestBeanWithoutClass" init-method="initialize">
    <property name="name" value="override"/>
    <!-- age will inherit the value of 1 from the parent bean definition-->
</bean>
```

父bean不能单独实例化，因为它不完整，并且也明确标记为`abstract`。当定义是`abstract`的时，它只能用作纯模板bean定义，用作子定义的父定义。如果试图单独地使用声明了`abstract`的父bean， 通过引用它作为另一个bean的ref属性，或者使用父bean id进行显式的`getBean()`调用，都将返回一个错误。同样，容器内部的 `preInstantiateSingletons()`方法也会忽略定义为`abstract`的bean。

`ApplicationContext` 默认会预先实例化所有的单例bean。因此，如果开发者打算把(父）bean定义仅仅作为模板来使用，同时为它指定了class属性， 那么必须确保设置_abstract_的属性值为true。否则，应用程序上下文会(尝试）预实例化这个`abstract` bean。
