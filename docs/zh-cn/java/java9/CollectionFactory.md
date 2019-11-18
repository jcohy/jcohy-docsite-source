---
title: 集合工厂方法
keywords: docs,jcohy-docs,java9,集合工厂方法
description: 集合工厂方法
---

## 集合工厂方法
### 官方Feature
* 269: Convenience Factory Methods for Collections
在集合上，Java 9 增加 了 List.of()、Set.of()、Map.of() 和 M ap.ofEntries()等工厂方法来创建不可变集合 ，如 下 所示。
```java
List.of(); 
List.of("Hello", "World"); 
List.of(1, 2, 3);
Set.of(); 
Set.of("Hello", "World"); 
Set.of(1, 2, 3);
Map.of();
Map.of("Hello", 1, "World", 2);
```
