---
title: 基于注解的容器配置
keywords: keywords: docs，jcohy-docs，spring,基于注解的容器配置
description: Spring  Framework 中文文档 》 基于注解的容器配置
---

# Spring  Framework 中文文档
### [](#beans-annotation-config)1.9. 基于注解的容器配置

注解是否比配置Spring的XML更好?

在引入基于注解的配置之后,引发了这种方法是否比XML更优秀的问题.简短的答案是得看情况,每种方法都有其优缺点。通常由开发人员决定使用更适合他们的策略。 首先看看两种定义方式,注解在它们的声明中提供了很多上下文信息，使得配置变得更短、更简洁；但是，XML擅长于在不接触源码或者无需反编译的情况下装配组件，一些开发人员更喜欢在源码上使用注解配置。 而另一些人认为注解类不再是POJO，同时认为注解配置会很分散，最终难以控制。

无论选择如何，Spring都可以兼顾两种风格，甚至可以将它们混合在一起。Spring通过其[JavaConfig](#beans-java) 选项，允许注解以无侵入的方式使用，即无需接触目标组件源代码。 而且在工具应用方面， [Spring Tool Suite](https://spring.io/tools/sts)支持所有配置形式。

XML设置的替代方法是基于注解的配置，它依赖于字节码元数据来连接组件进而替代XML声明。开发人员通过使用相关类、方法或字段声明上的注解来将配置移动到组件类本身。而不是使用XML bean来配置。 如示例中所述，[`RequiredAnnotationBeanPostProcessor`](#beans-factory-extension-bpp-examples-rabpp),将`BeanPostProcessor` 与注解混合使用是扩展Spring IoC容器的常用方法。 例如，Spring 2.0引入了使用[`@Required`](#beans-required-annotation)注解强制属性必须在配置的时候被填充， Spring 2.5使用同样的方式来驱动Spring的依赖注入。本质上，`@Autowired`注解提供的功能与[自动装配协作](#beans-factory-autowire)中描述的相同，但具有更细粒度的控制和更广泛的适用性。 Spring 2.5还增加了对JSR-250注解的支持，例如`@PostConstruct`和`@PreDestroy`。 Spring 3.0增加了对`javax.inject`包中包含的JSR-330（Java的依赖注入）注解的支持， 例如`@Inject`和`@Named`。有关这些注解的详细信息，请参阅[相关章节](#beans-standard-annotations)。

注解注入在XML注入之前执行，因此同时使用这两种方式进行注入时，XML配置会覆盖注解配置。

与之前一样，你可以将它们注册为单独的bean定义，但也可以通过在基于XML的Spring配置中包含以下标记来隐式注册它们（请注意包含`context`命名空间）：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:context="http://www.springframework.org/schema/context"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        https://www.springframework.org/schema/context/spring-context.xsd">

    <context:annotation-config/>

</beans>
```

（隐式注册的后处理器包括 [`AutowiredAnnotationBeanPostProcessor`](https://docs.spring.io/spring-framework/docs/5.1.3.BUILD-SNAPSHOT/javadoc-api/org/springframework/beans/factory/annotation/AutowiredAnnotationBeanPostProcessor.html), [`CommonAnnotationBeanPostProcessor`](https://docs.spring.io/spring-framework/docs/5.1.3.BUILD-SNAPSHOT/javadoc-api/org/springframework/context/annotation/CommonAnnotationBeanPostProcessor.html), [`PersistenceAnnotationBeanPostProcessor`](https://docs.spring.io/spring-framework/docs/5.1.3.BUILD-SNAPSHOT/javadoc-api/org/springframework/orm/jpa/support/PersistenceAnnotationBeanPostProcessor.html), 和前面提到的 [`RequiredAnnotationBeanPostProcessor`](https://docs.spring.io/spring-framework/docs/5.1.3.BUILD-SNAPSHOT/javadoc-api/org/springframework/beans/factory/annotation/RequiredAnnotationBeanPostProcessor.html).)

`<context:annotation-config/>`只有在定义bean的相同应用程序上下文中查找bean上的注解。 这意味着，如果将 `<context:annotation-config/>` 放在`DispatcherServlet`的`WebApplicationContext`中， 它只检查控制器中的`@Autowired` bean，而不检查您的服务。 有关更多信息，请参阅 [DispatcherServlet](https://github.com/DocsHome/spring-docs/blob/master/pages/web/web.md#mvc-servlet)。

<a id="beans-required-annotation"></a>

#### [](#beans-required-annotation)1.9.1. @Required

`@Required`注解适用于bean属性setter方法，如下例所示：

```java
public class SimpleMovieLister {

    private MovieFinder movieFinder;

    @Required
    public void setMovieFinder(MovieFinder movieFinder) {
        this.movieFinder = movieFinder;
    }

    // ...
}
```

kotlin:

```kotlin
 class SimpleMovieLister {

    @Required
    lateinit var movieFinder: MovieFinder

    // ...
}
```

此注解仅表示受影响的bean属性必须在配置时通过bean定义中的显式赋值或自动注入值。如果受影响的bean属性尚未指定值，容器将抛出异常；这导致及时的、明确的失败，避免在运行后再抛出`NullPointerException`或类似的异常。 在这里，建议开发者将断言放入bean类本身，例如放入init方法。这样做强制执行那些必需的引用和值，即使是在容器外使用这个类。

从Spring Framework 5.1开始，@ Required注解已正式弃用，转而使用构造函数注入进行必需的属性设置（或用自定义InitializingBean.afterPropertiesSet（）的实现bean属性setter方法）。

<a id="beans-autowired-annotation"></a>

#### [](#beans-autowired-annotation)1.9.2. `@Autowired`

可以使用JSR 330的 `@Inject`注解代替本节中包含的示例中的Spring的`@Autowired`注解。 有关详细信息，[请参见此处](#beans-standard-annotations)

开发者可以在构造器上使用`@Autowired`注解:

```java
public class MovieRecommender {

    private final CustomerPreferenceDao customerPreferenceDao;

    @Autowired
    public MovieRecommender(CustomerPreferenceDao customerPreferenceDao) {
        this.customerPreferenceDao = customerPreferenceDao;
    }

    // ...
}
```

kotlin:

```kotlin
class MovieRecommender @Autowired constructor(
    private val customerPreferenceDao: CustomerPreferenceDao)

```

从Spring Framework 4.3开始，如果目标bean仅定义一个构造函数，则不再需要`@Autowired`构造函数。如果有多个构造函数可用，则至少有一个必须注解`@Autowired`以让容器知道它使用的是哪个

您还可以将`@Autowired`注解应用于“传统”setter方法，如以下示例所示：

```java
public class SimpleMovieLister {

    private MovieFinder movieFinder;

    @Autowired
    public void setMovieFinder(MovieFinder movieFinder) {
        this.movieFinder = movieFinder;
    }

    // ...
}
```

```kotlin
class SimpleMovieLister {

    @Autowired
    lateinit var movieFinder: MovieFinder

    // ...

}
```

您还可以将注解应用于具有任意名称和多个参数的方法，如以下示例所示：:

```java
public class MovieRecommender {

    private MovieCatalog movieCatalog;

    private CustomerPreferenceDao customerPreferenceDao;

    @Autowired
    public void prepare(MovieCatalog movieCatalog,
            CustomerPreferenceDao customerPreferenceDao) {
        this.movieCatalog = movieCatalog;
        this.customerPreferenceDao = customerPreferenceDao;
    }

    // ...
}
```

kotlin:

```kotlin
class MovieRecommender {

    private lateinit var movieCatalog: MovieCatalog

    private lateinit var customerPreferenceDao: CustomerPreferenceDao

    @Autowired
    fun prepare(movieCatalog: MovieCatalog,
                customerPreferenceDao: CustomerPreferenceDao) {
        this.movieCatalog = movieCatalog
        this.customerPreferenceDao = customerPreferenceDao
    }

    // ...
}
```

还可以将`@Autowired`应用于字段，甚至可以和构造函数混合使用:

```java
public class MovieRecommender {

    private final CustomerPreferenceDao customerPreferenceDao;

    @Autowired
    private MovieCatalog movieCatalog;

    @Autowired
    public MovieRecommender(CustomerPreferenceDao customerPreferenceDao) {
        this.customerPreferenceDao = customerPreferenceDao;
    }

    // ...
}
```

kotlin:

```kotlin
class MovieRecommender @Autowired constructor(
    private val customerPreferenceDao: CustomerPreferenceDao) {

    @Autowired
    private lateinit var movieCatalog: MovieCatalog

    // ...
}
```

确保您的组件（例如，`MovieCatalog`或`CustomerPreferenceDao`）始终按照用于@Autowired注入点的类型声明。 否则，由于在运行时未找到类型匹配，注入可能会失败。

对于通过类路径扫描找到的XML定义的bean或组件类，容器通常预先知道具体类型。 但是，对于`@Bean`工厂方法，您需要确保其声明的具体返回类型。 对于实现多个接口的组件或可能由其实现类型引用的组件，请考虑在工厂方法上声明最具体的返回类型（至少与引用bean的注入点所需的特定类型一致）。 .

也可以用在数组上，注解用于标注属性或方法，数组的类型是`ApplicationContext`中定义的bean类型。如以下示例所示：

```java
public class MovieRecommender {

    @Autowired
    private MovieCatalog[] movieCatalogs;

    // ...
}
```

kotlin:

```kotlin
class MovieRecommender {

    @Autowired
    private lateinit var movieCatalogs: Array<MovieCatalog>

    // ...
}
```

也可以应用于集合类型，如以下示例所示:

```java
public class MovieRecommender {

    private Set<MovieCatalog> movieCatalogs;

    @Autowired
    public void setMovieCatalogs(Set<MovieCatalog> movieCatalogs) {
        this.movieCatalogs = movieCatalogs;
    }

    // ...
}
```

kotlin:

```kotlin
class MovieRecommender {

    @Autowired
    lateinit var movieCatalogs: Set<MovieCatalog>

    // ...
}
```

如果想让数组元素或集合元素按特定顺序排列，应用的bean可以实现`org.springframework.core.Ordered`， 或者使用`@Order`或标准的@`@Priority` 注解，否则，它们的顺序遵循容器中相应目标bean定义的注册顺序。

您可以在类级别和`@Bean`方法上声明 `@Order`注解，可能是通过单个bean定义（在多个定义使用相同bean类的情况下）。 `@Order`值可能会影响注入点的优先级，但要注意它们不会影响单例启动顺序，这是由依赖关系和`@DependsOn`声明确定的。

请注意，标准的`javax.annotation.Priority`注解在`@Bean`级别不可用，因为它无法在方法上声明。 它的语义可以通过`@Order`值与`@Primary`定义每个类型的单个bean上。

只要键类型是`String`，`Map`类型就可以自动注入。 Map值将包含所有类型的bean，并且键将包含相应的bean名称。如以下示例所示：

```java
public class MovieRecommender {

    private Map<String, MovieCatalog> movieCatalogs;

    @Autowired
    public void setMovieCatalogs(Map<String, MovieCatalog> movieCatalogs) {
        this.movieCatalogs = movieCatalogs;
    }

    // ...
}
```

```kotlin
class MovieRecommender {

    @Autowired
    lateinit var movieCatalogs: Map<String, MovieCatalog>

    // ...
}
```

默认情况下，当没有候选的bean可用时，自动注入将会失败；对于声明的数组，集合或映射，至少应有一个匹配元素。

默认的处理方式是将带有注解的方法、构造函数和字段标明为必须依赖，也可以使用required=false属性。来标明这种依赖不是必须的，如下：

```java
public class SimpleMovieLister {

    private MovieFinder movieFinder;

    @Autowired(required = false)
    public void setMovieFinder(MovieFinder movieFinder) {
        this.movieFinder = movieFinder;
    }

    // ...
}
```

```kotlin
class SimpleMovieLister {

    @Autowired(required = false)
    var movieFinder: MovieFinder? = null

    // ...
}
```

如果不需要的方法（或在多个参数的情况下，其中一个依赖项）不可用，则根本不会调用该方法。 在这种情况下，完全不需要填充非必需字段，而将其默认值保留在适当的位置。

注入的构造函数和工厂方法参数是一种特殊情况，因为由于Spring的构造函数解析算法可能会处理多个构造函数，因此@Autowired中的required属性的含义有所不同。 缺省情况下，实际上有效地需要构造函数和工厂方法参数，但是在单构造函数场景中有一些特殊规则，例如，如果没有可用的匹配bean，则多元素注入点（数组，集合，映射）解析为空实例。 这允许一种通用的实现模式，其中所有依赖项都可以在唯一的多参数构造函数中声明-例如，声明为没有@Autowired批注的单个公共构造函数。

每个类仅可以将一个带注解的构造函数标记为必需，但是可以注解多个非必需的构造函数。在这种情况下，每个项都会是候选者，而Spring使用的是最贪婪的构造函数。 这个构造函数的依赖关系可以得到满足，那就是具有最多参数的构造函数。

推荐使用`@Required`注解来代替`@Autowired`的required属性，required属性表示该属性不是自动装配必需的，如果该属性不能被自动装配。 则该属性会被忽略。 另一方面， `@Required`会强制执行通过容器支持的任何方式来设置属性。 如果没有值被注入的话，会引发相应的异常。

或者，您可以通过Java 8的`java.util.Optional`表达特定依赖项的非必需特性，如以下示例所示：

```java
public class SimpleMovieLister {

    @Autowired
    public void setMovieFinder(Optional<MovieFinder> movieFinder) {
        ...
    }
}
```

```kotlin
public class SimpleMovieLister {

    @Autowired
    public void setMovieFinder(Optional<MovieFinder> movieFinder) {
        ...
    }
}
```

从Spring Framework 5.0开始，您还可以使用`@Nullable` 注解（任何包中的任何类型，例如，来自JSR-305的 `javax.annotation.Nullable`）：

```java
public class SimpleMovieLister {

    @Autowired
    public void setMovieFinder(@Nullable MovieFinder movieFinder) {
        ...
    }
}
```

```kotlin
class SimpleMovieLister {

    @Autowired
    var movieFinder: MovieFinder? = null

    // ...
}
```

您也可以使用`@Autowired`作为常见的可解析依赖关系的接口，`BeanFactory`, `ApplicationContext`, `Environment`, `ResourceLoader`, `ApplicationEventPublisher`, 和 `MessageSource` 这些接口及其扩展接口（例如`ConfigurableApplicationContext` 或 `ResourcePatternResolver`） 会自动解析，无需特殊设置。 以下示例自动装配`ApplicationContext`对象：

```java
public class MovieRecommender {

    @Autowired
    private ApplicationContext context;

    public MovieRecommender() {
    }

    // ...
}
```

`@Autowired`, `@Inject`, `@Resource`, 和 `@Value` 注解 由 Spring `BeanPostProcessor` 实现.也就是说开发者不能使用自定义的`BeanPostProcessor`或者自定义`BeanFactoryPostProcessor`r来使用这些注解 必须使用XML或Spring @Bean方法显式地“连接”这些类型。

<a id="beans-autowired-annotation-primary"></a>

#### [](#beans-autowired-annotation-primary)1.9.3. `@Primary`

由于按类型的自动注入可能匹配到多个候选者，所以通常需要对选择过程添加更多的约束。使用Spring的`@Primary`注解是实现这个约束的一种方法。 它表示如果存在多个候选者且另一个bean只需要一个特定类型的bean依赖时，就明确使用标记有`@Primary`注解的那个依赖。如果候选中只有一个"Primary" bean，那么它就是自动注入的值

请考虑以下配置，将`firstMovieCatalog`定义为主要`MovieCatalog`：

```java
@Configuration
public class MovieConfiguration {

    @Bean
    @Primary
    public MovieCatalog firstMovieCatalog() { ... }

    @Bean
    public MovieCatalog secondMovieCatalog() { ... }

    // ...
}
```

kotlin:

```kotlin
@Configuration
class MovieConfiguration {

    @Bean
    @Primary
    fun firstMovieCatalog(): MovieCatalog { ... }

    @Bean
    fun secondMovieCatalog(): MovieCatalog { ... }

    // ...
}
```

使用上述配置，以下 `MovieRecommender`将与`firstMovieCatalog`一起自动装配：

```java
public class MovieRecommender {

    @Autowired
    private MovieCatalog movieCatalog;

    // ...
}
```

kotlin:

```kotlin
class MovieRecommender {

    @Autowired
    private lateinit var movieCatalog: MovieCatalog

    // ...
}
```

相应的bean定义如下:

```java
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:context="http://www.springframework.org/schema/context"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        https://www.springframework.org/schema/context/spring-context.xsd">

    <context:annotation-config/>

    <bean class="example.SimpleMovieCatalog" primary="true">
        <!-- inject any dependencies required by this bean -->
    </bean>

    <bean class="example.SimpleMovieCatalog">
        <!-- inject any dependencies required by this bean -->
    </bean>

    <bean id="movieRecommender" class="example.MovieRecommender"/>

</beans>
```

<a id="beans-autowired-annotation-qualifiers"></a>

#### [](#beans-autowired-annotation-qualifiers)1.9.4. 使用qualifiers微调基于注解的自动装配

`@Primary` 是一种用于解决自动装配多个值的注入的有效的方法，当需要对选择过程做更多的约束时，可以使用Spring的`@Qualifier`注解，可以为指定的参数绑定限定的值。 缩小类型匹配集，以便为每个参数选择特定的bean。 在最简单的情况下，这可以是一个简单的描述性值，如以下示例所示：

```java
public class MovieRecommender {

    @Autowired
    @Qualifier("main")
    private MovieCatalog movieCatalog;

    // ...
}
```

kotlin:

```kotlin
class MovieRecommender {

    @Autowired
    @Qualifier("main")
    private lateinit var movieCatalog: MovieCatalog

    // ...
}
```

您还可以在各个构造函数参数或方法参数上指定`@Qualifier`注解，如以下示例所示：

```java
public class MovieRecommender {

    private MovieCatalog movieCatalog;

    private CustomerPreferenceDao customerPreferenceDao;

    @Autowired
    public void prepare(@Qualifier("main")MovieCatalog movieCatalog,
            CustomerPreferenceDao customerPreferenceDao) {
        this.movieCatalog = movieCatalog;
        this.customerPreferenceDao = customerPreferenceDao;
    }

    // ...
}
```

kotlin:

```kotlin
class MovieRecommender {

    private lateinit var movieCatalog: MovieCatalog

    private lateinit var customerPreferenceDao: CustomerPreferenceDao

    @Autowired
    fun prepare(@Qualifier("main") movieCatalog: MovieCatalog,
                customerPreferenceDao: CustomerPreferenceDao) {
        this.movieCatalog = movieCatalog
        this.customerPreferenceDao = customerPreferenceDao
    }

    // ...
}
```

以下示例显示了相应的bean定义。.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:context="http://www.springframework.org/schema/context"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        https://www.springframework.org/schema/context/spring-context.xsd">

    <context:annotation-config/>

    <bean class="example.SimpleMovieCatalog">
        <qualifier value="main"/> 

        <!-- inject any dependencies required by this bean -->
    </bean>

    <bean class="example.SimpleMovieCatalog">
        <qualifier value="action"/> 

        <!-- inject any dependencies required by this bean -->
    </bean>

    <bean id="movieRecommender" class="example.MovieRecommender"/>

</beans>
```

**1**、带有限定符"`main`"的bean会被装配到拥有相同值的构造方法参数上.

**2**、带有限定符"`action`"的bean会被装配到拥有相同值的构造方法参数上.

bean的name会作为备用的qualifier值,因此可以定义bean的`id`为 main 替代内嵌的qualifier元素.这种匹配方式同样有效。但是，虽然可以使用这个约定来按名称引用特定的bean， 但是`@Autowired`默认是由带限定符的类型驱动注入的。这就意味着qualifier值，甚至是bean的name作为备选项，只是为了缩小类型匹配的范围。它们在语义上不表示对唯一bean id的引用。 良好的限定符值是像`main` 或 `EMEA` 或 `persistent`这样的，能表示与bean id无关的特定组件的特征，在匿名bean定义的情况下可以自动生成。

Qualifiers也可以用于集合类型，如上所述，例如 `Set<MovieCatalog>`。在这种情况下，根据声明的限定符，所有匹配的bean都作为集合注入。 这意味着限定符不必是唯一的。 相反，它们构成过滤标准。 例如，您可以使用相同的限定符值“action”定义多个`MovieCatalog` bean，所有这些bean都注入到使用`@Qualifier("action")`注解的`Set<MovieCatalog>`中。

在类型匹配候选项中，根据目标bean名称选择限定符值，在注入点不需要`@Qualifier`注解。 如果没有其他解析指示符（例如限定符或主标记）， 则对于非唯一依赖性情况，Spring会将注入点名称（即字段名称或参数名称）与目标bean名称进行匹配，然后选择同名的候选者，如果有的话。

如果打算by name来驱动注解注入，那么就不要使用`@Autowired`（多数情况），即使在技术上能够通过@Qualifier值引用bean名字。相反，应该使用JSR-250 `@Resource` 注解，该注解在语义上定义为通过其唯一名称标识特定目标组件，其中声明的类型与匹配进程无关。`@Autowired`具有多种不同的语义，在by type选择候选bean之后，指定的`String`限定的值只会考虑这些被选择的候选者。 例如将`account` 限定符与标有相同限定符标签的bean相匹配。

对于自身定义为 collection, `Map`, 或者 array type的bean， `@Resource`是一个很好的解决方案，通过唯一名称引用特定的集合或数组bean。 也就是说，从Spring4.3开始，只要元素类型信息保存在 `@Bean` 返回类型签名或集合（或其子类）中，您就可以通过Spring的 `@Autowired`类型匹配算法匹配Map和数组类型。 在这种情况下，可以使用限定的值来选择相同类型的集合，如上一段所述。

从Spring4.3开始，`@Autowired`也考虑了注入的自引用，即引用当前注入的bean。自引用只是一种后备选项，还是优先使用正常的依赖注入操作其它bean。 在这个意义上，自引用不参与到正常的候选者选择中，并且总是次要的，，相反，它们总是拥有最低的优先级。在实践中，自引用通常被用作最后的手段。例如，通过bean的事务代理在同一实例上调用其他方法 在这种情况下，考虑将受影响的方法分解为单独委托的bean，或者使用 `@Resource`,，它可以通过其唯一名称获取代理返回到当前的bean上。

`@Autowired`可以应用在字段、构造函数和多参数方法上，允许在参数上使用qualifier限定符注解缩小取值范围。相比之下，`@Resource`仅支持具有单个参数的字段和bean属性setter方法。 因此，如果注入目标是构造函数或多参数方法，请使用qualifiers限定符。

开发者也可以创建自定义的限定符注解，只需定义一个注解，在其上提供了@Qualifier注解即可。如以下示例所示：

```java
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Qualifier
public @interface Genre {

    String value();
}
```

kotlin:

```kotlin
@Target(AnnotationTarget.FIELD, AnnotationTarget.VALUE_PARAMETER)
@Retention(AnnotationRetention.RUNTIME)
@Qualifier
annotation class Genre(val value: String)
```

然后，您可以在自动装配的字段和参数上提供自定义限定符，如以下示例所示：

```java
public class MovieRecommender {

    @Autowired
    @Genre("Action")
    private MovieCatalog actionCatalog;

    private MovieCatalog comedyCatalog;

    @Autowired
    public void setComedyCatalog(@Genre("Comedy") MovieCatalog comedyCatalog) {
        this.comedyCatalog = comedyCatalog;
    }

    // ...
}
```

```kotlin
class MovieRecommender {

    @Autowired
    @Genre("Action")
    private lateinit var actionCatalog: MovieCatalog

    private lateinit var comedyCatalog: MovieCatalog

    @Autowired
    fun setComedyCatalog(@Genre("Comedy") comedyCatalog: MovieCatalog) {
        this.comedyCatalog = comedyCatalog
    }

    // ...
}
```

接下来，提供候选bean定义的信息。开发者可以添加`<qualifier/>`标签作为`<bean/>`标签的子元素，然后指定 `type`类型和`value`值来匹配自定义的qualifier注解。 type是自定义注解的权限定类名(包路径+类名）。如果没有重名的注解，那么可以使用类名(不含包路径）。 以下示例演示了两种方法：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:context="http://www.springframework.org/schema/context"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        https://www.springframework.org/schema/context/spring-context.xsd">

    <context:annotation-config/>

    <bean class="example.SimpleMovieCatalog">
        <qualifier type="Genre" value="Action"/>
        <!-- inject any dependencies required by this bean -->
    </bean>

    <bean class="example.SimpleMovieCatalog">
        <qualifier type="example.Genre" value="Comedy"/>
        <!-- inject any dependencies required by this bean -->
    </bean>

    <bean id="movieRecommender" class="example.MovieRecommender"/>

</beans>
```

在 [类路径扫描和组件管理](#beans-classpath-scanning),将展示一个基于注解的替代方法，可以在XML中提供qualifier元数据, 请参阅[使用注解提供限定符元数据。](#beans-scanning-qualifiers)

在某些情况下，使用没有值的注解可能就足够了。当注解用于更通用的目的并且可以应用在多种不同类型的依赖上时，这是很有用的。 例如，您可以提供可在没有Internet连接时搜索的Offline目录。 首先，定义简单注解，如以下示例所示：

```java
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Qualifier
public @interface Offline {

}
```

```kotlin
@Target(AnnotationTarget.FIELD, AnnotationTarget.VALUE_PARAMETER)
@Retention(AnnotationRetention.RUNTIME)
@Qualifier
annotation class Offline
```

然后将注解添加到需要自动注入的字段或属性中:

```java
public class MovieRecommender {

    @Autowired
    @Offline (1)
    private MovieCatalog offlineCatalog;

    // ...
}
```

kotlin:

```kotlin
class MovieRecommender {

    @Autowired
    @Offline 
    private lateinit var offlineCatalog: MovieCatalog

    // ...
}
```

**1**、此行添加`@Offline`注解

现在bean定义只需要一个限定符类型，如下例所示：:

```xml
<bean class="example.SimpleMovieCatalog">
    <qualifier type="Offline"/> (1)
    <!-- inject any dependencies required by this bean -->
</bean>
```

**1**、此元素指定限定符。

开发者还可以为自定义限定名qualifier注解增加属性，用于替代简单的`value`属性。如果在要自动注入的字段或参数上指定了多个属性值，则bean的定义必须全部匹配这些属性值才能被视为自动注入候选者。 例如，请考虑以下注解定义：

```java
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Qualifier
public @interface MovieQualifier {

    String genre();

    Format format();
}
```

```kotlin
@Target(AnnotationTarget.FIELD, AnnotationTarget.VALUE_PARAMETER)
@Retention(AnnotationRetention.RUNTIME)
@Qualifier
annotation class MovieQualifier(val genre: String, val format: Format)
```

在这种情况下， `Format`是一个枚举类型，定义如下:

```java
public enum Format {
    VHS, DVD, BLURAY
}
```

```kotlin
enum class Format {
    VHS, DVD, BLURAY
}
```

要自动装配的字段使用自定义限定符进行注解，并包含两个属性的值：`genre` 和 `format`，如以下示例所示:

```java
public class MovieRecommender {

    @Autowired
    @MovieQualifier(format=Format.VHS, genre="Action")
    private MovieCatalog actionVhsCatalog;

    @Autowired
    @MovieQualifier(format=Format.VHS, genre="Comedy")
    private MovieCatalog comedyVhsCatalog;

    @Autowired
    @MovieQualifier(format=Format.DVD, genre="Action")
    private MovieCatalog actionDvdCatalog;

    @Autowired
    @MovieQualifier(format=Format.BLURAY, genre="Comedy")
    private MovieCatalog comedyBluRayCatalog;

    // ...
}
```

```kotlin
class MovieRecommender {

    @Autowired
    @MovieQualifier(format = Format.VHS, genre = "Action")
    private lateinit var actionVhsCatalog: MovieCatalog

    @Autowired
    @MovieQualifier(format = Format.VHS, genre = "Comedy")
    private lateinit var comedyVhsCatalog: MovieCatalog

    @Autowired
    @MovieQualifier(format = Format.DVD, genre = "Action")
    private lateinit var actionDvdCatalog: MovieCatalog

    @Autowired
    @MovieQualifier(format = Format.BLURAY, genre = "Comedy")
    private lateinit var comedyBluRayCatalog: MovieCatalog

    // ...
}
```

最后，bean定义应包含匹配的限定符值。此示例还演示了可以使用bean meta属性而不是使用`<qualifier/>`子元素。如果可行，`<qualifier/>`元素及其属性优先， 但如果不存在此类限定符，那么自动注入机制会使用 `<meta/>` 标签中提供的值，如以下示例中的最后两个bean定义：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:context="http://www.springframework.org/schema/context"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        https://www.springframework.org/schema/context/spring-context.xsd">

    <context:annotation-config/>

    <bean class="example.SimpleMovieCatalog">
        <qualifier type="MovieQualifier">
            <attribute key="format" value="VHS"/>
            <attribute key="genre" value="Action"/>
        </qualifier>
        <!-- inject any dependencies required by this bean -->
    </bean>

    <bean class="example.SimpleMovieCatalog">
        <qualifier type="MovieQualifier">
            <attribute key="format" value="VHS"/>
            <attribute key="genre" value="Comedy"/>
        </qualifier>
        <!-- inject any dependencies required by this bean -->
    </bean>

    <bean class="example.SimpleMovieCatalog">
        <meta key="format" value="DVD"/>
        <meta key="genre" value="Action"/>
        <!-- inject any dependencies required by this bean -->
    </bean>

    <bean class="example.SimpleMovieCatalog">
        <meta key="format" value="BLURAY"/>
        <meta key="genre" value="Comedy"/>
        <!-- inject any dependencies required by this bean -->
    </bean>

</beans>
```

<a id="beans-generics-as-qualifiers"></a>

#### [](#beans-generics-as-qualifiers)1.9.5. 使用泛型作为自动装配限定符

除了`@Qualifier` 注解之外，您还可以使用Java泛型类型作为隐式的限定形式。 例如，假设您具有以下配置：

```java
@Configuration
public class MyConfiguration {

    @Bean
    public StringStore stringStore() {
        return new StringStore();
    }

    @Bean
    public IntegerStore integerStore() {
        return new IntegerStore();
    }
}
```

```kotlin
@Configuration
class MyConfiguration {

    @Bean
    fun stringStore() = StringStore()

    @Bean
    fun integerStore() = IntegerStore()
}
```

假设上面的bean都实现了泛型接口,即 `Store<String>`和`Store<Integer>`,那么可以用`@Autowire`来注解`Store` 接口, 并将泛型用作限定符，如下例所示：

```java
@Autowired
private Store<String> s1; // <String> qualifier, injects the stringStore bean

@Autowired
private Store<Integer> s2; // <Integer> qualifier, injects the integerStore bean
```

```kotlin
@Autowired
private lateinit var s1: Store<String> // <String> qualifier, injects the stringStore bean

@Autowired
private lateinit var s2: Store<Integer> // <Integer> qualifier, injects the integerStore bean
```

通用限定符也适用于自动装配列表，`Map`实例和数组。 以下示例自动装配通用`List`：

```java
// Inject all Store beans as long as they have an <Integer> generic
// Store<String> beans will not appear in this list
@Autowired
private List<Store<Integer>> s;
```

```kotlin
// Inject all Store beans as long as they have an <Integer> generic
// Store<String> beans will not appear in this list
@Autowired
private lateinit var s: List<Store<Integer>>
```

<a id="beans-custom-autowire-configurer"></a>

#### [](#beans-custom-autowire-configurer)1.9.6. `CustomAutowireConfigurer`

[`CustomAutowireConfigurer`](https://docs.spring.io/spring-framework/docs/5.1.3.BUILD-SNAPSHOT/javadoc-api/org/springframework/beans/factory/annotation/CustomAutowireConfigurer.html) 是一个`BeanFactoryPostProcessor`，它允许开发者注册自定义的qualifier注解类型，而无需指定`@Qualifier`注解，以下示例显示如何使用`CustomAutowireConfigurer`:

```xml
<bean id="customAutowireConfigurer"
        class="org.springframework.beans.factory.annotation.CustomAutowireConfigurer">
    <property name="customQualifierTypes">
        <set>
            <value>example.CustomQualifier</value>
        </set>
    </property>
</bean>
```

`AutowireCandidateResolver` 通过以下方式确定自动注入的候选者:

*   每个bean定义的`autowire-candidate`值

*   在`<beans/>`元素上使用任何可用的 `default-autowire-candidates` 模式

*   存在 `@Qualifier` 注解以及使用`CustomAutowireConfigurer`注册的任何自定义注解


当多个bean有资格作为自动注入的候选项时，“primary”的确定如下：如果候选者中只有一个bean定义的 `primary`属性设置为`true`，则选择它。

<a id="beans-resource-annotation"></a>

#### [](#beans-resource-annotation)1.9.7. `@Resource`

Spring还通过在字段或bean属性setter方法上使用JSR-250 `@Resource(javax.annotation.Resource)`注解来支持注入。 这是Java EE 中的常见模式（例如，JSF-managed beans 和JAX-WS 端点中）。 Spring也为Spring管理对象提供这种模式。

`@Resource` 接受一个name属性.。默认情况下，Spring将该值解释为要注入的bean名称。 换句话说，它遵循按名称语义，如以下示例所示:

```java
public class SimpleMovieLister {

    private MovieFinder movieFinder;

    @Resource(name="myMovieFinder") (1)
    public void setMovieFinder(MovieFinder movieFinder) {
        this.movieFinder = movieFinder;
    }
}
```

```kotlin
class SimpleMovieLister {

    @Resource(name="myMovieFinder") 
    private lateinit var movieFinder:MovieFinder
}
```

**1**、这行注入一个`@Resource`.

如果未明确指定名称，则默认名称是从字段名称或setter方法派生的。 如果是字段，则采用字段名称。 在setter方法的情况下，它采用bean属性名称。 下面的例子将把名为`movieFinder`的bean注入其setter方法：

```java
public class SimpleMovieLister {

    private MovieFinder movieFinder;

    @Resource
    public void setMovieFinder(MovieFinder movieFinder) {
        this.movieFinder = movieFinder;
    }
}
```

```kotlin
class SimpleMovieLister {

    @Resource
    private lateinit var movieFinder: MovieFinder

}
```

`ApplicationContext`若使用了`CommonAnnotationBeanPostProcessor`，注解提供的name名字将被解析为bean的name名字。 如果配置了Spring的 [`SimpleJndiBeanFactory`](https://docs.spring.io/spring-framework/docs/5.1.3.BUILD-SNAPSHOT/javadoc-api/org/springframework/jndi/support/SimpleJndiBeanFactory.html)，这些name名称就可以通过JNDI解析。但是，推荐使用默认的配置，简单地使用Spring的JNDI，这样可以保持逻辑引用。而不是直接引用。

@Resource在没有明确指定name时，其行为类似于`@Autowired`，对于特定bean(Spring API内的bean）， `@Resource` 找到主要类型匹配而不是特定的命名bean， 并解析众所周知的可解析依赖项：`ApplicationContext`, `ResourceLoader`, `ApplicationEventPublisher`, 和 `MessageSource`接口。

因此，在以下示例中，`customerPreferenceDao`字段首先查找名为customerPreferenceDao的bean，如果未找到，则会使用类型匹配`CustomerPreferenceDao`类的实例：

```java
public class MovieRecommender {

    @Resource
    private CustomerPreferenceDao customerPreferenceDao;

    @Resource
    private ApplicationContext context; (1)

    public MovieRecommender() {
    }

    // ...
}
```

```kotlin
class MovieRecommender {

    @Resource
    private lateinit var customerPreferenceDao: CustomerPreferenceDao


    @Resource
    private lateinit var context: ApplicationContext 

    // ...
}
```

**1**、`context`域将会注入`ApplicationContext`

<a id="beans-value-annotations"></a>

#### [](#beans-value-annotations)1.9.8. 使用`@Value` 

`@Value`通常用于注入外部属性：

java:

```java
@Component
public class MovieRecommender {

    private final String catalog;

    public MovieRecommender(@Value("${catalog.name}") String catalog) {
        this.catalog = catalog;
    }
}
```

kotlin:

```kotlin
@Component
class MovieRecommender(@Value("\${catalog.name}") private val catalog: String)
```

使用以下配置：

java:

```java
@Configuration
@PropertySource("classpath:application.properties")
public class AppConfig { }
```

kotlin:

```kotlin
@Configuration
@PropertySource("classpath:application.properties")
class AppConfig
```

以及以下application.properties文件：

```xml
catalog.name=MovieCatalog
```

在这种情况下，catalog参数和字段将等于MovieCatalog值。

Spring提供了一个默认的宽松内嵌值解析器。 它将尝试解析属性值，如果无法解析，则将属性名称（例如`$ {catalog.name}`）作为值注入。 如果要严格控制不存在的值，则应声明一个`PropertySourcesPlaceholderConfigurer` bean，如以下示例所示：

java:

```java
@Configuration
public class AppConfig {

     @Bean
     public static PropertySourcesPlaceholderConfigurer propertyPlaceholderConfigurer() {
           return new PropertySourcesPlaceholderConfigurer();
     }
}
```

kotlin:

```kotlin
@Configuration
class AppConfig {

    @Bean
    fun propertyPlaceholderConfigurer() = PropertySourcesPlaceholderConfigurer()
}
```

使用JavaConfig配置PropertySourcesPlaceholderConfigurer时，@ Bean方法必须是静态的。

如果无法解析任何`$ {}`占位符，则使用上述配置可确保Spring初始化失败。 也可以使用setPlaceholderPrefix，setPlaceholderSuffix或setValueSeparator之类的方法来自定义占位符。

Spring Boot默认配置一个`PropertySourcesPlaceholderConfigurer` bean，它将从`application.properties和application.yml`文件获取属性。

Spring提供的内置转换器支持允许自动处理简单的类型转换（例如，转换为Integer或int）。 多个逗号分隔的值可以自动转换为String数组，而无需付出额外的努力。

可以提供如下默认值：

java:

```java
@Component
public class MovieRecommender {

    private final String catalog;

    public MovieRecommender(@Value("${catalog.name:defaultCatalog}") String catalog) {
        this.catalog = catalog;
    }
}
```

kotlin:

```kotlin
@Component
class MovieRecommender(@Value("\${catalog.name:defaultCatalog}") private val catalog: String)
```

Spring `BeanPostProcessor`在后台使用`ConversionService`处理将`@Value`中的String值转换为目标类型的过程。 如果要为自己的自定义类型提供转换支持，则可以提供自己的`ConversionService` bean实例，如以下示例所示：

java:

```java
@Configuration
public class AppConfig {

    @Bean
    public ConversionService conversionService() {
        DefaultFormattingConversionService conversionService = new DefaultFormattingConversionService();
        conversionService.addConverter(new MyCustomConverter());
        return conversionService;
    }
}
```

kotlin

```kotlin
@Configuration
class AppConfig {

    @Bean
    fun conversionService(): ConversionService {
            return DefaultFormattingConversionService().apply {
            addConverter(MyCustomConverter())
        }
    }
}
```

当@Value包含SpEL表达式时，该值将在运行时动态计算，如以下示例所示：

java:

```java
@Component
public class MovieRecommender {

    private final String catalog;

    public MovieRecommender(@Value("#{systemProperties['user.catalog'] + 'Catalog' }") String catalog) {
        this.catalog = catalog;
    }
}
```

kotlin:

```kotlin
@Component
class MovieRecommender(
    @Value("#{systemProperties['user.catalog'] + 'Catalog' }") private val catalog: String)
```

SpEL还可以使用更复杂的数据结构：

java:

```java
@Component
public class MovieRecommender {

    private final Map<String, Integer> countOfMoviesPerCatalog;

    public MovieRecommender(
            @Value("#{{'Thriller': 100, 'Comedy': 300}}") Map<String, Integer> countOfMoviesPerCatalog) {
        this.countOfMoviesPerCatalog = countOfMoviesPerCatalog;
    }
}
```

kotlin:

```kotlin
@Component
class MovieRecommender(
    @Value("#{{'Thriller': 100, 'Comedy': 300}}") private val countOfMoviesPerCatalog: Map<String, Int>)
```



<a id="beans-postconstruct-and-predestroy-annotations"></a>

#### [](#beans-postconstruct-and-predestroy-annotations)1.9.9. `@PostConstruct` 和 `@PreDestroy`

`CommonAnnotationBeanPostProcessor` 不仅仅识别`@Resource` 注解，还识别JSR-250生命周期注解 `javax.annotation.PostConstruct` 和`javax.annotation.PreDestroy`. 。，在Spring 2.5中引入了这些注解， 它们提供了另一个替代[初始化回调](#beans-factory-lifecycle-initializingbean)和[销毁回调](#beans-factory-lifecycle-disposablebean)。 如果`CommonAnnotationBeanPostProcessor`在Spring `ApplicationContext`中注册，它会在相应的Spring bean生命周期中调用相应的方法，就像是Spring生命周期接口方法，或者是明确声明的回调函数那样。 在以下示例中，缓存在初始化时预先填充并在销毁时清除：

```java
public class CachingMovieLister {

    @PostConstruct
    public void populateMovieCache() {
        // populates the movie cache upon initialization...
    }

    @PreDestroy
    public void clearMovieCache() {
        // clears the movie cache upon destruction...
    }
}
```

```kotlin
class CachingMovieLister {

    @PostConstruct
    fun populateMovieCache() {
        // populates the movie cache upon initialization...
    }

    @PreDestroy
    fun clearMovieCache() {
        // clears the movie cache upon destruction...
    }
}
```

有关组合各种生命周期机制的影响的详细信息，请参阅组合[生命周期机制](#beans-factory-lifecycle-combined-effects)。
