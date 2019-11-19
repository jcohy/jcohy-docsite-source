---
title: 
keywords: docs，jcohy-docs,
description: 
---

### [](#resources-resource)2.2. 资源接口

Spring的`Resource`接口的目标是成为一个更强大的接口，用于抽象对底层资源的访问。 以下清单显示了`Resource`接口定义：

```java
public interface Resource extends InputStreamSource {

    boolean exists();

    boolean isOpen();

    URL getURL() throws IOException;

    File getFile() throws IOException;

    Resource createRelative(String relativePath) throws IOException;

    String getFilename();

    String getDescription();

}
```

kotlin
```kotlin
interface Resource : InputStreamSource {

    fun exists(): Boolean

    val isOpen: Boolean

    val url: URL

    val file: File

    @Throws(IOException::class)
    fun createRelative(relativePath: String): Resource

    val filename: String

    val description: String
}
```


正如`Resource`接口的定义所示，它扩展了`InputStreamSource`接口。 以下清单显示了`InputStreamSource`接口的定义：

```java
public interface InputStreamSource {

    InputStream getInputStream() throws IOException;

}
```

kotlin 
```kotlin
interface InputStreamSource {

    val inputStream: InputStream
}
```


`Resource` 接口中一些最重要的方法是：

*   `getInputStream()`: 用于定位和打开当前资源, 返回当前资源的`InputStream` ，预计每一次调用都会返回一个新的`InputStream`. 因此调用者必须自行关闭当前的输出流.

*   `exists()`: 返回`boolean`值，表示当前资源是否存在。

*   `isOpen()`: 返回`boolean`值，表示当前资源是否有已打开的输入流。如果为 `true`，那么`InputStream`不能被多次读取 ，只能在一次读取后即关闭以防止内存泄漏。除了`InputStreamResource`外，其他常用Resource实现都会返回`false`。

*   `getDescription()`: 返回当前资源的描述，当处理资源出错时，资源的描述会用于输出错误的信息。一般来说，资源的描述是一个完全限定的文件名称，或者是当前资源的真实URL。


其他方法允许您获取表示资源的实际`URL`或`File`对象（如果底层实现兼容并支持该功能）。

在Spring里， `Resource`抽象有着相当广泛的使用，例如，当需要某个资源时， `Resource`可以当作方法签名里的参数类型被使用。在Spring API中，有些方法（例如各种`ApplicationContext`实现的构造函数） 会直接采用普通格式的`String`路径来创建合适的`Resource`，调用者也可以通过在路径里带上指定的前缀来创建特定的`Resource`实现。

不但Spring内部和使用Spring的应用都大量地使用了`Resource`接口,而且开发者在应用代码中将它作为一个通用的工具类也是非常通用的。当你仅需要使用到`Resource`接口实现时， 可以直接忽略Spring的其余部分.虽然这样会与Spring耦合,但是也只是耦合一部分而已。使用这些`Resource`实现代替底层的访问是极其美好的。这与开发者引入其他库的目的也是一样的

`Resource`抽象不会取代功能。 它尽可能地包裹它。 例如，`UrlResource`包装`URL`并使用包装的URL来完成其工作。
