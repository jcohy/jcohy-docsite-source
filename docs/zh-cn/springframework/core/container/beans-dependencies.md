---
title: 依赖
keywords: keywords: docs，jcohy-docs，spring,依赖
description: Spring  Framework 中文文档 》 依赖
---

# Spring  Framework 中文文档
### [](#beans-dependencies)1.4. 依赖

一般情况下企业应用不会只有一个对象（Spring Bean），甚至最简单的应用都需要多个对象协同工作。下一节将解释如何从定义单个Bean到让多个Bean协同工作。

<a id="beans-factory-collaborators"></a>

#### [](#beans-factory-collaborators)1.4.1. 依赖注入

依赖注入是让对象只通过构造参数、工厂方法的参数或者配置的属性来定义他们的依赖的过程。这些依赖也是其他对象所需要协同工作的对象， 容器会在创建Bean的时候注入这些依赖。整个过程完全反转了由Bean自己控制实例化或者依赖引用，所以这个过程也称之为“控制反转”

当使用了依赖注入的特性以后，会让开发者更容易管理和解耦对象之间的依赖，使代码变得更加简单。对象之间不再关注依赖，也不需要知道依赖类的位置。如此一来，开发的类更易于测试 尤其是当开发者的依赖是接口或者抽象类的情况时，开发者可以轻易地在单元测试中mock对象。

