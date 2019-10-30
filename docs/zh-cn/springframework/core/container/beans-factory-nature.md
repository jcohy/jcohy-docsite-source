---
title: 自定义Bean的特性
keywords: keywords: docs，jcohy-docs，spring,自定义Bean的特性
description: Spring  Framework 中文文档 》 自定义Bean的特性
---

# Spring  Framework 中文文档
### [](#beans-factory-nature)1.6. 自定义Bean的特性

Spring Framework提供了许多可用于自定义bean特性的接口。 本节将它们分组如下：

*   [Lifecycle Callbacks(生命周期回调)](#beans-factory-lifecycle)

*   [`ApplicationContextAware` and `BeanNameAware`](#beans-factory-aware)

*   [其他 `Aware` 接口](#aware-list)

<a id="beans-factory-lifecycle"></a>

#### [](#beans-factory-lifecycle)1.6.1. 生命周期回调

你可以实现`InitializingBean` 和 `DisposableBean`接口，让容器里管理Bean的生命周期。容器会在调用`afterPropertiesSet()` 之后和`destroy()`之前会允许bean在初始化和销毁bean时执行某些操作。

JSR-250 `@PostConstruct` 和 `@PreDestroy`注解通常被认为是在现代Spring应用程序中接收生命周期回调的最佳实践。 使用这些注解意味着您的bean不会耦合到特定于Spring的接口。 有关详细信息，请参阅[使用 `@PostConstruct` 和 `@PreDestroy`](#beans-postconstruct-and-predestroy-annotations).

如果您不想使用JSR-250注解但仍想删除耦合，请考虑使用`init-method` 和 `destroy-method`定义对象元数据。

在内部，Spring 框架使用`BeanPostProcessor` 实现来处理任何回调接口并调用适当的方法。 如果您需要Spring默认提供的自定义功能或其他生命周期行为，您可以自己实现`BeanPostProcessor`。 有关更多信息，请参阅[容器扩展点](#beans-factory-extension)。

除了初始化和销毁方法的回调，Spring管理的对象也实现了Lifecycle接口来让管理的对象在容器的`生命周期`内启动和关闭。

本节描述了生命周期回调接口。.

<a id="beans-factory-lifecycle-initializingbean"></a>

##### [](#beans-factory-lifecycle-initializingbean)初始化方法回调

`org.springframework.beans.factory.InitializingBean`接口允许bean在所有的必要的依赖配置完成后执行bean的初始化， `InitializingBean` 接口中指定使用如下方法:

```java
void afterPropertiesSet() throws Exception;
```

```kotlin
fun afterPropertiesSet()
```

Spring团队是不建议开发者使用`InitializingBean`接口，因为这样会将代码耦合到Spring的特殊接口上。他们建议使用[`@PostConstruct`](#beans-postconstruct-and-predestroy-annotations) 注解或者指定一个POJO的实现方法， 这会比实现接口更好。在基于XML的元数据配置上，开发者可以使用`init-method` 属性来指定一个没有参数的方法，使用Java配置的开发者可以在`@Bean`上添加 `initMethod` 属性。 请参阅 [接收生命周期回调](#beans-java-lifecycle-callbacks)接收生命周期回调：

```xml
<bean id="exampleInitBean" class="examples.ExampleBean" init-method="init"/>
//java
public class ExampleBean {

    public void init() {
        // do some initialization work
    }
}
//kotlin
class ExampleBean {

    fun init() {
        // do some initialization work
    }
}
```

前面的示例与以下示例（由两个列表组成）具有几乎完全相同的效果：

```xml
<bean id="exampleInitBean" class="examples.AnotherExampleBean"/>
//java
public class AnotherExampleBean implements InitializingBean {

    public void afterPropertiesSet() {
        // do some initialization work
    }
}

//kotlin
class AnotherExampleBean : InitializingBean {

    override fun afterPropertiesSet() {
        // do some initialization work
    }
}
```

但是，前面两个示例中的第一个没有将代码耦合到Spring。

<a id="beans-factory-lifecycle-disposablebean"></a>

##### [](#beans-factory-lifecycle-disposablebean)销毁方法的回调

实现`org.springframework.beans.factory.DisposableBean` 接口的Bean就能让容器通过回调来销毁bean所引用的资源。 `DisposableBean` 接口指定一个方法：

```java
void destroy() throws Exception;
```

```kotlin
fun destroy()
```

我们建议您不要使用 `DisposableBean` 回调接口，因为它会不必要地将代码耦合到Spring。或者，我们建议使用[`@PreDestroy`](#beans-postconstruct-and-predestroy-annotations)注解 或指定bean定义支持的泛型方法。 在基于XML的元数据配置中，您可以在`<bean/>`上使用`destroy-method`属性。 使用Java配置，您可以使用`@Bean`的 `destroyMethod` 属性。 请参阅[接收生命周期回调](#beans-java-lifecycle-callbacks)。 考虑以下定义：

```xml
<bean id="exampleInitBean" class="examples.ExampleBean" destroy-method="cleanup"/>

//java
public class ExampleBean {

    public void cleanup() {
        // do some destruction work (like releasing pooled connections)
    }
}

//kotlin
class ExampleBean {

    fun cleanup() {
        // do some destruction work (like releasing pooled connections)
    }
}
```

前面的定义与以下定义几乎完全相同：:

```xml
<bean id="exampleInitBean" class="examples.AnotherExampleBean"/>

//java
public class AnotherExampleBean implements DisposableBean {

    public void destroy() {
        // do some destruction work (like releasing pooled connections)
    }
}

//kotlin
class AnotherExampleBean : DisposableBean {

    override fun destroy() {
        // do some destruction work (like releasing pooled connections)
    }
}
```

但是，前面两个定义中的第一个没有将代码耦合到Spring。.

您可以为`<bean>` 元素的`destroy-method`属性分配一个特殊的（推断的）值，该值指示Spring自动检测特定bean类的`close`或者`shutdown`方法。 （因此，任何实现`java.lang.AutoCloseable`或`java.io.Closeable`的类都将匹配。） 您还可以在`<bean>` 元素的`default-destroy-method`属性上设置此特殊（推断）值，用于让所有的bean都实现这个行为（[参见默认初始化和销毁方法](#beans-factory-lifecycle-default-init-destroy-methods)）。 请注意，这是Java配置的默认行为。

<a id="beans-factory-lifecycle-default-init-destroy-methods"></a>

##### [](#beans-factory-lifecycle-default-init-destroy-methods)默认初始化和销毁方法

当您不使用Spring特有的`InitializingBean`和 `DisposableBean`回调接口来实现初始化和销毁方法时，您定义方法的名称最好类似于`init()`, `initialize()`, `dispose()`。 这样可以在项目中标准化类方法，并让所有开发者都使用一样的名字来确保一致性。

您可以配置Spring容器来针对每一个Bean都查找这种名字的初始化和销毁回调方法。也就是说， 任意的开发者都会在应用的类中使用一个叫 `init()`的初始化回调。而不需要在每个bean中都定义`init-method="init"` 这种属性， Spring IoC容器会在bean创建的时候调用那个回调方法（[如前面描述](#beans-factory-lifecycle)的标准生命周期一样）。这个特性也将强制开发者为其他的初始化以及销毁回调方法使用同样的名字。

假设您的初始化回调方法名为`init()`，而您的destroy回调方法名为`destroy()`。 然后，您的类类似于以下示例中的类：

```java
public class DefaultBlogService implements BlogService {

    private BlogDao blogDao;

    public void setBlogDao(BlogDao blogDao) {
        this.blogDao = blogDao;
    }

    // this is (unsurprisingly) the initialization callback method
    public void init() {
        if (this.blogDao == null) {
            throw new IllegalStateException("The [blogDao] property must be set.");
        }
    }
}
```

kotlin:

```kotlin
class DefaultBlogService : BlogService {

    private var blogDao: BlogDao? = null

    // this is (unsurprisingly) the initialization callback method
    fun init() {
        if (blogDao == null) {
            throw IllegalStateException("The [blogDao] property must be set.")
        }
    }
}
```

然后，您可以在类似于以下内容的bean中使用该类:

```xml
<beans default-init-method="init">

    <bean id="blogService" class="com.something.DefaultBlogService">
        <property name="blogDao" ref="blogDao" />
    </bean>

</beans>
```

顶级`<beans/>`元素属性上存在`default-init-method`属性会导致Spring IoC容器将bean类上的`init`方法识别为初始化方法回调。 当bean被创建和组装时，如果bean拥有同名方法的话，则在适当的时候调用它。

您可以使用 `<beans/>`元素上的`default-destroy-method`属性，以类似方式（在XML中）配置destroy方法回调。

当某些bean已有的回调方法与配置的默认回调方法不相同时，开发者可以通过特指的方式来覆盖掉默认的回调方法。以XML为例，可以通过使用元素的`init-method` 和`destroy-method`属性来覆盖掉`<bean/>`中的配置。

Spring容器会做出如下保证，bean会在装载了所有的依赖以后，立刻就开始执行初始化回调。这样的话，初始化回调只会在直接的bean引用装载好后调用， 而此时AOP拦截器还没有应用到bean上。首先目标的bean会先完全初始化，然后AOP代理和拦截链才能应用。如果目标bean和代理是分开定义的，那么开发者的代码甚至可以跳过AOP而直接和引用的bean交互。 因此，在初始化方法中应用拦截器会前后矛盾，因为这样做耦合了目标bean的生命周期和代理/拦截器，还会因为与bean产生了直接交互进而引发不可思议的现象。

<a id="beans-factory-lifecycle-combined-effects"></a>

##### [](#beans-factory-lifecycle-combined-effects)组合生命周期策略

从Spring 2.5开始，您有三种选择用于控制bean生命周期行为:

*   [`InitializingBean`](#beans-factory-lifecycle-initializingbean) 和 [`DisposableBean`](#beans-factory-lifecycle-disposablebean) 回调接口

*   自定义 `init()` 和 `destroy()` 方法

*   [`@PostConstruct` 和 `@PreDestroy` 注解](#beans-postconstruct-and-predestroy-annotations). 你也可以在bean上同时使用这些机制.


如果bean配置了多个生命周期机制，而且每个机制都配置了不同的方法名字时，每个配置的方法会按照以下描述的顺序来执行。但是，如果配置了相同的名字， 例如初始化回调为`init()`，在不止一个生命周期机制配置为这个方法的情况下，这个方法只会执行一次。如[上一节中所述](#beans-factory-lifecycle-default-init-destroy-methods)。

为同一个bean配置的多个生命周期机制具有不同的初始化方法，如下所示:

1.  包含`@PostConstruct`注解的方法

2.  在`InitializingBean` 接口中的`afterPropertiesSet()` 方法

3.  自定义的`init()` 方法


Destroy方法以相同的顺序调用:

1.  包含`@PreDestroy`注解的方法

2.  在`DisposableBean`接口中的`destroy()` 方法

3.  自定义的`destroy()` 方法

<a id="beans-factory-lifecycle-processor"></a>

##### [](#beans-factory-lifecycle-processor)开始和关闭回调

`Lifecycle`接口中为所有具有自定义生命周期需求的对象定义了一些基本方法（例如启动或停止一些后台进程）:

```java
public interface Lifecycle {

    void start();

    void stop();

    boolean isRunning();
}
```

kotlin:

```kotlin
interface Lifecycle {

    fun start()

    fun stop()

    val isRunning: Boolean
}
```

任何Spring管理的对象都可以实现`Lifecycle` 接口。然后，当`ApplicationContext`接收到启动和停止信号时（例如，对于运行时的停止/重启场景），ApplicationContext会通知到所有上下文中包含的生命周期对象。 它通过委托 `LifecycleProcessor`完成此操作，如下面的清单所示：

```java
public interface LifecycleProcessor extends Lifecycle {

    void onRefresh();

    void onClose();
}
```

kotlin:

```kotlin
interface LifecycleProcessor : Lifecycle {

    fun onRefresh()

    fun onClose()
}
```

请注意，`LifecycleProcessor`是 `Lifecycle`接口的扩展。 它还添加了另外两种方法来响应刷新和关闭的上下文。

注意，常规的`org.springframework.context.Lifecycle`接口只是为明确的开始/停止通知提供一个约束，而并不表示在上下文刷新就会自动开始。 要对特定bean的自动启动（包括启动阶段）进行细粒度控制，请考虑实现`org.springframework.context.SmartLifecycle`接口。

同时，停止通知并不能保证在销毁之前出现。在正常的关闭情况下，所有的`Lifecycle`都会在销毁回调准备好之前收到停止通知，然而， 在上下文生命周期中的热刷新或者停止尝试刷新时，则只会调用销毁方法。

启动和关闭调用的顺序非常重要。如果任何两个对象之间存在“依赖”关系，则依赖方在其依赖之后开始，并且在其依赖之前停止。但是，有时，直接依赖性是未知的。 您可能只知道某种类型的对象应该在另一种类型的对象之前开始。 在这些情况下， `SmartLifecycle`接口定义了另一个选项，即在其超级接口`Phased` 上定义的 `getPhase()` 方法。 以下清单显示了`Phased`接口的定义

```java
public interface Phased {

    int getPhase();
}
```

kotlin:

```kotlin
interface Phased {

    val phase: Int
}
```

以下清单显示了`SmartLifecycle`接口的定义:

```java
public interface SmartLifecycle extends Lifecycle, Phased {

    boolean isAutoStartup();

    void stop(Runnable callback);
}
```

```kotlin
interface SmartLifecycle : Lifecycle, Phased {

    val isAutoStartup: Boolean

    fun stop(callback: Runnable)
}
```

当启动时，拥有最低phased的对象会优先启动，而当关闭时，会相反的顺序执行。因此，如果一个对象实现了`SmartLifecycle`，然后令其`getPhase()`方法返回`Integer.MIN_VALUE`值的话， 就会让该对象最早启动，而最晚销毁。显然，如果`getPhase()`方法返回了`Integer.MAX_VALUE`值则表明该对象会最晚启动，而最早销毁。 当考虑到使用phased值时，也同时需要了解正常没有实现`SmartLifecycle`的`Lifecycle`对象的默认值，这个值是0。因此，配置任意的负值都将表明将对象会在标准组件启动之前启动 ，而在标准组件销毁以后再进行销毁。

`SmartLifecycle`接口也定义了一个名为stop的回调方法，任何实现了`SmartLifecycle`接口的方法都必须在关闭流程完成之后调用回调中的`run()`方法。 这样做可以进行异步关闭，而`lifecycleProcessor`的默认实现`DefaultLifecycleProcessor`会等到配置的超时时间之后再调用回调。默认的每一阶段的超时时间为30秒。 您可以通过在上下文中定义名为 `lifecycleProcessor` 的bean来覆盖默认生命周期处理器实例。 如果您只想修改超时，则定义以下内容就足够了：

```xml
<bean id="lifecycleProcessor" class="org.springframework.context.support.DefaultLifecycleProcessor">
    <!-- timeout value in milliseconds -->
    <property name="timeoutPerShutdownPhase" value="10000"/>
</bean>
```

如前所述，`LifecycleProcessor` 接口还定义了用于刷新和关闭上下文的回调方法。在关闭过程中，如果`stop()`方法已经被调用，则就会执行关闭流程。 但是如果上下文正在关闭中则不会在进行此流程，而刷新的回调会使用到`SmartLifecycle`的另一个特性。当上下文刷新完毕（所有的对象已经实例化并初始化）后， 就会调用刷新回调，默认的生命周期处理器会检查每一个`SmartLifecycle` 对象的`isAutoStartup()`方法返回的Boolean值.如果为真，对象将会自动启动而不是等待明确的上下文调用， 或者调用自己的`start()`方法(不同于上下文刷新，标准的上下文实现是不会自动启动的）。`phase`的值以及“depends-on”关系会决定对象启动和销毁的顺序。

<a id="beans-factory-shutdown"></a>

##### [](#beans-factory-shutdown)在非Web应用中优雅地关闭Spring IoC容器

本节仅适用于非Web应用程序。 Spring的基于Web的`ApplicationContext` 实现已经具有代码，可以在关闭相关Web应用程序时正常关闭Spring IoC容器。

如果开发者在非Web应用环境使用Spring IoC容器的话（例如，在桌面客户端的环境下）开发者需要在JVM上注册一个关闭的钩子，来确保在关闭Spring IoC容器的时候能够调用相关的销毁方法来释放掉引用的资源。 当然，开发者也必须正确配置和实现那些销毁回调。

要注册关闭钩子，请调用`ConfigurableApplicationContext`接口上声明的`registerShutdownHook()` 方法，如以下示例所示：

```java
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public final class Boot {

    public static void main(final String[] args) throws Exception {
        ConfigurableApplicationContext ctx = new ClassPathXmlApplicationContext("beans.xml");

        // add a shutdown hook for the above context...
        ctx.registerShutdownHook();

        // app runs here...

        // main method exits, hook is called prior to the app shutting down...
    }
}
```

kotlin:

```kotlin
import org.springframework.context.support.ClassPathXmlApplicationContext

fun main() {
    val ctx = ClassPathXmlApplicationContext("beans.xml")

    // add a shutdown hook for the above context...
    ctx.registerShutdownHook()

    // app runs here...

    // main method exits, hook is called prior to the app shutting down...
}
```

<a id="beans-factory-aware"></a>

#### [](#beans-factory-aware)1.6.2. `ApplicationContextAware` 和 `BeanNameAware`

当`ApplicationContext` 创建实现`org.springframework.context.ApplicationContextAware`接口的对象实例时，将为该实例提供对该 `ApplicationContext`.的引用。 以下清单显示了`ApplicationContextAware`接口的定义：

```java
public interface ApplicationContextAware {

    void setApplicationContext(ApplicationContext applicationContext) throws BeansException;
}
```

kotlin:

```kotlin
interface ApplicationContextAware {

    @Throws(BeansException::class)
    fun setApplicationContext(applicationContext: ApplicationContext)
}
```

这样bean就能够通过编程的方式创建和操作`ApplicationContext` 了。通过`ApplicationContext` 接口，或者通过将引用转换成已知的接口的子类， 例如`ConfigurableApplicationContext`就能够提供一些额外的功能。其中的一个用法就是可以通过编程的方式来获取其他的bean。 有时候这个能力非常有用。当然，Spring团队并不推荐这样做，因为这样会使代码与Spring框架耦合，同时也没有遵循IoC的风格。 `ApplicationContext` 中其它的方法可以提供一些诸如资源的访问、发布应用事件或者添加`MessageSource`之类的功能。[`ApplicationContext`的附加功能](#context-introduction)中描述了这些附加功能。

从Spring 2.5开始， 自动装配是另一种获取`ApplicationContext`引用的替代方法。传统的的`构造函数` 和 `byType`的装载方式自动装配模式（如[自动装配](#beans-factory-autowire)中所述） 可以通过构造函数或setter方法的方式注入，开发者也可以通过注解注入的方式。为了更为方便，包括可以注入的字段和多个参数方法，请使用新的基于注解的自动装配功能。 这样，`ApplicationContext`将自动装配字段、构造函数参数或方法参数，如果相关的字段，构造函数或方法带有 `@Autowired`注解，则该参数需要`ApplicationContext`类型。 有关更多信息，请参阅[使用 `@Autowired`](#beans-autowired-annotation)@Autowired。

当`ApplicationContext`创建实现了`org.springframework.beans.factory.BeanNameAware`接口的类，那么这个类就可以针对其名字进行配置。以下清单显示了BeanNameAware接口的定义：:

```java
public interface BeanNameAware {

    void setBeanName(String name) throws BeansException;
}
```

```kotlin
interface BeanNameAware {

    @Throws(BeansException::class)
    fun setBeanName(name: String)
}
```

这个回调的调用在属性配置完成之后，但是在初始化回调之前。例如`InitializingBean`, `afterPropertiesSet`方法以及自定义的初始化方法等。

<a id="aware-list"></a>

#### [](#aware-list)1.6.3. 其他的 `Aware`接口

除了 `ApplicationContextAware`和`BeanNameAware`（前面已讨论过）之外，Spring还提供了一系列`Aware`回调接口，让bean告诉容器，它们需要一些具体的基础配置信息。。 一些重要的`Aware`接口参看下表：

Table 4. Aware 接口

| 名称                             | 注入的依赖                                                   | 所对应的章节                                                 |
| -------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `ApplicationContextAware`        | 声明 `ApplicationContext`                                    | [`ApplicationContextAware` 和 `BeanNameAware`](#beans-factory-aware) |
| `ApplicationEventPublisherAware` | `ApplicationContext`的事件发布者                             | [`ApplicationContext`的其他功能](#context-introduction)      |
| `BeanClassLoaderAware`           | 用于加载bean类的类加载器                                     | [实例化Bean](#beans-factory-class)                           |
| `BeanFactoryAware`               | 声明 `BeanFactory`.                                          | [`ApplicationContextAware` 和 `BeanNameAware`](#beans-factory-aware) |
| `BeanNameAware`                  | 声明bean的名称.                                              | [`ApplicationContextAware` 和 `BeanNameAware`](#beans-factory-aware) |
| `BootstrapContextAware`          | 容器运行的资源适配器`BootstrapContext`。通常仅在JCA-aware的 `ApplicationContext` 实例中可用 | [JCA CCI](https://github.com/DocsHome/spring-docs/blob/master/pages/integration/integration.md#cci) |
| `LoadTimeWeaverAware`            | 定义的weaver用于在加载时处理类定义.                          | [在Spring框架中使用AspectJ进行加载时织入](#aop-aj-ltw)       |
| `MessageSourceAware`             | 用于解析消息的已配置策略（支持参数化和国际化）               | [`ApplicationContext`的其他作用](#context-introduction)      |
| `NotificationPublisherAware`     | Spring JMX通知发布者                                         | [通知](https://github.com/DocsHome/spring-docs/blob/master/pages/integration/integration.md#jmx-notifications) |
| `ResourceLoaderAware`            | 配置的资源加载器                                             | [资源](#resources)                                           |
| `ServletConfigAware`             | 当前`ServletConfig`容器运行。仅在Web下的Spring `ApplicationContext`中有效 | [Spring MVC](https://github.com/DocsHome/spring-docs/blob/master/pages/web/web.md#mvc) |
| `ServletContextAware`            | 容器运行的当前ServletContext。仅在Web下的Spring `ApplicationContext`中有效。 | [Spring MVC](https://github.com/DocsHome/spring-docs/blob/master/pages/web/web.md#mvc) |

请再次注意，使用这些接口会将您的代码绑定到Spring API，而不会遵循IoC原则。 因此，我们建议将它们用于需要以编程方式访问容器的基础架构bean。
