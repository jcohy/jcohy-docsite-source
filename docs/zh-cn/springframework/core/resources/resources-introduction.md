---
title: 基于注解的容器配置
keywords: keywords: docs，jcohy-docs，spring,基于注解的容器配置
description: Spring  Framework 中文文档 》 简介
---

### [](#resources-introduction)2.1. 简介

遗憾的是，Java的标准`java.net.URL`类和各种 `URL`前缀的标准处理程序不足以完全访问底层资源。例如，没有标准化的 `URL`实现可用于访问需要从类路径或相对于 `ServletContext`获取的资源。 虽然可以为专用 `URL`前缀注册新的处理程序（类似于`http:` :)这样的前缀的现有处理程序，但这通常非常复杂，并且`URL`接口仍然缺少一些理想的功能，例如检查当前资源是否存在的方法。
