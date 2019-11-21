---
title: 
keywords: docs，jcohy-docs,
description: 
---

### [](#resources-app-ctx)2.7. 应用上下文和资源路径

本节介绍如何使用资源创建应用程序上下文，包括使用XML的快捷方式，如何使用通配符以及其他详细信息。

<a id="resources-app-ctx-construction"></a>

#### [](#resources-app-ctx-construction)2.7.1. 构造应用上下文

应用程序上下文构造函数（对于特定的应用程序上下文类型）通常将字符串或字符串数组作为资源的位置路径，例如构成上下文定义的XML文件。

当指定的位置路径没有带前缀时，那么从指定位置路径创建`Resource`类型（用于后续加载bean定义），具体取决于所使用应用上下文。 例如，请考虑以下示例，该示例创建`ClassPathXmlApplicationContext`：

```java
ApplicationContext ctx = new ClassPathXmlApplicationContext("conf/appContext.xml");
```

bean定义是从类路径加载的，因为使用了`ClassPathResource`。 但是，请考虑以下示例，该示例创建 `FileSystemXmlApplicationContext`：

```java
ApplicationContext ctx =
    new FileSystemXmlApplicationContext("conf/appContext.xml");
```

现在，bean定义是从文件系统位置加载的（在这种情况下，相对于当前工作目录）。

若位置路径带有classpath前缀或URL前缀，会覆盖默认创建的用于加载bean定义的`Resource`类型。请考虑以下示例：

```java
ApplicationContext ctx =
    new FileSystemXmlApplicationContext("classpath:conf/appContext.xml");
```

使用`FileSystemXmlApplicationContext`从类路径加载bean定义。 但是，它仍然是`FileSystemXmlApplicationContext`。 如果它随后用作`ResourceLoader`，则任何未加前缀的路径仍被视为文件系统路径。

<a id="resources-app-ctx-classpathxml"></a>

##### [](#resources-app-ctx-classpathxml)构造`ClassPathXmlApplicationContext`实例的快捷方式

`ClassPathXmlApplicationContext`提供了多个构造函数，以利于快捷创建`ClassPathXmlApplicationContext`的实例。基础的想法是， 使用只包含多个XML文件名（不带路径信息）的字符串数组和一个Class参数的构造器，所省略路径信息`ClassPathXmlApplicationContext`会从`Class`参数中获取。

请考虑以下目录布局:

com/
  foo/
    services.xml
    daos.xml
    MessengerService.class

以下示例显示如何实例化由名为`services.xml`和`daos.xml`（位于类路径中）的文件中定义的bean组成的`ClassPathXmlApplicationContext`实例：

```java
ApplicationContext ctx = new ClassPathXmlApplicationContext(
    new String[] {"services.xml", "daos.xml"}, MessengerService.class);
```

