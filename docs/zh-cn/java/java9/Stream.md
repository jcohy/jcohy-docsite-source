---
title: 增强的StreamAPI
keywords: docs,jcohy-docs,java9,增强的StreamAPI
description: 增强的StreamAPI
---

## 增强的StreamAPI
Stream 中增加了新的方法 ofNullable、dropWhile、takeWhile 和 iterate。在 如下代码中，流中包含了从 1 到 5 的 元素。断言检查元素是否为奇数。第一个元素 1 被删除，结果流中包含 4 个元素。
```java
@Test 
public void testDropWhile() throws Exception { 
    final long count = Stream.of(1, 2, 3, 4, 5) 
        .dropWhile(i -> i % 2 != 0) 
        .count(); 
    assertEquals(4, count); 
}
```

Collectors 中增加了新的方法 filtering 和 flatMapping。在 如下代码中，对于输入的 String 流 ，先通过 flatMapping 把 String 映射成 Integer 流 ，再把所有的 Integer 收集到一个集合中。
```java
@Test 
public void testFlatMapping() throws Exception { 
    final Set<Integer> result = Stream.of("a", "ab", "abc") 
        .collect(Collectors.flatMapping(v -> v.chars().boxed(), 
            Collectors.toSet())); 
    assertEquals(3, result.size()); 
}
```
Optiona l 类中新增了 ifPresentOrElse、or 和 stream 等方法。在 如下代码中，Optiona l 流中包含 3 个 元素，其中只有 2 个有值。在使用 flatMap 之后，结果流中包含了 2 个值。
```java
@Test 
public void testStream() throws Exception { 
    final long count = Stream.of( 
        Optional.of(1), 
        Optional.empty(), 
        Optional.of(2) 
    ).flatMap(Optional::stream) 
        .count(); 
    assertEquals(2, count); 
}
```
