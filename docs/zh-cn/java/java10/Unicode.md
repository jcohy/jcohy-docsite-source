---
title: 额外的Unicode语言标签扩展
keywords: docs,jcohy-docs,java10,额外的Unicode语言标签扩展
description: 额外的Unicode语言标签扩展
---

## 额外的Unicode语言标签扩展
自 Java 7 开始支持 BCP 47 语言标记以来， JDK 中便增加了与日历和数字相关的 Unicode 区域设置扩展，在 Java 9 中，新增支持 ca 和 nu 两种语言标签扩展。而在 Java 10 中将继续增加 Unicode 语言标签扩展，具体为：增强 java.util.Locale 类及其相关的 API，以更方便的获得所需要的语言地域环境信息。同时在这次升级中还带来了如下扩展支持：

##### Unicode 扩展表

| **编码** | **注释**     |
| -------- | ------------ |
| cu       | 货币类型     |
| fw       | 一周的第一天 |
| rg       | 区域覆盖     |
| tz       | 时区         |

```java
java.time.format.DateTimeFormatter::localizedBy
```

 通过这个方法，可以采用某种数字样式，区域定义或者时区来获得时间信息所需的语言地域本地环境信息。 
