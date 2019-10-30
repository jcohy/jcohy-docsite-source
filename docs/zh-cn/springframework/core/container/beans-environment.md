---
title: 抽象环境
keywords: keywords: docs，jcohy-docs，spring,抽象环境
description: Spring  Framework 中文文档 》 抽象环境
---

# Spring  Framework 中文文档
### [](#beans-environment)1.13. 抽象环境

[`Environment`](https://docs.spring.io/spring-framework/docs/5.1.3.BUILD-SNAPSHOT/javadoc-api/org/springframework/core/env/Environment.html)接口是集成在容器中的抽象，它模拟了应用程序环境的两个关键方面：[profiles](#beans-definition-profiles) 和 [properties](#beans-property-source-abstraction)。

profile配置是一个被命名的,bean定义的逻辑组,这些bean只有在给定的profile配置激活时才会注册到容器.无论是以XML还是通过注解定义,Bean都可以分配给配置文件 。`Environment`对象在profile中的角色是判断哪一个profile应该在当前激活和哪一个profile应该在默认情况下激活。

属性在几乎所有应用程序中都发挥着重要作用，可能源自各种源：属性文件，JVM系统属性，系统环境变量，JNDI，servlet上下文参数，ad-hoc属性对象，Map对象等。 与属性相关的`Environment`对象的作用是为用户提供方便的服务接口，用于配置属性源和从中解析属性。

<a id="beans-definition-profiles"></a>

#### [](#beans-definition-profiles)1.13.1. Bean定义Profiles

bean定义profiles是核心容器内的一种机制，该机制能在不同环境中注册不同的bean。“环境”这个词对不同的用户来说意味着不同的东西，这个功能可以帮助解决许多用例，包括：

*   在QA或生产环境中，针对开发中的内存数据源而不是从JNDI查找相同的数据源。

*   开发期使用监控组件，当部署以后则关闭监控组件，使应用更高效

*   为用户各自注册自定义bean实现


考虑`DataSource`的实际应用程序中的第一个用例。 在测试环境中，配置可能类似于以下内容：

```java
@Bean
public DataSource dataSource() {
    return new EmbeddedDatabaseBuilder()
        .setType(EmbeddedDatabaseType.HSQL)
        .addScript("my-schema.sql")
        .addScript("my-test-data.sql")
        .build();
}
```

```kotlin
@Bean
fun dataSource(): DataSource {
    return EmbeddedDatabaseBuilder()
            .setType(EmbeddedDatabaseType.HSQL)
            .addScript("my-schema.sql")
            .addScript("my-test-data.sql")
            .build()
}
```

现在考虑如何将此应用程序部署到QA或生产环境中，假设应用程序的数据源已注册到生产应用程序服务器的JNDI目录。 我们的`dataSource` bean现在看起来如下：

```java
@Bean(destroyMethod="")
public DataSource dataSource() throws Exception {
    Context ctx = new InitialContext();
    return (DataSource) ctx.lookup("java:comp/env/jdbc/datasource");
}
```

```kotlin
@Bean(destroyMethod = "")
fun dataSource(): DataSource {
    val ctx = InitialContext()
    return ctx.lookup("java:comp/env/jdbc/datasource") as DataSource
}
```

问题是如何根据当前环境在使用这两种变体之间切换。随着时间的推移，Spring用户已经设计了许多方法来完成这项工作，通常依赖于系统环境变量和包含`${placeholder}`标记的XML`<import/>`语句的组合， 这些标记根据值解析为正确的配置文件路径一个环境变量。 Bean定义profiles是核心容器功能，可为此问题提供解决方案。

概括一下上面的场景，环境决定bean定义,最后发现,我们需要在某些上下文环境中使用某些bean,在其他环境中则不用这些bean.或者说, 在场景A中注册一组bean定义,而在场景B中注册另外一组。先看看如何通过修改配置来完成此需求：

<a id="beans-definition-profiles-java"></a>

##### [](#beans-definition-profiles-java)使用 `@Profile`

[`@Profile`](https://docs.spring.io/spring-framework/docs/5.1.3.BUILD-SNAPSHOT/javadoc-api/org/springframework/context/annotation/Profile.html)注解用于当一个或多个配置文件激活的时候,用来指定组件是否有资格注册。使用前面的示例，我们可以重写`dataSource`配置，如下所示：

```java
@Configuration
@Profile("development")
public class StandaloneDataConfig {

    @Bean
    public DataSource dataSource() {
        return new EmbeddedDatabaseBuilder()
            .setType(EmbeddedDatabaseType.HSQL)
            .addScript("classpath:com/bank/config/sql/schema.sql")
            .addScript("classpath:com/bank/config/sql/test-data.sql")
            .build();
    }
}

@Configuration
@Profile("production")
public class JndiDataConfig {

    @Bean(destroyMethod="")
    public DataSource dataSource() throws Exception {
        Context ctx = new InitialContext();
        return (DataSource) ctx.lookup("java:comp/env/jdbc/datasource");
    }
}
```

```kotlin
@Configuration
@Profile("development")
class StandaloneDataConfig {

    @Bean
    fun dataSource(): DataSource {
        return EmbeddedDatabaseBuilder()
                .setType(EmbeddedDatabaseType.HSQL)
                .addScript("classpath:com/bank/config/sql/schema.sql")
                .addScript("classpath:com/bank/config/sql/test-data.sql")
                .build()
    }
}

@Configuration
@Profile("production")
class JndiDataConfig {

    @Bean(destroyMethod = "")
    fun dataSource(): DataSource {
        val ctx = InitialContext()
        return ctx.lookup("java:comp/env/jdbc/datasource") as DataSource
    }
}
```

如前所述，使用`@Bean`方法，您通常选择使用Spring的`JndiTemplate`/`JndiLocatorDelegate`帮助程序或前面显示的 直接JNDI `InitialContext`用法但不使用`JndiObjectFactoryBean`变量来使用编程JNDI查找，这会强制您将返回类型声明为 `FactoryBean`类型。 As mentioned earlier, with `@Bean` methods, you typically choose to use programmatic JNDI lookups, by using either Spring’s `JndiTemplate`/`JndiLocatorDelegate` helpers or the straight JNDI `InitialContext` usage shown earlier but not the `JndiObjectFactoryBean` variant, which would force you to declare the return type as the `FactoryBean` type.

profile字符串可以包含简单的profile名称（例如，`production`）或profile表达式。 profile表达式允许表达更复杂的概要逻辑（例如，`production & us-east`）。 profile表达式支持以下运算符：

*   `!`: A logical “not” of the profile

*   `&`: A logical “and” of the profiles

*   `|`: A logical “or” of the profiles


你不能不使用括号而混合 `&` 和 `|` 。 例如，`production & us-east | eu-central`不是一个有效的表达。 它必须表示为 `production & (us-east | eu-central)`.。

您可以将`@Profile`用作[元注解](#beans-meta-annotations)，以创建自定义组合注解。 以下示例定义了一个自定义`@Production`注解，您可以将其用作`@Profile("production")`的替代品：

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Profile("production")
public @interface Production {
}
```

```kotlin
@Target(AnnotationTarget.TYPE)
@Retention(AnnotationRetention.RUNTIME)
@Profile("production")
annotation class Production
```

如果`@Configuration`类标有 `@Profile`,类中所有`@Bean`和`@Import`注解相关的类都将被忽略,除非该profile被激活。 如果一个`@Component`或`@Configuration`类被标记为`@Profile({"p1", "p2"})`。那么除非profile 'p1' or 'p2' 已被激活。 否则该类将不会注册/处理。如果给定的配置文件以NOT运算符(`!`)为前缀，如果配置文件为not active，则注册的元素将被注册。 例如，给定`@Profile({"p1", "!p2"})`，如果配置文件“p1”处于活动状态或配置文件“p2”未激活，则会进行注册。

`@Profile`也能注解方法，用于配置一个配置类中的指定bean。如以下示例所示：

```java
@Configuration
public class AppConfig {

    @Bean("dataSource")
    @Profile("development") (1)
    public DataSource standaloneDataSource() {
        return new EmbeddedDatabaseBuilder()
            .setType(EmbeddedDatabaseType.HSQL)
            .addScript("classpath:com/bank/config/sql/schema.sql")
            .addScript("classpath:com/bank/config/sql/test-data.sql")
            .build();
    }

    @Bean("dataSource")
    @Profile("production") (2)
    public DataSource jndiDataSource() throws Exception {
        Context ctx = new InitialContext();
        return (DataSource) ctx.lookup("java:comp/env/jdbc/datasource");
    }
}
```

```kotlin
@Configuration
class AppConfig {

    @Bean("dataSource")
    @Profile("development") 
    fun standaloneDataSource(): DataSource {
        return EmbeddedDatabaseBuilder()
                .setType(EmbeddedDatabaseType.HSQL)
                .addScript("classpath:com/bank/config/sql/schema.sql")
                .addScript("classpath:com/bank/config/sql/test-data.sql")
                .build()
    }

    @Bean("dataSource")
    @Profile("production") 
    fun jndiDataSource() =
        InitialContext().lookup("java:comp/env/jdbc/datasource") as DataSource
}
```

**1**、`standaloneDataSource` 方法仅在 `development` 环境可用.

**2**、`jndiDataSource`方法仅在 `production` 环境可用.

在`@Bean` 方法上还添加有`@Profile`注解,可能会应用在特殊情况。在相同Java方法名称的重载`@Bean`方法(类似于构造函数重载）的情况下， 需要在所有重载方法上一致声明`@Profile`条件，如果条件不一致，则只有重载方法中第一个声明的条件才重要。因此，`@Profile`不能用于选择具有特定参数签名的重载方法， 所有工厂方法对相同的bean在Spring构造器中的解析算法在创建时是相同的。

如果想定义具有不同配置文件条件的备用bean，请使用不同的Java方法名称，通过`@Bean`名称属性指向相同的bean名称。如上例所示。 如果参数签名都是相同的（例如，所有的变体都是无参的工厂方法），这是安排有效Java类放在首要位置的唯一方法（因为只有一个 特定名称和参数签名的方法）。

<a id="beans-definition-profiles-xml"></a>

##### [](#beans-definition-profiles-xml)XML bean定义profiles

XML中的`<beans>` 元素有一个`profile` 属性,我们之前的示例配置可以在两个XML文件中重写，如下所示：

```xml
<beans profile="development"
    xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:jdbc="http://www.springframework.org/schema/jdbc"
    xsi:schemaLocation="...">

    <jdbc:embedded-database id="dataSource">
        <jdbc:script location="classpath:com/bank/config/sql/schema.sql"/>
        <jdbc:script location="classpath:com/bank/config/sql/test-data.sql"/>
    </jdbc:embedded-database>
</beans>

<beans profile="production"
    xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:jee="http://www.springframework.org/schema/jee"
    xsi:schemaLocation="...">

    <jee:jndi-lookup id="dataSource" jndi-name="java:comp/env/jdbc/datasource"/>
</beans>
```

也可以不用分开2个文件，在同一个XML中配置2个`<beans/>`，`<beans/>`元素也有profile属性。如以下示例所示：

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:jdbc="http://www.springframework.org/schema/jdbc"
    xmlns:jee="http://www.springframework.org/schema/jee"
    xsi:schemaLocation="...">

    <!-- other bean definitions -->

    <beans profile="development">
        <jdbc:embedded-database id="dataSource">
            <jdbc:script location="classpath:com/bank/config/sql/schema.sql"/>
            <jdbc:script location="classpath:com/bank/config/sql/test-data.sql"/>
        </jdbc:embedded-database>
    </beans>

    <beans profile="production">
        <jee:jndi-lookup id="dataSource" jndi-name="java:comp/env/jdbc/datasource"/>
    </beans>
</beans>
```

`spring-bean.xsd` 强制允许将profile元素定义在文件的最后面，这有助于在XML文件中提供灵活的方式而又不引起混乱。

对应XML不支持前面描述的profile表达式。 但是，有可能通过使用`!` 来否定一个profile表达式。 也可以通过嵌套profiles来应用“and”，如以下示例所示：

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:jdbc="http://www.springframework.org/schema/jdbc"
    xmlns:jee="http://www.springframework.org/schema/jee"
    xsi:schemaLocation="...">

    <!-- other bean definitions -->

    <beans profile="production">
        <beans profile="us-east">
            <jee:jndi-lookup id="dataSource" jndi-name="java:comp/env/jdbc/datasource"/>
        </beans>
    </beans>
</beans>
```

在前面的示例中，如果`production` 和`us-east` profiles都处于活动状态，则会暴露`dataSource` bean。

<a id="beans-definition-profiles-enable"></a>

##### [](#beans-definition-profiles-enable)启用profile

现在已经更新了配置,但仍然需要指定要激活哪个配置文件, 如果我们现在开始我们的示例应用程序， 我们会看到抛出`NoSuchBeanDefinitionException`，因为容器找不到名为`dataSource`的Spring bean。

激活配置文件可以通过多种方式完成，但最直接的方法是以编程方式对可通过`ApplicationContext`提供的`Environment` API进行操作。 以下示例显示了如何执行此操作：

```java
AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext();
ctx.getEnvironment().setActiveProfiles("development");
ctx.register(SomeConfig.class, StandaloneDataConfig.class, JndiDataConfig.class);
ctx.refresh();
```

```kotlin
val ctx = AnnotationConfigApplicationContext().apply {
    environment.setActiveProfiles("development")
    register(SomeConfig::class.java, StandaloneDataConfig::class.java, JndiDataConfig::class.java)
    refresh()
}
```

此外,配置文件也可以通过`spring.profiles.active`属性声明式性地激活,可以通过系统环境变量，JVM系统属性，`web.xml`中的Servlet上下文参数指定， 甚至作为JNDI中的一个条目设置（[`PropertySource` 抽象](#beans-property-source-abstraction)）。在集成测试中，可以通过 `spring-test`模块中的`@ActiveProfiles`注解来声明活动配置文件(参见使用[环境配置文件的上下文配置](https://github.com/DocsHome/spring-docs/blob/master/pages/test/testing.mdl#testcontext-ctx-management-env-profiles))

配置文件不是“二选一”的。开发者可以一次激活多个配置文件。使用编程方式，您可以为`setActiveProfiles()`方法提供多个配置文件名称，该方法接受 `String…`varargs。 以下示例激活多个配置文件：

```java
ctx.getEnvironment().setActiveProfiles("profile1", "profile2");
```

```kotlin
ctx.getEnvironment().setActiveProfiles("profile1", "profile2")
```

声明性地，`spring.profiles.active`可以接受以逗号分隔的profile名列表，如以下示例所示：

```java
-Dspring.profiles.active="profile1,profile2"
```

<a id="beans-definition-profiles-default"></a>

##### [](#beans-definition-profiles-default)默认 Profile

default配置文件表示默认开启的profile配置。考虑以下配置:

```java
@Configuration
@Profile("default")
public class DefaultDataConfig {

    @Bean
    public DataSource dataSource() {
        return new EmbeddedDatabaseBuilder()
            .setType(EmbeddedDatabaseType.HSQL)
            .addScript("classpath:com/bank/config/sql/schema.sql")
            .build();
    }
}
```

```kotlin
@Configuration
@Profile("default")
class DefaultDataConfig {

    @Bean
    fun dataSource(): DataSource {
        return EmbeddedDatabaseBuilder()
                .setType(EmbeddedDatabaseType.HSQL)
                .addScript("classpath:com/bank/config/sql/schema.sql")
                .build()
    }
}
```

如果没有配置文件激活，上面的`dataSource`就会被创建。这提供了一种默认的方式，如果有任何一个配置文件启用，default配置就不会生效。

默认配置文件的名字(default）可以通过`Environment`的`setDefaultProfiles()`方法或者`spring.profiles.default`属性修改。

<a id="beans-property-source-abstraction"></a>

#### [](#beans-property-source-abstraction)1.13.2. `PropertySource` 抽象

Spring的`Environment`抽象提供用于一系列的propertysources属性配置文件的搜索操作.请考虑以下列表：

```java
ApplicationContext ctx = new GenericApplicationContext();
Environment env = ctx.getEnvironment();
boolean containsMyProperty = env.containsProperty("my-property");
System.out.println("Does my environment contain the 'my-property' property? " + containsMyProperty);
```

```kotlin
val ctx = GenericApplicationContext()
val env = ctx.environment
val containsMyProperty = env.containsProperty("my-property")
println("Does my environment contain the 'my-property' property? $containsMyProperty")
```

在上面的代码段中,一个高级别的方法用于访问Spring是否为当前环境定义了`my-property` 属性。为了回答这个问题，`Environment`对象对一组PropertySource对象进行搜索。 [`PropertySource`](https://docs.spring.io/spring-framework/docs/5.1.3.BUILD-SNAPSHOT/javadoc-api/org/springframework/core/env/PropertySource.html)是对任何键值对的简单抽象，Spring的[`StandardEnvironment`](https://docs.spring.io/spring-framework/docs/5.1.3.BUILD-SNAPSHOT/javadoc-api/org/springframework/core/env/StandardEnvironment.html)配置有两个`PropertySource`对象 ，一个表示JVM系统属性(`System.getProperties()`),一个表示系统环境变量(`System.getenv()`)。

这些默认property源位于`StandardEnvironment`中,用于独立应用程序。[`StandardServletEnvironment`](https://docs.spring.io/spring-framework/docs/5.1.3.BUILD-SNAPSHOT/javadoc-api/org/springframework/web/context/support/StandardServletEnvironment.html)用默认的property配置源填充。 默认配置源包括Servlet配置和Servlet上下文参数，它可以选择启用[`JndiPropertySource`](https://docs.spring.io/spring-framework/docs/5.1.3.BUILD-SNAPSHOT/javadoc-api/org/springframework/jndi/JndiPropertySource.html)。有关详细信息，请参阅它的javadocs

具体地说，当您使用`StandardEnvironment`时，如果在运行时存在`my-property`系统属性或`my-propertyi`环境变量，则对 `env.containsProperty("my-property")`的调用将返回true。

执行的搜索是分层的。默认情况下，系统属性优先于环境变量，因此如果在调用`env.getProperty("my-property")`期间碰巧在两个位置都设置了`my-property`属性， 系统属性值返回优先于环境变量。 请注意，属性值未合并，而是由前面的条目完全覆盖。

对于常见的 `StandardServletEnvironment`，完整层次结构如下，最高优先级条目位于顶部：

1.  ServletConfig参数（如果适用 - 例如，在DispatcherServlet上下文的情况下）

2.  ServletContext参数（web.xml context-param条目）

3.  JNDI环境变量（`java:comp/env/`entries）

4.  JVM系统属性（`-D`命令行参数）

5.  JVM系统环境（操作系统环境变量）


最重要的是,整个机制都是可配置的。也许开发者需要一个自定义的properties源，并将该源整合到这个检索层级中。为此，请实现并实例化您自己的`PropertySource`，并将其添加到当前`Environment`的`PropertySource`集合中。 以下示例显示了如何执行此操作：

```java
ConfigurableApplicationContext ctx = new GenericApplicationContext();
MutablePropertySources sources = ctx.getEnvironment().getPropertySources();
sources.addFirst(new MyPropertySource());
```

```kotlin
val ctx = GenericApplicationContext()
val sources = ctx.environment.propertySources
sources.addFirst(MyPropertySource())
```

在上面的代码中， `MyPropertySource`在搜索中添加了最高优先级。如果它包含`my-property`属性，则会检测并返回该属性， 优先于其他 `PropertySource`中的任何`my-property`属性。 [`MutablePropertySources`](https://docs.spring.io/spring-framework/docs/5.1.3.BUILD-SNAPSHOT/javadoc-api/org/springframework/core/env/MutablePropertySources.html) API公开了许多方法，允许你显式操作property属性源。

<a id="beans-using-propertysource"></a>

#### [](#beans-using-propertysource)1.13.3. 使用 `@PropertySource`

[`@PropertySource`](https://docs.spring.io/spring-framework/docs/5.1.3.BUILD-SNAPSHOT/javadoc-api/org/springframework/context/annotation/PropertySource.html) 注解提供了便捷的方式，用于增加`PropertySource`到Spring的 `Environment`中。

给定一个名为`app.properties`的文件，其中包含键值对`testbean.name=myTestBean`， 以下`@Configuration`类使用`@PropertySource`，以便调用`testBean.getName()` 返回`myTestBean`：

```java
@Configuration
@PropertySource("classpath:/com/myco/app.properties")
public class AppConfig {

    @Autowired
    Environment env;

    @Bean
    public TestBean testBean() {
        TestBean testBean = new TestBean();
        testBean.setName(env.getProperty("testbean.name"));
        return testBean;
    }
}
```

```kotlin
@Configuration
@PropertySource("classpath:/com/myco/app.properties")
class AppConfig {

    @Autowired
    private lateinit var env: Environment

    @Bean
    fun testBean() = TestBean().apply {
        name = env.getProperty("testbean.name")!!
    }
}
```

任何的存在于`@PropertySource`中的`${…}`占位符，将会被解析为定义在环境中的属性配置文件中的属性值。 如以下示例所示：

```java
@Configuration
@PropertySource("classpath:/com/${my.placeholder:default/path}/app.properties")
public class AppConfig {

    @Autowired
    Environment env;

    @Bean
    public TestBean testBean() {
        TestBean testBean = new TestBean();
        testBean.setName(env.getProperty("testbean.name"));
        return testBean;
    }
}
```

```kotlin
@Configuration
@PropertySource("classpath:/com/\${my.placeholder:default/path}/app.properties")
class AppConfig {

    @Autowired
    private lateinit var env: Environment

    @Bean
    fun testBean() = TestBean().apply {
        name = env.getProperty("testbean.name")!!
    }
}
```

假设`my.placeholder`存在于已注册的其中一个属性源中（例如，系统属性或环境变量），则占位符将解析为相应的值。 如果不是，则`default/path`用作默认值。 如果未指定默认值且无法解析属性，则抛出`IllegalArgumentException`。

根据Java 8惯例，`@PropertySource`注解是可重复的。 但是，所有这些`@PropertySource`注解都需要在同一级别声明，可以直接在配置类上声明， 也可以在同一自定义注解中作为元注解声明。 不建议混合直接注解和元注解，因为直接注解有效地覆盖了元注解。

<a id="beans-placeholder-resolution-in-statements"></a>

#### [](#beans-placeholder-resolution-in-statements)1.13.4. 在声明中的占位符

之前，元素中占位符的值只能针对JVM系统属性或环境变量进行解析。现在已经打破了这种情况。因为环境抽象集成在整个容器中，所以很容易通过它来对占位符进行解析. 这意味着开发者可以以任何喜欢的方式来配置这个解析过程，可以改变是优先查找系统properties或者是有限查找环境变量，或者删除它们；增加自定义property源，使之成为更合适的配置

具体而言，只要在`Environment`中可用，无论`customer`属性在何处定义，以下语句都可以工作：

```xml
<beans>
    <import resource="com/bank/service/${customer}-config.xml"/>
</beans>
```