有关各种构造函数的详细信息，请参阅[`ClassPathXmlApplicationContext`](https://docs.spring.io/spring-framework/docs/5.1.3.BUILD-SNAPSHOT/javadoc-api/org/springframework/jca/context/SpringContextResourceAdapter.html)javadoc。

<a id="resources-app-ctx-wildcards-in-resource-paths"></a>

#### [](#resources-app-ctx-wildcards-in-resource-paths)2.7.2. 使用通配符构造应用上下文

从前文可知，应用上下文构造器的资源路径可以是单一的路径（即一对一地映射到目标资源）。也可以使用高效的通配符。可以包含特殊的"classpath*:"前缀或ant风格的正则表达式（使用Spring的PathMatcher来匹配）。

通配符机制可用于组装应用程序的组件，应用程序里所有组件都可以在一个公用的位置路径发布自定义的上下文片段，那么最终的应用上下文可使用`classpath*:`。 在同一路径前缀（前面的公用路径）下创建，这时所有组件上下文的片段都会被自动装配。

请注意，此通配符特定于在应用程序上下文构造函数中使用资源路径（或直接使用 `PathMatcher`实用程序类层次结构时），并在构造时解析。 它与资源类型本身无关。 您不能使用`classpath*:`前缀来构造实际的`Resource`,，因为资源一次只指向一个资源。

<a id="resources-app-ctx-ant-patterns-in-paths"></a>

##### [](#resources-app-ctx-ant-patterns-in-paths)Ant风格模式

路径位置可以包含Ant样式模式，如以下示例所示:

/WEB-INF/*-context.xml
com/mycompany/**/applicationContext.xml
file:C:/some/path/*-context.xml
classpath:com/mycompany/**/applicationContext.xml

当路径位置包含Ant样式模式时，解析程序遵循更复杂的过程来尝试解析通配符。解释器会先从位置路径里获取最靠前的不带通配符的路径片段， 并使用这个路径片段来创建一个`Resource`，并从中获取一个URL。 如果此URL不是`jar:`URL或特定于容器的变体（例如，在WebLogic中为`zip:`，在WebSphere中为`wsjar`，等等） 则从Resource里获取`java.io.File`对象，并通过其遍历文件系统。进而解决位置路径里通配符。 对于jar URL，解析器要么从中获取`java.net.JarURLConnection`， 要么手动解析jar URL，然后遍历jar文件的内容以解析通配符。

<a id="resources-app-ctx-portability"></a>

###### [](#resources-app-ctx-portability)可移植性所带来的影响

如果指定的路径定为文件URL（不管是显式还是隐式的），首先默认的`ResourceLoader`就是文件系统，其次通配符使用程序可以完美移植。

如果指定的路径是类路径位置，则解析器必须通过 `Classloader.getResource()`方法调用获取最后一个非通配符路径段URL。 因为这只是路径的一个节点（而不是末尾的文件），实际上它是未定义的（在`ClassLoader` javadoc中），在这种情况下并不能确定返回什么样的URL。 实际上，它始终会使用`java.io.File`来解析目录，其中类路径资源会解析到文件系统的位置或某种类型的jar URL，其中类路径资源解析为jar包的位置。 但是，这个操作就碰到了可移植的问题了。

如果获取了最后一个非通配符段的jar包URL，解析器必须能够从中获取`java.net.JarURLConnection`，或者手动解析jar包的URL，以便能够遍历jar的内容。 并解析通配符，这适用于大多数工作环境，但在某些其他特定环境中将会有问题，最后会导致解析失败，所以强烈建议在特定环境中彻底测试来自jar资源的通配符解析，测试成功之后再对其作依赖使用。

<a id="resources-classpath-wildcards"></a>

##### [](#resources-classpath-wildcards)The `classpath*:` 前缀

当构造基于XML文件的应用上下文时，位置路径可以使用`classpath*:`前缀。如以下示例所示：

```java
ApplicationContext ctx =
    new ClassPathXmlApplicationContext("classpath*:conf/appContext.xml");
```

`classpath*:`的使用表示该类路径下所有匹配文件名称的资源都会被获取（本质上就是调用了`ClassLoader.getResources(…​)`方法，接着将获取到的资源装配成最终的应用上下文。

通配符类路径依赖于底层类加载器的`getResources()` 方法。由于现在大多数应用程序服务器都提供自己的类加载器实现，因此行为可能会有所不同，尤其是在处理jar文件时。 要在指定服务器测试`classpath*` 是否有效，简单点可以使用`getClass().getClassLoader().getResources("<someFileInsideTheJar>")`来加载类路径jar包里的文件。 尝试在两个不同的路径加载相同名称的文件，如果返回的结果不一致，就需要查看一下此服务器中与classloader设置相关的文档。

您还可以将`classpath*:` 前缀与位置路径的其余部分中的 `PathMatcher`模式组合在一起（例如，`classpath*:META-INF/*-beans.xml`）。 这种情况的解析策略非常简单，取位置路径最靠前的无通配符片段，然后调用`ClassLoader.getResources()`获取所有匹配到的类层次加载器加载资源，随后将`PathMatcher`的策略应用于每一个得到的资源。

<a id="resources-wildcards-in-path-other-stuff"></a>

##### [](#resources-wildcards-in-path-other-stuff)通配符的补充说明

请注意，除非所有目标资源都存在文件系统中，否则`classpath*:`与Ant样式模式结合，都只能在至少有一个确定了根路径的情况下，才能达到预期的效果。 这意味着`classpath*:*.xml`等模式可能无法从jar文件的根目录中检索文件，而只能从根目录中的扩展目录中检索文件。

问题的根源是JDK的`ClassLoader.getResources()`方法的局限性。当向`ClassLoader.getResources()`传入空串时（表示搜索潜在的根目录）， 只能获取的文件系统的位置路径，即获取不了jar中文件的位置路径。Spring也会评估`URLClassLoader`运行时配置和jar文件中的`java.class.path`清单，但这不能保证导致可移植行为。

扫描类路径包需要在类路径中存在相应的目录条目。 使用Ant构建JAR时，请不要激活JAR任务的文件开关。 此外，在某些环境中，类路径目录可能不会基于安全策略公开 - 例如，JDK 1.7.0_45及更高版本上的独立应用程序（需要在清单中设置'Trusted-Library' 。 请参阅[http://stackoverflow.com/questions/19394570/java-jre-7u45-breaks-classloader-getresources](https://stackoverflow.com/questions/19394570/java-jre-7u45-breaks-classloader-getresources))）。

在JDK 9的模块路径（Jigsaw）上，Spring的类路径扫描通常按预期工作。 此处强烈建议将资源放入专用目录，避免上述搜索jar文件根级别的可移植性问题。

如果有多个类路径上都用搜索到的根包，那么使用`classpath:`和ant风格模式一起指定资源并不保证会找到匹配的资源。请考虑以下资源位置示例：

com/mycompany/package1/service-context.xml

现在考虑一个人可能用来尝试查找该文件的Ant风格路径:

classpath:com/mycompany/**/service-context.xml

这样的资源可能只在一个位置，但是当使用前面例子之类的路径来尝试解析它时，解析器会处理`getResource("com/mycompany");`返回的（第一个）URL。 当在多个类路径存在基础包节点`"com/mycompany"`时(如在多个jar存在这个基础节点），解析器就不一定会找到指定资源。因此，这种情况下建议结合使用`classpath*:` 和ant风格模式，`classpath*:`会让解析器去搜索所有包含基础包节点的类路径。

<a id="resources-filesystemresource-caveats"></a>

#### [](#resources-filesystemresource-caveats)2.7.3. `FileSystemResource` 的警告

当`FileSystemResource`与`FileSystemApplicationContext`之间没有联系（即，当`FileSystemApplicationContext`不是实际的`ResourceLoader`时）时会按预期处理绝对路径和相对路径。 相对路径是相对与当前工作目录而言的，而绝对路径则是相对文件系统的根目录而言的。

但是，出于向后兼容性（历史）的原因，当`FileSystemApplicationContext`是`ResourceLoader`时，这会发生变化。`FileSystemApplicationContext`强制所有有联系的`FileSystemResource`实例将所有位置路径视为相对路径， 无论它们是否以'/'开头。 实际上，这意味着以下示例是等效的：

```java
ApplicationContext ctx =
    new FileSystemXmlApplicationContext("conf/context.xml");

ApplicationContext ctx =
    new FileSystemXmlApplicationContext("/conf/context.xml");
```

以下示例也是等效的（即使它们有所不同，因为一个案例是相对的而另一个案例是绝对的）：

```java
FileSystemXmlApplicationContext ctx = ...;
ctx.getResource("some/resource/path/myTemplate.txt");

FileSystemXmlApplicationContext ctx = ...;
ctx.getResource("/some/resource/path/myTemplate.txt");
```

实际上，如果确实需要使用绝对路径，建议放弃使用`FileSystemResource`和`FileSystemXmlApplicationContext`，而强制使用 `file:`的`UrlResource`。

```java
// actual context type doesn't matter, the Resource will always be UrlResource
ctx.getResource("file:///some/resource/path/myTemplate.txt");

// force this FileSystemXmlApplicationContext to load its definition via a UrlResource
ApplicationContext ctx =
    new FileSystemXmlApplicationContext("file:///conf/context.xml");
```
