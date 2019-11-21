---
title: 
keywords: docs，jcohy-docs,
description: 
---

### [](#resources-implementations)2.3. 内置的资源实现

Spring包括以下`Resource`实现:

*   [`UrlResource`](#resources-implementations-urlresource)

*   [`ClassPathResource`](#resources-implementations-classpathresource)

*   [`FileSystemResource`](#resources-implementations-filesystemresource)

*   [`ServletContextResource`](#resources-implementations-servletcontextresource)

*   [`InputStreamResource`](#resources-implementations-inputstreamresource)

*   [`ByteArrayResource`](#resources-implementations-bytearrayresource)


<a id="resources-implementations-urlresource"></a>

#### [](#resources-implementations-urlresource)2.3.1. `UrlResource`

`UrlResource` 封装了`java.net.URL`用来访问正常URL的任意对象。例如`file:` ，HTTP目标，FTP目标等。所有的URL都可以用标准化的字符串来表示，例如通过正确的标准化前缀。 可以用来表示当前URL的类型。 这包括`file:`，用于访问文件系统路径，`http:` ：用于通过HTTP协议访问资源，`ftp:`：用于通过FTP访问资源，以及其他。

通过java代码可以显式地使用`UrlResource`构造函数来创建`UrlResource`，但也可以调用API方法来使用代表路径的String参数来隐式创建`UrlResource`。 对于后一种情况，JavaBeans `PropertyEditor`最终决定要创建哪种类型的`Resource`。如果路径字符串包含众所周知的（对于它，那么）前缀（例如 `classpath:`:)，它会为该前缀创建适当的专用`Resource`。 但是，如果它无法识别前缀，则假定该字符串是标准URL字符串并创建`UrlResource`。

<a id="resources-implementations-classpathresource"></a>

#### [](#resources-implementations-classpathresource)2.3.2. `ClassPathResource`

ClassPathResource代表从类路径中获取资源，它使用线程上下文加载器，指定类加载器或给定class类来加载资源。

当类路径上资源存于文件系统中时，`ClassPathResource`支持使用`java.io.File`来访问。但是当类路径上的资源位于未解压(没有被Servlet引擎或其他可解压的环境解压）的jar包中时， `ClassPathResource`就不再支持以`java.io.File`的形式访问。鉴于此，Spring中各种Resource的实现都支持以`java.net.URL`的形式访问资源。

可以显式使用`ClassPathResource`构造函数来创建`ClassPathResource`，但是更多情况下，是调用API方法使用的。即使用一个代表路径的`String`参数来隐式创建`ClassPathResource`。 对于后一种情况，将会由JavaBeans的`PropertyEditor`来识别路径中`classpath:`前缀，并创建`ClassPathResource`。

<a id="resources-implementations-filesystemresource"></a>

#### [](#resources-implementations-filesystemresource)2.3.3. `FileSystemResource`

`FileSystemResource`是用于处理`java.io.File`和`java.nio.file.Path`的实现，显然，它同时能解析作为`File`和作为`URL`的资源。

<a id="resources-implementations-servletcontextresource"></a>

#### [](#resources-implementations-servletcontextresource)2.3.4. `ServletContextResource`

这是`ServletContext`资源的 `Resource`实现，用于解释相关Web应用程序根目录中的相对路径。

ServletContextResource完全支持以流和URL的方式访问资源，但只有当Web项目是解压的（不是以war等压缩包形式存在），而且该ServletContext资源必须位于文件系统中， 它支持以`java.io.File`的方式访问资源。无论它是在文件系统上扩展还是直接从JAR或其他地方（如数据库）（可以想象）访问，实际上都依赖于Servlet容器。

<a id="resources-implementations-inputstreamresource"></a>

#### [](#resources-implementations-inputstreamresource)2.3.5. `InputStreamResource`

`InputStreamResource`是针对`InputStream`提供的`Resource`实现。在一般情况下，如果确实无法找到合适的`Resource`实现时，才去使用它。 同时请优先选择`ByteArrayResource`或其他基于文件的`Resource`实现，迫不得已的才使用它。

与其他`Resource` 实现相比，这是已打开资源的描述符。 因此，它从`isOpen()`返回`true`。

<a id="resources-implementations-bytearrayresource"></a>

#### [](#resources-implementations-bytearrayresource)2.3.6. `ByteArrayResource`

这是给定字节数组的`Resource`实现。 它为给定的字节数组创建一个`ByteArrayInputStream`。

当需要从字节数组加载内容时，ByteArrayResource会是个不错的选择，无需求助于单独使用的`InputStreamResource`。
