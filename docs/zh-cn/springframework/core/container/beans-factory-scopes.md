---
title: bean的作用域
keywords: keywords: docs，jcohy-docs，spring,bean的作用域
description: Spring  Framework 中文文档 》 bean的作用域
---

# Spring  Framework 中文文档
### [](#beans-factory-scopes)1.5. bean的作用域

创建bean定义时，同时也会定义该如何创建Bean实例。 这些具体创建的过程是很重要的，因为只有通过对这些配置过程，您才能创建实例对象。

您不仅可以将不同的依赖注入到bean中，还可以配置bean的作用域。这种方法是非常强大而且也非常灵活，开发者可以通过配置来指定对象的作用域，无需在Java类的层次上配置。 bean可以配置多种作用域，Spring框架支持五种作用域，有三种作用域是当开发者使用基于Web的`ApplicationContext`的时候才有效的。您还可以创建[自定义范围.](#beans-factory-scopes-custom)。

下表描述了支持的范围:

Table 3. Bean 的作用域

| 作用域                                                | 描述                                                         |
| ----------------------------------------------------- | ------------------------------------------------------------ |
| [singleton](#beans-factory-scopes-singleton)          | (默认) 每一Spring IOC容器都拥有唯一的实例对象。              |
| [prototype](#beans-factory-scopes-prototype)          | 一个Bean定义可以创建任意多个实例对象.                        |
| [request](#beans-factory-scopes-request)              | 将单个bean定义范围限定为单个HTTP请求的生命周期。 也就是说，每个HTTP请求都有自己的bean实例，它是在单个bean定义的后面创建的。 只有基于Web的Spring `ApplicationContext`的才可用。 |
| [session](#beans-factory-scopes-session)              | 将单个bean定义范围限定为HTTP `Session`的生命周期。 只有基于Web的Spring `ApplicationContext`的才可用。 |
| [application](#beans-factory-scopes-application)      | 将单个bean定义范围限定为`ServletContext`的生命周期。 只有基于Web的Spring `ApplicationContext`的才可用。 |
| [websocket](https://github.com/DocsHome/spring-docs/blob/master/pages/web/web.md#websocket-stomp-websocket-scope) | 将单个bean定义范围限定为 `WebSocket`的生命周期。 只有基于Web的Spring `ApplicationContext`的才可用。 |

从Spring 3.0开始，线程作用域默认是可用的，但默认情况下未注册。 有关更多信息，请参阅[`SimpleThreadScope`](https://docs.spring.io/spring-framework/docs/5.1.3.BUILD-SNAPSHOT/javadoc-api/org/springframework/context/support/SimpleThreadScope.html)的文档。 有关如何注册此范围或任何其他自定义范围的说明，请参阅使用[自定义范围](#beans-factory-scopes-custom-using)。

<a id="beans-factory-scopes-singleton"></a>

#### [](#beans-factory-scopes-singleton)1.5.1. 单例作用域

单例bean在全局只有一个共享的实例，所有依赖单例bean的场景中，容器返回的都是同一个实例。

换句话说，当您定义一个bean并且它的范围是一个单例时，Spring IoC容器只会根据bean的定义来创建该bean的唯一实例。 这些唯一的实例会缓存到容器中，后续针对单例bean的请求和引用，都会从这个缓存中拿到这个唯一实例。 下图显示了单例范围的工作原理：

![singleton](https://github.com/DocsHome/spring-docs/blob/master/pages/images/singleton.png)

Spring的单例bean概念不同于设计模式（GoF）之中所定义的单例模式。设计模式中的单例模式是将一个对象的作用域硬编码的，一个ClassLoader只能有唯一的一个实例。 而Spring的单例作用域是以容器为前提的，每个容器每个bean只能有一个实例。 这意味着，如果在单个Spring容器中为特定类定义一个bean，则Spring容器会根据bean定义创建唯一的bean实例。 单例作用域是Spring的默认作用域。 下面的例子是在XML中配置单例模式Bean的例子：

```xml
<bean id="accountService" class="com.something.DefaultAccountService"/>

<!-- the following is equivalent, though redundant (singleton scope is the default) -->
<bean id="accountService" class="com.something.DefaultAccountService" scope="singleton"/>
```

<a id="beans-factory-scopes-prototype"></a>

#### [](#beans-factory-scopes-prototype)1.5.2. 原型作用域

非单例的、原型bean指的是每次请求bean实例时,返回的都是新的对象实例。也就是说，每次注入到另外的bean或者通过调用 `getBean()`方法来获得的bean都是全新的实例。 基于线程安全性的考虑，当bean对象有状态时使用原型作用域，而无状态时则使用单例作用域。

下图说明了Spring原型作用域：:

![prototype](https://github.com/DocsHome/spring-docs/blob/master/pages/images/prototype.png)

（数据访问对象（DAO）通常不配置为原型，因为典型的DAO不具有任何会话状态。我们可以更容易重用单例图的核心。）

用下面的例子来说明Spring的原型作用域:

```xml
<bean id="accountService" class="com.something.DefaultAccountService" scope="prototype"/>
```

与其他作用域相比，Spring不会完整地管理原型bean的生命周期。 Spring容器只会初始化、配置和装载这些bean，然后传递给Client。但是之后就不会再有该原型实例的进一步记录。 也就是说，初始化生命周期回调方法在所有作用域的bean是都会调用的，但是销毁生命周期回调方法在原型bean是不会调用的。所以，客户端代码必须注意清理原型bean以及释放原型bean所持有的资源。 可以通过使用自定义的[bean post-processor](#beans-factory-extension-bpp)（Bean的后置处理器）来让Spring释放掉原型bean所持有的资源。

在某些方面，Spring容器关于原型作用域的bean就是取代了Java的`new` 操作符。 所有的生命周期的控制都由客户端来处理（有关Spring容器中bean的生命周期的详细信息，请参阅[Bean的生命周期](#beans-factory-lifecycle)）。

<a id="beans-factory-scopes-sing-prot-interaction"></a>

#### [](#beans-factory-scopes-sing-prot-interaction)1.5.3. 依赖原型bean的单例bean

当您使用具有依赖于原型bean的单例作用域bean时，请注意在实例化时解析依赖项。 因此，如果将原型bean注入到单例的bean中，则会实例化一个新的原型bean，然后将依赖注入到单例bean中。 这个依赖的原型bean仍然是同一个实例。

但是，假设您希望单例作用域的bean在运行时重复获取原型作用域的bean的新实例。 您不能将原型作用域的bean依赖注入到您的单例bean中， 因为当Spring容器实例化单例bean并解析注入其依赖项时，该注入只发生一次。 如果您需要在运行时多次使用原型bean的新实例，请参阅[方法注入](#beans-factory-method-injection)。

<a id="beans-factory-scopes-other"></a>

#### [](#beans-factory-scopes-other)1.5.4. 请求，会话，应用程序和WebSocket作用域

`request`, `session`, `application`, 和 `websocket`作用域只有在Web中使用Spring的`ApplicationContext`（例如`ClassPathXmlApplicationContext`）的情况下才用得上。 如果在普通的Spring IoC容器，例如ClassPathXmlApplicationContext中使用这些作用域，将会抛出IllegalStateException异常来说明使用了未知的作用域。

<a id="beans-factory-scopes-other-web-configuration"></a>

##### [](#beans-factory-scopes-other-web-configuration)初始化Web的配置

为了能够使用请求 `request`, `session`, `application`, 和`websocket`（Web范围的bean），需要在配置bean之前作一些基础配置。 而对于标准的作用域，例如单例和原型作用域，这种基础配置是不需要的。

如何完成此初始设置取决于您的特定Servlet环境.

例如，如果开发者使用了Spring Web MVC框架，那么每一个请求都会通过Spring的`DispatcherServlet`来处理，那么也无需特殊的设置了。DispatcherServlet和DispatcherPortlet已经包含了相应状态。

如果您使用Servlet 2.5 Web容器，并且在Spring的`DispatcherServlet`之外处理请求（例如，使用JSF或Struts时），则需要注册`org.springframework.web.context.request.RequestContextListener`或者`ServletRequestListener`。 对于Servlet 3.0+，可以使用`WebApplicationInitializer`接口以编程方式完成此操作。 如果需要兼容旧版本容器的话，将以下声明添加到Web应用程序的`web.xml` 文件中:

```xml
<web-app>
    ...
    <listener>
        <listener-class>
            org.springframework.web.context.request.RequestContextListener
        </listener-class>
    </listener>
    ...
</web-app>
```

或者，如果对Listener不是很熟悉，请考虑使用Spring的`RequestContextFilter`。 Filter映射取决于Web应用的配置，因此您必须根据需要进行更改。 以下清单显示了Web应用程序的过滤器部分:

```xml
<web-app>
    ...
    <filter>
        <filter-name>requestContextFilter</filter-name>
        <filter-class>org.springframework.web.filter.RequestContextFilter</filter-class>
    </filter>
    <filter-mapping>
        <filter-name>requestContextFilter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>
    ...
</web-app>
```

`DispatcherServlet`, `RequestContextListener`, and `RequestContextFilter`所做的工作实际上是一样的，都是将request对象请求绑定到服务的 `Thread`上。 这才使bean在之后的调用链上对请求和会话作用域可见。

<a id="beans-factory-scopes-request"></a>

##### [](#beans-factory-scopes-request)Request作用域

参考下面这个XML配置的bean定义:

```xml
<bean id="loginAction" class="com.something.LoginAction" scope="request"/>
```

Spring容器会在每次使用`LoginAction`来处理每个HTTP请求时都会创建新的`LoginAction`实例。也就是说，`LoginAction` bean的作用域是HTTP Request级别的。 开发者可以随意改变实例的状态，因为其他通过`loginAction`请求来创建的实例根本看不到开发者改变的实例状态，所有创建的Bean实例都是根据独立的请求创建的。当请求处理完毕，这个bean也将会销毁。

当使用注解配置或Java配置时，使用`@RequestScope`注解修饰的bean会被设置成request作用域。 以下示例显示了如何执行此操作：

```java
@RequestScope
@Component
public class LoginAction {
    // ...
}
```

kotlin:

```kotlin
@RequestScope
@Component
class LoginAction {
    // ...
}
```

<a id="beans-factory-scopes-session"></a>

##### [](#beans-factory-scopes-session)Session作用域

参考下面XML配置的bean的定义:

```xml
<bean id="userPreferences" class="com.something.UserPreferences" scope="session"/>
```

Spring容器通过在单个HTTP会话的生命周期中使用`UserPreferences` bean定义来创建`UserPreferences` bean的新实例。换言之，`UserPreferences` Bean的作用域是HTTP S`Session`级别的，在request-scoped作用域的bean上， 开发者可以随意的更改实例的状态，同样，其他HTTP `Session`的基本实例在每个`Session`中都会请求userPreferences来创建新的实例，所以，开发者更改bean的状态， 对于其他的Bean仍然是不可见的。当HTTP `Session`被销毁时，根据这个`Session`来创建的bean也将会被销毁。

使用注解配置和Java配置时，使用`@SessionScope` 注解修饰的 bean 会被设置成`session`作用域。

```java
@SessionScope
@Component
public class UserPreferences {
    // ...
}
```

kotlin:

```kotlin
@SessionScope
@Component
class UserPreferences {
    // ...
}
```

<a id="beans-factory-scopes-application"></a>

##### [](#beans-factory-scopes-application)Application作用域

参考下面用XML配置的bean的定义:

```xml
<bean id="appPreferences" class="com.something.AppPreferences" scope="application"/>
```

Spring容器会在整个Web应用内使用到`appPreferences`的时候创建一个新的`AppPreferences`的实例。也就是说，`appPreferences` bean是在`ServletContext` 级别的， 就像普通的`ServletContext` 属性一样。这种作用域在一些程度上来说和Spring的单例作用域是极为相似，但是也有如下不同之处，应用作用域是每个`ServletContext` 中包含一个 而不是每个Spring ApplicationContext中只有一个（某些应用可能包含多个ApplicationContext）。应用作用域仅仅对`ServletContext` 可见，单例bean是对ApplicationContext可见。

当使用注解配置或Java配置时，使用`@ApplicationScope` 注解修饰的bean会被设置成`application`作用域 。以下示例显示了如何执行此操作:

```java
@ApplicationScope
@Component
public class AppPreferences {
    // ...
}
```

kotlin:

```kotlin
@ApplicationScope
@Component
class AppPreferences {
    // ...
}
```

<a id="beans-factory-scopes-other-injection"></a>

##### [](#beans-factory-scopes-other-injection)有作用域bean的依赖

Spring IoC容器不仅仅管理对象（bean）的实例化，同时也负责装配依赖。如果开发者要将一个bean装配到比它作用域更广的bean时（例如HTTP请求返回的bean），那么开发者应当选择注入AOP代理而不是使用带作用域的bean。 也就是说，开发者需要注入代理对象，而这个代理对象既可以找到实际的bean，还能够创建全新的bean。

您还可以在作为单例的作用域的bean之间使用`<aop:scoped-proxy/>`，然后引用通过可序列化的中间代理，从而能够在反序列化时重新获取目标`单例`bean。

当针对原型作用域的bean声明`<aop:scoped-proxy/>`时，每个通过代理的调用都会产生新的目标实例。

此外，作用域代理并不是取得作用域bean的唯一安全方式。 开发者也可以通过简单的声明注入（即构造函数或setter参数或自动装配字段）`ObjectFactory<MyTargetBean>`， 然后允许通过类似`getObject()`的方法调用来获取一些指定的依赖，而不是直接储存依赖的实例。

作为扩展变体，您可以声明`ObjectProvider<MyTargetBean>`，它提供了几个额外的访问变体，包括`getIfAvailable` 和 `getIfUnique`。

JSR-330将这样的变种称为Provider，它使用`Provider<MyTargetBean>` 声明以及相关的 `get()` 方法来尝试获取每一个配置。 有关JSR-330整体的更多详细信息，[请参看此处](#beans-standard-annotations)。

以下示例中的配置只有一行，但了解“为什么”以及它背后的“如何”非常重要：:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:aop="http://www.springframework.org/schema/aop"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/aop
        https://www.springframework.org/schema/aop/spring-aop.xsd">

    <!-- an HTTP Session-scoped bean exposed as a proxy -->
    <bean id="userPreferences" class="com.something.UserPreferences" scope="session">
        <!-- instructs the container to proxy the surrounding bean -->
        <aop:scoped-proxy/> (1)
    </bean>

    <!-- a singleton-scoped bean injected with a proxy to the above bean -->
    <bean id="userService" class="com.something.SimpleUserService">
        <!-- a reference to the proxied userPreferences bean -->
        <property name="userPreferences" ref="userPreferences"/>
    </bean>
</beans>
```

**1**、定义代理的行。

要创建这样的一个代理，只需要在带作用域的bean定义中添加子节点`<aop:scoped-proxy/>`即可（具体查看[选择创建代理的类型](#beans-factory-scopes-other-injection-proxies)和 [基于XML Schema的配置](#xsd-schemas)）。为什么在`request`, `session`和自定义作用域级别范围内的bean定义需要`<aop:scoped-proxy/>`， 考虑以下单例bean定义，并将其与您需要为上述范围定义的内容进行对比（请注意，以下`userPreferences`bean定义不完整）:

```xml
<bean id="userPreferences" class="com.something.UserPreferences" scope="session"/>

<bean id="userManager" class="com.something.UserManager">
    <property name="userPreferences" ref="userPreferences"/>
</bean>
```

在上面的例子中，单例bean（`userManager`）注入了注入了HTTP `Session`级别的`userPreferences`依赖。 显然， 问题就是`userPreferences`在Spring容器中只会实例化一次。它的依赖项（在这种情况下只有一个，`userPreferences`）也只注入一次。 这意味着`userManager` 每次使用的是完全相同的`userPreferences`对象（即最初注入它的对象）进行操作。

这不是将短周期作用域bean注入到长周期作用域bean时所需的行为，例如将HTTP `Session`级别的作用域bean作为依赖注入到单例bean中。相反，开发者需要一个 `userManager`对象， 而在HTTP `Session`的生命周期中，开发者需要一个特定于HTTP Session的 userPreferences 对象。因此，容器创建一个对象，该对象公开与UserPreferences类（理想情况下为`UserPreferences`实例的对象） 完全相同的公共接口，该对象可以从作用域机制（HTTP Request、`Session`等）中获取真实的`UserPreferences`对象。容器将这个代理对象注入到`userManager`中， 而不知道这个`UserPreferences`引用是一个代理。在这个例子中，当一个UserManager实例在依赖注入的UserPreferences对象上调用一个方法时， 它实际上是在调用代理的方法，再由代理从HTTP `Session`（本例）获取真实的`UserPreferences`对象，并将方法调用委托给检索到的实际`UserPreferences`对象。

因此，在将`request-` and `session-scoped`的bean来作为依赖时，您需要以下（正确和完整）配置，如以下示例所示： 所以当开发者希望能够正确的使用配置请求、会话或者全局会话级别的bean来作为依赖时，需要进行如下类似的配置。

```xml
<bean id="userPreferences" class="com.something.UserPreferences" scope="session">
    <aop:scoped-proxy/>
</bean>

<bean id="userManager" class="com.something.UserManager">
    <property name="userPreferences" ref="userPreferences"/>
</bean>
```

<a id="beans-factory-scopes-other-injection-proxies"></a>

###### [](#beans-factory-scopes-other-injection-proxies)选择要创建的代理类型

默认情况下，当Spring容器为使用`<aop:scoped-proxy/>` 元素标记的bean创建代理时，将创建基于CGLIB的类代理。

CGLIB代理只拦截公共方法调用！ 不要在这样的代理上调用非公共方法。 它们不会委托给实际的作用域目标对象。

或者，您可以通过为`<aop:scoped-proxy/>`元素的`proxy-target-class` 属性的值指定`false`来配置Spring容器， 以便为此类作用域bean创建基于JDK接口的标准代理。 使用基于接口的JDK代理意味着开发者无需引入第三方库即可完成代理。 但是，这也意味着带作用域的bean需要额外实现一个接口，而依赖是从这些接口来获取的。 以下示例显示基于接口的代理：

```xml
<!-- DefaultUserPreferences implements the UserPreferences interface -->
<bean id="userPreferences" class="com.stuff.DefaultUserPreferences" scope="session">
    <aop:scoped-proxy proxy-target-class="false"/>
</bean>

<bean id="userManager" class="com.stuff.UserManager">
    <property name="userPreferences" ref="userPreferences"/>
</bean>
```

有关选择基于类或基于接口的代理的更多详细信息，请参阅[代理机制](#aop-proxying)。

<a id="beans-factory-scopes-custom"></a>

#### [](#beans-factory-scopes-custom)1.5.5. 自定义作用域

bean的作用域机制是可扩展的，开发者可以自定义作用域，甚至重新定义已经存在的作用域，但是Spring团队不推荐这样做，而且开发者也不能重写`singleton` 和 `prototype`作用域。

<a id="beans-factory-scopes-custom-creating"></a>

##### [](#beans-factory-scopes-custom-creating)创建自定义作用域

为了能够使Spring可以管理开发者定义的作用域，开发者需要实现`org.springframework.beans.factory.config.Scope`。如何实现自定义的作用域， 可以参考Spring框架的一些实现或者有关[`Scope`](https://docs.spring.io/spring-framework/docs/5.1.3.BUILD-SNAPSHOT/javadoc-api/org/springframework/beans/factory/config/Scope.html) 的javadoc

`Scope`接口有四个方法用于操作对象,例如获取、移除或销毁等操作。

例如，传入Session作用域该方法将会返回一个 session-scoped的bean（如果它不存在，那么将会返回绑定session作用域的新实例）。下面的方法返回相应作用域的对象：

```java
Object get(String name, ObjectFactory objectFactory)
```

```kotlin
fun get(name: String, objectFactory: ObjectFactory<*>): Any
```

下面的方法将从相应的作用域中移除对象。同样，以会话为例，该函数会删除会话作用域的Bean。删除的对象会作为返回值返回，当无法找到对象时将返回null。 以下方法从相应作用域中删除对象：:

```java
Object remove(String name)
```

```kotlin
fun remove(name: String): Any
```

以下方法注册范围在销毁时或在Scope中的指定对象被销毁时应该执行的回调:

```java
void registerDestructionCallback(String name, Runnable destructionCallback)
```

```kotlin
fun registerDestructionCallback(name: String, destructionCallback: Runnable)
```

有关销毁回调的更多信息，请参看[javadoc](https://docs.spring.io/spring-framework/docs/5.1.3.BUILD-SNAPSHOT/javadoc-api/org/springframework/beans/factory/config/Scope.html#registerDestructionCallback)或Spring的Scope实现部分。

下面的方法获取相应作用域的区分标识符:

```java
String getConversationId()
```

```kotlin
fun getConversationId(): String
```

这个标识符在不同的作用域中是不同的。例如对于会话作用域，这个标识符就是会话的标识符。.

<a id="beans-factory-scopes-custom-using"></a>

##### [](#beans-factory-scopes-custom-using)使用自定义作用域

在实现了自定义`作用域`后，开发者还需要让Spring容器能够识别发现所创建的新`作用域`。下面的方法就是在Spring容器中用来注册新`Scope`的:

```java
void registerScope(String scopeName, Scope scope);
```

```kotlin
fun registerScope(scopeName: String, scope: Scope)
```

这个方法是在`ConfigurableBeanFactory`的接口中声明的，可以用在多数的`ApplicationContext`实现，也可以通过 `BeanFactory`属性来调用。

`registerScope(..)`方法的第一个参数是相关`作用域`的唯一名称。举例来说，Spring容器中的单例和原型就以它本身来命名。 第二个参数就是开发者希望注册和使用的自定义`Scope`实现的具有对象 T

假定开发者实现了自定义`Scope`，然后可以按如下步骤来注册。

下一个示例使用SimpleThreadScope，这个例子在Spring中是有实现的，但没有默认注册。 您自定义的作用域也可以通过如下的方式来注册。

```java
Scope threadScope = new SimpleThreadScope();
beanFactory.registerScope("thread", threadScope);
```

```kotlin
val threadScope = SimpleThreadScope()
beanFactory.registerScope("thread", threadScope)
```

然后，您可以创建符合自定义Scope的作用域规则的bean定义，如下所示：

```xml
<bean id="..." class="..." scope="thread">
```

在自定义作用域中，开发者也不限于仅仅通过编程的方式来注册作用域，还可以通过配置`CustomScopeConfigurer` 类来实现。如以下示例所示：:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:aop="http://www.springframework.org/schema/aop"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/aop
        http://www.springframework.org/schema/aop/spring-aop.xsd">

    <bean class="org.springframework.beans.factory.config.CustomScopeConfigurer">
        <property name="scopes">
            <map>
                <entry key="thread">
                    <bean class="org.springframework.context.support.SimpleThreadScope"/>
                </entry>
            </map>
        </property>
    </bean>

    <bean id="thing2" class="x.y.Thing2" scope="thread">
        <property name="name" value="Rick"/>
        <aop:scoped-proxy/>
    </bean>

    <bean id="thing1" class="x.y.Thing1">
        <property name="thing2" ref="thing2"/>
    </bean>

</beans>
```

在`FactoryBean`实现中添加了`<aop:scoped-proxy/>`元素时，它是工厂bean本身的作用域，而不是从`getObject()`方法返回的对象。
