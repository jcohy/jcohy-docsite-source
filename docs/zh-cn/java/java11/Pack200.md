---
title: 废除 Pack200
keywords: docs,jcohy-docs, Pack200,java11
description: 废除 Pack200
---

## 废除 Pack200
Java5中带了一个压缩工具:Pack200，这个工具能对普通的jar文件进行高效压缩。其  实现原理是根据Java类特有的结构，合并常数  池，去掉无用信息等来实现对java类的高效压缩。由于是专门对Java类进行压缩的，所以对普通文件的压缩和普通压缩软件没有什么两样，但是对于Jar  文件却能轻易达到10-40%的压缩率。这在Java应用部署中很有用，尤其对于移动Java计算，能够大大减小代码下载量。
Java5中还提供了这一技术的API接口，你可以将其嵌入到你的程序中使用。使用的方法很简单，下面的短短几行代码即可以实现jar的压缩和解压：
压缩
```java
Packer packer=Pack200.newPacker(); 
OutputStream output=new BufferedOutputStream(new  FileOutputStream(outfile)); 
packer.pack(new JarFile(jarFile), output); 
output.close(); 
```

解压
```java
Unpacker unpacker=Pack200.newUnpacker(); 
output=new JarOutputStream(new FileOutputStream(jarFile)); 
unpacker.unpack(pack200File, output); 
output.close(); 
```

Pack200的压缩和解压缩速度是比较快的，而且压缩率也是很惊人的，在我是使用  的包4.46MB压缩后成了1.44MB（0.322%），而且随着包的越大压缩率会根据明显，据说如果jar包都是class类可以压缩到1/9的大  小。其实JavaWebStart还有很多功能，例如可以按不同的jar包进行lazy下载和 单独更新，设置可以根据jar中的类变动进行class粒度的下载。


但是在java11中废除了pack200以及unpack200工具以及java.util.jar中的Pack200 API。因为Pack200主要是用来压缩jar包的工具，由于网络下载速度的提升以及java9引入模块化系统之后不再依赖Pack200，因此这个版本将其移除掉。
