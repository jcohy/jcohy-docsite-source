---
title: Deprecated的相关API
keywords: docs,jcohy-docs,java9,Deprecated的相关API
description: Deprecated的相关API
---

## Deprecated的相关API
### 官方Feature
* 211: Elide Deprecation Warnings on Import Statements
* 214: Remove GC Combinations Deprecated in JDK 8
* 277: Enhanced Deprecation
* 289: Deprecate the Applet API
* 291: Deprecate the Concurrent Mark Sweep (CMS) Garbage Collector
Java 9 废弃或者移除了几个不常用的功能。其中最主要的是 Applet API，现在是标记为废弃的。随着对安全要求的提高，主流浏览器已经取消对 Java 浏览器插件的支持。HTML5 的出现也进一步加速了它的消亡。开发者现在可以使用像 Java Web Start 这样的技术来代替 Applet，它可以实现从浏览器启动应用程序或者安装应用程序。
同时，appletviewer 工具也被标记为废弃。
