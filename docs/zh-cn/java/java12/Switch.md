---
title: Switch 表达式扩展
keywords: docs,jcohy-docs,Switch，java12
description: Switch 表达式扩展
---

## Switch 表达式扩展
传统的switch声明语句(switch statement)在使用中有一些问题：
* 匹配是自上而下的，如果忘记写break, 后面的case语句不论匹配与否都会执行；
* 所有的case语句共用一个块范围，在不同的case语句定义的变量名不能重复；
* 不能在一个case里写多个执行结果一致的条件；
* 整个switch不能作为表达式返回值；

Java 12将会对switch声明语句进行扩展，可将其作为增强版的 switch 语句或称为 "switch 表达式"来写出更加简化的代码。
### 预览语言

Switch 表达式也是作为预览语言功能的第一个语言改动被引入新版 Java 中来的，预览语言功能的想法是在 2018 年初被引入 Java 中的，本质上讲，这是一种引入新特性的测试版的方法。通过这种方式，能够根据用户反馈进行升级、更改，在极端情况下，如果没有被很好的接纳，则可以完全删除该功能。预览功能的关键在于它们没有被包含在 Java SE 规范中。

### 使用
扩展的 switch 语句，不仅可以作为语句（statement），还可以作为表达式（expression），并且两种写法都可以使用传统的 switch 语法，或者使用简化的“case L ->”模式匹配语法作用于不同范围并控制执行流。这些更改将简化日常编码工作，并为 switch 中的模式匹配（JEP 305）做好准备。
* 使用 Java 12 中 Switch 表达式的写法，省去了 break 语句，避免了因少写 break 而出错。同时将多个 case 合并到一行，显得简洁、清晰也更加优雅的表达逻辑分支，其具体写法就是将之前的 case 语句表成了：case L ->，即如果条件匹配 case L，则执行标签右侧的代码 ，同时标签右侧的代码段只能是表达式、代码块或throw 语句。
* 为了保持兼容性，case 条件语句中依然可以使用字符 : ，这时 fall-through 规则依然有效的，即不能省略原有的 break 语句，但是同一个 Switch 结构里不能混用 -> 和 : ，否则会有编译错误。并且简化后的 Switch 代码块中定义的局部变量，其作用域就限制在代码块中，而不是蔓延到整Switch 结构，也不用根据不同的判断条件来给变量赋值。
java12之前
```java
public class SwitchTest {
    public static void main(String[] args) {
        int numberOfLetters;
        Fruit fruit = Fruit.APPLE;
        switch (fruit) {
            case PEAR:
                numberOfLetters = 4;
                break;
            case APPLE:
            case GRAPE:
            case MANGO:
                numberOfLetters = 5;
                break;
            case ORANGE:
            case PAPAYA:
                numberOfLetters = 6;
                break;
            default:
                throw new IllegalStateException("No Such Fruit:" + fruit);
        }
        System.out.println(numberOfLetters);
    }
}

enum Fruit {
	PEAR, APPLE, GRAPE, MANGO, ORANGE, PAPAYA;
}
```
如果有编码经验，你一定知道，switch 语句如果漏写了一个 break，那么逻辑往往就跑偏了，这种方式既繁琐，又容易出错。如果换成 switch 表达式，Pattern Matching 机制能够自然地保证只有单一路径会被执行：
java12
```java
public class SwitchTest1 {
    public static void main(String[] args) {
        Fruit fruit = Fruit.GRAPE;
        switch(fruit){
            case PEAR -> System.out.println(4);
            case APPLE,MANGO,GRAPE -> System.out.println(5);
            case ORANGE,PAPAYA -> System.out.println(6);
            default -> throw new IllegalStateException("No Such Fruit:" + fruit);
        };
    }
}
```
更进一步，下面的表达式，为我们提供了优雅地表达特定场合计算逻辑的方式：
```java
public class SwitchTest2 {
    public static void main(String[] args) {
        Fruit fruit = Fruit.GRAPE;
        int numberOfLetters = switch(fruit){
            case PEAR -> 4;
            case APPLE,MANGO,GRAPE -> 5;
            case ORANGE,PAPAYA -> 6;
            default -> throw new IllegalStateException("No Such Fruit:" + fruit);
        };
        System.out.println(numberOfLetters);
    }
}
```
举例2
java12之前：
```java
public class SwitchTest {
    public static void main(String[] args) {
        Week day = Week.FRIDAY;
        switch (day) {
            case MONDAY:
            case FRIDAY:
            case SUNDAY:
                System.out.println(6);
                break;
            case TUESDAY:
                System.out.println(7);
                break;
            case THURSDAY:
            case SATURDAY:
                System.out.println(8);
                break;
            case WEDNESDAY:
                System.out.println(9);
                break;
            default:
                throw new IllegalStateException("What day is today?" + day);
        }
    }
}
enum Week {
    MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY;
}
```
java12
```java
public class SwitchTest1 {
    public static void main(String[] args) {
        Week day = Week.FRIDAY;
        switch (day) {
            case MONDAY,FRIDAY, SUNDAY -> System.out.println(6);
            case TUESDAY -> System.out.println(7);
            case THURSDAY, SATURDAY -> System.out.println(8);
            case WEDNESDAY -> System.out.println(9);
            default -> throw new IllegalStateException("What day is today?" + day);
        }
    }
}
```
java12更近一步
```java
public class SwitchTest2 {
    public static void main(String[] args) {
        Week day = Week.FRIDAY;
        int numLetters = switch (day) {
            case MONDAY, FRIDAY, SUNDAY -> 6;
            case TUESDAY -> 7;
            case THURSDAY, SATURDAY -> 8;
            case WEDNESDAY -> 9;
            default -> throw new IllegalStateException("What day is today?" + day);
        };
    }
}
```
