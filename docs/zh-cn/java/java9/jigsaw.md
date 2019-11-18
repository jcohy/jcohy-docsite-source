---
title: jigsaw
keywords: docs,jcohy-docs,java9,jigsaw
description: jigsaw
---

## 模块化系统 Jigsaw > Modularity

### 官方Feature
- 200: The Modular JDK 201: Modular Source Code

- 220: Modular Run-Time Images

- 260: Encapsulate Most Internal APIs 

- 261: Module System

- 282: jlink: The Java Linker

### 概述

> Java 平台模块系统，也就是 Project Jigsaw，把模块化开发实践引入到了 Java 平台中。在引入了模块系统之后，JDK 被重新组织成 94 个模块。Java 应用可以通过新增的 jlink 工具，创建出只包含所依赖的 JDK 模块的自定义运行时镜像。这样可以极大的减少 Java 运行时环境的大小。这对于目前流行的不可变基础设施的实践来说，镜像的大小的减少可以节省很多存储空间和带宽资源 。

> 模块化开发的实践在软件开发领域并不是一个新的概念。Java 开发社区已经使用这样的模块化实践有相当长的一段时间。主流的构建工具，包括 Apache Maven 和 Gradle 都支持把一个大的项目划分成若干个子项目。子项目之间通过不同的依赖关系组织在一起。每个子项目在构建之后都会产生对应的 JAR 文件。 在 Java9 中 ，已有的这些项目可以很容易的升级转换为 Java 9 模块 ，并保持原有的组织结构不变。

> Java 9 模块的重要特征是在其工件（artifact）的根目录中包含了一个描述模块的 module-info.class 文 件。 工件的格式可以是传统的 JAR 文件或是 Java 9 新增的 JMOD 文件。这个文件由根目录中的源代码文件 module-info.java 编译而来。该模块声明文件可以描述模块的不同特征。模块声明文件中可以包含的内容如下：

- 模块导出的包：使用 exports 可以声明模块对其他模块所导出的包。包中的 public 和 protected 类型，以及这些类型的 public 和 protected 成员可以被其他模块所访问。没有声明为导出的包相当于模块中的私有成员，不能被其他模块使用。

- 模块的依赖关系：使用 requires 可以声明模块对其他模块的依赖关系。使用 requires transitive 可 以把一个模块依赖声明为传递的。传递的模块依赖可以被依赖当前模块的其他模块所读取。 如果一个模块所导出的类型的型构中包含了来自它所依赖的模块的类型，那么对该模块的依赖应该声明为传递的。

- 服务的提供和使用：如果一个模块中包含了可以被 ServiceLocator 发现的服务接口的实现 ，需要使用 provides with 语句来声明具体的实现类 ；如果一个模块需要使用服务接口，可以使用 uses 语句来声明。

### 使用

```java
module com.jcohy.sample { 
    exports com.jcohy.sample; 
    requires com.jcohy.common; 
    provides com.jcohy.common.DemoService with
        com.mycompany.sample.DemoServiceImpl; 
}
```

模块系统中增加了模块路径的概念。模块系统在解析模块时，会从模块路径中进行查找。为了保持与之前 Java 版本的兼容性，CLASSPATH 依然被保留。所有的类型在运行时都属于某个特定的模块。对于从 CLASSPATH 中加载的类型，它们属于加载它们的类加载器对应的未命名模块。可以通过 Class 的 getModule()方法来获取到表示其所在模块的 Module 对象。

在 JVM 启动时，会从应用的根模块开始，根据依赖关系递归的进行解析，直到得到一个表示依赖关系的图。如果解析过程中出现找不到模块的情况，或是在模块路径的同一个地方找到了名称相同的模块，模块解析过程会终止，JVM 也会退出。Java 也提供了相应的 API 与模块系统进行交互。