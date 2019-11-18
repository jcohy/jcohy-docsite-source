---
title: 多分辨率图像API
keywords: docs,jcohy-docs,java9,多分辨率图像API
description: 多分辨率图像API
---

## 多分辨率图像API
### 官方Feature
* 251: Multi-Resolution Images
* 263: HiDPI Graphics on Windows and Linux

> 在Mac上，JDK已经支持视网膜显示，但在Linux和Windows上，它并没有。在那里，Java程序在当前的高分辨率屏幕上可能看起来很小，不能使用它们。这是因为像素用于这些系统的大小计算（无论像素实际有多大）。毕竟，高分辨率显示器的有效部分是像素非常小。
> JEP 263以这样的方式扩展了JDK，即Windows和Linux也考虑到像素的大小。为此，使用比现在更多的现代API：Direct2D for Windows和GTK +，而不是Xlib for Linux。图形，窗口和文本由此自动缩放。
> JEP 251还提供处理多分辨率图像的能力，即包含不同分辨率的相同图像的文件。根据相应屏幕的DPI度量，然后以适当的分辨率使用图像。
### 使用
* 新的API定义在java.awt.image包下
* 将不同分辨率的图像封装到一张（多分辨率的）图像中，作为它的变体
* 获取这个图像的所有变体
* 获取特定分辨率的图像变体-表示一张已知分辨率单位为DPI的特定尺寸大小的逻辑图像，并且这张图像是最佳的变体。
* 基于当前屏幕分辨率大小和运用的图像转换算法，java.awt.Graphics类可以从接口MultiResolutionImage获取所需的变体。
* MultiResolutionImage的基础实现是java.awt.image.BaseMultiResolutionImage
