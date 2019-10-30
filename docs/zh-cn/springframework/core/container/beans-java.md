---
title: 基于Java的容器配置  
keywords: keywords: docs，jcohy-docs，spring,基于Java的容器配置
description: Spring  Framework 中文文档 》 基于Java的容器配置
---

# Spring  Framework 中文文档
### [](#beans-java)1.12. 基于Java的容器配置

本节介绍如何在Java代码中使用注解来配置Spring容器。 它包括以下主题：:

*   [基本概念: `@Bean` 和 `@Configuration`](#beans-java-basic-concepts)

*   [使用`AnnotationConfigApplicationContext`实例化Spring容器](#beans-java-instantiating-container)

*   [使用`@Bean`注解](#beans-java-bean-annotation)

*   [使用`@Configuration`注解](#beans-java-configuration-annotation)

*   [编写基于Java的配置](#beans-java-composing-configuration-classes)

*   [定义Bean配置文件](#beans-definition-profiles)

*   [`PropertySource` 抽象](#beans-property-source-abstraction)

*   [使用 `@PropertySource`](#beans-using-propertysource)

*   [声明中的占位符](#beans-placeholder-resolution-in-statements)

<a id="beans-java-basic-concepts"></a>

#### [](#beans-java-basic-concepts)1.12.1. 基本概念: `@Bean` 和 `@Configuration`

Spring新的基于Java配置的核心内容是`@Configuration`注解的类和`@Bean`注解的方法。

`@Bean`注解用于表明方法的实例化，、配置和初始化都是由Spring IoC容器管理的新对象，对于那些熟悉Spring的`<beans/>`XML配置的人来说， `@Bean`注解扮演的角色与`<beans/>`元素相同。开发者可以在任意的Spring `@Component`中使用`@Bean`注解方法 ，但大多数情况下，`@Bean`是配合`@Configuration`使用的。

使用`@Configuration`注解类时，这个类的目的就是作为bean定义的地方。此外，`@Configuration`类允许通过调用同一个类中的其他`@Bean`方法来定义bean间依赖关系。 最简单的`@Configuration`类如下所示：

```java
@Configuration
public class AppConfig {

    @Bean
    public MyService myService() {
        return new MyServiceImpl();
    }
}
```

kotlin:

```kotlin
@Configuration
class AppConfig {

    @Bean
    fun myService(): MyService {
        return MyServiceImpl()
    }
}
```

前面的`AppConfig`类等效于以下Spring `<beans/>`XML：

```xml
<beans>
    <bean id="myService" class="com.acme.services.MyServiceImpl"/>
</beans>
```

完整的@Configuration模式对比“lite”模式的@Bean?

当`@Bean`方法在没有用 `@Configuration`注解的类中声明时，它们将会被称为“lite”的模式处理。例如，`@Component`中声明的bean方法或者一个普通的旧类中的bean方法将被视为 “lite”的。包含类的主要目的不同，而`@Bean`方法在这里是一种额外的好处。。例如，服务组件可以通过在每个适用的组件类上使用额外的 `@Bean`方法将管理视图公开给容器。 在这种情况下，`@Bean`方法是一种通用的工厂方法机制。

与完整的 `@Configuration`不同，lite的`@Bean`方法不能声明bean之间的依赖关系。 相反，它们对其包含组件的内部状态进行操作，并且可以有选择的对它们可能声明的参数进行操作。因此，这样的`@Bean`注解的方法不应该调用其他`@Bean`注解的方法。 每个这样的方法实际上只是特定bean引用的工厂方法，没有任何特殊的运行时语义。不经过CGLIB处理，所以在类设计方面没有限制（即，包含类可能是最终的）。

在常见的场景中，`@Bean`方法将在`@Configuration`类中声明，确保始终使用“full”模式，这将防止相同的`@Bean`方法被意外地多次调用，这有助于减少在 “lite”模式下操作时难以跟踪的细微错误。

`@Bean`和`@Configuration`注解将在下面的章节深入讨论，首先，我们将介绍使用基于Java代码的配置来创建Spring容器的各种方法。

<a id="beans-java-instantiating-container"></a>

#### [](#beans-java-instantiating-container)1.12.2. 使用`AnnotationConfigApplicationContext`初始化Spring容器

以下部分介绍了Spring的`AnnotationConfigApplicationContext`，它是在Spring 3.0中引入的。这是一个强大的(versatile)`ApplicationContext` 实现,它不仅能解析`@Configuration`注解类 ,也能解析 `@Component`注解的类和使用JSR-330注解的类.

当使用`@Configuration`类作为输入时,`@Configuration`类本身被注册为一个bean定义,类中所有声明的`@Bean`方法也被注册为bean定义.

当提供 `@Component`和JSR-330类时，它们被注册为bean定义，并且假定在必要时在这些类中使用DI元数据，例如`@Autowired` 或 `@Inject`。

<a id="beans-java-instantiating-container-contstructor"></a>

##### [](#beans-java-instantiating-container-contstructor)简单结构

与实例化`ClassPathXmlApplicationContext`时Spring XML文件用作输入的方式大致相同， 在实例化`AnnotationConfigApplicationContext`时可以使用`@Configuration` 类作为输入。 这允许完全无XML使用Spring容器，如以下示例所示：

```java
public static void main(String[] args) {
    ApplicationContext ctx = new AnnotationConfigApplicationContext(AppConfig.class);
    MyService myService = ctx.getBean(MyService.class);
    myService.doStuff();
}
```

kotlin:

```kotlin
import org.springframework.beans.factory.getBean

fun main() {
    val ctx = AnnotationConfigApplicationContext(AppConfig::class.java)
    val myService = ctx.getBean<MyService>()
    myService.doStuff()
}
```

如前所述，`AnnotationConfigApplicationContext`不仅限于使用`@Configuration`类。 任何`@Component`或JSR-330带注解的类都可以作为输入提供给构造函数，如以下示例所示：

```java
public static void main(String[] args) {
    ApplicationContext ctx = new AnnotationConfigApplicationContext(MyServiceImpl.class, Dependency1.class, Dependency2.class);
    MyService myService = ctx.getBean(MyService.class);
    myService.doStuff();
}
```

kotlin:

```kotlin
import org.springframework.beans.factory.getBean

fun main() {
    val ctx = AnnotationConfigApplicationContext(MyServiceImpl::class.java, Dependency1::class.java, Dependency2::class.java)
    val myService = ctx.getBean<MyService>()
    myService.doStuff()
}
```

上面假设`MyServiceImpl`, `Dependency1`, 和 `Dependency2`使用Spring依赖注入注解，例如`@Autowired`。

<a id="beans-java-instantiating-container-register"></a>

##### [](#beans-java-instantiating-container-register)使用`register(Class<?>…)`编程构建容器

`AnnotationConfigApplicationContext`可以通过无参构造函数实例化，然后调用`register()` 方法进行配置。 这种方法在以编程的方式构建 `AnnotationConfigApplicationContext`时特别有用。下列示例显示了如何执行此操作

```java
public static void main(String[] args) {
    AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext();
    ctx.register(AppConfig.class, OtherConfig.class);
    ctx.register(AdditionalConfig.class);
    ctx.refresh();
    MyService myService = ctx.getBean(MyService.class);
    myService.doStuff();
}
```

```kotlin
import org.springframework.beans.factory.getBean

fun main() {
    val ctx = AnnotationConfigApplicationContext()
    ctx.register(AppConfig::class.java, OtherConfig::class.java)
    ctx.register(AdditionalConfig::class.java)
    ctx.refresh()
    val myService = ctx.getBean<MyService>()
    myService.doStuff()
}
```

<a id="beans-java-instantiating-container-scan"></a>

##### [](#beans-java-instantiating-container-scan)3 使用`scan(String…)`扫描组件

要启用组件扫描，可以按如下方式注解`@Configuration`类:

```java
@Configuration
@ComponentScan(basePackages = "com.acme") (1)
public class AppConfig  {
    ...
}
```

```kotlin
@Configuration
@ComponentScan(basePackages = ["com.acme"]) 
class AppConfig  {
    // ...
}
```

**1**、此注解可启用组件扫描。

有经验的用户可能更熟悉使用XML的等价配置形式，如下例所示：

    <beans>
        <context:component-scan base-package="com.acme"/>
    </beans>

上面的例子中，`com.acme`包会被扫描，只要是使用了`@Component`注解的类，都会被注册进容器中。同样地，`AnnotationConfigApplicationContext`公开的`scan(String…)` 方法也允许扫描类完成同样的功能 如以下示例所示：

```java
public static void main(String[] args) {
    AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext();
    ctx.scan("com.acme");
    ctx.refresh();
    MyService myService = ctx.getBean(MyService.class);
}
```

```kotlin
fun main() {
    val ctx = AnnotationConfigApplicationContext()
    ctx.scan("com.acme")
    ctx.refresh()
    val myService = ctx.getBean<MyService>()
}
```

请记住`@Configuration`类是使用`@Component`进行[元注解](#beans-meta-annotations)的，因此它们是组件扫描的候选者。 在前面的示例中， 假设AppConfig在com.acme包（或下面的任何包）中声明，它在`scan()`调用期间被拾取。 在`refresh()`之后，它的所有`@Bean`方法都被处理并在容器中注册为bean定义。

<a id="beans-java-instantiating-container-web"></a>

##### [](#beans-java-instantiating-container-web)使用`AnnotationConfigWebApplicationContext`支持Web应用程序

`WebApplicationContext`与`AnnotationConfigApplicationContext`的变种是 `AnnotationConfigWebApplicationContext`配置。这个实现可以用于配置Spring `ContextLoaderListener` servlet监听器 ，Spring MVC的 `DispatcherServlet`等等。以下web.xml代码段配置典型的Spring MVC Web应用程序（请注意`contextClass` context-param和init-param的使用）：

```xml
<web-app>
    <!-- Configure ContextLoaderListener to use AnnotationConfigWebApplicationContext
        instead of the default XmlWebApplicationContext -->
    <context-param>
        <param-name>contextClass</param-name>
        <param-value>
            org.springframework.web.context.support.AnnotationConfigWebApplicationContext
        </param-value>
    </context-param>

    <!-- Configuration locations must consist of one or more comma- or space-delimited
        fully-qualified @Configuration classes. Fully-qualified packages may also be
        specified for component-scanning -->
    <context-param>
        <param-name>contextConfigLocation</param-name>
        <param-value>com.acme.AppConfig</param-value>
    </context-param>

    <!-- Bootstrap the root application context as usual using ContextLoaderListener -->
    <listener>
        <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
    </listener>

    <!-- Declare a Spring MVC DispatcherServlet as usual -->
    <servlet>
        <servlet-name>dispatcher</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <!-- Configure DispatcherServlet to use AnnotationConfigWebApplicationContext
            instead of the default XmlWebApplicationContext -->
        <init-param>
            <param-name>contextClass</param-name>
            <param-value>
                org.springframework.web.context.support.AnnotationConfigWebApplicationContext
            </param-value>
        </init-param>
        <!-- Again, config locations must consist of one or more comma- or space-delimited
            and fully-qualified @Configuration classes -->
        <init-param>
            <param-name>contextConfigLocation</param-name>
            <param-value>com.acme.web.MvcConfig</param-value>
        </init-param>
    </servlet>

    <!-- map all requests for /app/* to the dispatcher servlet -->
    <servlet-mapping>
        <servlet-name>dispatcher</servlet-name>
        <url-pattern>/app/*</url-pattern>
    </servlet-mapping>
</web-app>
```

<a id="beans-java-bean-annotation"></a>

#### [](#beans-java-bean-annotation)1.12.3. 使用`@Bean` 注解

`@Bean` @Bean是一个方法级别的注解，它与XML中的 `<bean/>`元素类似。注解支持 `<bean/>`提供的一些属性，例如 \* [init-method](#beans-factory-lifecycle-initializingbean) \* [destroy-method](#beans-factory-lifecycle-disposablebean) \* [autowiring](#beans-factory-autowire) \* `name`

开发者可以在`@Configuration`类或`@Component`类中使用`@Bean`注解。

<a id="beans-java-declaring-a-bean"></a>

##### [](#beans-java-declaring-a-bean)声明一个Bean

要声明一个bean，只需使用`@Bean`注解方法即可。使用此方法，将会在`ApplicationContext`内注册一个bean，bean的类型是方法的返回值类型。默认情况下， bean名称将与方法名称相同。以下示例显示了`@Bean`方法声明：

```java
@Configuration
public class AppConfig {

    @Bean
    public TransferServiceImpl transferService() {
        return new TransferServiceImpl();
    }
}
```

kotlin:

```kotlin
@Configuration
class AppConfig {

    @Bean
    fun transferService() = TransferServiceImpl()
}
```

前面的配置完全等同于以下Spring XML:

```xml
<beans>
    <bean id="transferService" class="com.acme.TransferServiceImpl"/>
</beans>
```

这两个声明都在`ApplicationContext`中创建一个名为`transferService`的bean，并且绑定了`TransferServiceImpl`的实例。如下图所示：

```
transferService -> com.acme.TransferServiceImpl
```

您还可以使用接口（或基类）返回类型声明`@Bean`方法，如以下示例所示：

```java
@Configuration
public class AppConfig {

    @Bean
    public TransferService transferService() {
        return new TransferServiceImpl();
    }
}
```

```kotlin
@Configuration
class AppConfig {

    @Bean
    fun transferService(): TransferService {
        return TransferServiceImpl()
    }
}
```

但是，这会将预先类型预测的可见性限制为指定的接口类型(`TransferService`),然后在实例化受影响的单一bean时,只知道容器的完整类型(`TransferServiceImpl`）。 。非延迟的单例bean根据它们的声明顺序进行实例化，因此开发者可能会看到不同类型的匹配结果，这具体取决于另一个组件尝试按未类型匹配的时间(如`@Autowired TransferServiceImpl`， 一旦`transferService` bean已被实例化,这个问题就被解决了).

如果通过声明的服务接口都是引用类型,那么`@Bean` 返回类型可以安全地加入该设计决策.但是,对于实现多个接口的组件或可能由其实现类型引用的组件, 更安全的方法是声明可能的最具体的返回类型(至少按照注入点所要求的特定你的bean）。

<a id="beans-java-dependencies"></a>

##### [](#beans-java-dependencies)Bean之间的依赖

一个使用`@Bean`注解的方法可以具有任意数量的参数描述构建该bean所需的依赖，例如，如果我们的`TransferService`需要`AccountRepository`， 我们可以使用方法参数来实现该依赖关系，如以下示例所示：

```java
@Configuration
public class AppConfig {

    @Bean
    public TransferService transferService(AccountRepository accountRepository) {
        return new TransferServiceImpl(accountRepository);
    }
}
```

```kotlin
@Configuration
class AppConfig {

    @Bean
    fun transferService(accountRepository: AccountRepository): TransferService {
        return TransferServiceImpl(accountRepository)
    }
}
```

这个解析机制与基于构造函数的依赖注入非常相似。有关详细信息，请参阅[相关部分](#beans-constructor-injection)。

<a id="beans-java-lifecycle-callbacks"></a>

##### [](#beans-java-lifecycle-callbacks)接收生命周期回调

使用`@Bean`注解定义的任何类都支持常规的生命周期回调，并且可以使用JSR-的`@PostConstruct`和`@PreDestroy`注解。 有关更多详细信息，请参阅 [JSR-250](#beans-postconstruct-and-predestroy-annotations) 注解。

完全支持常规的Spring[生命周期](#beans-factory-nature)回调。 如果bean实现`InitializingBean`, `DisposableBean`, 或 `Lifecycle`，则它们各自的方法由容器调用。

同样地，还完全支持标准的`*Aware`，如[BeanFactoryAware](#beans-beanfactory), [BeanNameAware](#beans-factory-aware), [MessageSourceAware](#context-functionality-messagesource), [ApplicationContextAware](#beans-factory-aware)。

`@Bean`注解支持指定任意初始化和销毁回调方法，就像`bean`元素上的Spring XML的 `init-method`和`destroy-method` 属性一样，如下例所示：

```java
public class BeanOne {

    public void init() {
        // initialization logic
    }
}

public class BeanTwo {

    public void cleanup() {
        // destruction logic
    }
}

@Configuration
public class AppConfig {

    @Bean(initMethod = "init")
    public BeanOne beanOne() {
        return new BeanOne();
    }

    @Bean(destroyMethod = "cleanup")
    public BeanTwo beanTwo() {
        return new BeanTwo();
    }
}
```

```kotlin
class BeanOne {

    fun init() {
        // initialization logic
    }
}

class BeanTwo {

    fun cleanup() {
        // destruction logic
    }
}

@Configuration
class AppConfig {

    @Bean(initMethod = "init")
    fun beanOne() = BeanOne()

    @Bean(destroyMethod = "cleanup")
    fun beanTwo() = BeanTwo()
}

```

默认情况下，使用Java Config定义的bean中`close`方法或者`shutdown`方法，会作为销毁回调而自动调用。若bean中有`close` 或 `shutdown` 方法，并且您不希望在容器关闭时调用它，则可以将`@Bean(destroyMethod="")` 添加到bean定义中以禁用默认`(inferred)` 模式。

开发者可能希望对通过JNDI获取的资源执行此操作，因为它的生命周期是在应用程序外部管理的。更进一步，使用 `DataSource`时一定要关闭它，不关闭将会出问题。

以下示例说明如何防止`DataSource`的自动销毁回调：

```java
@Bean(destroyMethod="")
public DataSource dataSource() throws NamingException {
    return (DataSource) jndiTemplate.lookup("MyDS");
}
```

```kotlin
@Bean(destroyMethod = "")
fun dataSource(): DataSource {
    return jndiTemplate.lookup("MyDS") as DataSource
}
```

同样地，使用`@Bean`方法，通常会选择使用程序化的JNDI查找：使用Spring的`JndiTemplate` / `JndiLocatorDelegate`帮助类或直接使用JNDI的`InitialContext` ，但是不要使用`JndiObjectFactoryBean`的变体，因为它会强制开发者声明一个返回类型作为`FactoryBean`的类型用于代替实际的目标类型，这会使得交叉引用变得很困难。

对于前面注解中上面示例中的`BeanOne`，在构造期间直接调用`init()`方法同样有效，如下例所示：

```java
@Configuration
public class AppConfig {

    @Bean
    public BeanOne beanOne() {
        BeanOne beanOne = new BeanOne();
        beanOne.init();
        return beanOne;
    }

    // ...
}
```

```kotlin
@Configuration
class AppConfig {

    @Bean
    fun beanOne() = BeanOne().apply {
        init()
    }

    // ...
}
```

当您直接使用Java（new对象那种）工作时，您可以使用对象执行任何您喜欢的操作，并且不必总是依赖于容器生命周期。

<a id="beans-java-specifying-bean-scope"></a>

##### [](#beans-java-specifying-bean-scope)指定Bean范围

Spring包含`@Scope`注解，以便您可以指定bean的范围。

<a id="beans-java-available-scopes"></a>

###### [](#beans-java-available-scopes)使用 `@Scope` 注解

可以使用任意标准的方式为 `@Bean`注解的bean指定一个作用域，你可以使用[Bean Scopes](#beans-factory-scopes)中的任意标准作用域

默认范围是`singleton`的，但是可以使用 `@Scope`注解来覆盖。如下例所示：

```java
@Configuration
public class MyConfiguration {

    @Bean
    @Scope("prototype")
    public Encryptor encryptor() {
        // ...
    }
}
```

```kotlin
@Configuration
class MyConfiguration {

    @Bean
    @Scope("prototype")
    fun encryptor(): Encryptor {
        // ...
    }
}
```

<a id="beans-java-scoped-proxy"></a>

###### [](#beans-java-scoped-proxy)`@Scope` and `scoped-proxy`

Spring提供了一种通过[scoped proxies](#beans-factory-scopes-other-injection)处理作用域依赖项的便捷方法。使用XML配置时创建此类代理的最简单方法是`<aop:scoped-proxy/>`元素。 使用`@Scope`注解在Java中配置bean提供了与`proxyMode`属性的等效支持。 默认值为无代理（`ScopedProxyMode.NO`），但您可以指定`ScopedProxyMode.TARGET_CLASS` 或 `ScopedProxyMode.INTERFACES`。

如果使用Java将XML参考文档（请参阅[scoped proxies](#beans-factory-scopes-other-injection)）的作用域代理示例移植到我们的 `@Bean`，它类似于以下内容：

```java
// an HTTP Session-scoped bean exposed as a proxy
@Bean
@SessionScope
public UserPreferences userPreferences() {
    return new UserPreferences();
}

@Bean
public Service userService() {
    UserService service = new SimpleUserService();
    // a reference to the proxied userPreferences bean
    service.setUserPreferences(userPreferences());
    return service;
}
```

```kotlin
// an HTTP Session-scoped bean exposed as a proxy
@Bean
@SessionScope
fun userPreferences() = UserPreferences()

@Bean
fun userService(): Service {
    return SimpleUserService().apply {
        // a reference to the proxied userPreferences bean
        setUserPreferences(userPreferences()
    }
}
```

<a id="beans-java-customizing-bean-naming"></a>

##### [](#beans-java-customizing-bean-naming)自定义Bean命名

默认情况下，配置类使用`@Bean`方法的名称作为结果bean的名称。 但是，可以使用`name`属性覆盖此功能，如以下示例所示：

```java
@Configuration
public class AppConfig {

    @Bean(name = "myThing")
    public Thing thing() {
        return new Thing();
    }
}
```

```kotlin
@Configuration
class AppConfig {

    @Bean("myThing")
    fun thing() = Thing()
}
```

<a id="beans-java-bean-aliasing"></a>

##### [](#beans-java-bean-aliasing)bean别名

正如[Bean的 命名](#beans-beanname)中所讨论的，有时需要为单个bean提供多个名称，也称为bean别名。 `@Bean`注解的 `name`属性为此接受String数组。 以下示例显示如何为bean设置多个别名：

```java
@Configuration
public class AppConfig {

    @Bean(name = { "dataSource", "subsystemA-dataSource", "subsystemB-dataSource" })
    public DataSource dataSource() {
        // instantiate, configure and return DataSource bean...
    }
}
```

```kotlin
@Configuration
class AppConfig {

    @Bean("dataSource", "subsystemA-dataSource", "subsystemB-dataSource")
    fun dataSource(): DataSource {
        // instantiate, configure and return DataSource bean...
    }
}
```

<a id="beans-java-bean-description"></a>

##### [](#beans-java-bean-description)Bean 的描述

有时，提供更详细的bean文本描述会很有帮助。 当bean被暴露（可能通过JMX）用于监视目的时，这可能特别有用。

要向@Bean添加描述，可以使用[`@Description`](https://docs.spring.io/spring-framework/docs/5.1.3.BUILD-SNAPSHOT/javadoc-api/org/springframework/context/annotation/Description.html)注解，如以下示例所示：

```java
@Configuration
public class AppConfig {

    @Bean
    @Description("Provides a basic example of a bean")
    public Thing thing() {
        return new Thing();
    }
}
```

```kotlin
@Configuration
class AppConfig {

    @Bean
    @Description("Provides a basic example of a bean")
    fun thing() = Thing()
}
```

<a id="beans-java-configuration-annotation"></a>

#### [](#beans-java-configuration-annotation)1.12.4. 使用 `@Configuration` 注解

`@Configuration`是一个类级别的注解,表明该类将作为bean定义的元数据配置. `@Configuration`类会将有`@Bean`注解的公开方法声明为bean, .在 `@Configuration`类上调用`@Bean`方法也可以用于定义bean间依赖关系, 有关一般介绍，请参阅 [基本概念: `@Bean` 和 `@Configuration`](#beans-java-basic-concepts)

<a id="beans-java-injecting-dependencies"></a>

##### [](#beans-java-injecting-dependencies)注入内部bean依赖

当Bean彼此有依赖关系时,表示依赖关系就像调用另一个bean方法一样简单.如下例所示：

```java
@Configuration
public class AppConfig {

    @Bean
    public BeanOne beanOne() {
        return new BeanOne(beanTwo());
    }

    @Bean
    public BeanTwo beanTwo() {
        return new BeanTwo();
    }
}
```

```kotlin
@Configuration
class AppConfig {

    @Bean
    fun beanOne() = BeanOne(beanTwo())

    @Bean
    fun beanTwo() = BeanTwo()
}
```

在前面的示例中，`beanOne`通过构造函数注入接收对`beanTwo`的引用。

这种声明bean间依赖关系的方法只有在 `@Configuration` 类中声明`@Bean`方法时才有效。 您不能使用普通的`@Component`类声明bean间依赖关系。

<a id="beans-java-method-injection"></a>

##### [](#beans-java-method-injection)查找方法注入

如前所述，[查找方法注入](#beans-factory-method-injection)是一项很少使用的高级功能。 在单例范围的bean依赖于原型范围的bean的情况下，它很有用。 Java提供了很友好的API来实现这种模式。以下示例显示了如何使用查找方法注入：

```java
public abstract class CommandManager {
    public Object process(Object commandState) {
        // grab a new instance of the appropriate Command interface
        Command command = createCommand();
        // set the state on the (hopefully brand new) Command instance
        command.setState(commandState);
        return command.execute();
    }

    // okay... but where is the implementation of this method?
    protected abstract Command createCommand();
}
```

```kotlin
abstract class CommandManager {
    fun process(commandState: Any): Any {
        // grab a new instance of the appropriate Command interface
        val command = createCommand()
        // set the state on the (hopefully brand new) Command instance
        command.setState(commandState)
        return command.execute()
    }

    // okay... but where is the implementation of this method?
    protected abstract fun createCommand(): Command
}
```

通过使用Java配置，您可以创建 `CommandManager`的子类，其中抽象的 `createCommand()` 方法被覆盖，以便查找新的（原型）对象。 以下示例显示了如何执行此操作：

```java
@Bean
@Scope("prototype")
public AsyncCommand asyncCommand() {
    AsyncCommand command = new AsyncCommand();
    // inject dependencies here as required
    return command;
}

@Bean
public CommandManager commandManager() {
    // return new anonymous implementation of CommandManager with command() overridden
    // to return a new prototype Command object
    return new CommandManager() {
        protected Command createCommand() {
            return asyncCommand();
        }
    }
}
```

```kotlin
@Bean
@Scope("prototype")
fun asyncCommand(): AsyncCommand {
    val command = AsyncCommand()
    // inject dependencies here as required
    return command
}

@Bean
fun commandManager(): CommandManager {
    // return new anonymous implementation of CommandManager with createCommand()
    // overridden to return a new prototype Command object
    return object : CommandManager() {
        override fun createCommand(): Command {
            return asyncCommand()
        }
    }
}
```

<a id="beans-java-further-information-java-config"></a>

##### [](#beans-java-further-information-java-config)有关基于Java的配置如何在内部工作的更多信息

请考虑以下示例，该示例显示了被调用两次的`@Bean`注解方法:

```java
@Configuration
public class AppConfig {

    @Bean
    public ClientService clientService1() {
        ClientServiceImpl clientService = new ClientServiceImpl();
        clientService.setClientDao(clientDao());
        return clientService;
    }

    @Bean
    public ClientService clientService2() {
        ClientServiceImpl clientService = new ClientServiceImpl();
        clientService.setClientDao(clientDao());
        return clientService;
    }

    @Bean
    public ClientDao clientDao() {
        return new ClientDaoImpl();
    }
}
```

```kotlin
@Configuration
class AppConfig {

    @Bean
    fun clientService1(): ClientService {
        return ClientServiceImpl().apply {
            clientDao = clientDao()
        }
    }

    @Bean
    fun clientService2(): ClientService {
        return ClientServiceImpl().apply {
            clientDao = clientDao()
        }
    }

    @Bean
    fun clientDao(): ClientDao {
        return ClientDaoImpl()
    }
}
```

`clientDao()`在`clientService1()`中调用一次，在`clientService2()`中调用一次。由于此方法创建了`ClientDaoImpl`的新实例并将其返回，因此通常希望有两个实例（每个服务一个）。 这肯定会有问题：在Spring中，实例化的bean默认具有`singleton`范围。这就是它的神奇之处:所有`@Configuration`类在启动时都使用 `CGLIB`进行子类化。 在子类中，子方法在调用父方法并创建新实例之前，首先检查容器是否有任何缓存（作用域）bean。

这种行为可以根据bean的作用域而变化,我们这里只是讨论单例.

从Spring 3.2开始，不再需要将CGLIB添加到类路径中，因为CGLIB类已经在`org.springframework.cglib`下重新打包并直接包含在spring-core JAR中。

由于CGLIB在启动时动态添加功能，因此存在一些限制。 特别是，配置类不能是 final的。 但是，从4.3开始，配置类允许使用任何构造函数，包括使用`@Autowired`或单个非默认构造函数声明进行默认注入。

如果想避免因CGLIB带来的限制,请考虑声明非`@Configuration`类的`@Bean`方法，例如在纯的`@Component`类 .这样在`@Bean`方法之间的交叉方法调用将不会被拦截,此时必须在构造函数或方法级别上进行依赖注入。

<a id="beans-java-composing-configuration-classes"></a>

#### [](#beans-java-composing-configuration-classes)1.12.5. 编写基于Java的配置

Spring的基于Java的配置功能允许您撰写注解，这可以降低配置的复杂性。

<a id="beans-java-using-import"></a>

##### [](#beans-java-using-import)使用`@Import` 注解

就像在Spring XML文件中使用`<import/>`元素来帮助模块化配置一样，`@Import` 注解允许从另一个配置类加载`@Bean`定义，如下例所示：

```java
@Configuration
public class ConfigA {

    @Bean
    public A a() {
        return new A();
    }
}

@Configuration
@Import(ConfigA.class)
public class ConfigB {

    @Bean
    public B b() {
        return new B();
    }
}
```

```kotlin
@Configuration
class ConfigA {

    @Bean
    fun a() = A()
}

@Configuration
@Import(ConfigA::class)
class ConfigB {

    @Bean
    fun b() = B()
}
```

现在，在实例化上下文时，不需要同时指定`ConfigA.class`和 `ConfigB.class`，只需要显式提供`ConfigB`，如下例所示：

```java
public static void main(String[] args) {
    ApplicationContext ctx = new AnnotationConfigApplicationContext(ConfigB.class);

    // now both beans A and B will be available...
    A a = ctx.getBean(A.class);
    B b = ctx.getBean(B.class);
}
```

```kotlin
import org.springframework.beans.factory.getBean

fun main() {
    val ctx = AnnotationConfigApplicationContext(ConfigB::class.java)

    // now both beans A and B will be available...
    val a = ctx.getBean<A>()
    val b = ctx.getBean<B>()
}
```

这种方法简化了容器实例化，因为只需要处理一个类，而不是要求您在构造期间记住可能大量的`@Configuration`类。

从Spring Framework 4.2开始，`@Import`还支持引用常规组件类，类似于`AnnotationConfigApplicationContext.register`方法。 如果要避免组件扫描，这一点特别有用，可以使用一些配置类作为明确定义所有组件的入口点。

<a id="beans-java-injecting-imported-beans"></a>

###### [](#beans-java-injecting-imported-beans)在导入的`@Bean`定义上注入依赖项

上面的例子可以运行,,但是太简单了。在大多数实际情况下，bean将在配置类之间相互依赖.在使用XML时,这本身不是问题,因为没有涉及到编译器. 可以简单地声明 `ref="someBean"`,并且相信Spring将在容器初始化期间可以很好地处理它。当然，当使用`@Configuration`类时，Java编译器会有一些限制 ，即需符合Java的语法。

幸运的是，解决这个问题很简单。正如我们[已经讨论过](#beans-java-dependencies)的，`@Bean`方法可以有任意数量的参数来描述bean的依赖关系。 考虑以下更多真实场景，其中包含几个 `@Configuration`类，每个类都取决于其他类中声明的bean：

```java
@Configuration
public class ServiceConfig {

    @Bean
    public TransferService transferService(AccountRepository accountRepository) {
        return new TransferServiceImpl(accountRepository);
    }
}

@Configuration
public class RepositoryConfig {

    @Bean
    public AccountRepository accountRepository(DataSource dataSource) {
        return new JdbcAccountRepository(dataSource);
    }
}

@Configuration
@Import({ServiceConfig.class, RepositoryConfig.class})
public class SystemTestConfig {

    @Bean
    public DataSource dataSource() {
        // return new DataSource
    }
}

public static void main(String[] args) {
    ApplicationContext ctx = new AnnotationConfigApplicationContext(SystemTestConfig.class);
    // everything wires up across configuration classes...
    TransferService transferService = ctx.getBean(TransferService.class);
    transferService.transfer(100.00, "A123", "C456");
}
```

```kotlin
import org.springframework.beans.factory.getBean

@Configuration
class ServiceConfig {

    @Bean
    fun transferService(accountRepository: AccountRepository): TransferService {
        return TransferServiceImpl(accountRepository)
    }
}

@Configuration
class RepositoryConfig {

    @Bean
    fun accountRepository(dataSource: DataSource): AccountRepository {
        return JdbcAccountRepository(dataSource)
    }
}

@Configuration
@Import(ServiceConfig::class, RepositoryConfig::class)
class SystemTestConfig {

    @Bean
    fun dataSource(): DataSource {
        // return new DataSource
    }
}


fun main() {
    val ctx = AnnotationConfigApplicationContext(SystemTestConfig::class.java)
    // everything wires up across configuration classes...
    val transferService = ctx.getBean<TransferService>()
    transferService.transfer(100.00, "A123", "C456")
}
```

还有另一种方法可以达到相同的效果。请记住，`@Configuration`类最终只是容器中的另一个bean： 这意味着它们可以利用`@Autowired` 和 `@Value` 注入以及与任何其他bean相同的其他功能。

确保以这种方式注入的依赖项只是最简单的。`@Configuration`类在上下文初始化期间很早就被处理，并且强制以这种方式注入依赖项可能会导致意外的早期初始化。 尽可能采用基于参数的注入，如前面的示例所示。

另外，要特别注意通过`@Bean`的`BeanPostProcessor` 和 `BeanFactoryPostProcessor`定义。 这些通常应该声明为静态`@Bean`方法，而不是触发其包含配置类的实例化。否则，`@Autowired` 和 `@Value`不能在配置类本身上工作，因为它过早地被创建为bean实例。

以下示例显示了如何将一个bean自动连接到另一个bean:

```java
@Configuration
public class ServiceConfig {

    @Autowired
    private AccountRepository accountRepository;

    @Bean
    public TransferService transferService() {
        return new TransferServiceImpl(accountRepository);
    }
}

@Configuration
public class RepositoryConfig {

    private final DataSource dataSource;

    @Autowired
    public RepositoryConfig(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Bean
    public AccountRepository accountRepository() {
        return new JdbcAccountRepository(dataSource);
    }
}

@Configuration
@Import({ServiceConfig.class, RepositoryConfig.class})
public class SystemTestConfig {

    @Bean
    public DataSource dataSource() {
        // return new DataSource
    }
}

public static void main(String[] args) {
    ApplicationContext ctx = new AnnotationConfigApplicationContext(SystemTestConfig.class);
    // everything wires up across configuration classes...
    TransferService transferService = ctx.getBean(TransferService.class);
    transferService.transfer(100.00, "A123", "C456");
}
```

```kotlin
import org.springframework.beans.factory.getBean

@Configuration
class ServiceConfig {

    @Autowired
    lateinit var accountRepository: AccountRepository

    @Bean
    fun transferService(): TransferService {
        return TransferServiceImpl(accountRepository)
    }
}

@Configuration
class RepositoryConfig(private val dataSource: DataSource) {

    @Bean
    fun accountRepository(): AccountRepository {
        return JdbcAccountRepository(dataSource)
    }
}

@Configuration
@Import(ServiceConfig::class, RepositoryConfig::class)
class SystemTestConfig {

    @Bean
    fun dataSource(): DataSource {
        // return new DataSource
    }
}

fun main() {
    val ctx = AnnotationConfigApplicationContext(SystemTestConfig::class.java)
    // everything wires up across configuration classes...
    val transferService = ctx.getBean<TransferService>()
    transferService.transfer(100.00, "A123", "C456")
}
```

仅在Spring Framework 4.3中支持`@Configuration`类中的构造函数注入。 另请注意，如果目标bean仅定义了一个构造函数，则无需指定`@Autowired`。 在前面的示例中，`RepositoryConfig`构造函数中不需要`@Autowired`。

完全导入bean便于查找

在上面的场景中,`@Autowired`可以很好的工作,使设计更具模块化,但是自动注入哪个bean依然有些模糊不清.例如, 作为一个开发者查看`ServiceConfig`类时,你怎么知道`@Autowired AccountRepository`在哪定义的呢?代码中并未明确指出, 还好, [Spring Tool Suite](https://spring.io/tools/sts)提供的工具可以呈现图表，显示所有内容的连线方式，这可能就是您所需要的。 此外，您的Java IDE可以轻松找到`AccountRepository`类型的所有声明和用法，并快速显示返回该类型的`@Bean`方法的位置。

万一需求不允许这种模糊的装配,并且您希望从IDE中从一个`@Configuration`类直接导航到另一个`@Configuration`类，请考虑自动装配配置类本身。 以下示例显示了如何执行此操作：

```java
@Configuration
public class ServiceConfig {

    @Autowired
    private RepositoryConfig repositoryConfig;

    @Bean
    public TransferService transferService() {
        // navigate 'through' the config class to the @Bean method!
        return new TransferServiceImpl(repositoryConfig.accountRepository());
    }
}
```

```kotlin
@Configuration
class ServiceConfig {

    @Autowired
    private lateinit var repositoryConfig: RepositoryConfig

    @Bean
    fun transferService(): TransferService {
        // navigate 'through' the config class to the @Bean method!
        return TransferServiceImpl(repositoryConfig.accountRepository())
    }
}
```

在前面的情况中，定义`AccountRepository` 是完全明确的。但是，`ServiceConfig`现在与`RepositoryConfig`紧密耦合。这是一种权衡的方法。 通过使用基于接口的或基于类的抽象`@Configuration` 类，可以在某种程度上减轻这种紧密耦合。请考虑以下示例：

```java
@Configuration
public class ServiceConfig {

    @Autowired
    private RepositoryConfig repositoryConfig;

    @Bean
    public TransferService transferService() {
        return new TransferServiceImpl(repositoryConfig.accountRepository());
    }
}

@Configuration
public interface RepositoryConfig {

    @Bean
    AccountRepository accountRepository();
}

@Configuration
public class DefaultRepositoryConfig implements RepositoryConfig {

    @Bean
    public AccountRepository accountRepository() {
        return new JdbcAccountRepository(...);
    }
}

@Configuration
@Import({ServiceConfig.class, DefaultRepositoryConfig.class})  // import the concrete config!
public class SystemTestConfig {

    @Bean
    public DataSource dataSource() {
        // return DataSource
    }

}

public static void main(String[] args) {
    ApplicationContext ctx = new AnnotationConfigApplicationContext(SystemTestConfig.class);
    TransferService transferService = ctx.getBean(TransferService.class);
    transferService.transfer(100.00, "A123", "C456");
}
```

```kotlin
import org.springframework.beans.factory.getBean

@Configuration
class ServiceConfig {

    @Autowired
    private lateinit var repositoryConfig: RepositoryConfig

    @Bean
    fun transferService(): TransferService {
        return TransferServiceImpl(repositoryConfig.accountRepository())
    }
}

@Configuration
interface RepositoryConfig {

    @Bean
    fun accountRepository(): AccountRepository
}

@Configuration
class DefaultRepositoryConfig : RepositoryConfig {

    @Bean
    fun accountRepository(): AccountRepository {
        return JdbcAccountRepository(...)
    }
}

@Configuration
@Import(ServiceConfig::class, DefaultRepositoryConfig::class)  // import the concrete config!
class SystemTestConfig {

    @Bean
    fun dataSource(): DataSource {
        // return DataSource
    }

}

fun main() {
    val ctx = AnnotationConfigApplicationContext(SystemTestConfig::class.java)
    val transferService = ctx.getBean<TransferService>()
    transferService.transfer(100.00, "A123", "C456")
}
```

现在，`ServiceConfig`与具体的`DefaultRepositoryConfig`松散耦合，内置的IDE工具仍然很有用：您可以很容易获取`RepositoryConfig`实现类的继承体系。 以这种方式,操作`@Configuration`类及其依赖关系与操作基于接口的代码的过程没有什么区别

如果要影响某些bean的启动创建顺序，可以考虑将其中一些声明为`@Lazy` （用于在首次访问时创建而不是在启动时）或`@DependsOn`某些其他bean（确保在创建之前创建特定的其他bean（当前的bean，超出后者的直接依赖性所暗示的））。

<a id="beans-java-conditional"></a>

##### [](#beans-java-conditional)有条件地包含`@Configuration`类或`@Bean`方法

基于某些任意系统状态，有条件地启用或禁用完整的`@Configuration`类甚至单独的 `@Bean` 方法通常很有用。 一个常见的例子是， 只有在Spring环境中启用了特定的配置文件时才使用`@Profile` 注解来激活bean（有关详细信息，请参阅Bean[定义配置文件](#beans-definition-profiles)）。

`@Profile`注解实际上是通过使用更灵活的注解`@Conditional`实现的。[`@Conditional`](https://docs.spring.io/spring-framework/docs/5.1.3.BUILD-SNAPSHOT/javadoc-api/org/springframework/context/annotation/Conditional.html)注解表示特定的`org.springframework.context.annotation.Condition`实现。 它表明`@Bean`被注册之前会先"询问"`@Conditional`注解。

`Condition`接口的实现提供了一个返回`true` 或 `false`的`matches(…)`方法。例如，以下清单显示了用于 `@Profile`的实际`Condition`实现：

```java
@Override
public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
    if (context.getEnvironment() != null) {
        // Read the @Profile annotation attributes
        MultiValueMap<String, Object> attrs = metadata.getAllAnnotationAttributes(Profile.class.getName());
        if (attrs != null) {
            for (Object value : attrs.get("value")) {
                if (context.getEnvironment().acceptsProfiles(((String[]) value))) {
                    return true;
                }
            }
            return false;
        }
    }
    return true;
}
```

```kotlin
override fun matches(context: ConditionContext, metadata: AnnotatedTypeMetadata): Boolean {
    // Read the @Profile annotation attributes
    val attrs = metadata.getAllAnnotationAttributes(Profile::class.java.name)
    if (attrs != null) {
        for (value in attrs["value"]!!) {
            if (context.environment.acceptsProfiles(Profiles .of(*value as Array<String>))) {
                return true
            }
        }
        return false
    }
    return true
}
```

有关更多详细信息，请参阅[`@Conditional`](https://docs.spring.io/spring-framework/docs/5.1.3.BUILD-SNAPSHOT/javadoc-api/org/springframework/context/annotation/Conditional.html)javadoc。

<a id="beans-java-combining"></a>

##### [](#beans-java-combining)结合Java和XML配置

Spring的`@Configuration`类支持但不一定成为Spring XML的100％完全替代品。 某些工具（如Spring XML命名空间）仍然是配置容器的理想方法。在XML方便或必要的情况下，您可以选择：通过使用例如`ClassPathXmlApplicationContext`以“以XML为中心”的方式实例化容器， 或者通过使用`AnnotationConfigApplicationContext`以“以Java为中心”的方式实例化它。`@ImportResource`注解，根据需要导入XML。

<a id="beans-java-combining-xml-centric"></a>

###### [](#beans-java-combining-xml-centric)以XML为中心使用`@Configuration`类

更受人喜爱的方法是从包含`@Configuration`类的XML启动容器.例如，在使用Spring的现有系统中,大量使用的是Spring XML配置,所以很容易根据需要创建`@Configuration`类 ,并将他们到包含XML文件中。我们将介绍在这种“以XML为中心”的情况下使用`@Configuration`类的选项。

将`@Configuration`类声明为普通的Spring`<bean/>` 元素

请记住,`@Configuration`类最终也只是容器中的bean定义。在本系列示例中，我们创建一个名为AppConfig的`@Configuration`类，并将其作为`<bean/>`定义包含在`system-test-config.xml`中。 由于 `<context:annotation-config/>`已打开，容器会识别`@Configuration` 注解并正确处理`AppConfig`中声明的`@Bean` 方法。

以下示例显示了Java中的普通配置类:

```java
@Configuration
public class AppConfig {

    @Autowired
    private DataSource dataSource;

    @Bean
    public AccountRepository accountRepository() {
        return new JdbcAccountRepository(dataSource);
    }

    @Bean
    public TransferService transferService() {
        return new TransferService(accountRepository());
    }
}
```

```kotlin
@Configuration
class AppConfig {

    @Autowired
    private lateinit var dataSource: DataSource

    @Bean
    fun accountRepository(): AccountRepository {
        return JdbcAccountRepository(dataSource)
    }

    @Bean
    fun transferService() = TransferService(accountRepository())
}
```

以下示例显示了示例`system-test-config.xml`文件的一部分：

```xml
<beans>
    <!-- enable processing of annotations such as @Autowired and @Configuration -->
    <context:annotation-config/>
    <context:property-placeholder location="classpath:/com/acme/jdbc.properties"/>

    <bean class="com.acme.AppConfig"/>

    <bean class="org.springframework.jdbc.datasource.DriverManagerDataSource">
        <property name="url" value="${jdbc.url}"/>
        <property name="username" value="${jdbc.username}"/>
        <property name="password" value="${jdbc.password}"/>
    </bean>
</beans>
```

以下示例显示了可能的`jdbc.properties`文件:

```properties
jdbc.url=jdbc:hsqldb:hsql://localhost/xdb
jdbc.username=sa
jdbc.password=
```

```java
public static void main(String[] args) {
    ApplicationContext ctx = new ClassPathXmlApplicationContext("classpath:/com/acme/system-test-config.xml");
    TransferService transferService = ctx.getBean(TransferService.class);
    // ...
}
```

```kotlin
fun main() {
    val ctx = ClassPathXmlApplicationContext("classpath:/com/acme/system-test-config.xml")
    val transferService = ctx.getBean<TransferService>()
    // ...
}
```

在 `system-test-config.xml`文件中， `AppConfig` `<bean/>`不声明`id`元素。虽然这样做是可以的，但是没有必要，因为没有其他bean引用它，并且不太可能通过名称从容器中明确地获取它。 类似地，`DataSource` bean只是按类型自动装配，因此不严格要求显式的bean`id`。

使用<context:component-scan/> 来获取`@Configuration` 类

因为`@Configuration`是`@Component`注解的元注解,所以`@Configuration`注解的类也可以被自动扫描。使用与上面相同的场景，可以重新定义`system-test-config.xml` 以使用组件扫描。 请注意，在这种情况下，我们不需要显式声明 `<context:annotation-config/>`,，因为`<context:component-scan/>` 启用相同的功能。

以下示例显示了已修改的`system-test-config.xml`文件:

```xml
<beans>
    <!-- picks up and registers AppConfig as a bean definition -->
    <context:component-scan base-package="com.acme"/>
    <context:property-placeholder location="classpath:/com/acme/jdbc.properties"/>

    <bean class="org.springframework.jdbc.datasource.DriverManagerDataSource">
        <property name="url" value="${jdbc.url}"/>
        <property name="username" value="${jdbc.username}"/>
        <property name="password" value="${jdbc.password}"/>
    </bean>
</beans>
```

<a id="beans-java-combining-java-centric"></a>

###### [](#beans-java-combining-java-centric)基于`@Configuration`混合XML的`@ImportResource`

在 `@Configuration`类为配置容器的主要方式的应用程序中,也需要使用一些XML配置。在这些情况下,只需使用`@ImportResource` ,并只定义所需的XML。这样做可以实现“以Java为中心”的方法来配置容器并尽可能少的使用XML。 以下示例（包括配置类，定义bean的XML文件，属性文件和主类）显示了如何使用`@ImportResource` 注解来实现根据需要使用XML的“以Java为中心”的配置：

```java
@Configuration
@ImportResource("classpath:/com/acme/properties-config.xml")
public class AppConfig {

    @Value("${jdbc.url}")
    private String url;

    @Value("${jdbc.username}")
    private String username;

    @Value("${jdbc.password}")
    private String password;

    @Bean
    public DataSource dataSource() {
        return new DriverManagerDataSource(url, username, password);
    }
}

properties-config.xml
<beans>
    <context:property-placeholder location="classpath:/com/acme/jdbc.properties"/>
</beans>
```

```kotlin
@Configuration
@ImportResource("classpath:/com/acme/properties-config.xml")
class AppConfig {

    @Value("\${jdbc.url}")
    private lateinit var url: String

    @Value("\${jdbc.username}")
    private lateinit var username: String

    @Value("\${jdbc.password}")
    private lateinit var password: String

    @Bean
    fun dataSource(): DataSource {
        return DriverManagerDataSource(url, username, password)
    }
}
```



```
jdbc.properties
jdbc.url=jdbc:hsqldb:hsql://localhost/xdb
jdbc.username=sa
jdbc.password=
```



    public static void main(String[] args) {
        ApplicationContext ctx = new AnnotationConfigApplicationContext(AppConfig.class);
        TransferService transferService = ctx.getBean(TransferService.class);
        // ...
    }

```kotlin
import org.springframework.beans.factory.getBean

fun main() {
    val ctx = AnnotationConfigApplicationContext(AppConfig::class.java)
    val transferService = ctx.getBean<TransferService>()
    // ...
}
```
