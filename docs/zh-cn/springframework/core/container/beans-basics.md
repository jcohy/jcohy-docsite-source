---
title: 容器概述
keywords: keywords: docs，jcohy-docs，spring,容器概述
description: Spring  Framework 中文文档 》 容器概述
---

# Spring  Framework 中文文档
### [](#beans-basics)1.2. 容器概述

`org.springframework.context.ApplicationContext`是Spring IoC容器实现的代表，它负责实例化，配置和组装Bean。容器通过读取配置元数据获取有关实例化、配置和组装哪些对象的说明 。配置元数据可以使用XML、Java注解或Java代码来呈现。它允许你处理应用程序的对象与其他对象之间的互相依赖关系。

Spring提供了`ApplicationContext`接口的几个实现。 在独立应用程序中，通常创建[`ClassPathXmlApplicationContext`](https://docs.spring.io/spring-framework/docs/5.1.3.BUILD-SNAPSHOT/javadoc-api/org/springframework/context/support/ClassPathXmlApplicationContext.html)或[`FileSystemXmlApplicationContext`](https://docs.spring.io/spring-framework/docs/5.1.3.BUILD-SNAPSHOT/javadoc-api/org/springframework/context/support/FileSystemXmlApplicationContext.html)的实例。虽然XML一直是定义配置元数据的传统格式， 但是您可以指定容器使用Java注解或编程的方式编写元数据格式，并通过提供少量的XML配置以声明对某些额外元数据的支持。

在大多数应用场景中，不需要用户显式的编写代码来实例化IOC容器的一个或者多个实例。例如，在Web应用场景中，只需要在web.xml中添加大概8行简单的web描述样板就行了。（ [便捷的ApplicationContext实例化Web应用程序](#context-create)） 如果你使用的是基于Eclipse的[Spring Tool Suite](https://spring.io/tools/sts)开发环境，该样板配置只需点击几下鼠标或按几下键盘就能创建了。

下图展示了Spring工作方式的高级视图，应用程序的类与元数据配置相互配合，这样，在`ApplicationContext`创建和初始化后，你立即拥有一个可配置的，可执行的系统或应用程序。

![container magic](https://github.com/DocsHome/spring-docs/blob/master/pages/images/container-magic.png)

图 1\. IOC容器

<a id="beans-factory-metadata"></a>

#### [](#beans-factory-metadata)1.2.1. 配置元数据

如上图所示，Spring IOC容器使用元数据配置这种形式，这个配置元数据表示了应用开发人员告诉Spring容器以何种方式实例化、配置和组装应用程序中的对象。

配置元数据通常以简单、直观的XML格式提供，本章的大部分内容都使用这种格式来说明Spring IoC容器的关键概念和特性。

XML并不是配置元数据的唯一方式，Spring IoC容器本身是完全与元数据配置的实际格式分离的。现在，许多开发人员选择[基于Java的配置](#beans-java)来开发应用程序。

更多其他格式的元数据见:

*   [基于注解的配置](#beans-annotation-config): Spring 2.5 支持基于注解的元数据配置.

*   [基于Java的配置](#beans-java): 从 Spring 3.0开始, 由Spring JavaConfig项目提供的功能已经成为Spring核心框架的一部分。因此，你可以使用Java配置来代替XML配置定义外部bean 。要使用这些新功能，请参阅 [`@Configuration`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/context/annotation/Configuration.html), [`@Bean`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/context/annotation/Bean.html), [`@Import`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/context/annotation/Import.html), 和 [`@DependsOn`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/context/annotation/DependsOn.html) annotations.

Spring配置至少一个（通常不止一个）由容器来管理。基于XML的元数据配置将这些bean配置为`<bean/>`元素，并放置于`<bean/>`元素内部。 典型的Java配置是在使用`@Configuration`注解过的类中，在它的方法上使用`@Bean`注解。

这些bean定义会对应到构成应用程序的实际对象。通常你会定义服务层对象，数据访问对象（DAOs），表示对象(如Struts `Action`的实例)，基础对象（如Hibernate 的`SessionFactories`, JMS `Queues`）。通常不会在容器中配置细粒度的域对象，但是，因为它的创建和加载通常是DAO和业务逻辑的任务。 但是，你可以使用Spring与AspectJ 集成独立于 IoC 容器来创建的对象，请参阅[AspectJ在Spring中进行依赖关系注入域对象](#aop-atconfigurable)

下面的示例显示了基于XML元数据配置的基本结构:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="..." class="...">  (1) (2)
        <!-- collaborators and configuration for this bean go here -->
    </bean>

    <bean id="..." class="...">
        <!-- collaborators and configuration for this bean go here -->
    </bean>

    <!-- more bean definitions go here -->

</beans>
```

**1**

`id` 属性是字符串 ，用来识别唯一的bean定义.

**2**

`class` 属性定义了bean的类型，使用全类名.

`id`属性的值是指引用协作对象（在这个例子没有显示用于引用协作对象的XML）。请参阅[依赖](#beans-dependencies)获取更多信息

<a id="beans-factory-instantiation"></a>

#### [](#beans-factory-instantiation)1.2.2. 实例化容器

提供给ApplicationContext构造函数的路径就是实际的资源字符串，使容器能从各种外部资源(如本地文件系统、Java类路径等)装载元数据配置。

java:

```java
    ApplicationContext context = new ClassPathXmlApplicationContext("services.xml", "daos.xml");
```
kotlin:

```kotlin
    val context = ClassPathXmlApplicationContext("services.xml", "daos.xml");
```

当你了解Spring IoC容器，你可能想知道更多关于Spring的抽象资源（详细描述[资源](#resources)）它提供了一种方便的，由URI语法定义的位置读取InputStream描述的方式 ，资源路径被用于构建应用程序上下文[应用环境和资源路径](#resources-app-ctx)

下面的例子显示了服务层对象(`services.xml`)配置文件::

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd">

    <!-- services -->

    <bean id="petStore" class="org.springframework.samples.jpetstore.services.PetStoreServiceImpl">
        <property name="accountDao" ref="accountDao"/>
        <property name="itemDao" ref="itemDao"/>
        <!-- additional collaborators and configuration for this bean go here -->
    </bean>

    <!-- more bean definitions for services go here -->

</beans>
```

下面的示例显示了数据访问对象（`daos.xml`）配置文件:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="accountDao"
        class="org.springframework.samples.jpetstore.dao.jpa.JpaAccountDao">
        <!-- additional collaborators and configuration for this bean go here -->
    </bean>

    <bean id="itemDao" class="org.springframework.samples.jpetstore.dao.jpa.JpaItemDao">
        <!-- additional collaborators and configuration for this bean go here -->
    </bean>

    <!-- more bean definitions for data access objects go here -->

</beans>
```

在上面的例子中，服务层由PetStoreServiceImpl类，两个数据访问对象JpaAccountDao类和JpaItemDao类（基于JPA对象/关系映射标准）组成 property name元素是指JavaBean属性的名称，而ref元素引用另一个bean定义的名称。id和ref元素之间的这种联系表达了组合对象之间的相互依赖关系。有关对象间的依赖关系，请参阅[依赖](#beans-dependencies) .

<a id="beans-factory-xml-import"></a>

##### [](#beans-factory-xml-import)组合基于XML的元数据配置

使用XML配置，可以让bean定义分布在多个XML文件上，这种方法直观优雅清晰明显。通常，每个单独的XML配置文件代表架构中的一个逻辑层或模块。

你可以使用应用程序上下文构造函数从所有这些XML片段加载bean定义，这个构造函数可以输入多个资源位置，[如上一节所示](#beans-factory-instantiation)。 或者，使用`<import/>`元素也可以从另一个（或多个）文件加载bean定义。例如：

    <beans>
        <import resource="services.xml"/>
        <import resource="resources/messageSource.xml"/>
        <import resource="/resources/themeSource.xml"/>
    
        <bean id="bean1" class="..."/>
        <bean id="bean2" class="..."/>
    </beans>

上面的例子中，使用了3个文件：`services.xml`, `messageSource.xml`, 和 `themeSource.xml`来加载外部Bean的定义。 导入文件采用的都是相对路径，因此`services.xml`必须和导入文件位于同一目录或类路径中，而`messageSource.xml` 和 `themeSource.xml` 必须在导入文件的资源位置中。正如你所看到的，前面的斜线将会被忽略，但考虑到这些路径是相对的，最佳的使用是不用斜线的。 这个XML文件的内容都会被导入，包括顶级的 `<beans/>`元素，但必须遵循Spring Schema定义XML bean定义的规则 。

这种相对路径的配置是可行的，但不推荐这样做，引用在使用相对于"../"路径的父目录文件中，这样做会对当前应用程序之外的文件产生依赖关系。 特别是对于`classpath:`: URLs(例如`classpath:../services.xml`)，不建议使用此引用，因为在该引用中，运行时解析过程选择“最近的”classpath根目录，然后查看其父目录。 类路径的变化或者选择了不正确的目录都会导致此配置不可用。

您可以使用完全限定的资源位置而不是相对路径:例如，`file:C:/config/services.xml`或者`classpath:/config/services.xml`.。 但是，请注意，您正在将应用程序的配置与特定的绝对位置耦合。通常会选取间接的方式应对这种绝对路径，例如使用占位符“${…}”来解决对JVM系统属性的引用。

import 是由bean命名空间本身提供的功能。在Spring提供的XML命名空间中，如“`context`”和“`util`”命名空间，可以用于对普通bean定义进行更高级的功能配置。

<a id="groovy-bean-definition-dsl"></a>

##### [](#groovy-bean-definition-dsl)DSL定义Groovy Bean

作为从外部配置元数据的另一个示例，bean定义也可以使用Spring的Groovy DSL来定义。Grails框架有此配置实例，通常， 可以在具有以下结构的".groovy"文件中配置bean定义。例如：

```groovy
beans {
    dataSource(BasicDataSource) {
        driverClassName = "org.hsqldb.jdbcDriver"
        url = "jdbc:hsqldb:mem:grailsDB"
        username = "sa"
        password = ""
        settings = [mynew:"setting"]
    }
    sessionFactory(SessionFactory) {
        dataSource = dataSource
    }
    myService(MyService) {
        nestedBean = { AnotherBean bean ->
            dataSource = dataSource
        }
    }
}
```

这种配置风格在很大程度上等价于XML bean定义，甚至支持Spring的XML配置名称空间。它还允许通过`importBeans`指令导入XML bean定义文件。


<a id="beans-factory-client"></a>

#### [](#beans-factory-client)1.2.3. 使用容器

`ApplicationContext`是能够创建bean定义以及处理相互依赖关系的高级工厂接口，使用方法`T getBean(String name, Class<T> requiredType)`获取容器实例。

`ApplicationContext`可以读取bean定义并访问它们 如下 :

java:

```java
// create and configure beans
ApplicationContext context = new ClassPathXmlApplicationContext("services.xml", "daos.xml");

// retrieve configured instance
PetStoreService service = context.getBean("petStore", PetStoreService.class);

// use configured instance
List<String> userList = service.getUsernameList();
```

kotlin:

```kotlin
import org.springframework.beans.factory.getBean

// create and configure beans
val context = ClassPathXmlApplicationContext("services.xml", "daos.xml")

// retrieve configured instance
val service = context.getBean<PetStoreService>("petStore")

// use configured instance
var userList = service.getUsernameList()
```

使用Groovy配置引导看起来非常相似，只是用到不同的上下文实现类：它是Groovy感知的（但也需理解XML bean定义） 如下:

java:

```groovy
ApplicationContext context = new GenericGroovyApplicationContext("services.groovy", "daos.groovy");
```

kotlin:

```kotlin
val context = GenericGroovyApplicationContext("services.groovy", "daos.groovy")
```

最灵活的变体是`GenericApplicationContext`，例如读取XML文件的`XmlBeanDefinitionReader`。如下面的示例所示:

java:

```java
GenericApplicationContext context = new GenericApplicationContext();
new XmlBeanDefinitionReader(context).loadBeanDefinitions("services.xml", "daos.xml");
context.refresh();
```

kotlin:

```kotlin
val context = GenericApplicationContext()
GroovyBeanDefinitionReader(context).loadBeanDefinitions("services.groovy", "daos.groovy")
context.refresh()
```

您还可以为Groovy文件使用`GroovyBeanDefinitionReader`，如下面的示例所示:

```groovy
GenericApplicationContext context = new GenericApplicationContext();
new GroovyBeanDefinitionReader(context).loadBeanDefinitions("services.groovy", "daos.groovy");
context.refresh();
```

这一类的读取可以在同一个 `ApplicationContext`上混合使用，也可以自动匹配，如果需要可以从不同的配置源读取bean定义。

您可以使用 `getBean`来获取bean实例， `ApplicationContext`接口也可以使用其他的方法来获取bean。但是在理想情况下，应用程序代码永远不应该使用它们。 事实上，你的应用程序代码也不应该调用的`getBean()`方法，因此对Spring API没有依赖。例如，Spring与Web框架的集成为各种Web框架组件(如控制器和JSF管理bean） 提供了依赖项注入功能，从而允许开发者通过元数据声明对特定bean的依赖(例如，自动注解）。
