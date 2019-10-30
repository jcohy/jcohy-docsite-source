---
title: 类路径扫描和管理组件
keywords: keywords: docs，jcohy-docs，spring,类路径扫描和管理组件
description: Spring  Framework 中文文档 》 类路径扫描和管理组件
---

# Spring  Framework 中文文档
### [](#beans-classpath-scanning)1.10. 类路径扫描和管理组件

本章中的大多数示例会使用XML配置指定在Spring容器中生成每个`BeanDefinition`的元数据，上一节（[基于注解的容器配置](#beans-annotation-config)）演示了如何通过源代码注解提供大量的元数据配置。 然而，即使在这些示例中，注解也仅仅用于驱动依赖注入。 “base” bean依然会显式地在XML文件中定义。本节介绍通过扫描类路径隐式检测候选组件的选项。候选者组件是class类， 这些类经过过滤匹配，由Spring容器注册的bean定义会成为Spring bean。这消除了使用XML执行bean注册的需要(也就是没有XML什么事儿了),可以使用注解(例如`@Component`)， AspectJ类型表达式或开发者自定义过滤条件来选择哪些类将在容器中注册bean定义。

从Spring 3.0开始，Spring JavaConfig项目提供的许多功能都是核心Spring 框架的一部分。这允许开发者使用Java而不是使用传统的XML文件来定义bean。 有关如何使用这些新功能的示例，请查看`@Configuration`, `@Bean`,`@Import`, 和 `@DependsOn`注解。

<a id="beans-stereotype-annotations"></a>

#### [](#beans-stereotype-annotations)1.10.1. `@Component`注解和更多模板注解

`@Repository`注解用于满足存储库(也称为数据访问对象或DAO)的情况,这个注解的用途是自动转换异常。如[异常转换](https://github.com/DocsHome/spring-docs/blob/master/pages/dataaccess/data-access.md#orm-exception-translation)中所述。

Spring提供了更多的构造型注解：`@Component`, `@Service`, 和`@Controller`. `@Component` 可用于管理任何Spring的组件。 `@Repository`, `@Service`, 或 `@Controller`是`@Component`的特殊化。用于更具体的用例（分别在持久性，服务和表示层中）。 因此，您可以使用`@Component`注解组件类，但是，通过使用`@Repository`, `@Service`, 和 `@Controller`注解它们，能够让你的类更易于被合适的工具处理或与相应的切面关联。 例如，这些注解可以使目标组件变成切入点。在Spring框架的未来版本中，`@Repository`, `@Service`, 和 `@Controller`也可能带有附加的语义。 因此，如果在使用`@Component` 或 `@Service` 来选择服务层时，@Service显然是更好的选择。同理，在持久化层要选择`@Repository`，它能自动转换异常。

<a id="beans-meta-annotations"></a>

#### [](#beans-meta-annotations)1.10.2. 使用元注解和组合注解

Spring提供的许多注解都可以在您自己的代码中用作元注解。 元注解是可以应用于另一个注解的注解。 例如，[前面提到的](#beans-stereotype-annotations) `@Service`注解是使用`@Component`进行元注解的，如下例所示：

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Component (1)
public @interface Service {

    // ....
}
```

kotlin:

```kotlin
@Target(AnnotationTarget.TYPE)
@Retention(AnnotationRetention.RUNTIME)
@MustBeDocumented
@Component 
annotation class Service {

    // ...
}
```

**1**、`Component`使`@Service`以与@`@Component`相同的方式处理。

元注解也可以进行组合，进而创建组合注解。例如，来自Spring MVC的`@RestController`注解是由`@Controller`和`@ResponseBody`组成的

此外，组合注解也可以重新定义来自元注解的属性。这在只想公开元注解的部分属性时非常有用。例如，Spring的`@SessionScope`注解将它的作用域硬编码为`session`，但仍允许自定义`proxyMode`。 以下清单显示了`SessionScope`注解的定义：

```java
@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Scope(WebApplicationContext.SCOPE_SESSION)
public @interface SessionScope {

    /**
     * Alias for {@link Scope#proxyMode}.
     * <p>Defaults to {@link ScopedProxyMode#TARGET_CLASS}.
     */
    @AliasFor(annotation = Scope.class)
    ScopedProxyMode proxyMode() default ScopedProxyMode.TARGET_CLASS;

}
```

```kotlin
@Target(AnnotationTarget.TYPE, AnnotationTarget.FUNCTION)
@Retention(AnnotationRetention.RUNTIME)
@MustBeDocumented
@Scope(WebApplicationContext.SCOPE_SESSION)
annotation class SessionScope(
        @get:AliasFor(annotation = Scope::class)
        val proxyMode: ScopedProxyMode = ScopedProxyMode.TARGET_CLASS
)
```

然后，您可以使用`@SessionScope`而不声明`proxyMode`，如下所示：

```java
@Service
@SessionScope
public class SessionScopedService {
    // ...
}
```

```kotlin
@Service
@SessionScope
class SessionScopedService {
    // ...
}
```

您还可以覆盖`proxyMode`的值，如以下示例所示:

```java
@Service
@SessionScope(proxyMode = ScopedProxyMode.INTERFACES)
public class SessionScopedUserService implements UserService {
    // ...
}
```

```kotlin
@Service
@SessionScope(proxyMode = ScopedProxyMode.INTERFACES)
class SessionScopedUserService : UserService {
    // ...
}
```

有关更多详细信息，请参阅[Spring注解编程模型](https://github.com/spring-projects/spring-framework/wiki/Spring-Annotation-Programming-Model)wiki页面.

<a id="beans-scanning-autodetection"></a>

#### [](#beans-scanning-autodetection)1.10.3. 自动探测类并注册bean定义

Spring可以自动检测各代码层中被注解的类，并使用`ApplicationContext`内注册相应的`BeanDefinition`。例如，以下两个类就可以被自动探测：

```java
@Service
public class SimpleMovieLister {

    private MovieFinder movieFinder;

    @Autowired
    public SimpleMovieLister(MovieFinder movieFinder) {
        this.movieFinder = movieFinder;
    }
}

@Repository
public class JpaMovieFinder implements MovieFinder {
    // implementation elided for clarity
}
```

```kotlin
@Service
class SimpleMovieLister(private val movieFinder: MovieFinder)

@Repository
class JpaMovieFinder : MovieFinder {
    // implementation elided for clarity
}
```

想要自动检测这些类并注册相应的bean，需要在`@Configuration`配置中添加`@ComponentScan`注解，其中`basePackages`属性是两个类的父包路径。 （或者，您可以指定以逗号或分号或空格分隔的列表，其中包含每个类的父包）。

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

为简洁起见，前面的示例可能使用了注解的`value`属性（即`@ComponentScan("org.example")`）。

或者使用XML配置代替扫描:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:context="http://www.springframework.org/schema/context"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        https://www.springframework.org/schema/context/spring-context.xsd">

    <context:component-scan base-package="org.example"/>

</beans>
```

使用`<context:component-scan>`隐式启用`<context:annotation-config>`的功能。 使用`<context:component-scan>`时，通常不需要包含`<context:annotation-config>`元素。

类路径扫描的包必须保证这些包出现在类路径中。当使用Ant构建JAR时，请确保你没有激活JAR任务的纯文件开关。此外在某些环境装由于安全策略，类路径目录可能不能访问。 JDK 1.7.0_45及更高版本上的独立应用程序（需要在清单中设置“Trusted-Library”） - 请参阅 [http://stackoverflow.com/questions/19394570/java-jre-7u45-breaks-classloader-getresources](https://stackoverflow.com/questions/19394570/java-jre-7u45-breaks-classloader-getresources)）。

在JDK 9的模块路径（Jigsaw）上，Spring的类路径扫描通常按预期工作。，但是，请确保在模块信息描述符中导出组件类。 如果您希望Spring调用类的非公共成员，请确保它们已“打开”（即，它们在`module-info`描述符中使用`opens` 声明而不是`exports`声明）。

在使用component-scan元素时， `AutowiredAnnotationBeanPostProcessor` 和 `CommonAnnotationBeanPostProcessor`都会隐式包含。意味着这两个组件也是自动探测和注入的。 所有这些都无需XML配置。

您可以通过annotation-config=false属性来禁用`AutowiredAnnotationBeanPostProcessor` 和`CommonAnnotationBeanPostProcessor`的注册。

<a id="beans-scanning-filters"></a>

#### [](#beans-scanning-filters)1.10.4. 在自定义扫描中使用过滤器

默认情况下，使用`@Component`, `@Repository`, `@Service`,`@Controller`  `@Configuration`注解的类或者注解为`@Component`的自定义注解类才能被检测为候选组件。 但是，开发者可以通过应用自定义过滤器来修改和扩展此行为。将它们添加为`@ComponentScan`注解的`includeFilters`或`excludeFilters`参数(或作为`component-scan` 元素。元素的`include-filter`或`exclude-filter`子元素。每个filter元素都需要包含`type`和`expression`属性。下表介绍了筛选选项：

Table 5.过滤类型

| 过滤类型             | 表达式例子                   | 描述                                                         |
| -------------------- | ---------------------------- | ------------------------------------------------------------ |
| annotation (default) | `org.example.SomeAnnotation` | 要在目标组件中的类级别出现的注解。                           |
| assignable           | `org.example.SomeClass`      | 目标组件可分配给（继承或实现）的类（或接口）。               |
| aspectj              | `org.example..*Service+`     | 要由目标组件匹配的AspectJ类型表达式。                        |
| regex                | `org\.example\.Default.*`    | 要由目标组件类名匹配的正则表达式。                           |
| custom               | `org.example.MyTypeFilter`   | `org.springframework.core.type .TypeFilter`接口的自定义实现。 |

以下示例显示忽略所有`@Repository` 注解并使用“stub”存储库的配置：

```java
@Configuration
@ComponentScan(basePackages = "org.example",
        includeFilters = @Filter(type = FilterType.REGEX, pattern = ".*Stub.*Repository"),
        excludeFilters = @Filter(Repository.class))
public class AppConfig {
    ...
}
```

```kotlin
@Configuration
@ComponentScan(basePackages = "org.example",
        includeFilters = [Filter(type = FilterType.REGEX, pattern = [".*Stub.*Repository"])],
        excludeFilters = [Filter(Repository::class)])
class AppConfig {
    // ...
}
```

以下清单显示了等效的XML：:

```java
<beans>
    <context:component-scan base-package="org.example">
        <context:include-filter type="regex"
                expression=".*Stub.*Repository"/>
        <context:exclude-filter type="annotation"
                expression="org.springframework.stereotype.Repository"/>
    </context:component-scan>
</beans>
```

你还可以通过在注解上设置`useDefaultFilters=false`或通过`use-default-filters="false"`作为<`<component-scan/>` 元素的属性来禁用默认过滤器。这样将不会自动检测带有`@Component`, `@Repository`,`@Service`, `@Controller`, 或 `@Configuration`.

<a id="beans-factorybeans-annotations"></a>

#### [](#beans-factorybeans-annotations)1.10.5.在组件中定义bean的元数据

Spring组件也可以向容器提供bean定义元数据，。在`@Configuration`注解的类中使用`@Bean`注解定义bean元数据(也就是Spring bean),以下示例显示了如何执行此操作：

```java
@Component
public class FactoryMethodComponent {

    @Bean
    @Qualifier("public")
    public TestBean publicInstance() {
        return new TestBean("publicInstance");
    }

    public void doWork() {
        // Component method implementation omitted
    }
}
```

```kotlin
@Component
class FactoryMethodComponent {

    @Bean
    @Qualifier("public")
    fun publicInstance() = TestBean("publicInstance")

    fun doWork() {
        // Component method implementation omitted
    }
}
```

这个类是一个Spring组件，它有个 `doWork()`方法。然而，它还有一个工厂方法 `publicInstance()`用于产生bean定义。`@Bean`注解了工厂方法， 还设置了其他bean定义的属性，例如通过`@Qualifier`注解的qualifier值。可以指定的其他方法级别的注解是 `@Scope`, `@Lazy`以及自定义的qualifier注解。

除了用于组件初始化的角色之外，`@Lazy`注解也可以在`@Autowired`或者code>@Inject注解上，在这种情况下，该注入将会变成延迟注入代理lazy-resolution proxy（也就是懒加载）。

自动注入的字段和方法也可以像前面讨论的一样被支持，也支持`@Bean`方法的自动注入。以下示例显示了如何执行此操作：:

```java
@Component
public class FactoryMethodComponent {

    private static int i;

    @Bean
    @Qualifier("public")
    public TestBean publicInstance() {
        return new TestBean("publicInstance");
    }

    // use of a custom qualifier and autowiring of method parameters
    @Bean
    protected TestBean protectedInstance(
            @Qualifier("public") TestBean spouse,
            @Value("#{privateInstance.age}") String country) {
        TestBean tb = new TestBean("protectedInstance", 1);
        tb.setSpouse(spouse);
        tb.setCountry(country);
        return tb;
    }

    @Bean
    private TestBean privateInstance() {
        return new TestBean("privateInstance", i++);
    }

    @Bean
    @RequestScope
    public TestBean requestScopedInstance() {
        return new TestBean("requestScopedInstance", 3);
    }
}
```

```kotlin
@Component
class FactoryMethodComponent {

    companion object {
        private var i: Int = 0
    }

    @Bean
    @Qualifier("public")
    fun publicInstance() = TestBean("publicInstance")

    // use of a custom qualifier and autowiring of method parameters
    @Bean
    protected fun protectedInstance(
            @Qualifier("public") spouse: TestBean,
            @Value("#{privateInstance.age}") country: String) = TestBean("protectedInstance", 1).apply {
        this.spouse = spouse
        this.country = country
    }

    @Bean
    private fun privateInstance() = TestBean("privateInstance", i++)

    @Bean
    @RequestScope
    fun requestScopedInstance() = TestBean("requestScopedInstance", 3)
}
```

该示例将方法参数为`String`，名称为`country`的bean自动装配为另一个名为`privateInstance`的bean的`age`属性值。 Spring表达式语言元素通过记号`#{ <expression> }`来定义属性的值。对于 `@Value`注解，表达式解析器在解析表达式后，会查找bean的名字并设置value值。

从Spring4.3开始，您还可以声明一个类型为`InjectionPoint`的工厂方法参数（或其更具体的子类：`DependencyDescriptor`）以访问触发创建当前bean的请求注入点。 请注意，这仅适用于真实创建的bean实例，而不适用于注入现有实例。因此，这个特性对prototype scope的bean最有意义。对于其他作用域，工厂方法将只能看到触发在给定scope中创建新bean实例的注入点。 例如，触发创建一个延迟单例bean的依赖。在这种情况下，使用提供的注入点元数据拥有优雅的语义。 以下示例显示了如何使用`InjectionPoint`:

```java
@Component
public class FactoryMethodComponent {

    @Bean @Scope("prototype")
    public TestBean prototypeInstance(InjectionPoint injectionPoint) {
        return new TestBean("prototypeInstance for " + injectionPoint.getMember());
    }
}
```

```kotlin
@Component
class FactoryMethodComponent {

    @Bean
    @Scope("prototype")
    fun prototypeInstance(injectionPoint: InjectionPoint) =
            TestBean("prototypeInstance for ${injectionPoint.member}")
}
```

在Spring组件中处理`@Bean`和在code>@Configuration中处理是不一样的，区别在于，在`@Component`中，不会使用CGLIB增强去拦截方法和属性的调用。在`@Configuration`注解的类中， `@Bean`注解创建的bean对象会使用CGLIB代理对方法和属性进行调用。方法的调用不是常规的Java语法，而是通过容器来提供通用的生命周期管理和代理Spring bean， 甚至在通过编程的方式调用`@Bean`方法时也会产生对其它bean的引用。相比之下，在一个简单的`@Component`类中调用`@Bean`方法中的方法或字段具有标准Java语义，这里没有用到特殊的CGLIB处理或其他约束。

开发者可以将`@Bean`方法声明为`static`的，并允许在不将其包含的配置类作为实例的情况下调用它们。这在定义后置处理器bean时是特别有意义的。 例如`BeanFactoryPostProcessor` 或`BeanPostProcessor`),，因为这类bean会在容器的生命周期前期被初始化，而不会触发其它部分的配置。

对静态`@Bean`方法的调用永远不会被容器拦截，即使在`@Configuration`类内部。这是用为CGLIB的子类代理限制了只会重写非静态方法。因此， 对另一个`@Bean`方法的直接调用只能使用标准的Java语法。也只能从工厂方法本身直接返回一个独立的实例。

由于Java语言的可见性，`@Bean`方法并不一定会对容器中的bean有效。开发者可能很随意的在非`@Configuration`类中定义或定义为静态方法。然而， 在`@Configuration`类中的正常`@Bean`方法都会被重写，因此，它们不应该定义为`private`或`final`。

`@Bean`方法也可以用在父类中，同样适用于Java 8接口中的默认方法。这使得组建复杂的配置时能具有更好的灵活性，甚至可能通过Java 8的默认方法实现多重继承。 这种特性在Spring 4.2开始支持。

最后，请注意，单个类可以为同一个bean保存多个`@Bean`方法，例如根据运行时可用的依赖关系选择合适的工厂方法。使用算法会选择 “最贪婪“的构造方法， 一些场景可能会按如下方法选择相应的工厂方法：满足最多依赖的会被选择，这与使用`@Autowired` 时选择多个构造方法时类似。

<a id="beans-scanning-name-generator"></a>

#### [](#beans-scanning-name-generator)1.10.6. 命名自动注册组件

扫描处理过程，其中一步就是自动探测组件，扫描器使用`BeanNameGenerator`对探测到的组件命名。默认情况下，各代码层注解(`@Component`, `@Repository`, `@Service`, 和 `@Controller`)所包含的name值，将会作为相应的bean定义的名字。

如果这些注解没有name值，或者是其他一些被探测到的组件（比如使用自定义过滤器探测到的)，默认会又bean name生成器生成，使用小写类名作为bean名字。 例如，如果检测到以下组件类，则名称为`myMovieLister`和`movieFinderImpl`:

```java
@Service("myMovieLister")
public class SimpleMovieLister {
    // ...
}

@Repository
public class MovieFinderImpl implements MovieFinder {
    // ...
}
```

```kotlin
@Service("myMovieLister")
class SimpleMovieLister {
    // ...
}

@Repository
class MovieFinderImpl : MovieFinder {
    // ...
}
```

如果您不想依赖默认的bean命名策略，则可以提供自定义bean命名策略。首先，实现 [`BeanNameGenerator`](https://docs.spring.io/spring-framework/docs/5.1.3.BUILD-SNAPSHOT/javadoc-api/org/springframework/beans/factory/support/BeanNameGenerator.html)接口，并确保包括一个默认的无参构造函数。 然后，在配置扫描程序时提供完全限定的类名，如以下示例注解和bean定义所示：

    @Configuration
    @ComponentScan(basePackages = "org.example", nameGenerator = MyNameGenerator.class)
    public class AppConfig {
        ...
    }
    //kotlin
    @Configuration
    @ComponentScan(basePackages = ["org.example"], nameGenerator = MyNameGenerator::class)
    class AppConfig {
        // ...
    }
    
    <beans>
        <context:component-scan base-package="org.example"
            name-generator="org.example.MyNameGenerator" />
    </beans>



作为一般规则，考虑在其他组件可能对其进行显式引用时使用注解指定名称。 另一方面，只要容器负责装配时，自动生成的名称就足够了。

<a id="beans-scanning-scope-resolver"></a>

#### [](#beans-scanning-scope-resolver)1.10.7.为自动检测组件提供范围

与一般的Spring管理组件一样，自动检测组件的默认和最常见的作用域是`singleton`。但是，有时您需要一个可由`@Scope`注解指定的不同作用域。 您可以在注解中提供作用域的名称，如以下示例所示：

```java
@Scope("prototype")
@Repository
public class MovieFinderImpl implements MovieFinder {
    // ...
}
```

```kotlin
@Scope("prototype")
@Repository
class MovieFinderImpl : MovieFinder {
    // ...
}
```

`@Scope`注解仅在具体bean类（用于带注解的组件）或工厂方法（用于`@Bean`方法）上进行关联。 与XML bean定义相比，没有bean继承的概念，并且 类级别的继承结构与元数据无关。

有关特定于Web的范围（如Spring上下文中的“request” or “session”）的详细信息，请参阅[请求，会话，应用程序和WebSocket作用域](#beans-factory-scopes-other)。 这些作用域与构建注解一样，您也可以使用Spring的元注解方法编写自己的作用域注解：例如，使用`@Scope("prototype")`进行元注解的自定义注解，可能还会声明自定义作用域代理模式。

想要提供自定义作用域的解析策略，而不是依赖于基于注解的方法，那么需要实现[`ScopeMetadataResolver`](https://docs.spring.io/spring-framework/docs/5.1.3.BUILD-SNAPSHOT/javadoc-api/org/springframework/context/annotation/ScopeMetadataResolver.html)接口，并确保包含一个默认的无参数构造函数。 然后，在配置扫描程序时提供完全限定类名。以下注解和bean定义示例显示：

```java
//java
@Configuration
@ComponentScan(basePackages = "org.example", scopeResolver = MyScopeResolver.class)
public class AppConfig {
    ...
}
//kotlin
@Configuration
@ComponentScan(basePackages = ["org.example"], scopeResolver = MyScopeResolver::class)
class AppConfig {
    // ...
}
<beans>
    <context:component-scan base-package="org.example" scope-resolver="org.example.MyScopeResolver"/>
</beans>
```

当使用某个非单例作用域时，为作用域对象生成代理可能非常必要，原因参看 [作为依赖关系的作用域bean](#beans-factory-scopes-other-injection)。 为此，组件扫描元素上提供了scoped-proxy属性。 三个可能的值是：`no`, `interfaces`, 和 `targetClass`。 例如，以下配置导致标准JDK动态代理：

```java
//java
@Configuration
@ComponentScan(basePackages = "org.example", scopedProxy = ScopedProxyMode.INTERFACES)
public class AppConfig {
    ...
}

//kotlin
@Configuration
@ComponentScan(basePackages = ["org.example"], scopedProxy = ScopedProxyMode.INTERFACES)
class AppConfig {
    // ...
}


<beans>
    <context:component-scan base-package="org.example" scoped-proxy="interfaces"/>
</beans>
```

<a id="beans-scanning-qualifiers"></a>

#### [](#beans-scanning-qualifiers)1.10.8. 为注解提供Qualifier元数据

在前面[使用qualifiers微调基于注解自动装配](#beans-autowired-annotation-qualifiers)讨论过`@Qualifier` 注解。该部分中的示例演示了在解析自动注入候选者时使用 `@Qualifier`注解和自定义限定符注解以提供细粒度控制。 因为这些示例基于XML bean定义，所以使用XML中的`bean`元素的 `qualifier` 或 `meta`子元素在候选bean定义上提供了限定符元数据。当依靠类路径扫描并自动检测组件时， 可以在候选类上提供具有类型级别注解的限定符元数据。以下三个示例演示了此技术：

```java
@Component
@Qualifier("Action")
public class ActionMovieCatalog implements MovieCatalog {
    // ...
}

@Component
@Genre("Action")
public class ActionMovieCatalog implements MovieCatalog {
    // ...
}

@Component
@Offline
public class CachingMovieCatalog implements MovieCatalog {
    // ...
}
```

```kotlin
@Component
@Qualifier("Action")
class ActionMovieCatalog : MovieCatalog

@Component
@Genre("Action")
class ActionMovieCatalog : MovieCatalog {
    // ...
}

@Component
@Offline
class CachingMovieCatalog : MovieCatalog {
    // ...
}
```

与大多数基于注解的替代方法一样，注解元数据绑定到类定义本身，而使用在XML配置时，允许同一类型的beans在qualifier元数据中提供变量， 因为元数据是依据实例而不是类来提供的。

<a id="beans-scanning-index"></a>

#### [](#beans-scanning-index)1.10.9. 生成候选组件的索引

虽然类路径扫描非常快，但通过在编译时创建候选的静态列表。可以提高大型应用程序的启动性能。在此模式下，应用程序的所有模块都必须使用此机制， 当 `ApplicationContext`检测到此类索引时，它将自动使用它，而不是扫描类路径。

若要生成索引， 只需向包含组件扫描指令目标组件的每个模块添加一个附加依赖项。以下示例显示了如何使用Maven执行此操作：

```java
<dependencies>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context-indexer</artifactId>
        <version>5.2.0.RELEASE</version>
        <optional>true</optional>
    </dependency>
</dependencies>
```

以下示例显示了如何使用Gradle执行此操作:

```groovy
dependencies {
     compileOnly "org.springframework:spring-context-indexer:5.2.0.RELEASE"
}
```

对于Gradle 4.6和更高版本，应在 `annotationProcessor` 配置中声明依赖项，如以下示例所示：

```groovy
dependencies {
    annotationProcessor "org.springframework:spring-context-indexer:{spring-version}"
}
```

这个过程将产生一个名为`META-INF/spring.components`的文件，并将包含在jar包中。

在IDE中使用此模式时，必须将`spring-context-indexer`注册为注解处理器， 以确保更新候选组件时索引是最新的。

如果在类路径中找到 `META-INF/spring.components` 时，将自动启用索引。如果某个索引对于某些库(或用例)是不可用的， 但不能为整个应用程序构建，则可以将`spring.index.ignore`设置为`true`，从而将其回退到常规类路径的排列(即根本不存在索引)， 或者作为系统属性或在`spring.properties`文件位于类路径的根目录中。
