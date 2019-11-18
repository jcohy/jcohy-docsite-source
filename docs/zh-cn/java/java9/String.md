---
title: String存储结构变更
keywords: docs,jcohy-docs,java9,String存储结构变更
description: String存储结构变更
---

## String存储结构变更
### 官方Feature
* JEP 254: Compact Strings

### 动机
String类的在jdk8之前的实现是采用的char数组来存储的，每个字符使用两个字节（十六位）。然而， 从许多不同的应用程序收集到的数据表明，字符串是堆使用的主要组成部分，而且，大多数String对象仅包含Latin-1这样的拉丁字符。 这样的字符仅需要一个字节的存储空间，因此此类String对象的内部char数组中的一半空间都没有使用。

### 实现
我们建议将String类的内部表示形式从UTF-16字符数组更改为字节数组，再加上一个encoding-flag字段。新的String类将存储基于字符串内容编码为ISO-8859-1 / Latin-1（每个字符一个字节）或UTF-16（每个字符两个字节）的字符。encoding-flag字段将指示使用哪种编码。
与字符串相关的类（例如AbstractStringBuilder，StringBuilder和StringBuffer）将更新为使用相同的表示形式，HotSpot VM的固有字符串操作也将使用相同的表示形式。
这纯粹是实现更改，不更改现有的公共接口。没有计划添加任何新的公共API或其他接口。