依赖注入主要使用两种方式，一种是[基于构造函数的注入](#beans-constructor-injection)，另一种的[基于Setter方法的依赖注入](#beans-setter-injection)。

<a id="beans-constructor-injection"></a>

##### [](#beans-constructor-injection)基于构造函数的依赖注入

基于构造函数的依赖注入是由IoC容器来调用类的构造函数，构造函数的参数代表这个Bean所依赖的对象。构造函数的依赖注入与调用带参数的静态工厂方法基本一样。 调用具有特定参数的静态工厂方法来构造bean几乎是等效的，本讨论同样处理构造函数和静态工厂方法的参数。下面的例子展示了一个通过构造函数来实现依赖注入的类。:

```java
public class SimpleMovieLister {

    // the SimpleMovieLister has a dependency on a MovieFinder
    private MovieFinder movieFinder;

    // a constructor so that the Spring container can inject a MovieFinder
    public SimpleMovieLister(MovieFinder movieFinder) {
        this.movieFinder = movieFinder;
    }

    // business logic that actually uses the injected MovieFinder is omitted...
}
```

kotlin:

```kotlin
// a constructor so that the Spring container can inject a MovieFinder
class SimpleMovieLister(private val movieFinder: MovieFinder) {
    // business logic that actually uses the injected MovieFinder is omitted...
}
```

请注意，这个类没有什么特别之处。 它是一个POJO，它不依赖于容器特定的接口，基类或注解。

<a id="beans-factory-ctor-arguments-resolution"></a>

###### [](#beans-factory-ctor-arguments-resolution)解析构造器参数

构造函数的参数解析是通过参数的类型来匹配的。如果在Bean的构造函数参数不存在歧义，那么构造器参数的顺序也就是就是这些参数实例化以及装载的顺序。参考如下代码：

```java
package x.y;

public class ThingOne {

    public ThingOne(ThingTwo thingTwo, ThingThree thingThree) {
        // ...
    }
}
```

kotlin:

```kotlin
package x.y

class ThingOne(thingTwo: ThingTwo, thingThree: ThingThree)
```

假设`ThingTwo`和`ThingThree`类与继承无关，也没有什么歧义。下面的配置完全可以工作正常。开发者无需再到`<constructor-arg/>`元素中指定构造函数参数的index或type

```xml
<beans>
    <bean id="beanOne" class="x.y.ThingOne">
        <constructor-arg ref="thingTwo"/>
        <constructor-arg ref="thingThree"/>
    </bean>

    <bean id="beanTwo" class="x.y.ThingTwo"/>

    <bean id="beanThree" class="x.y.ThingThree"/>
</beans>
```

当引用另一个bean时，如果类型是已知的，匹配就会工作正常（与前面的示例一样）。当使用简单类型的时候（例如`<value>true</value>`）， Spring IoC容器无法判断值的类型，所以也是无法匹配的，考虑代码：

```java
package examples;

public class ExampleBean {

    // Number of years to calculate the Ultimate Answer
    private int years;

    // The Answer to Life, the Universe, and Everything
    private String ultimateAnswer;

    public ExampleBean(int years, String ultimateAnswer) {
        this.years = years;
        this.ultimateAnswer = ultimateAnswer;
    }
}
```

kotlin:

```kotlin
package examples

class ExampleBean(
    private val years: Int, // Number of years to calculate the Ultimate Answer
    private val ultimateAnswer: String// The Answer to Life, the Universe, and Everything
)
```

构造函数参数类型匹配

在前面的场景中，如果使用 type 属性显式指定构造函数参数的类型，则容器可以使用与简单类型的类型匹配。如下例所示：

```xml
<bean id="exampleBean" class="examples.ExampleBean">
    <constructor-arg type="int" value="7500000"/>
    <constructor-arg type="java.lang.String" value="42"/>
</bean>
```

构造函数参数索引

您可以使用`index`属性显式指定构造函数参数的索引，如以下示例所示：

```xml
<bean id="exampleBean" class="examples.ExampleBean">
    <constructor-arg index="0" value="7500000"/>
    <constructor-arg index="1" value="42"/>
</bean>
```

除了解决多个简单值的歧义之外，指定索引还可以解决构造函数具有相同类型的两个参数的歧义。

index 从0开始。

构造函数参数名称

您还可以使用构造函数参数名称消除歧义，如以下示例所示：:

```xml
<bean id="exampleBean" class="examples.ExampleBean">
    <constructor-arg name="years" value="7500000"/>
    <constructor-arg name="ultimateAnswer" value="42"/>
</bean>
```

需要注意的是，解析这个配置的代码必须启用了调试标记来编译，这样Spring才可以从构造函数查找参数名称。开发者也可以使用[@ConstructorProperties](https://download.oracle.com/javase/6/docs/api/java/beans/ConstructorProperties.html)注解来显式声明构造函数的名称。 例如下面代码:

```java
package examples;

public class ExampleBean {

    // Fields omitted

    @ConstructorProperties({"years", "ultimateAnswer"})
    public ExampleBean(int years, String ultimateAnswer) {
        this.years = years;
        this.ultimateAnswer = ultimateAnswer;
    }
}
```

kotlin:

```kotlin
package examples

class ExampleBean
@ConstructorProperties("years", "ultimateAnswer")
constructor(val years: Int, val ultimateAnswer: String)
```

<a id="beans-setter-injection"></a>

##### [](#beans-setter-injection)基于setter方法的依赖注入

基于setter函数的依赖注入是让容器调用拥有Bean的无参构造函数，或者`无参静态工厂方法`，然后再来调用setter方法来实现依赖注入。

下面的例子展示了使用setter方法进行的依赖注入的过程。其中类对象只是简单的POJO，它不依赖于容器特定的接口，基类或注解。

```java
public class SimpleMovieLister {

    // the SimpleMovieLister has a dependency on the MovieFinder
    private MovieFinder movieFinder;

    // a setter method so that the Spring container can inject a MovieFinder
    public void setMovieFinder(MovieFinder movieFinder) {
        this.movieFinder = movieFinder;
    }

    // business logic that actually uses the injected MovieFinder is omitted...
}
```

kotlin:

```kotlin
class SimpleMovieLister {

    // a late-initialized property so that the Spring container can inject a MovieFinder
    lateinit var movieFinder: MovieFinder

    // business logic that actually uses the injected MovieFinder is omitted...
}
```

`ApplicationContext`所管理Bean同时支持基于构造函数和基于setter方法的依赖注入，同时也支持使用setter方法在通过构造函数注入依赖之后再次注入依赖。 开发者在`BeanDefinition`中可以使用`PropertyEditor`实例来自由选择注入方式。然而，大多数的开发者并不直接使用这些类，而是更喜欢使用XML配置来进行bean定义， 或者基于注解的组件（例如使用 `@Component`,`@Controller`等），或者在配置了`@Configuration`的类上面使用`@Bean`的方法。 然后，这些源在内部转换为 `BeanDefinition`的实例，并用于加载整个Spring IoC容器实例。

如何选择基于构造器和基于setter方法?

因为开发者可以混用两种依赖注入方式，两种方式用于处理不同的情况：必要的依赖通常通过构造函数注入，而可选的依赖则通过setter方法注入。其中，在setter方法上添加[@Required](#beans-required-annotation) 注解可用于构造必要的依赖。但是，最好使用带有参数验证的构造函数注入。

Spring团队推荐使用基于构造函数的注入，因为这种方式会促使开发者将组件开发成不可变对象并且确保注入的依赖不为`null`。另外，基于构造函数的注入的组件被客户端调用的时候也已经是完全构造好的 。当然，从另一方面来说，过多的构造函数参数也是非常糟糕的代码方式，这种方式说明类附带了太多的功能，最好重构将不同职能分离。

基于setter的注入只用于可选的依赖，但是也最好配置一些合理的默认值。否则，只能对代码的依赖进行非null值检查了。基于setter方法的注入有一个便利之处是：对象可以重新配置和重新注入。 因此，使用setter注入管理 [JMX MBeans](https://github.com/DocsHome/spring-docs/blob/master/pages/integration/integration.md#jmx) 是很方便的

依赖注入的两种风格适合大多数的情况，但是在使用第三方库的时候，开发者可能并没有源码，那么就只能使用基于构造函数的依赖注入了。

<a id="beans-dependency-resolution"></a>

##### [](#beans-dependency-resolution)决定依赖的过程

容器解析Bean的过程如下:

*   创建并根据描述的元数据来实例化`ApplicationContext`，元数据配置可以是XML文件、Java代码或者注解。

*   每一个Bean的依赖都通过构造函数参数或属性，或者静态工厂方法的参数等等来表示。这些依赖会在Bean创建的时候装载和注入

*   每一个属性或者构造函数的参数都是真实定义的值或者引用容器其他的Bean.

*   每一个属性或者构造参数可以根据指定的类型转换为所需的类型。Spring也可以将String转成默认的Java内置类型。例如`int`, `long`, `String`, `boolean`等 。


Spring容器会在容器创建的时候针对每一个Bean进行校验。但是Bean的属性在Bean没有真正创建之前是不会进行配置的，单例类型的Bean是容器创建的时候配置成预实例状态的。 [Bean的作用域](#beans-factory-scopes)后面再说，其他的Bean都只有在请求的时候，才会创建，显然创建Bean对象会有一个依赖顺序图，这个图表示Bean之间的依赖关系。 容器根据此来决定创建和配置Bean的顺序。

循环依赖

如果开发者主要使用基于构造函数的依赖注入，那么很有可能出现循环依赖的情况。

例如：类A在构造函数中依赖于类B的实例，而类B的构造函数又依赖类A的实例。如果这样配置类A和类B相互注入的话，Spring IoC容器会发现这个运行时的循环依赖， 并且抛出`BeanCurrentlyInCreationException`。

开发者可以选择setter方法来配置依赖注入，这样就不会出现循环依赖的情况。或者根本就不使用基于构造函数的依赖注入，而仅仅使用基于setter方法的依赖注入。 换言之，但是开发者可以将循环依赖配置为基于Setter方法的依赖注入（尽管不推荐这样做）

不像典型的例子（没有循环依赖的情况），bean A和bean B之间的循环依赖关系在完全初始化之前就已经将其中一个bean注入到另一个中了（典型的鸡和鸡蛋的故事）

你可以信任Spring做正确的事。它在容器加载时检测配置问题，例如对不存在的bean和循环依赖的引用。 当实际创建bean时，Spring会尽可能晚地设置属性并解析依赖项。这也意味着Spring容器加载正确后会在bean注入依赖出错的时候抛出异常。例如，bean抛出缺少属性或者属性不合法的异常 ，这种延迟的解析也是`ApplicationContext` 的实现会令单例Bean处于预实例化状态的原因。这样，通过`ApplicationContext`创建bean，可以在真正使用bean之前消耗一些内存代价而发现配置的问题 。开发者也可以覆盖默认的行为让单例bean延迟加载，而不总是处于预实例化状态。

如果不存在循环依赖的话，bean所引用的依赖会预先全部构造。举例来说，如果bean A依赖于bean B，那么Spring IoC容器会先配置bean B，然后调用bean A的setter方法来构造bean A。 换言之，bean先会实例化，然后再注入依赖，最后才是相关生命周期方法的调用（就像配置文件的[初始化方法](#beans-factory-lifecycle-initializingbean) 或者[InitializingBean的回调函数](#beans-factory-lifecycle-initializingbean)那样）。

<a id="beans-some-examples"></a>

##### [](#beans-some-examples)依赖注入的例子

下面的例子使用基于XML的元数据配置，然后使用setter方式进行依赖注入。下面是Spring中使用XML文件声明bean定义的片段：

```xml
<bean id="exampleBean" class="examples.ExampleBean">
    <!-- setter injection using the nested ref element -->
    <property name="beanOne">
        <ref bean="anotherExampleBean"/>
    </property>

    <!-- setter injection using the neater ref attribute -->
    <property name="beanTwo" ref="yetAnotherBean"/>
    <property name="integerProperty" value="1"/>
</bean>

<bean id="anotherExampleBean" class="examples.AnotherBean"/>
<bean id="yetAnotherBean" class="examples.YetAnotherBean"/>
```

以下示例显示了相应的 `ExampleBean`类：

```java
public class ExampleBean {

    private AnotherBean beanOne;

    private YetAnotherBean beanTwo;

    private int i;

    public void setBeanOne(AnotherBean beanOne) {
        this.beanOne = beanOne;
    }

    public void setBeanTwo(YetAnotherBean beanTwo) {
        this.beanTwo = beanTwo;
    }

    public void setIntegerProperty(int i) {
        this.i = i;
    }
}
```

kotlin:

```kotlin
class ExampleBean {
    lateinit var beanOne: AnotherBean
    lateinit var beanTwo: YetAnotherBean
    var i: Int = 0
}
```

在前面的示例中，setter被声明为与XML文件中指定的属性匹配。以下示例使用基于构造函数的DI：

```xml
<bean id="exampleBean" class="examples.ExampleBean">
    <!-- constructor injection using the nested ref element -->
    <constructor-arg>
        <ref bean="anotherExampleBean"/>
    </constructor-arg>

    <!-- constructor injection using the neater ref attribute -->
    <constructor-arg ref="yetAnotherBean"/>

    <constructor-arg type="int" value="1"/>
</bean>

<bean id="anotherExampleBean" class="examples.AnotherBean"/>
<bean id="yetAnotherBean" class="examples.YetAnotherBean"/>
```

以下示例显示了相应的`ExampleBean`类：

```java
public class ExampleBean {

    private AnotherBean beanOne;

    private YetAnotherBean beanTwo;

    private int i;

    public ExampleBean(
        AnotherBean anotherBean, YetAnotherBean yetAnotherBean, int i) {
        this.beanOne = anotherBean;
        this.beanTwo = yetAnotherBean;
        this.i = i;
    }
}
```

kotlin:

```kotlin
class ExampleBean(
        private val beanOne: AnotherBean,
        private val beanTwo: YetAnotherBean,
        private val i: Int)
```

bean定义中指定的构造函数参数用作 `ExampleBean`的构造函数的参数。

现在考虑这个示例的变体，其中，不使用构造函数，而是告诉Spring调用静态工厂方法来返回对象的实例：

```xml
<bean id="exampleBean" class="examples.ExampleBean" factory-method="createInstance">
    <constructor-arg ref="anotherExampleBean"/>
    <constructor-arg ref="yetAnotherBean"/>
    <constructor-arg value="1"/>
</bean>

<bean id="anotherExampleBean" class="examples.AnotherBean"/>
<bean id="yetAnotherBean" class="examples.YetAnotherBean"/>
```

以下示例显示了相应的`ExampleBean`类：

```java
public class ExampleBean {

    // a private constructor
    private ExampleBean(...) {
        ...
    }

    // a static factory method; the arguments to this method can be
    // considered the dependencies of the bean that is returned,
    // regardless of how those arguments are actually used.
    public static ExampleBean createInstance (
        AnotherBean anotherBean, YetAnotherBean yetAnotherBean, int i) {

        ExampleBean eb = new ExampleBean (...);
        // some other operations...
        return eb;
    }
}
```

kotlin:

```kotlin
class ExampleBean private constructor() {
    companion object {
        // a static factory method; the arguments to this method can be
        // considered the dependencies of the bean that is returned,
        // regardless of how those arguments are actually used.
        fun createInstance(anotherBean: AnotherBean, yetAnotherBean: YetAnotherBean, i: Int): ExampleBean {
            val eb = ExampleBean (...)
            // some other operations...
            return eb
        }
    }
}
```

`静态工厂方法`的参数由`<constructor-arg/>`元素提供，与实际使用的构造函数完全相同。工厂方法返回类的类型不必与包含`静态工厂方法` 的类完全相同， 尽管在本例中是这样。实例（非静态）工厂方法的使用方式也是相似的（除了使用`factory-bean`属性而不是`class`属性。因此此处不在展开讨论。

<a id="beans-factory-properties-detailed"></a>

#### [](#beans-factory-properties-detailed)1.4.2. 依赖和配置的细节

[如上一节所述](#beans-factory-collaborators)，您可以将bean的属性和构造函数参数定义为对其他bean的引用，或者作为其内联定义的值。Spring可以允许您在基于XML的配置元数据（定义Bean）中使用子元素`<property/>` and `<constructor-arg/>` 来达到这种目的。

<a id="beans-value-element"></a>

##### [](#beans-value-element)直接值（基本类型，String等等）

`<property/>` 元素的`value` 属性将属性或构造函数参数指定为人类可读的字符串表示形式， Spring的[conversion service](#core-convert-ConversionService-API)用于将这些值从`String` 转换为属性或参数的实际类型。 以下示例显示了要设置的各种值：

```xml
<bean id="myDataSource" class="org.apache.commons.dbcp.BasicDataSource" destroy-method="close">
    <!-- results in a setDriverClassName(String) call -->
    <property name="driverClassName" value="com.mysql.jdbc.Driver"/>
    <property name="url" value="jdbc:mysql://localhost:3306/mydb"/>
    <property name="username" value="root"/>
    <property name="password" value="masterkaoli"/>
</bean>
```

以下示例使用[p命名空间](#beans-p-namespace)进行更简洁的XML配置：

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:p="http://www.springframework.org/schema/p"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
    https://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="myDataSource" class="org.apache.commons.dbcp.BasicDataSource"
        destroy-method="close"
        p:driverClassName="com.mysql.jdbc.Driver"
        p:url="jdbc:mysql://localhost:3306/mydb"
        p:username="root"
        p:password="masterkaoli"/>

</beans>
```

前面的XML更简洁。 但是因为属性的类型是在运行时确定的，而非设计时确定的。所有有可能在运行时发现拼写错误。，除非您在创建bean定义时使用支持自动属性完成的IDE（例如[IntelliJ IDEA](http://www.jetbrains.com/idea/) or the [Spring Tool Suite](https://spring.io/tools/sts)）。 所以，强烈建议使用此类IDE帮助。

你也可以配置一个`java.util.Properties` 的实例，如下：

```xml
<bean id="mappings"
    class="org.springframework.context.support.PropertySourcesPlaceholderConfigurer">

    <!-- typed as a java.util.Properties -->
    <property name="properties">
        <value>
            jdbc.driver.className=com.mysql.jdbc.Driver
            jdbc.url=jdbc:mysql://localhost:3306/mydb
        </value>
    </property>
</bean>
```

Spring的容器会将`<value/>`里面的文本通过JavaBean的`PropertyEditor` 机制转换成`java.util.Properties` 实例， 这种嵌套`<value/>`元素的快捷方式也是Spring团队推荐使用的。

<a id="beans-idref-element"></a>

###### [](#beans-idref-element)`idref` 元素

`idref` 元素只是一种防错方法，可以将容器中另一个bean的`id`（字符串值 \- 而不是引用）传递给`<constructor-arg/>`或`<property/>`元素：

```xml
<bean id="theTargetBean" class="..."/>

<bean id="theClientBean" class="...">
    <property name="targetName">
        <idref bean="theTargetBean"/>
    </property>
</bean>
```

前面的bean定义代码段运行时与以下代码段完全等效：

```xml
<bean id="theTargetBean" class="..." />

<bean id="client" class="...">
    <property name="targetName" value="theTargetBean"/>
</bean>
```

Spring团队更推荐第一种方式，因为使用了`idref` 标签，它会让容器在部署阶段就对bean进行校验，以确保bean一定存在。而使用第二种方式的话，是没有任何校验的。 只有实际上引用了`client` bean的`targetName`属性，不对其值进行校验。在实例化client的时候才会被发现。如果client是[prototype](#beans-factory-scopes)类型的Bean的话，那么类似拼写之类的错误会在容器部署以后很久才能发现。

`idref`元素的`local`属性在Spring 4.0以后的xsd中已经不再支持了，而是使用了bean引用。如果更新了版本的话，只要将`idref local`引用都转换成`idref bean` 即可。

在`ProxyFactoryBean`定义中，元素所携带的值在[AOP拦截器a>的配置中很常见（至少在Spring 2.0之前的版本是这样）。在指定拦截器名称时使用`<idref/>` 元素可防止拦截器漏掉id或拼写错误。](#aop-pfb-1)

<a id="beans-ref-element"></a>

##### [](#aop-pfb-1)[](#beans-ref-element)引用其他的Bean（装配）

`ref` 元素是`<constructor-arg/>` 或 or `<property/>`定义元素中的最后一个元素。 你可以通过这个标签配置一个bean来引用另一个bean。当需要引用一个bean的时候，被引用的bean会先实例化，然后配置属性，也就是引用的依赖。如果该bean是单例bean的话 ，那么该bean会早由容器初始化。最终会引用另一个对象的所有引用，bean的范围以及校验取决于你是否有通过`bean`, `local,` or `parent` 这些属性来指定对象的id或者name属性。

通过指定 `bean`属性中的`<ref/>`元素来指定依赖是最常见的一种方式，可以引用容器或者父容器中的bean，不在同一个XML文件定义也可以引用。 其中`bean` 属性中的值可以和其他引用`bean` 中的`id`属性一致，或者和其中的某个`name` 属性一致，以下示例显示如何使用ref元素：：

    <ref bean="someBean"/>

通过指定bean的`parent`属性可以创建一个引用到当前容器的父容器之中。`parent`属性的值可以与目标bean的`id`属性一致，或者和目标bean的`name`属性中的某个一致，目标bean必须是当前引用目标bean容器的父容器 。开发者一般只有在存在层次化容器，并且希望通过代理来包裹父容器中一个存在的bean的时候才会用到这个属性。 以下一对列表显示了如何使用父属性:

```xml
<!-- in the parent context -->
<bean id="accountService" class="com.something.SimpleAccountService">
    <!-- insert dependencies as required as here -->
</bean>

<!-- in the child (descendant) context -->
<bean id="accountService" <!-- bean name is the same as the parent bean -->
    class="org.springframework.aop.framework.ProxyFactoryBean">
    <property name="target">
        <ref parent="accountService"/> <!-- notice how we refer to the parent bean -->
    </property>
    <!-- insert other configuration and dependencies as required here -->
</bean>
```

与idref标签一样，`ref`元素中的`local` 标签在xsd 4.0，以后已经不再支持了，开发者可以通过将已存在的`ref local`改为`ref bean` 来完成Spring版本升级。

<a id="beans-inner-beans"></a>

##### [](#beans-inner-beans)内部bean

定义在`<bean/>`元素的`<property/>`或者`<constructor-arg/>` 元素之内的bean叫做内部bean，如下例所示：:

```xml
<bean id="outer" class="...">
    <!-- instead of using a reference to a target bean, simply define the target bean inline -->
    <property name="target">
        <bean class="com.example.Person"> <!-- this is the inner bean -->
            <property name="name" value="Fiona Apple"/>
            <property name="age" value="25"/>
        </bean>
    </property>
</bean>
```

内部bean定义不需要定义的ID或名称。如果指定，则容器不使用此类值作为标识符。容器还会在创建时忽略`scope` 标签，因为内部bean始终是匿名的，并且始终使用外部bean创建。 开发者是无法将内部bean注入到外部bean以外的其他bean中的。

作为一个极端情况，可以从自定义范围接收销毁回调 ， 例如：请求范围的内部bean包含了单例bean，那么内部bean实例会绑定到包含的bean，而包含的bean允许访问request的scope生命周期。 这种场景并不常见，内部bean通常只是供给它的外部bean使用。

<a id="beans-collection-elements"></a>

##### [](#beans-collection-elements)集合

在`<list/>`, `<set/>`, `<map/>`, 和 `<props/>`元素中，您可以分别配置Java集合类型 `List`, `Set`, `Map`, and `Properties`的属性和参数。 以下示例显示了如何使用它们:

```xml
<bean id="moreComplexObject" class="example.ComplexObject">
    <!-- results in a setAdminEmails(java.util.Properties) call -->
    <property name="adminEmails">
        <props>
            <prop key="administrator">administrator@example.org</prop>
            <prop key="support">support@example.org</prop>
            <prop key="development">development@example.org</prop>
        </props>
    </property>
    <!-- results in a setSomeList(java.util.List) call -->
    <property name="someList">
        <list>
            <value>a list element followed by a reference</value>
            <ref bean="myDataSource" />
        </list>
    </property>
    <!-- results in a setSomeMap(java.util.Map) call -->
    <property name="someMap">
        <map>
            <entry key="an entry" value="just some string"/>
            <entry key ="a ref" value-ref="myDataSource"/>
        </map>
    </property>
    <!-- results in a setSomeSet(java.util.Set) call -->
    <property name="someSet">
        <set>
            <value>just some string</value>
            <ref bean="myDataSource" />
        </set>
    </property>
</bean>
```

当然，map的key或者value，或者集合的value都可以配置为下列元素之一:

    bean | ref | idref | list | set | map | props | value | null

<a id="beans-collection-elements-merging"></a>

###### [](#beans-collection-elements-merging)集合的合并

Spring的容器也支持集合合并，开发者可以定义父样式的`<list/>`, `<map/>`, `<set/>` 或 `<props/>`元素， 同时有子样式的`<list/>`, `<map/>`, `<set/>` 或 `<props/>`元素。也就是说，子集合的值是父元素和子元素集合的合并值。

有关合并的这一节讨论父子bean机制，不熟悉父和子bean定义的读者可能希望在继续之前阅读[相关部分](#beans-child-bean-definitions)。

以下示例演示了集合合并：:

```xml
<beans>
    <bean id="parent" abstract="true" class="example.ComplexObject">
        <property name="adminEmails">
            <props>
                <prop key="administrator">administrator@example.com</prop>
                <prop key="support">support@example.com</prop>
            </props>
        </property>
    </bean>
    <bean id="child" parent="parent">
        <property name="adminEmails">
            <!-- the merge is specified on the child collection definition -->
            <props merge="true">
                <prop key="sales">sales@example.com</prop>
                <prop key="support">support@example.co.uk</prop>
            </props>
        </property>
    </bean>
<beans>
```

请注意，在`child` bean 定义的`adminEmails`中的`<props/>`使用`merge=true` 属性。 当容器解析并实例化`child` bean时，生成的实例有一个`adminEmails`属性集合， 其实例中包含的`adminEmails`集合就是child的`adminEmails`以及parent的`adminEmails`集合。以下清单显示了结果： :

```
administrator=administrator@example.com
sales=sales@example.com
support=support@example.co.uk
```

子`属性`集合的值集继承父`<props/>`的所有属性元素，子值的`支持`值覆盖父集合中的值。

这个合并的行为和`<list/>`, `<map/>`, 和 `<set/>`之类的集合类型的行为是类似的。`List` 在特定例子中，与List集合类型类似， 有着隐含的 `ordered`概念。所有的父元素里面的值，是在所有子元素的值之前配置的。但是像`Map`, `Set`, 和 `Properties`的集合类型，是不存在顺序的。

<a id="beans-collection-merge-limitations"></a>

###### [](#beans-collection-merge-limitations)集合合并的限制

您不能合并不同类型的集合（例如要将`Map` 和`List`合并是不可能的）。如果开发者硬要这样做就会抛出异常， `merge`的属性是必须特指到更低级或者继承的子节点定义上， 特指merge属性到父集合的定义上是冗余的，而且在合并上也没有任何效果。

<a id="beans-collection-elements-strongly-typed"></a>

###### [](#beans-collection-elements-strongly-typed)强类型的集合

在Java 5以后，开发者可以使用强类型的集合了。也就是，开发者可以声明`Collection`类型，然后这个集合只包含`String`元素（举例来说）。 如果开发者通过Spring来注入强类型的Collection到bean中，开发者就可以利用Spring的类型转换支持来做到 以下Java类和bean定义显示了如何执行此操作:

```xml
public class SomeClass {

    private Map<String, Float> accounts;

    public void setAccounts(Map<String, Float> accounts) {
        this.accounts = accounts;
    }
}
```

kotlin:

```kotlin
class SomeClass {
    lateinit var accounts: Map<String, Float>
}
```
```xml
<beans>
    <bean id="something" class="x.y.SomeClass">
        <property name="accounts">
            <map>
                <entry key="one" value="9.99"/>
                <entry key="two" value="2.75"/>
                <entry key="six" value="3.99"/>
            </map>
        </property>
    </bean>
</beans>
```



当`something`的属性`accounts`准备注入的时候，accounts的泛型信息Map`Map<String, Float>` 就会通过反射拿到。 这样，Spring的类型转换系统能够识别不同的类型，如上面的例子`Float`然后会将字符串的值`9.99, 2.75`, 和`3.99`转换成对应的`Float`类型。

<a id="beans-null-element"></a>

##### [](#beans-null-element)Null and 空字符串

`Strings`将属性的空参数视为空字符串。下面基于XML的元数据配置就会将`email` 属性配置为String的值。

```xml
<bean class="ExampleBean">
    <property name="email" value=""/>
</bean>
```

上面的示例等效于以下Java代码:

```java
exampleBean.setEmail("");
```

kotlin:

```kotlin
exampleBean.email = ""
```

`<null/>`将被处理为null值。以下清单显示了一个示例:

```xml
<bean class="ExampleBean">
    <property name="email">
        <null/>
    </property>
</bean>
```

上述配置等同于以下Java代码：

```java
exampleBean.setEmail(null);
```

kotlin:

```kotlin
exampleBean.email = null
```

<a id="beans-p-namespace"></a>

##### [](#beans-p-namespace)使用p命名空间简化XML配置

p命名空间让开发者可以使用`bean`的属性，而不必使用嵌套的`<property/>`元素。

Spring是支持基于XML的格式化[命名空间](#xsd-schemas)扩展的。本节讨论的`beans` 配置都是基于XML的，p命名空间是定义在Spring Core中的（不是在XSD文件）。

以下示例显示了两个XML片段（第一个使用标准XML格式，第二个使用p命名空间），它们解析为相同的结果：

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:p="http://www.springframework.org/schema/p"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean name="classic" class="com.example.ExampleBean">
        <property name="email" value="someone@somewhere.com"/>
    </bean>

    <bean name="p-namespace" class="com.example.ExampleBean"
        p:email="someone@somewhere.com"/>
</beans>
```

上面的例子在bean中定义了`email`的属性。这种定义告知Spring这是一个属性声明。如前面所描述的，p命名空间并没有标准的定义模式，所以开发者可以将属性的名称配置为依赖名称。

下一个示例包括另外两个bean定义，它们都引用了另一个bean:

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:p="http://www.springframework.org/schema/p"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean name="john-classic" class="com.example.Person">
        <property name="name" value="John Doe"/>
        <property name="spouse" ref="jane"/>
    </bean>

    <bean name="john-modern"
        class="com.example.Person"
        p:name="John Doe"
        p:spouse-ref="jane"/>

    <bean name="jane" class="com.example.Person">
        <property name="name" value="Jane Doe"/>
    </bean>
</beans>
```

此示例不仅包含使用p命名空间的属性值，还使用特殊格式来声明属性引用。第一个bean定义使用`<property name="spouse" ref="jane"/>`来创建从bean `john`到bean `jane`的引用， 而第二个bean定义使用`p:spouse-ref="jane"`来作为指向bean的引用。在这个例子中 `spouse`是属性的名字，而`-ref`部分表名这个依赖不是直接的类型，而是引用另一个bean。

p命名空间并不如标准XML格式灵活。例如，声明属性的引用可能和一些以`Ref`结尾的属性相冲突，而标准的XML格式就不会。Spring团队推荐开发者能够和团队商量一下，协商使用哪一种方式，而不要同时使用三种方法。

<a id="beans-c-namespace"></a>

##### [](#beans-c-namespace)使用c命名空间简化XML

与 [p命名空间](#beans-p-namespace)类似，c命名空间是在Spring 3.1首次引入的，c命名空间允许使用内联的属性来配置构造参数而不必使用`constructor-arg` 。

以下示例使用`c:`命名空间的例子来执行与[基于Constructor的依赖注入](#beans-constructor-injection)相同的操作：

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:c="http://www.springframework.org/schema/c"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="beanTwo" class="x.y.ThingTwo"/>
    <bean id="beanThree" class="x.y.ThingThree"/>

    <!-- traditional declaration with optional argument names -->
    <bean id="beanOne" class="x.y.ThingOne">
        <constructor-arg name="thingTwo" ref="beanTwo"/>
        <constructor-arg name="thingThree" ref="beanThree"/>
        <constructor-arg name="email" value="something@somewhere.com"/>
    </bean>

    <!-- c-namespace declaration with argument names -->
    <bean id="beanOne" class="x.y.ThingOne" c:thingTwo-ref="beanTwo"
        c:thingThree-ref="beanThree" c:email="something@somewhere.com"/>

</beans>
```

`c:`:命名空间使用了和`p:` :命名空间相类似的方式（使用了`-ref` 来配置引用).而且,同样的,c命名空间也是定义在Spring Core中的（不是XSD模式)。

在少数的例子之中,构造函数的参数名字并不可用（通常,如果字节码没有debug信息的编译),你可以使用回调参数的索引，如下面的例子:

```xml
<bean id="beanOne" class="x.y.ThingOne" c:_0-ref="beanTwo" c:_1-ref="beanThree"
    c:_2="something@somewhere.com"/>
```

由于XML语法，索引表示法需要使用`_`作为属性名字的前缀，因为XML属性名称不能以数字开头（即使某些IDE允许它）。相应的索引符号也可用于<constructor-arg>元素，但并不常用，因为声明的普通顺序在那里就足够了。

实际上，[构造函数解析机制](#beans-factory-ctor-arguments-resolution)在匹配参数方面非常有效，因此除非您确实需要，否则我们建议在整个配置中使用名称表示法。

<a id="beans-compound-property-names"></a>

##### [](#beans-compound-property-names)组合属性名

开发者可以配置混合的属性，只需所有的组件路径（除了最后一个属性名字）不能为`null`即可。参考如下定义：

```xml
<bean id="something" class="things.ThingOne">
    <property name="fred.bob.sammy" value="123" />
</bean>
```

`something`有 `fred`的属性，而其中`fred`属性有`bob`属性，而`bob`属性之中有`sammy`属性，那么最后这个`sammy`属性会配置为123。 想要上述的配置能够生效，`fred`属性需要有`bob`属性而且在`fred`构造之后不为null即可。

<a id="beans-factory-dependson"></a>

#### [](#beans-factory-dependson)1.4.3. 使用 `depends-on`属性

如果一个bean是另一个bean的依赖，通常这个bean也就是另一个bean的属性之一。多数情况下，开发者可以在配置XML元数据的时候使用[`<ref/>`](#beans-ref-element)标签。 然而，有时bean之间的依赖不是直接关联的。例如：需要调用类的静态实例化器来触发依赖，类似数据库驱动注册。`depends-on`属性可以显式强制初始化一个或多个bean。 以下示例使用depends-on属性表示对单个bean的依赖关系:

```xml
<bean id="beanOne" class="ExampleBean" depends-on="manager"/>
<bean id="manager" class="ManagerBean" />
```

如果想要依赖多个bean，可以提供多个名字作为`depends-on`的值。以逗号、空格或者分号分割:

```xml
<bean id="beanOne" class="ExampleBean" depends-on="manager,accountDao">
    <property name="manager" ref="manager" />
</bean>

<bean id="manager" class="ManagerBean" />
<bean id="accountDao" class="x.y.jdbc.JdbcAccountDao" />
```

`depends-on`属性既可以指定初始化时间依赖性，也可以指定单独的bean，相应的销毁时间的依赖。独立定义了`depends-on`属性的bean会优先销毁 （相对于`depends-on`的bean销毁，这样`depends-on`可以控制销毁的顺序。

<a id="beans-factory-lazy-init"></a>

#### [](#beans-factory-lazy-init)1.4.4. 懒加载Bean

默认情况下， `ApplicationContext` 会在实例化的过程中创建和配置所有的单例[singleton](#beans-factory-scopes-singleton) bean。总的来说， 这个预初始化是很不错的。因为这样能及时发现环境上的一些配置错误，而不是系统运行了很久之后才发现。如果这个行为不是迫切需要的，开发者可以通过将Bean标记为延迟加载就能阻止这个预初始化 懒加载bean会通知IoC不要让bean预初始化而是在被引用的时候才会实例化。

在XML中，此行为由`<bean/>`元素上的`lazy-init` 属性控制，如以下示例所示：

```xml
<bean id="lazy" class="com.something.ExpensiveToCreateBean" lazy-init="true"/>
<bean name="not.lazy" class="com.something.AnotherBean"/>
```

当将bean配置为上述XML的时候， `ApplicationContext`之中的`lazy` bean是不会随着 `ApplicationContext`的启动而进入到预初始化状态的。 只有那些非延迟加载的bean是处于预初始化的状态的。

然而，如果延迟加载的类是作为单例非延迟加载的bean的依赖而存在的话，`ApplicationContext`仍然会在`ApplicationContext`启动的时候加载。 因为作为单例bean的依赖，会随着单例bean的实例化而实例化。

您还可以使用`<beans/>`元素上的`default-lazy-init`属性在容器级别控制延迟初始化，以下示例显示：

```xml
<beans default-lazy-init="true">
    <!-- no beans will be pre-instantiated... -->
</beans>
```

<a id="beans-factory-autowire"></a>

#### [](#beans-factory-autowire)1.4.5. 自动装配

Spring容器可以根据bean之间的依赖关系自动装配，开发者可以让Spring通过`ApplicationContext`来自动解析这些关联，自动装载有很多优点:

*   自动装载能够明显的减少指定的属性或者是构造参数。（在本章[其他地方讨论](#beans-child-bean-definitions)的其他机制，如bean模板，在这方面也很有价值。）

*   自动装载可以扩展开发者的对象，比如说，如果开发者需要加一个依赖，只需关心如何更改配置即可自动满足依赖关联。这样，自动装载在开发过程中是极其高效的，无需明确选择装载的依赖会使系统更加稳定


使用基于XML的配置元数据（请参阅[依赖注入](#beans-factory-collaborators)）时，可以使用`<bean/>` 元素的`autowire`属性为bean定义指定autowire模式。 自动装配功能有四种方式。开发者可以指定每个bean的装配方式，这样bean就知道如何加载自己的依赖。下表描述了四种自动装配模式：

Table 2. 装配模式

| 模式          | 说明                                                         |
| ------------- | ------------------------------------------------------------ |
| `no`          | (默认) 不自动装配。Bean引用必须由 `ref` 元素定义，对于比较大的项目的部署，不建议修改默认的配置 ，因为明确指定协作者可以提供更好的控制和清晰度。在某种程度上，它记录了系统的结构。 |
| `byName`      | 按属性名称自动装配。 Spring查找与需要自动装配的属性同名的bean。 例如，如果bean配置为根据名字装配，他包含 的属性名字为`master`（即，它具有`setMaster(..)`方法），则Spring会查找名为 `master` 的bean定义并使用它来设置属性。 |
| `byType`      | 如果需要自动装配的属性的类型在容器中只存在一个的话，他允许自动装配。如果存在多个，则抛出致命异常，这表示您不能对该bean使用`byType`自动装配。 如果没有匹配的bean，则不会发生任何事情（未设置该属性）。 |
| `constructor` | 类似于`byType`，但应用于构造函数参数。 如果容器中没有一个Bean的类型和构造函数参数类型一致的话，则会引发致命错误。 |

通过`byType`或者`constructor`的自动装配方式，开发者可以装载数组和强类型集合。在这样的例子中，所有容器中的匹配了指定类型的bean都会自动装配到bean上来完成依赖注入。 开发者可以自动装配key为`String`.的强类型的 `Map` 。自动装配的Map值会包含所有的bean实例值来匹配指定的类型，`Map`的key会包含关联的bean的名字。

<a id="beans-autowired-exceptions"></a>

##### [](#beans-autowired-exceptions)自动装配的局限和缺点

自动装配在项目中一致使用时效果最佳。如果一般不使用自动装配，那么开发人员使用它来装配一个或两个bean定义可能会让人感到困惑。

考虑自动装配的局限和缺点:

*   `property`和`constructor-arg`设置中的显式依赖项始终覆盖自动装配。开发者不能自动装配一些简单属性，您不能自动装配简单属性，例如基本类型 ，字符串和类（以及此类简单属性的数组）。这种限制是按设计的。

*   自动装配比显式的配置更容易歧义，尽管上表表明了不同自动配置的特点，Spring也会尽可能避免不必要的装配错误。但是Spring管理的对象关系仍然不如显式配置那样明确。

*   从Spring容器生成文档的工具可能无法有效的提供装配信息。

*   容器中的多个bean定义可能与setter方法或构造函数参数所指定的类型相匹配， 这有利于自动装配。对于arrays, collections, or `Map`实例来说这不是问题。但是如果是对只有一个依赖项的值是有歧义的话，那么这个项是无法解析的。如果没有唯一的bean，则会抛出异常。


在后面的场景，你可有如下的选择：

*   放弃自动装配，改用显式的配置。
*   通过将`autowire-candidate` 属性设置为`false`，避免对bean定义进行自动装配，[如下一节所述](#beans-factory-autowire-candidate)。
*   通过将其`<bean/>` 元素的`primary`属性设置为 `true`，将单个bean定义指定为主要候选项。
*   使用基于注解的配置实现更细粒度的控制，如[基于注解的容器配置](#beans-annotation-config)中所述。

<a id="beans-factory-autowire-candidate"></a>

##### [](#beans-factory-autowire-candidate)将bean从自动装配中排除

在每个bean的基础上，您可以从自动装配中排除bean。 在Spring的XML格式中，将`<bean/>` 元素的`autowire-candidate` 属性设置为`false`。 容器使特定的bean定义对自动装配基础结构不可用（包括注解样式配置，如[`@Autowired`](#beans-autowired-annotation)）。

`autowire-candidate` 属性旨在仅影响基于类型的自动装配。 它不会影响名称的显式引用，即使指定的bean未标记为autowire候选，也会解析它。 因此，如果名称匹配，则按名称自动装配会注入bean。

开发者可以通过模式匹配而不是Bean的名字来限制自动装配的候选者。最上层的`<beans/>` 元素会在`default-autowire-candidates` 属性中来配置多种模式。 例如，限制自动装配候选者的名字以`Repository`结尾，可以配置成`*Repository`。如果需要配置多种模式，只需要用逗号分隔开即可。 bean定义的`autowire-candidate`属性的显式值`true` 或`false`始终优先。 对于此类bean，模式匹配规则不适用。

上面的这些技术在配置那些无需自动装配的bean是相当有效的，当然这并不是说这类bean本身无法自动装配其他的bean。而是说这些bean不再作为自动装配的依赖候选者。

<a id="beans-factory-method-injection"></a>

#### [](#beans-factory-method-injection)1.4.6.方法注入

在大多数的应用场景下，多数的bean都是[单例](#beans-factory-scopes-singleton)的。当这个单例的bean需要和另一个单例的或者非单例的bean协作使用的时候，开发者只需要配置依赖bean为这个bean的属性即可。 但是有时会因为bean具有不同的生命周期而产生问题。假设单例的bean A在每个方法调用中使用了非单例的bean B。容器只会创建bean A一次，而只有一个机会来配置属性。 那么容器就无法为每一次创建bean A时都提供新的bean B实例。

一种解决方案就是放弃IoC，开发者可以通过实现`ApplicationContextAware`接口让[bean A对ApplicationContext](#beans-factory-aware)可见。 从而通过调用[`getBean("B")`](#beans-factory-client)来在bean A 需要新的实例的时候来获取到新的B实例。参考下面例子。

```java
// a class that uses a stateful Command-style class to perform some processing
package fiona.apple;

// Spring-API imports
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

public class CommandManager implements ApplicationContextAware {

    private ApplicationContext applicationContext;

    public Object process(Map commandState) {
        // grab a new instance of the appropriate Command
        Command command = createCommand();
        // set the state on the (hopefully brand new) Command instance
        command.setState(commandState);
        return command.execute();
    }

    protected Command createCommand() {
        // notice the Spring API dependency!
        return this.applicationContext.getBean("command", Command.class);
    }

    public void setApplicationContext(
            ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
    }
}
```

kotlin:

```kotlin
// a class that uses a stateful Command-style class to perform some processing
package fiona.apple

// Spring-API imports
import org.springframework.context.ApplicationContext
import org.springframework.context.ApplicationContextAware

class CommandManager : ApplicationContextAware {

    private lateinit var applicationContext: ApplicationContext

    fun process(commandState: Map<*, *>): Any {
        // grab a new instance of the appropriate Command
        val command = createCommand()
        // set the state on the (hopefully brand new) Command instance
        command.state = commandState
        return command.execute()
    }

    // notice the Spring API dependency!
    protected fun createCommand() =
            applicationContext.getBean("command", Command::class.java)

    override fun setApplicationContext(applicationContext: ApplicationContext) {
        this.applicationContext = applicationContext
    }
}
```

上面的代码并不让人十分满意，因为业务的代码已经与Spring框架耦合在一起。方法注入是Spring IoC容器的一个高级功能，可以让您处理这种问题。 Spring提供了一个稍微高级的注入方式来处理这种问题

您可以在此[博客条目](https://spring.io/blog/2004/08/06/method-injection/)中阅读有关方法注入的更多信息。

<a id="beans-factory-lookup-method-injection"></a>

##### [](#beans-factory-lookup-method-injection)查找方法注入

查找方法注入是容器覆盖管理bean上的方法的能力，以便返回容器中另一个命名bean的查找结果。查找方法通常涉及原型bean，[如前面描述的场景](#beans-factory-method-injection)。 Spring框架通过使用CGLIB库生成的字节码来生成动态子类重写的方法实现此注入。

*   如果想让这个动态子类正常工作，那么Spring容器所继承的Bean不能是`final`的，而覆盖的方法也不能是`final`的。

*   对具有`抽象`方法的类进行单元测试时，需要开发者对类进行子类化，并提供`抽象`方法的具体实现。

*   组件扫描也需要具体的方法，因为它需要获取具体的类。

*   另一个关键限制是查找方法不适用于工厂方法，特别是在配置类中不使用`@Bean`的方法。因为在这种情况下，容器不负责创建实例，因此不能在运行时创建运行时生成的子类。


对于前面代码片段中的`CommandManager`类，Spring容器动态地覆盖`createCommand()`方法的实现。 `CommandManager`类不再拥有任何的Spring依赖，如下：

```java
package fiona.apple;

// no more Spring imports!

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

kotlin:

```kotlin
package fiona.apple

// no more Spring imports!

abstract class CommandManager {

    fun process(commandState: Any): Any {
        // grab a new instance of the appropriate Command interface
        val command = createCommand()
        // set the state on the (hopefully brand new) Command instance
        command.state = commandState
        return command.execute()
    }

    // okay... but where is the implementation of this method?
    protected abstract fun createCommand(): Command
}
```

在包含需要注入方法的客户端类中 (在本例中为`CommandManager`）注入方法的签名需要如下形式：

```javajava
<public|protected> [abstract] <return-type> theMethodName(no-arguments);
```

如果方法是`abstract`的， 那么动态生成的子类会实现该方法。否则，动态生成的子类将覆盖原始类定义的具体方法。例如：

```xml
<!-- a stateful bean deployed as a prototype (non-singleton) -->
<bean id="myCommand" class="fiona.apple.AsyncCommand" scope="prototype">
    <!-- inject dependencies here as required -->
</bean>

<!-- commandProcessor uses statefulCommandHelper -->
<bean id="commandManager" class="fiona.apple.CommandManager">
    <lookup-method name="createCommand" bean="myCommand"/>
</bean>
```

当需要新的myCommand bean实例时，标识为`commandManager`的bean会调用自身的`createCommand()`方法.开发者必须小心部署`myCommand` bean为原型bean. 如果所需的bean是[单例](#beans-factory-scopes-singleton)的,那么每次都会返回相同的`myCommand` bean实例.

另外,如果是基于注解的配置模式,你可以在查找方法上定义`@Lookup`注解,如下:

```java
public abstract class CommandManager {

    public Object process(Object commandState) {
        Command command = createCommand();
        command.setState(commandState);
        return command.execute();
    }

    @Lookup("myCommand")
    protected abstract Command createCommand();
}
```

kotlin:

```kotlin
abstract class CommandManager {

    fun process(commandState: Any): Any {
        val command = createCommand()
        command.state = commandState
        return command.execute()
    }

    @Lookup("myCommand")
    protected abstract fun createCommand(): Command
}
```

或者，更常见的是，开发者也可以根据查找方法的返回类型来查找匹配的bean，如下

```java
public abstract class CommandManager {

    public Object process(Object commandState) {
        MyCommand command = createCommand();
        command.setState(commandState);
        return command.execute();
    }

    @Lookup
    protected abstract MyCommand createCommand();
}
```

kotlin:

```kotlin
abstract class CommandManager {

    fun process(commandState: Any): Any {
        val command = createCommand()
        command.state = commandState
        return command.execute()
    }

    @Lookup
    protected abstract fun createCommand(): Command
}
```

注意开发者可以通过创建子类实现lookup方法，以便使它们与Spring的组件扫描规则兼容，同时抽象类会在默认情况下被忽略。这种限制不适用于显式注册bean或明确导入bean的情况。

另一种可以访问不同生命周期的方法是`ObjectFactory`/`Provider`注入，具体参看 [作用域的bean依赖](#beans-factory-scopes-other-injection)

您可能还会发现`ServiceLocatorFactoryBean`（在`org.springframework.beans.factory.config`包中）很有用。

<a id="beans-factory-arbitrary-method-replacement"></a>

##### [](#beans-factory-arbitrary-method-replacement)替换任意方法

从前面的描述中，我们知道查找方法是有能力来覆盖任何由容器管理的bean方法的。开发者最好跳过这一部分，除非一定需要用到这个功能。

通过基于XML的元数据配置，开发者可以使用`replaced-method`元素来替换已存在方法的实现。考虑以下类，它有一个我们想要覆盖的名为`computeValue` 的方法：

```java
public class MyValueCalculator {

    public String computeValue(String input) {
        // some real code...
    }

    // some other methods...
}
```

kotlin:

```kotlin
class MyValueCalculator {

    fun computeValue(input: String): String {
        // some real code...
    }

    // some other methods...
}
```

实现`org.springframework.beans.factory.support.MethodReplacer`接口的类提供了新的方法定义，如以下示例所示：

```java
/**
 * meant to be used to override the existing computeValue(String)
 * implementation in MyValueCalculator
 */
public class ReplacementComputeValue implements MethodReplacer {

    public Object reimplement(Object o, Method m, Object[] args) throws Throwable {
        // get the input value, work with it, and return a computed result
        String input = (String) args[0];
        ...
        return ...;
    }
}
```

kotlin:

```kotlin
/**
* meant to be used to override the existing computeValue(String)
* implementation in MyValueCalculator
*/
class ReplacementComputeValue : MethodReplacer {

    override fun reimplement(obj: Any, method: Method, args: Array<out Any>): Any {
        // get the input value, work with it, and return a computed result
        val input = args[0] as String;
        ...
        return ...;
    }
}
```

如果需要覆盖bean方法的XML配置如下类似于以下示例：

```xml
<bean id="myValueCalculator" class="x.y.z.MyValueCalculator">
    <!-- arbitrary method replacement -->
    <replaced-method name="computeValue" replacer="replacementComputeValue">
        <arg-type>String</arg-type>
    </replaced-method>
</bean>

<bean id="replacementComputeValue" class="a.b.c.ReplacementComputeValue"/>
```

您可以在`<replaced-method/>`元素中使用一个或多个 `<arg-type/>`元素来指示被覆盖的方法的方法。当需要覆盖的方法存在重载方法时，必须指定所需参数。 为了方便起见，字符串的类型会匹配以下类型，它完全等同于`java.lang.String`

    java.lang.String
    String
    Str

因为，通常来说参数的个数已经足够区别不同的方法，这种快捷的写法可以省去很多的代码。
