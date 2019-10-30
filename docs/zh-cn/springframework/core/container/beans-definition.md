---
title: Bean 的概述
keywords: keywords: docs，jcohy-docs，spring,Bean 的概述
description: Spring  Framework 中文文档 》 Bean 的概述
---

# Spring  Framework 中文文档
### [](#beans-definition)1.3. Bean 的概述

Spring IoC容器管理一个或多个bean。这些bean是由您提供给容器的元数据配置创建的(例如，XML `<bean/>`定义的形式)。

在容器内部，这些bean定义表示为`BeanDefinition`对象，其中包含（其他信息）以下元数据

*   限定包类名称: 通常，定义的bean的实际实现类。

*   bean行为配置元素, 定义Bean的行为约束(例如作用域，生命周期回调等等）

*   bean需要引用其他bean来完成工作. 这些引用也称为协作或依赖关系.

*   其他配置用于新对象的创建，例如使用bean的数量来管理连接池，或者限制池的大小。


以下是每个bean定义的属性:

Table 1. Bean的定义  

| Property                 | 对应的章节名                                                |
| ------------------------ | ----------------------------------------------------------- |
| Class                    | [实例化Bean](#beans-factory-class)                          |
| Name                     | [命名Bean](#beans-beanname)                                 |
| Scope                    | [Bean 的作用域](#beans-factory-scopes)                      |
| Constructor arguments    | [依赖注入](#beans-factory-collaborators)                    |
| Properties               | [依赖注入](#beans-factory-collaborators)                    |
| Autowiring mode          | [自动装配](#beans-factory-autowire)                         |
| Lazy initialization mode | [懒加载Bean](#beans-factory-lazy-init)                      |
| Initialization method    | [初始化方法回调](#beans-factory-lifecycle-initializingbean) |
| Destruction method       | [销毁方法回调](#beans-factory-lifecycle-disposablebean)     |

除了bean定义包含如何创建特定的bean的信息外，`ApplicationContext`实现还允许用户在容器中注册现有的、已创建的对象。 通过`getBeanFactory()`访问到返回值为`DefaultListableBeanFactory`的实现的ApplicationContext的BeanFactory `DefaultListableBeanFactory`支持通过`registerSingleton(..)`和`registerBeanDefinition(..)`方法来注册对象。 然而，典型的应用程序只能通过元数据配置来定义bean。

为了让容器正确推断它们在自动装配和其它内置步骤，需要尽早注册Bean的元数据和手动使用单例的实例。虽然覆盖现有的元数据和现有的单例实例在某种程度上是支持的， 但是新bean在运行时(同时访问动态工厂）注册官方并不支持，可能会导致并发访问异常、bean容器中的不一致状态，或者两者兼有。

<a id="beans-beanname"></a>

#### [](#beans-beanname)1.3.1. 命名bean

每个bean都有一个或多个标识符，这些标识符在容器托管时必须是唯一的。bean通常只有一个标识符，但如果需要到的标识不止一个时，可以考虑使用别名。

在基于XML的配置中，开发者可以使用`id`属性，name属性或两者都指定bean的标识符。 `id`属性允许您指定一个`id`，通常这些名字使用字母和数字的组合(例如'myBean', 'someService'，等等），但也可以包含特殊字符。 如果你想使用bean别名，您可以在name属性上定义，使用逗号(`,`），分号(`;`)，或白色空格进行分隔。由于历史因素， 请注意，在Spring 3.1之前的版本中，id属性被定义为`xsd:ID`类型，它会限制某些字符。从3.1开始，它被定义为`xsd:string`类型。请注意，由于bean `id`的唯一性，他仍然由容器执行，不再由XML解析器执行。

您也无需提供bean的`name`或 `id`，如果没有显式地提供`name`或 `id`，容器会给bean生成唯一的名称。 然而，如果你想引用bean的名字，可以使用ref元素或使用[Service Locator](#beans-servicelocator)（服务定位器）来进行查找（此时必须提供名称）。 不使用名称的情况有： [内部bean](#beans-inner-beans)和[自动装配的协作者](#beans-factory-autowire)

Bean 的命名约定

bean的命名是按照标准的Java字段名称命名来进行的。也就是说，bean名称开始需要以小写字母开头，后面采用“驼峰式”的方法。 例如`accountManager`,`accountService`, `userDao`, `loginController`等。

一致的beans命名能够让配置更方便阅读和理解，如果你正在使用Spring AOP，当你通过bean名称应用到通知时，这种命名方式会有很大的帮助。

在类路径中进行组件扫描时， Spring 会根据上面的规则为未命名的组件生成 bean 名称，规则是：采用简单的类名，并将其初始字符转化为小写字母。 然而，在特殊情况下，当有一个以上的字符，同时第一个和第二个字符都是大写时，原来的规则仍然应该保留。这些规则与Java中定义实例的相同。 例如Spring使用的`java.beans.Introspector.decapitalize` 类。

<a id="beans-beanname-alias"></a>

##### [](#beans-beanname-alias)为外部定义的bean起别名

在对bean定义时，除了使用`id`属性指定唯一的名称外，还可以提供多个别名，这需要通过`name`属性指定。 所有这个名称都会指向同一个bean，在某些情况下提供别名非常有用，例如为了让应用每一个组件都能更容易的对公共组件进行引用。

然而，在定义bean时就指定所有的别名并不是很恰当的。有时期望能够在当前位置为那些在别处定义的bean引入别名。在XML配置文件中， 可以通过`<alias/>`元素来定义bean别名，例如：

```xml
<alias name="fromName" alias="toName"/>
```

上面示例中，在同一个容器中名为`fromName` 的bean定义，在增加别名定义后，也可以使用`toName`来引用。

例如，在子系统A中通过名字`subsystemA-dataSource`配置的数据源。在子系统B中可能通过名字 `subsystemB-dataSource`来引用。 当两个子系统构成主应用的时候，主应用可能通过名字`myApp-dataSource`引用数据源，将全部三个名字引用同一个对象，你可以将下面的别名定义添加到应用配置中：

```xml
<alias name="subsystemA-dataSource" alias="subsystemB-dataSource"/>
<alias name="subsystemA-dataSource" alias="myApp-dataSource" />
```

现在，每个组件和主应用程序都可以通过一个唯一的名称引用dataSource，并保证不与任何其他定义冲突（有效地创建命名空间），但它们引用相同的bean。 .

Java配置

如果你是用java配置， `@Bean`可以用来提供别名，详情见[使用`@Bean` 注解。](#beans-java-bean-annotation)

<a id="beans-factory-class"></a>

#### [](#beans-factory-class)1.3.2. 实例化Bean

bean定义基本上就是用来创建一个或多个对象的配置，当需要bean的时候，容器会查找配置并且根据bean定义封装的元数据来创建（或获取）实际对象。

如果你使用基于XML的配置，那么可以在`<bean/>` 元素中通过 `class`属性来指定对象类型。 class属性实际上就是`BeanDefinition`实例中的`class`属性。他通常是必需的（一些例外情况，查看 [使用实例工厂方法实例化](#beans-factory-class-instance-factory-method) 和 [Bean 定义的继承](#beans-child-bean-definitions))。有两种方式使用Class属性

*   通常情况下，会直接通过反射调用构造方法来创建bean，这种方式与Java代码的`new`创建相似。

*   通过静态工厂方法创建，类中包含静态方法。通过调用静态方法返回对象的类型可能和Class一样，也可能完全不一样。


内部类名

如果你想配置静态内部类，那么必须使用内部类的二进制名称。

例如，在`com.example`有个`SomeThing`类，这个类里面有个静态内部类`OtherThing`，这种情况下bean定义的class属性应该写作 `com.example.SomeThing$OtherThing`.

使用$字符来分隔外部类和内部类的名称

<a id="beans-factory-class-ctor"></a>

##### [](#beans-factory-class-ctor)使用构造器实例化

当您通过构造方法创建bean时，所有普通类都可以使用并与Spring兼容。也就是说，正在开发的类不需要实现任何特定接口或以特定方式编码。 只要指定bean类就足够了。但是，根据您为该特定bean使用的IoC类型，您可能需要一个默认（空）构造函数。

Spring IoC容器几乎可以管理您希望它管理的任何类。它不仅限于管理真正的JavaBeans。大多数Spring用户更喜欢管理那些只有一个默认构造函数（无参数） 和有合适的setter和getter方法的真实的JavaBeans，还可以在容器中放置更多的外部非bean形式（non-bean-style)类，例如：如果需要使用一个绝对违反JavaBean规范的遗留连接池时 Spring也是可以管理它的。

使用基于XML的配置元数据，您可以按如下方式指定bean类：:

```xml
<bean id="exampleBean" class="examples.ExampleBean"/>

<bean name="anotherExample" class="examples.ExampleBeanTwo"/>
```

给构造方法指定参数以及为bean实例化设置属性将在后面的[依赖注入](#beans-factory-collaborators)中说明。

<a id="beans-factory-class-static-factory-method"></a>

##### [](#beans-factory-class-static-factory-method)使用静态工厂方法实例化

当采用静态工厂方法创建bean时，除了需要指定class属性外，还需要通过`factory-method` 属性来指定创建bean实例的工厂方法。 Spring将会调用此方法（其可选参数接下来会介绍）返回实例对象。从这样看来，它与通过普通构造器创建类实例没什么两样。

下面的bean定义展示了如何通过工厂方法来创建bean实例。注意，此定义并未指定对象的返回类型，只是指定了该类包含的工厂方法，在这个例中， `createInstance()`必须是一个静态（static）的方法。

```xml
<bean id="clientService"
    class="examples.ClientService"
    factory-method="createInstance"/>
```

以下示例显示了一个可以使用前面的bean定义的类:

java:

```java
public class ClientService {
    private static ClientService clientService = new ClientService();
    private ClientService() {}

    public static ClientService createInstance() {
        return clientService;
    }
}
```

kotlin:

```kotlin
class ClientService private constructor() {
    companion object {
        private val clientService = ClientService()
        fun createInstance() = clientService
    }
}
```

给工厂方法指定参数以及为bean实例设置属性的详细内容请查阅[依赖和配置详解](#beans-factory-properties-detailed) 。

<a id="beans-factory-class-instance-factory-method"></a>

##### [](#beans-factory-class-instance-factory-method)使用实例工厂方法实例化

通过调用工厂实例的非静态方法进行实例化与通过[静态工厂方法](#beans-factory-class-static-factory-method)实例化类似， 要使用此机制，请将class属性保留为空，并在`factory-bean`属性中指定当前（或父级或祖先）容器中bean的名称，该容器包含要调用以创建对象的实例方法。 使用`factory-method`属性设置工厂方法本身的名称。以下示例显示如何配置此类bean：

```xml
<!-- the factory bean, which contains a method called createInstance() -->
<bean id="serviceLocator" class="examples.DefaultServiceLocator">
    <!-- inject any dependencies required by this locator bean -->
</bean>

<!-- the bean to be created via the factory bean -->
<bean id="clientService"
    factory-bean="serviceLocator"
    factory-method="createClientServiceInstance"/>
```

以下示例显示了相应的Java类:

```java
public class DefaultServiceLocator {

    private static ClientService clientService = new ClientServiceImpl();

    public ClientService createClientServiceInstance() {
        return clientService;
    }
}
```

kotlin:

```kotlin
class DefaultServiceLocator {
    companion object {
        private val clientService = ClientServiceImpl()
    }
    fun createClientServiceInstance(): ClientService {
        return clientService
    }
}
```

一个工厂类也可以包含多个工厂方法，如以下示例所示:

```xml
<bean id="serviceLocator" class="examples.DefaultServiceLocator">
    <!-- inject any dependencies required by this locator bean -->
</bean>

<bean id="clientService"
    factory-bean="serviceLocator"
    factory-method="createClientServiceInstance"/>

<bean id="accountService"
    factory-bean="serviceLocator"
    factory-method="createAccountServiceInstance"/>
```

以下示例显示了相应的Java类:

```java
public class DefaultServiceLocator {

    private static ClientService clientService = new ClientServiceImpl();

    private static AccountService accountService = new AccountServiceImpl();

    public ClientService createClientServiceInstance() {
        return clientService;
    }

    public AccountService createAccountServiceInstance() {
        return accountService;
    }
}
```

kotlin:

```kotlin
class DefaultServiceLocator {
    companion object {
        private val clientService = ClientServiceImpl()
        private val accountService = AccountServiceImpl()
    }

    fun createClientServiceInstance(): ClientService {
        return clientService
    }

    fun createAccountServiceInstance(): AccountService {
        return accountService
    }
}	
```

这种方法表明可以通过依赖注入（DI）来管理和配置工厂bean本身。请参阅详细信息中的[依赖和配置详解](#beans-factory-properties-detailed)。

在Spring文档中，“factory bean”是指在Spring容器中配置并通过[实例](#beans-factory-class-instance-factory-method) 或 [静态工厂方法](#beans-factory-class-static-factory-method) 创建对象的bean。相比之下，FactoryBean（注意大小写）是指Spring特定的[`FactoryBean`](#beans-factory-extension-factorybean)。
