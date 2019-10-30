---
title: `ApplicationContext`的附加功能
keywords: keywords: docs，jcohy-docs，spring,`ApplicationContext`的附加功能
description: Spring  Framework 中文文档 》 `ApplicationContext`的附加功能
---

# Spring  Framework 中文文档
### [](#context-introduction)1.15.`ApplicationContext`的附加功能

正如 [前面章节](#beans)中讨论的，`org.springframework.beans.factory`包提供了管理和操作bean的基本功能，包括以编程方式。 `org.springframework.context`包添加了[`ApplicationContext`](https://docs.spring.io/spring-framework/docs/5.1.3.BUILD-SNAPSHOT/javadoc-api/org/springframework/context/ApplicationContext.html)接口，该接口扩展了`BeanFactory`接口，此外还扩展了其他接口，以更面向应用程序框架的方式提供其他功能。 许多人以完全声明的方式使用`ApplicationContext`， 甚至不以编程方式创建它，而是依赖于诸如`ContextLoader`之类的支持类来自动实例化`ApplicationContext`，作为Java EE Web应用程序的正常启动过程的一部分。

为了以更加面向框架的方式增强`BeanFactory`的功能,上下文包还提供了以下功能。

*   通过`MessageSource`接口访问i18n风格的消息。

*   通过`ResourceLoader`接口访问URL和文件等资源。

*   事件发布，即通过使用`ApplicationEventPublisher`接口实现`ApplicationListener`接口的bean。

*   通过`HierarchicalBeanFactory`接口，加载多级contexts，允许关注某一层级context，比如应用的Web层。

<a id="context-functionality-messagesource"></a>

#### [](#context-functionality-messagesource)1.15.1. 使用`MessageSource`实现国际化

`ApplicationContext` 接口扩展了一个名为`MessageSource`的接口，因此提供了国际化(“i18n”)功能。 Spring还提供了`HierarchicalMessageSource`接口，该接口可以分层次地解析消息。 这些接口共同提供了Spring影响消息解析的基础。 这些接口上定义的方法包括：

*   `String getMessage(String code, Object[] args, String default, Locale loc)`: 用于从`MessageSource`检索消息的基本方法。 如果未找到指定区域设置的消息，则使用默认消息。 传入的任何参数都使用标准库提供的`MessageFormat`功能成为替换值。

*   `String getMessage(String code, Object[] args, Locale loc)`: 基本上与前一个方法相同，但有一个区别：不能指定默认消息。 如果找不到该消息，则抛出`NoSuchMessageException` 。

*   `String getMessage(MessageSourceResolvable resolvable, Locale locale)`: 前面方法中使用的所有属性也包装在名为 `MessageSourceResolvable`的类中，您可以将此方法用于此类。


当一个`ApplicationContext`被加载时,它会自动搜索在上下文中定义的一个`MessageSource`,bean必须包含名称`messageSource`,如果找到这样的bean 则将对前面方法的所有调用委派给消息源。如果没有找到消息源，`ApplicationContext`会尝试找到一个包含同名bean的父对象。如果有，它使用那个bean作为`MessageSource`。 如果`ApplicationContext`找不到消息的任何源，则会实例化空的`DelegatingMessageSource`，以便能够接受对上面定义的方法的调用。

Spring提供了两个MessageSource实现， `ResourceBundleMessageSource`和`StaticMessageSource`，为了做嵌套消息两者都实现了`HierarchicalMessageSource`。 `StaticMessageSource`很少使用，但提供了以编程方式向源添加消息。 以下示例显示了`ResourceBundleMessageSource`：

```xml
<beans>
    <bean id="messageSource"
            class="org.springframework.context.support.ResourceBundleMessageSource">
        <property name="basenames">
            <list>
                <value>format</value>
                <value>exceptions</value>
                <value>windows</value>
            </list>
        </property>
    </bean>
</beans>
```

该示例假定您在类路径中定义了三个资源包，`format`, `exceptions` and `windows`。任何解析消息的请求都将以JDK标准方式处理, 通过`ResourceBundle`解析消息。出于示例的目的，假设上述两个资源包文件的内容如下：

```java
# in format.properties
message=Alligators rock!

# in exceptions.properties
argument.required=The {0} argument is required.
```

下一个示例显示了执行`MessageSource` 功能的程序。 请记住，所有`ApplicationContext`实现也都是`MessageSource` 实现，因此可以强制转换为`MessageSource` 接口。

```java
public static void main(String[] args) {
    MessageSource resources = new ClassPathXmlApplicationContext("beans.xml");
    String message = resources.getMessage("message", null, "Default", null);
    System.out.println(message);
}
```

```kotlin
fun main() {
    val resources = ClassPathXmlApplicationContext("beans.xml")
    val message = resources.getMessage("message", null, "Default", Locale.ENGLISH)
    println(message)
}
```

上述程序产生的结果如下:

Alligators rock!

总而言之，`MessageSource`在名为`beans.xml`的文件中定义，该文件存在于类路径的根目录中。`messageSource`bean定义通过其basenames属性引用许多资源包。 在列表中传递给`basenames`属性的三个文件作为类路径根目录下的文件存在，分别称为`format.properties`, `exceptions.properties`和`windows.properties`。

下一个示例显示传递给消息查询的参数，这些参数将被转换为字符串并插入查找消息中的占位符。

```java
<beans>

    <!-- this MessageSource is being used in a web application -->
    <bean id="messageSource" class="org.springframework.context.support.ResourceBundleMessageSource">
        <property name="basename" value="exceptions"/>
    </bean>

    <!-- lets inject the above MessageSource into this POJO -->
    <bean id="example" class="com.something.Example">
        <property name="messages" ref="messageSource"/>
    </bean>

</beans>

        //java
public class Example {

    private MessageSource messages;

    public void setMessages(MessageSource messages) {
        this.messages = messages;
    }

    public void execute() {
        String message = this.messages.getMessage("argument.required",
            new Object [] {"userDao"}, "Required", null);
        System.out.println(message);
    }
}

//kotlin
class Example {

    lateinit var messages: MessageSource

    fun execute() {
        val message = messages.getMessage("argument.required",
                arrayOf("userDao"), "Required", Locale.ENGLISH)
        println(message)
    }
}
```

调用 `execute()`方法得到的结果如下:

The userDao argument is required.

关于国际化(“i18n”)，Spring的各种 `MessageSource`实现遵循与标准JDK `ResourceBundle`相同的区域设置解析和回退规则。 简而言之，继续前面定义的示例`messageSource`，如果要根据British(`en-GB`)语言环境解析消息，则应分别创建名为`format_en_GB.properties`，`exceptions_en_GB.properties`和`windows_en_GB.properties`的文件。

通常，区域设置解析由应用程序的环境配置管理。在以下示例中，手动指定解析（英国）消息的区域设置：

\# in exceptions\_en\_GB.properties
argument.required=Ebagum lad, the {0} argument is required, I say, required.

```java
public static void main(final String[] args) {
    MessageSource resources = new ClassPathXmlApplicationContext("beans.xml");
    String message = resources.getMessage("argument.required",
        new Object [] {"userDao"}, "Required", Locale.UK);
    System.out.println(message);
}
```

```kotlin
fun main() {
    val resources = ClassPathXmlApplicationContext("beans.xml")
    val message = resources.getMessage("argument.required",
            arrayOf("userDao"), "Required", Locale.UK)
    println(message)
}
```

运行上述程序产生的结果如下:

Ebagum lad, the 'userDao' argument is required, I say, required.

您还可以使用`MessageSourceAware`接口获取对已定义的任何`MessageSource`的引用。 在创建和配置bean时，应用程序上下文的`MessageSource`会注入实现`MessageSourceAware`接口的`ApplicationContext`中定义的任何bean。

作为`ResourceBundleMessageSource`的替代，Spring提供了一个`ReloadableResourceBundleMessageSource`类。 此变体支持相同的bundle文件格式，但比基于标准JDK的`ResourceBundleMessageSource`实现更灵活。特别是，它允许从任何Spring资源位置（不仅从类路径）读取文件，并支持bundle属性文件的热重新加载（同时在其间有效地缓存它们）。 有关详细信息，请参阅[`ReloadableResourceBundleMessageSource`](https://docs.spring.io/spring-framework/docs/5.1.3.BUILD-SNAPSHOT/javadoc-api/org/springframework/context/support/ReloadableResourceBundleMessageSource.html) javadoc。

<a id="context-functionality-events"></a>

#### [](#context-functionality-events)1.15.2. 标准和自定义事件

`ApplicationContext`中的事件处理是通过`ApplicationEvent`类和`ApplicationListener`接口提供的。如果将实现`ApplicationListener`接口的bean部署到上下文中，则每次将`ApplicationEvent`发布到`ApplicationContext`时，都会通知该bean。 从本质上讲，这是标准的Observer设计模式。

从Spring 4.2开始，事件架构已经得到显着改进，并提供了一个[基于注解的模型](#context-functionality-events-annotation)使其有发布任意事件的能力（即，不一定从`ApplicationEvent`扩展的对象） 。当发布这样的对象时，我们将它包装在一个事件中。

下表描述了Spring提供的标准事件：:

Table 7. Built-in Events

| 事件                    | 说明                                                         |
| ----------------------- | ------------------------------------------------------------ |
| `ContextRefreshedEvent` | 初始化或刷新`ApplicationContext`时发布（例如，通过使用`ConfigurableApplicationContext` 接口上的`refresh()` 方法）。 这里，“initialized”意味着加载所有bean，检测并激活bean的后置处理器，预先实例化单例，并且可以使用`ApplicationContext`对象。 只要上下文尚未关闭，只要所选的`ApplicationContext`实际支持这种“热”刷新，就可以多次触发刷新。 例如，`XmlWebApplicationContext`支持热刷新，但`GenericApplicationContext` 不支持。 |
| `ContextStartedEvent`   | 通过使用`ConfigurableApplicationContext`接口上的`start()`方法启动`ApplicationContext` 时发布。 通常，此信号用于在显式停止后重新启动Bean，但它也可用于启动尚未为自动启动配置的组件（例如，在初始化时尚未启动的组件）。 |
| `ContextStoppedEvent`   | 通过使用`ConfigurableApplicationContext`接口上的`close()` 方法停止`ApplicationContext`时发布。 这里，“已停止”表示所有生命周期bean都会收到明确的停止信号。 可以通过`start()`调用重新启动已停止的上下文。 |
| `ContextClosedEvent`    | 通过使用`ConfigurableApplicationContext`接口上的`close()`方法关闭`ApplicationContext`时发布。 这里， “关闭” 意味着所有单例bean都被销毁。 封闭的环境达到其寿命终结。 它无法刷新或重新启动。 |
| `RequestHandledEvent`   | 一个特定于Web的事件，告诉所有bean已经为HTTP请求提供服务。 请求完成后发布此事件。 此事件仅适用于使用Spring的DispatcherServlet的Web应用程序。 |


您还可以创建和发布自己的自定义事件。 以下示例显示了一个扩展Spring的`ApplicationEvent`基类的简单类：

```java
public class BlackListEvent extends ApplicationEvent {

    private final String address;
    private final String content;

    public BlackListEvent(Object source, String address, String content) {
        super(source);
        this.address = address;
        this.content = content;
    }

    // accessor and other methods...
}
```

```kotlin
class BlackListEvent(source: Any,
                    val address: String,
                    val content: String) : ApplicationEvent(source)
```

要发布自定义`ApplicationEvent`，请在`ApplicationEventPublisher`上调用`publishEvent()`方法。 通常，这是通过创建一个实现 `ApplicationEventPublisherAware`并将其注册为Spring bean的类来完成的。 以下示例显示了这样一个类：

```java
public class EmailService implements ApplicationEventPublisherAware {

    private List<String> blackList;
    private ApplicationEventPublisher publisher;

    public void setBlackList(List<String> blackList) {
        this.blackList = blackList;
    }

    public void setApplicationEventPublisher(ApplicationEventPublisher publisher) {
        this.publisher = publisher;
    }

    public void sendEmail(String address, String content) {
        if (blackList.contains(address)) {
            publisher.publishEvent(new BlackListEvent(this, address, content));
            return;
        }
        // send email...
    }
}
```

```kotlin
class EmailService : ApplicationEventPublisherAware {

    private lateinit var blackList: List<String>
    private lateinit var publisher: ApplicationEventPublisher

    fun setBlackList(blackList: List<String>) {
        this.blackList = blackList
    }

    override fun setApplicationEventPublisher(publisher: ApplicationEventPublisher) {
        this.publisher = publisher
    }

    fun sendEmail(address: String, content: String) {
        if (blackList!!.contains(address)) {
            publisher!!.publishEvent(BlackListEvent(this, address, content))
            return
        }
        // send email...
    }
}
```

在配置时，Spring容器检测到`EmailService`实现`ApplicationEventPublisherAware`并自动调用`setApplicationEventPublisher()`。 实际上，传入的参数是Spring容器本身。 您正在通过其`ApplicationEventPublisher`接口与应用程序上下文进行交互。

要接收自定义 `ApplicationEvent`，您可以创建一个实现`ApplicationListener`的类并将其注册为Spring bean。 以下示例显示了这样一个类：

```java
public class BlackListNotifier implements ApplicationListener<BlackListEvent> {

    private String notificationAddress;

    public void setNotificationAddress(String notificationAddress) {
        this.notificationAddress = notificationAddress;
    }

    public void onApplicationEvent(BlackListEvent event) {
        // notify appropriate parties via notificationAddress...
    }
}
```

```kotlin
class BlackListNotifier : ApplicationListener<BlackListEvent> {

    lateinit var notificationAddres: String

    override fun onApplicationEvent(event: BlackListEvent) {
        // notify appropriate parties via notificationAddress...
    }
}
```

请注意，`ApplicationListener`通常使用自定义事件的类型进行参数化（前面示例中为`BlackListEvent`）。这意味着`onApplicationEvent()`方法可以保持类型安全，从而避免任何向下转换的需要。 您可以根据需要注册任意数量的事件侦听器，但请注意，默认情况下，事件侦听器会同步接收事件。这意味着`publishEvent()`方法将阻塞，直到所有侦听器都已完成对事件的处理。 这种同步和单线程方法的一个优点是，当侦听器接收到事件时，如果事务上下文可用，它将在发布者的事务上下文内运行。如果需要另一个事件发布策略，请参阅Spring的[`ApplicationEventMulticaster`](https://docs.spring.io/spring-framework/docs/5.1.3.BUILD-SNAPSHOT/javadoc-api/org/springframework/context/event/ApplicationEventMulticaster.html)接口的javadoc。

以下示例显示了用于注册和配置上述每个类的bean定义:

```xml
<bean id="emailService" class="example.EmailService">
    <property name="blackList">
        <list>
            <value>[email protected]</value>
            <value>[email protected]</value>
            <value>[email protected]</value>
        </list>
    </property>
</bean>

<bean id="blackListNotifier" class="example.BlackListNotifier">
    <property name="notificationAddress" value="[email protected]"/>
</bean>
```

总而言之，当调用`emailService` bean的`sendEmail()`方法时，如果有任何应列入黑名单的电子邮件消息，则会发布`BlackListEvent`类型的自定义事件。 `blackListNotifier` bean注册为`ApplicationListener` 并接收`BlackListEvent` ，此时它可以通知相关方。

Spring的事件机制是为在同一应用程序上下文中的Spring bean之间的简单通信而设计的。但是，对于更复杂的企业集成需求，单独维护的[Spring Integration](https://projects.spring.io/spring-integration/) 项目提供了完整的支持并可用于构建轻量级，[pattern-oriented](http://www.enterpriseintegrationpatterns.com)(面向模式），依赖Spring编程模型的事件驱动架构。

<a id="context-functionality-events-annotation"></a>

##### [](#context-functionality-events-annotation)基于注解的事件监听器

从Spring 4.2开始，您可以使用`EventListener`注解在托管bean的任何公共方法上注册事件监听器。 `BlackListNotifier`可以重写如下：

```java
public class BlackListNotifier {

    private String notificationAddress;

    public void setNotificationAddress(String notificationAddress) {
        this.notificationAddress = notificationAddress;
    }

    @EventListener
    public void processBlackListEvent(BlackListEvent event) {
        // notify appropriate parties via notificationAddress...
    }
}
```

```kotlin
class BlackListNotifier {

    lateinit var notificationAddress: String

    @EventListener
    fun processBlackListEvent(event: BlackListEvent) {
        // notify appropriate parties via notificationAddress...
    }
}
```

方法签名再次声明它侦听的事件类型，但这次使用灵活的名称并且没有实现特定的侦听器接口。只要实际事件类型在其实现层次结构中解析通用参数，也可以通过泛型缩小事件类型。

如果您的方法应该监听多个事件，或者您想要根据任何参数进行定义，那么也可以在注解本身上指定事件类型。 以下示例显示了如何执行此操作：:

    @EventListener({ContextStartedEvent.class, ContextRefreshedEvent.class})
    public void handleContextStart() {
        ...
    }

```kotlin
@EventListener(ContextStartedEvent::class, ContextRefreshedEvent::class)
fun handleContextStart() {
    // ...
}
```

还可以通过使用定义[`SpEL` 表达式](#expressions)的注解的`condition`属性来添加额外的运行时过滤，该表达式应匹配以实际调用特定事件的方法。

以下示例显示了仅当事件的`content`属性等于`my-event`时才能重写我们的通知程序以进行调用：

```java
@EventListener(condition = "#blEvent.content == 'my-event'")
public void processBlackListEvent(BlackListEvent blEvent) {
    // notify appropriate parties via notificationAddress...
}
```

```kotlin
@EventListener(condition = "#blEvent.content == 'my-event'")
fun processBlackListEvent(blEvent: BlackListEvent) {
    // notify appropriate parties via notificationAddress...
}
```

每个`SpEL`表达式都针对专用上下文进行评估。 下表列出了可用于上下文的项目，以便您可以将它们用于条件事件处理：

Table 8. 事件SpEL可用的元数据

| 名字            | 位置               | 描述                                                         | 例子                                                         |
| --------------- | ------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| Event           | root               | 实际`ApplicationEvent`                                       | `#root.event`                                                |
| Arguments array | root object        | 用于调用目标的参数（作为数组）                               | `#root.args[0]`                                              |
| _Argument name_ | evaluation context | 任何方法参数的名称。 如果由于某种原因，名称不可用（例如，因为没有调试信息），参数名称也可以在#a `#a<#arg>`下获得，其中`#arg`代表参数索引（从0开始）。 | `#blEvent` or `#a0` (you can also use `#p0` or `#p<#arg>` notation as an alias) |

请注意，即使您的方法签名实际引用已发布的任意对象，`#root.event`也允许您访问基础事件。

如果需要发布一个事件作为处理另一个事件的结果，则可以更改方法签名以返回应发布的事件，如以下示例所示：

```java
@EventListener
public ListUpdateEvent handleBlackListEvent(BlackListEvent event) {
    // notify appropriate parties via notificationAddress and
    // then publish a ListUpdateEvent...
}
```

```kotlin
@EventListener
fun handleBlackListEvent(event: BlackListEvent): ListUpdateEvent {
    // notify appropriate parties via notificationAddress and
    // then publish a ListUpdateEvent...
}
```

[异步侦听器](#context-functionality-events-async)不支持此功能。

这将通过上述方法处理每个`BlackListEvent`并发布一个新的`ListUpdateEvent`，如果需要发布多个事件，则可以返回事件 `集合`。

<a id="context-functionality-events-async"></a>

##### [](#context-functionality-events-async)异步的监听器

如果希望特定侦听器异步处理事件，则可以重用[常规 `@Async`支持](https://github.com/DocsHome/spring-docs/blob/master/pages/integration/integration.md#scheduling-annotation-support-async)。 以下示例显示了如何执行此操作：

```java
@EventListener
@Async
public void processBlackListEvent(BlackListEvent event) {
    // BlackListEvent is processed in a separate thread
}
```

```kotlin
@EventListener
@Async
fun processBlackListEvent(event: BlackListEvent) {
    // BlackListEvent is processed in a separate thread
}
```

使用异步事件时请注意以下限制:

* 如果事件侦听器抛出`Exception`，则不会将其传播给调用者。有关更多详细信息，请参阅 `AsyncUncaughtExceptionHandler`。

* 此类事件监听器无法发送回复。 如果您需要作为处理结果发送另一个事件，请注入[`ApplicationEventPublisher`](https://docs.spring.io/spring-framework/docs/5.1.3.BUILD-SNAPSHOT/javadoc-api/org/springframework/aop/interceptor/AsyncUncaughtExceptionHandler.html)以手动发送事件。

<a id="context-functionality-events-order"></a>


##### [](#context-functionality-events-order)监听器的排序

如果需要在另一个侦听器之前调用一个侦听器，则可以将`@Order`注解添加到方法声明中，如以下示例所示：

```java
@EventListener
@Order(42)
public void processBlackListEvent(BlackListEvent event) {
    // notify appropriate parties via notificationAddress...
}
```

```kotlin
@EventListener
@Order(42)
fun processBlackListEvent(event: BlackListEvent) {
    // notify appropriate parties via notificationAddress...
}
```

<a id="context-functionality-events-generics"></a>

##### [](#context-functionality-events-generics)泛型的事件

您还可以使用泛型来进一步定义事件的结构。 考虑使用`EntityCreatedEvent<T>`，其中`T`是创建的实际实体的类型。 例如，您可以创建以下侦听器定义以仅接收`Person`的`EntityCreatedEvent`：

```java
@EventListener
public void onPersonCreated(EntityCreatedEvent<Person> event) {
    ...
}
```

```kotlin
@EventListener
fun onPersonCreated(event: EntityCreatedEvent<Person>) {
    // ...
}
```

由于泛型擦除，只有此事件符合事件监听器所过滤的通用参数条件那么才会触发相应的处理事件(有点类似于`class PersonCreatedEvent extends EntityCreatedEvent<Person> { … }`）

在某些情况下，如果所有事件遵循相同的结构(如上述事件的情况），这可能变得相当乏味。在这种情况下，开发者可以实现`ResolvableTypeProvider`来引导框架超出所提供的运行时环境范围。

```java
public class EntityCreatedEvent<T> extends ApplicationEvent implements ResolvableTypeProvider {

    public EntityCreatedEvent(T entity) {
        super(entity);
    }

    @Override
    public ResolvableType getResolvableType() {
        return ResolvableType.forClassWithGenerics(getClass(), ResolvableType.forInstance(getSource()));
    }
}
```

```kotlin
class EntityCreatedEvent<T>(entity: T) : ApplicationEvent(entity), ResolvableTypeProvider {

    override fun getResolvableType(): ResolvableType? {
        return ResolvableType.forClassWithGenerics(javaClass, ResolvableType.forInstance(getSource()))
    }
}
```

这不仅适用于`ApplicationEvent` ，也适用于作为事件发送的任意对象。

<a id="context-functionality-resources"></a>

#### [](#context-functionality-resources)1.15.3.通过便捷的方式访问底层资源

为了最佳地使用和理解应用程序上下文，您应该熟悉Spring的资源抽象，如参考资料中所述[资源](#resources)。

应用程序上下文是`ResourceLoader`，可用于加载`Resource`对象。 `Resource`本质上是JDK`java.net.URL`类的功能更丰富的版本。实际上Resource的实现类中大多含有`java.net.URL`的实例。 `Resource`几乎能从任何地方透明的获取底层资源，可以是classpath类路径、文件系统、标准的URL资源及变种URL资源。如果资源定位字串是简单的路径， 没有任何特殊前缀，就适合于实际应用上下文类型。

可以配置一个bean部署到应用上下文中，用以实现特殊的回调接口，`ResourceLoaderAware`它会在初始化期间自动回调。应用程序上下文本身作为`ResourceLoader`传入。可以公开`Resource`的type属性，这样就可以访问静态资源 静态资源可以像其他properties那样被注入`Resource`。可以使用简单的字串路径指定资源，这需要依赖于特殊的JavaBean `PropertyEditor`（由上下文自动注册），当bean部署时候它将转换资源中的字串为实际的资源对象。

提供给`ApplicationContext`构造函数的一个或多个位置路径实际上是资源字符串，并且以简单形式对特定上下文实现进行适当处理。 `ClassPathXmlApplicationContext`将一个简单的定位路径视为类路径位置。开发者还可以使用带有特殊前缀的定位路径，这样就可以强制从classpath或者URL定义加载路径， 而不用考虑实际的上下文类型。

<a id="context-create"></a>

#### [](#context-create)1.15.4. 快速对Web应用的ApplicationContext实例化

开发者可以通过使用`ContextLoader`来声明性地创建`ApplicationContext`实例，当然也可以通过使用`ApplicationContext`的实现来编程实现`ApplicationContext`。

您可以使用`ContextLoaderListener`注册`ApplicationContext` ，如以下示例所示：

```xml
<context-param>
    <param-name>contextConfigLocation</param-name>
    <param-value>/WEB-INF/daoContext.xml /WEB-INF/applicationContext.xml</param-value>
</context-param>

<listener>
    <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
</listener>
```

侦听器检查`contextConfigLocation`参数。 如果参数不存在，则侦听器将`/WEB-INF/applicationContext.xml`用作默认值。 当参数确实存在时，侦听器使用预定义的分隔符（逗号，分号和空格）分隔String，并将值用作搜索应用程序上下文的位置。 还支持Ant样式的路径模式。 示例是`/WEB-INF/*Context.xml`（对于所有名称以`Context.xml`结尾且位于`WEB-INF` 目录中的文件）和`/WEB-INF/**/*Context.xml`（对于所有这样的文件） `WEB-INF`的任何子目录中的文件。

<a id="context-deploy-rar"></a>

#### [](#context-deploy-rar)1.15.5. 使用Java EE RAR文件部署Spring的`ApplicationContext`

可以将Spring `ApplicationContext`部署为RAR文件，将上下文及其所有必需的bean类和库JAR封装在Java EE RAR部署单元中，这相当于引导一个独立的`ApplicationContext`。 只是托管在Java EE环境中，能够访问Java EE服务器设施。在部署无头WAR文件(实际上，没有任何HTTP入口点，仅用于在Java EE环境中引导Spring `ApplicationContext`的WAR文件）的情况下RAR部署是更自然的替代方案

RAR部署非常适合不需要HTTP入口点但仅由消息端点和调度作业组成的应用程序上下文。在这种情况下，Bean可以使用应用程序服务器资源， 例如JTA事务管理器和JNDI绑定的JDBC `DataSource`和JMS `ConnectionFactory`实例，并且还可以通过Spring的标准事务管理和JNDI和JMX支持设施向平台的JMX服务器注册。 应用程序组件还可以通过Spring的`TaskExecutor`抽象实现与应用程序服务器的JCA `WorkManager` 交互

有关RAR部署中涉及的配置详细信息，请参阅 [`SpringContextResourceAdapter`](https://docs.spring.io/spring-framework/docs/5.1.3.BUILD-SNAPSHOT/javadoc-api/org/springframework/jca/context/SpringContextResourceAdapter.html)类的javadoc

对于将Spring ApplicationContext简单部署为Java EE RAR文件：

1.  将所有应用程序类打包到一个RAR文件（这是一个具有不同文件扩展名的标准JAR文件）。将所有必需的库JAR添加到RAR存档的根目录中。 。添加`META-INF/ra.xml`部署描述符 （如[`SpringContextResourceAdapter`](https://docs.spring.io/spring-framework/docs/5.1.3.BUILD-SNAPSHOT/javadoc-api/org/springframework/jca/context/SpringContextResourceAdapter.html)的javadoc所示） 和相应的Spring XML bean定义文件（通常是 META-INF/applicationContext.xml）。

2.  将生成的RAR文件放入应用程序服务器的部署目录中。


这种RAR部署单元通常是独立的。它们不会将组件暴露给外部世界，甚至不会暴露给同一应用程序的其他模块。 与基于RAR的`ApplicationContext`的交互通常通过与其他模块共享的JMS目标进行。 例如，基于RAR的`ApplicationContext`还可以调度一些作业或对文件系统（等等）中的新文件作出反应。 如果它需要允许来自外部的同步访问，它可以（例如）导出RMI端点，这可以由同一台机器上的其他应用程序模块使用。
