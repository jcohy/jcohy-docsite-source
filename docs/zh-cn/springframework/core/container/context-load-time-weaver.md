---
title: 注册`LoadTimeWeaver`
keywords: keywords: docs，jcohy-docs，spring,注册`LoadTimeWeaver`
description: Spring  Framework 中文文档 》 注册`LoadTimeWeaver`
---

# Spring  Framework 中文文档
### [](#context-load-time-weaver)1.14. 注册`LoadTimeWeaver`

`LoadTimeWeaver`被Spring用来在将类加载到Java虚拟机(JVM)中时动态地转换类

若要开启加载时织入,要在`@Configuration`类中增加`@EnableLoadTimeWeaving`注解，如以下示例所示：

```java
@Configuration
@EnableLoadTimeWeaving
public class AppConfig {
}
```

```kotlin
@Configuration
@EnableLoadTimeWeaving
class AppConfig
```

或者，对于XML配置，您可以使用`context:load-time-weaver` 元素:

```xml
<beans>
    <context:load-time-weaver/>
</beans>
```

一旦配置为 `ApplicationContext`,该 `ApplicationContext`中的任何bean都可以实现`LoadTimeWeaverAware`,从而接收对load-time weaver实例的引用。 这特别适用于[Spring的JPA支持](https://github.com/DocsHome/spring-docs/blob/master/pages/dataaccess/data-access.md#orm-jpa)。其中JPA类转换可能需要加载时织入。 有关更多详细信息，请参阅[`LocalContainerEntityManagerFactoryBean`](https://docs.spring.io/spring-framework/docs/5.1.3.BUILD-SNAPSHOT/javadoc-api/org/springframework/orm/jpa/LocalContainerEntityManagerFactoryBean.html).。 有关AspectJ加载时编织的更多信息，请参阅[Spring Framework中使用AspectJ的加载时织入](#aop-aj-ltw)。
