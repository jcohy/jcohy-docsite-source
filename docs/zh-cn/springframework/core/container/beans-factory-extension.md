---
title: 容器的扩展点
keywords: keywords: docs，jcohy-docs，spring,容器的扩展点
description: Spring  Framework 中文文档 》 容器的扩展点
---

# Spring  Framework 中文文档
### [](#beans-factory-extension)1.8. 容器的扩展点

通常，应用程序开发者无需继承`ApplicationContext`的实现类。相反，Spring IoC容器可以通过插入特殊的集成接口实现进行扩展。接下来的几节将介绍这些集成接口。

<a id="beans-factory-extension-bpp"></a>

#### [](#beans-factory-extension-bpp)1.8.1. 使用`BeanPostProcessor`自定义Bean

`BeanPostProcessor`接口定义了可以实现的回调方法，以提供您自己的（或覆盖容器的默认）实例化逻辑，依赖关系解析逻辑等。 如果要在Spring容器完成实例化，配置和初始化bean之后实现某些自定义逻辑，则可以插入一个或多个自定义`BeanPostProcessor`实现。

您可以配置多个`BeanPostProcessor` 实例，并且可以通过设置`order`属性来控制这些 `BeanPostProcessor` 实例的执行顺序。 仅当`BeanPostProcessor`实现 `Ordered`接口时，才能设置此属性。如果编写自己的`BeanPostProcessor`，则应考虑实现Ordered接口。 有关更多详细信息， 请参阅[`BeanPostProcessor`](https://docs.spring.io/spring-framework/docs/5.1.3.BUILD-SNAPSHOT/javadoc-api/org/springframework/beans/factory/config/BeanPostProcessor.html) 和 [`Ordered`](https://docs.spring.io/spring-framework/docs/5.1.3.BUILD-SNAPSHOT/javadoc-api/org/springframework/core/Ordered.html)的javadoc。 另请参阅有关[`BeanPostProcessor` 实例](#beans-factory-programmatically-registering-beanpostprocessors)的编程注册的说明。

`BeanPostProcessor`实例在bean（或对象）实例上运行。 也就是说，Spring IoC容器实例化一个bean实例，然后才能用`BeanPostProcessor` 对这个实例进行处理。

`BeanPostProcessor`会在整个容器内起作用，所有它仅仅与正在使用的容器相关。如果在一个容器中定义了`BeanPostProcessor`，那么它只会处理那个容器中的bean。 换句话说，在一个容器中定义的bean不会被另一个容器定义的`BeanPostProcessor`处理，即使这两个容器都是同一层次结构的一部分。

要更改实际的bean定义（即定义bean的蓝图），您需要使用`BeanFactoryPostProcessor`，使用BeanFactoryPostProcessor自定义配置元数据。 [使用 `BeanFactoryPostProcessor`自定义配置元数据](#beans-factory-extension-factory-postprocessors).

`org.springframework.beans.factory.config.BeanPostProcessor`接口由两个回调方法组成，当一个类被注册为容器的后置处理器时，对于容器创建的每个bean实例， 后置处理器都会在容器初始化方法（如`InitializingBean.afterPropertiesSet()`之前和容器声明的`init`方法）以及任何bean初始化回调之后被调用。后置处理器可以对bean实例执行任何操作， 包括完全忽略回调。bean后置处理器，通常会检查回调接口或者使用代理包装bean。一些Spring AOP基础架构类为了提供包装好的代理逻辑，会被实现为bean后置处理器。

`ApplicationContext`会自动地检测所有定义在配置元文件中，并实现了`BeanPostProcessor` 接口的bean。`ApplicationContext`会注册这些beans为后置处理器， 使他们可以在bean创建完成之后被调用。bean后置处理器可以像其他bean一样部署到容器中。

当在配置类上使用 `@Bean` 工厂方法声明`BeanPostProcessor`时，工厂方法返回的类型应该是实现类自身。，或至少也是`org.springframework.beans.factory.config.BeanPostProcessor`接口， 要清楚地表明这个bean的后置处理器的本质特点。否则，在它完全创建之前，`ApplicationContext`将不能通过类型自动探测它。由于`BeanPostProcessor`在早期就需要被实例化， 以适应上下文中其他bean的实例化，因此这个早期的类型检查是至关重要的。

以编程方式注册`BeanPostProcessor`实例，虽然`BeanPostProcessor`注册的推荐方法是通过`ApplicationContext`自动检测（如前所述），但您可以以编程的方式使用`ConfigurableBeanFactory`的`addBeanPostProcessor`方法进行注册。 这对于在注册之前需要对条件逻辑进行评估，或者是在继承层次的上下文之间复制bean的后置处理器中是有很有用的。 但请注意，以编程方式添加的`BeanPostProcessor`实例不遵循`Ordered`接口。这里，注册顺序决定了执行的顺序。 另请注意，以编程方式注册的`BeanPostProcessor`实例始终在通过自动检测注册的实例之前处理，而不管任何显式排序。

`BeanPostProcessor` 实例 and AOP 自动代理

实现`BeanPostProcessor` 接口的类是特殊的，容器会对它们进行不同的处理。所有`BeanPostProcessor` 和他们直接引用的beans都会在容器启动的时候被实例化， 并作为`ApplicationContext`特殊启动阶段的一部分。接着，所有的`BeanPostProcessor` 都会以一个有序的方式进行注册，并应用于容器中的所有bean。 因为AOP自动代理本身被实现为`BeanPostProcessor`，这个`BeanPostProcessor`和它直接应用的beans都不适合进行自动代理，因此也就无法在它们中织入切面。

对于所有这样的bean，您应该看到一条信息性日志消息: `Bean someBean is not eligible for getting processed by all BeanPostProcessor interfaces (for example: not eligible for auto-proxying)`.

如果你使用自动装配或 `@Resource`（可能会回退到自动装配）将Bean连接到`BeanPostProcessor`中，Spring可能会在搜索类型匹配的依赖关系候选时访问到意外类型的bean； 因此，对它们不适合进行自动代理，或者对其他类型的bean进行后置处理。例如，如果有一个使用 `@Resource` 注解的依赖项，其中字段或setter名称不直接对应于bean的声明名称而且没有使用name属性， 则Spring会访问其他bean以按类型匹配它们。

以下示例显示如何在`ApplicationContext`中编写，注册和使用`BeanPostProcessor`实例。

<a id="beans-factory-extension-bpp-examples-hw"></a>

##### [](#beans-factory-extension-bpp-examples-hw)示例: Hello World, `BeanPostProcessor`-style

第一个例子说明了基本用法。 该示例显示了一个自定义`BeanPostProcessor`实现，该实现在容器创建时调用每个bean的 `toString()` 方法，并将生成的字符串输出到系统控制台。

以下清单显示了自定义`BeanPostProcessor` 实现类定义:

```java
package scripting;

import org.springframework.beans.factory.config.BeanPostProcessor;

public class InstantiationTracingBeanPostProcessor implements BeanPostProcessor {

    // simply return the instantiated bean as-is
    public Object postProcessBeforeInitialization(Object bean, String beanName) {
        return bean; // we could potentially return any object reference here...
    }

    public Object postProcessAfterInitialization(Object bean, String beanName) {
        System.out.println("Bean '" + beanName + "' created : " + bean.toString());
        return bean;
    }
}
```

```kotlin
import org.springframework.beans.factory.config.BeanPostProcessor

class InstantiationTracingBeanPostProcessor : BeanPostProcessor {

    // simply return the instantiated bean as-is
    override fun postProcessBeforeInitialization(bean: Any, beanName: String): Any? {
        return bean // we could potentially return any object reference here...
    }

    override fun postProcessAfterInitialization(bean: Any, beanName: String): Any? {
        println("Bean '$beanName' created : $bean")
        return bean
    }
}
```

以下beans元素使用`InstantiationTracingBeanPostProcessor`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:lang="http://www.springframework.org/schema/lang"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/lang
        https://www.springframework.org/schema/lang/spring-lang.xsd">

    <lang:groovy id="messenger"
            script-source="classpath:org/springframework/scripting/groovy/Messenger.groovy">
        <lang:property name="message" value="Fiona Apple Is Just So Dreamy."/>
    </lang:groovy>

    <!--
    when the above bean (messenger) is instantiated, this custom
    BeanPostProcessor implementation will output the fact to the system console
    -->
    <bean class="scripting.InstantiationTracingBeanPostProcessor"/>

</beans>
```

注意`InstantiationTracingBeanPostProcessor`是如何定义的，它甚至没有名字，因为它是一个bean，所以它可以像任何其他bean一样进行依赖注入 （前面的配置还定义了一个由Groovy脚本支持的bean。在[动态语言支持](https://github.com/DocsHome/spring-docs/blob/master/pages/languages/languages.md#dynamic-language)一章中详细介绍了Spring动态语言支持）。

下面简单的Java应用执行了前面代码和配置:

```java
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.scripting.Messenger;

public final class Boot {

    public static void main(final String[] args) throws Exception {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("scripting/beans.xml");
        Messenger messenger = (Messenger) ctx.getBean("messenger");
        System.out.println(messenger);
    }

}
```

```kotlin
import org.springframework.beans.factory.getBean

fun main() {
    val ctx = ClassPathXmlApplicationContext("scripting/beans.xml")
    val messenger = ctx.getBean<Messenger>("messenger")
    println(messenger)
}
```

上述应用程序的输出类似于以下内容:

```
Bean 'messenger' created :  org.springframework.scripting.groovy.GroovyMessenger@272961
org.springframework.scripting.groovy.GroovyMessenger@272961
```

<a id="beans-factory-extension-bpp-examples-rabpp"></a>

##### [](#beans-factory-extension-bpp-examples-rabpp)示例: The `RequiredAnnotationBeanPostProcessor`

自定义`BeanPostProcessor`实现与回调接口或注解配合使用，是一种常见的扩展Spring IoC容器手段，一个例子就是`RequiredAnnotationBeanPostProcessor`，这是`BeanPostProcessor`实现。 它确保用（任意）注解标记的bean上的JavaBean属性实际上（配置为）依赖注入值。

<a id="beans-factory-extension-factory-postprocessors"></a>

#### [](#beans-factory-extension-factory-postprocessors)1.8.2. 使用`BeanFactoryPostProcessor`自定义元数据配置

下一个我们要关注的扩展点是`org.springframework.beans.factory.config.BeanFactoryPostProcessor`。这个接口的语义与`BeanPostProcessor`类似， 但有一处不同，`BeanFactoryPostProcessor`操作bean的元数据配置。也就是说，也就是说，Spring IoC容器允许`BeanFactoryPostProcessor`读取配置元数据， 并可能在容器实例化除`BeanFactoryPostProcessor`实例之外的任何bean之前更改它。

您可以配置多个`BeanFactoryPostProcessor`实例，并且可以通过设置`order`属性来控制这些`BeanFactoryPostProcessor`实例的运行顺序（`BeanFactoryPostProcessor`必须实现了`Ordered`接口才能设置这个属性）。 如果编写自己的BeanFactoryPostProcessor，则应考虑实现Ordered接口。 有关更多详细信息， 请参阅[`BeanFactoryPostProcessor`](https://docs.spring.io/spring-framework/docs/5.1.3.BUILD-SNAPSHOT/javadoc-api/org/springframework/beans/factory/config/BeanFactoryPostProcessor.html) 和 [`Ordered`](https://docs.spring.io/spring-framework/docs/5.1.3.BUILD-SNAPSHOT/javadoc-api/org/springframework/core/Ordered.html) 接口的javadoc.

如果想修改实际的bean实例（也就是说，从元数据配置中创建的对象）那么需要使用`BeanPostProcessor`（前面在使用[`BeanPostProcessor`自定义Bean](#beans-factory-extension-bpp)中进行了描述）来替代。 在`BeanFactoryPostProcessor`（例如使用`BeanFactory.getBean()`）中使用这些bean的实例虽然在技术上是可行的，但这么来做会将bean过早实例化， 这违反了标准的容器生命周期。同时也会引发一些副作用，例如绕过bean的后置处理。

`BeanFactoryPostProcessor`会在整个容器内起作用，所有它仅仅与正在使用的容器相关。如果在一个容器中定义了`BeanFactoryPostProcessor`， 那么它只会处理那个容器中的bean。 换句话说，在一个容器中定义的bean不会被另一个容器定义的`BeanFactoryPostProcessor`处理，即使这两个容器都是同一层次结构的一部分。

bean工厂后置处理器在`ApplicationContext`中声明时自动执行，这样就可以对定义在容器中的元数据配置进行修改。 Spring包含许多预定义的bean工厂后处理器， 例如`PropertyOverrideConfigurer` 和`PropertySourcesPlaceholderConfigurer`。 您还可以使用自定义`BeanFactoryPostProcessor`。 例如，注册自定义属性编辑器。 .

`ApplicationContext` 自动检测部署到其中的任何实现`BeanFactoryPostProcessor`接口的bean。 它在适当的时候使用这些bean作为bean工厂后置处理器。 你可以部署这些后置处理器为你想用的任意其它bean。

注意，和`BeanPostProcessor`一样，通常不应该配置`BeanFactoryPostProcessor`来进行延迟初始化。如果没有其它bean引用`Bean(Factory)PostProcessor`， 那么后置处理器就不会被初始化。因此，标记它为延迟初始化就会被忽略，，即便你在`<beans />`元素声明中设置`default-lazy-init`=true属性，`Bean(Factory)PostProcessor`也会提前初始化bean。

<a id="beans-factory-PropertySourcesPlaceholderConfigurer"></a>

##### [](#beans-factory-PropertySourcesPlaceholderConfigurer示例: 类名替换`PropertySourcesPlaceholderConfigurer`

您可以使用`PropertySourcesPlaceholderConfigurer`通过使用标准Java `Properties`格式从单独文件中的bean定义外部化属性值。 这样做可以使部署应用程序的人能够定制特定于环境的属性，如数据库URL和密码，而无需修改容器的主XML定义文件或文件的复杂性或风险。

考虑以下这个基于XML的元数据配置代码片段，这里的DataSource使用了占位符来定义:

```xml
<bean class="org.springframework.context.support.PropertySourcesPlaceholderConfigurer">
    <property name="locations" value="classpath:com/something/jdbc.properties"/>
</bean>

<bean id="dataSource" destroy-method="close"
        class="org.apache.commons.dbcp.BasicDataSource">
    <property name="driverClassName" value="${jdbc.driverClassName}"/>
    <property name="url" value="${jdbc.url}"/>
    <property name="username" value="${jdbc.username}"/>
    <property name="password" value="${jdbc.password}"/>
</bean>
```

该示例显示了从外部属性文件配置的属性。在运行时，`PropertySourcesPlaceholderConfigurer`应用于替换DataSource的某些属性的元数据。 要替换的值被指定为$ {property-name}形式的占位符，它遵循Ant和log4j以及JSP EL样式。

而真正的值是来自于标准的Java `Properties`格式的文件:

```
jdbc.driverClassName=org.hsqldb.jdbcDriver
jdbc.url=jdbc:hsqldb:hsql://production:9002
jdbc.username=sa
jdbc.password=root
```

在上面的例子中，`${jdbc.username}` 字符串在运行时将替换为值'sa'，并且同样适用于与属性文件中的键匹配的其他占位符值。 `PropertySourcesPlaceholderConfigurer`检查bean定义的大多数属性和属性中的占位符。 此外，您可以自定义占位符前缀和后缀。

使用Spring 2.5中引入的`context` 命名空间，您可以使用专用配置元素配置属性占位符。 您可以在`location`属性中以逗号分隔列表的形式提供一个或多个位置，如以下示例所示：

```xml
<context:property-placeholder location="classpath:com/something/jdbc.properties"/>
```

`PropertySourcesPlaceholderConfigurer`不仅在您指定的属性文件中查找属性。 默认情况下，如果它在指定的属性文件中找不到属性，则会检查Spring Environment属性和常规Java System属性。

你可以使用`PropertySourcesPlaceholderConfigurer`来替换类名，当开发者在运行时需要选择某个特定的实现类时，这是很有用的。例如

```xml
<bean class="org.springframework.beans.factory.config.PropertySourcesPlaceholderConfigurer">
    <property name="locations">
        <value>classpath:com/something/strategy.properties</value>
    </property>
    <property name="properties">
        <value>custom.strategy.class=com.something.DefaultStrategy</value>
    </property>
</bean>

<bean id="serviceStrategy" class="${custom.strategy.class}"/>
```

如果在运行时无法将类解析为有效类，则在即将创建bean时，bean的解析将失败，这是 `ApplicationContext`在对非延迟初始化bean的`preInstantiateSingletons()`阶段发生的事。

<a id="beans-factory-overrideconfigurer"></a>

##### [](#beans-factory-overrideconfigurer)示例: `PropertyOverrideConfigurer`

`PropertyOverrideConfigurer`, 另外一种bean工厂后置处理器，类似于`PropertyPlaceholderConfigurer`，但与后者不同的是：对于所有的bean属性，原始定义可以有默认值或也可能没有值。 如果一个`Properties`覆盖文件没有配置特定的bean属性，则就会使用默认的上下文定义

注意，bean定义是不知道是否被覆盖的，所以从XML定义文件中不能马上看到那个配置正在被使用。在拥有多个`PropertyOverrideConfigurer` 实例的情况下，为相同bean的属性定义不同的值时，基于覆盖机制只会有最后一个生效。

属性文件配置行采用以下格式:

```
beanName.property=value
```

例如:

```
dataSource.driverClassName=com.mysql.jdbc.Driver
dataSource.url=jdbc:mysql:mydb
```

这个示例文件可以和容器定义一起使用，该容器定义包含一个名为`dataSource`的bean，该bean具有 `driver`和`url`属性

复合属性名称也是被支持的，只要被重写的最后一个属性以外的路径中每个组件都已经是非空时（假设由构造方法初始化）。 在下面的示例中，`tom` bean的`fred`属性的 `bob`属性的`sammy`属性设置值为`123`：

```
tom.fred.bob.sammy=123
```

指定的覆盖值通常是文字值，它们不会被转换成bean的引用。这个约定也适用于当XML中的bean定义的原始值指定了bean引用时。

使用Spring 2.5中引入的`context`命名空间，可以使用专用配置元素配置属性覆盖，如以下示例所示：

    <context:property-override location="classpath:override.properties"/>

<a id="beans-factory-extension-factorybean"></a>

#### [](#beans-factory-extension-factorybean)1.8.3. 使用`FactoryBean`自定义初始化逻辑

为自己工厂的对象实现`org.springframework.beans.factory.FactoryBean`接口。

`FactoryBean`接口就是Spring IoC容器实例化逻辑的可插拔点，如果你的初始化代码非常复杂，那么相对于（潜在地）大量详细的XML而言，最好是使用Java语言来表达。 你可以创建自定义的`FactoryBean`，在该类中编写复杂的初始化代码。然后将自定义的`FactoryBean`插入到容器中。

`FactoryBean`接口提供下面三个方法

*   `Object getObject()`: 返回这个工厂创建的对象实例。这个实例可能是共享的，这取决于这个工厂返回的是单例还是原型实例。

*   `boolean isSingleton()`: 如果`FactoryBean`返回单例，那么这个方法就返回`true`，否则返回`false`。

*   `Class getObjectType()`: 返回由`getObject()`方法返回的对象类型，如果事先不知道的类型则会返回null。


Spring框架大量地使用了`FactoryBean` 的概念和接口，`FactoryBean` 接口的50多个实现都随着Spring一同提供。

当开发者需要向容器请求一个真实的`FactoryBean`实例（而不是它生产的bean）时，调用 `ApplicationContext`的`getBean()`方法时在bean的id之前需要添加连字符（&） 所以对于一个给定id为myBean的`FactoryBean`，调用容器的`getBean("myBean")`方法返回的是FactoryBean的代理，而调用`getBean("&myBean")`方法则返回FactoryBean实例本身
