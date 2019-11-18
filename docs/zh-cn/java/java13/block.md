---
title: 文本块（预览）
keywords: docs,jcohy-docs,文本块（预览,java13
description: 文本块（预览）
---

## 文本块（预览）
在JDK 12中引入了Raw String Literals特性，但在发布之前就放弃了。这个JEP与引入多行字符串文字（text block）在意义上是类似的。

这条新特性跟 Kotlin 里的文本块是类似的。

在Java中，通常需要使用String类型表达HTML，XML，SQL或JSON等格式的字符串，在进行字符串赋值时需要进行转义和连接操作，然后才能编译该代码，这种表达方式难以阅读并且难以维护。

文本块就是指多行字符串，例如一段格式化后的xml、json等。而有了文本块以后，用户不需要转义，Java能自动搞定。因此，文本块将提高Java程序的可读性和可写性。

### 目标
> * 简化跨越多行的字符串，避免对换行等特殊字符进行转义，简化编写Java程序。
> * 增强Java程序中字符串的可读性。
### 使用
```java
//jdk 13 之前
"<html>\n" +
    " <body>\n" +
    " <p>Hello, 尚硅谷</p>\n" +
    " </body>\n" +
    "</html>\n";

//jdk 13
"""
    <html>
    <body>
    <p>Hello, world</p>
    </body>
    </html>
    """;
```

使用“”“作为文本块的开始符和结束符，在其中就可以放置多行的字符串，不需要进行任何转义。看起来就十分清爽了。

如常见的SQL语句：

```sql
select employee_id,last_name,salary,department_id
from employees
where department_id in (40,50,60)
order by department_id asc
```

```java
//jdk 13之前
String query = "select employee_id,last_name,salary,department_id\n" +
    "from employees\n" +
    "where department_id in (40,50,60)\n" +
    "order by department_id asc";

//jdk 13

String newQuery = """
    select employee_id,last_name,salary,department_id
    from employees
    where department_id in (40,50,60)
    order by department_id asc
    """;
```

### 具体使用

#### 基本使用
* 文本块是Java语言中的一种新文字。它可以用来表示任何字符串，并且提供更大的表现力和更少的复杂性。
* 文本块由零个或多个字符组成，由开始和结束分隔符括起来。
  * 开始分隔符是由三个双引号字符（"""），后面可以跟零个或多个空格，最终以行终止符结束。文本块内容以开始分隔符的行终止符后的第一个字符开始。
  * 结束分隔符也是由三个双引号字符（"""）表示，文本块内容以结束分隔符的第一个双引号之前的最后一个字符结束。
* 文本块中的内容可以直接使用"，"，但不是必需的。
* 文本块中的内容可以直接包括行终止符。允许在文本块中使用 \n，但不是必需的。例如，文本块：
```java
"""
line1
line2
line3
"""
```
相当于
```java
"line1\1 nline2\nline3\n"
```
或者一个连接的字符串：
```java
"line1\n" +
"line2\n" +
"line3\n"
```
如果字符串末尾不需要行终止符，则结束分隔符可以放在最后一行内容上。例如：
```java
"""
line1
line2
line3"""
```
相当于:
```java
"line1\nline2\nline3"
```
文本块可以表示空字符串，但不建议这样做，因为它需要两行源代码：
```java
String empty = """
""";
```
以下示例是错误格式的文本块：
```java
String a = """"""; // 开始分隔符后没有行终止符
String b = """ """; // 开始分隔符后没有行终止符
String c = """
"; // 没有结束分隔符
String d = """
abc \ def
"""; // 含有未转义的反斜线（请参阅下面的转义处理）
```
在运行时，文本块将被实例化为String的实例，就像字符串一样。从文本块派生的String实例与从字符串派生的实例是无法区分的。具有相同内容的两个文本块将引用相同的String实例，就像字符串一样。
#### 编译器在编译时会删除掉这些多余的空格。
下面这段代码中，我们用 . 来表示我们代码中的的空格，而这些位置的空格就是多余的。
```java
String html = """
..............<html>
.............. <body>
.............. <p>Hello, world</p>
.............. </body>
..............</html>
..............""";
```
多余的空格还会出现在每一行的结尾，特别是当你从其他地方复制过来时，更容易出现这种情况，比如下面的代码：
```java
String html = """
..............<html>...
.............. <body>
.............. <p>Hello, world</p>....
.............. </body>.
..............</html>...
..............""";
```
这些多余的空格对于程序员来说是看不到的，但是他又是实际存在的，所以如果编译器不做处理，可能会导致程序员看到的两个文本块内容是一样的，但是这两个文本块却因为存在这种多余的空格而导致差异，比如哈希值不相等。
#### 转义字符
允许开发人员使用 \n，\f 和\r 来进行字符串的垂直格式化，使用 \b和 \t进行水平格式化。比如下面的代码是合法的：
```java
String html = """
    <html>\n
    <body>\n
    <p>Hello, world</p>\n
    </body>\n
    </html>\n
    """;
```
请注意，在文本块内自由使用"是合法的。例如:
```java
String story = """
    "When I use a word," Humpty Dumpty said,
in rather a scornful tone, "it means just what I
    choose it to mean - neither more nor less."
    "The question is," said Alice, "whether you
    can make words mean so many different things."
    "The question is," said Humpty Dumpty,
"which is to be master - that's all."
    """;
```
但是，三个"字符的序列需要进行转义至少一个"以避免模仿结束分隔符：
```java
String code =
    """
    String text = \"""
    A text block inside a text block
    \""";
    """;
```
#### 文本块连接
可以在任何可以使用字符串的地方使用文本块。例如，文本块和字符串可以相互连接：
```java
String code = "public void print(Object o) {" +
    """
    System.out.println(Objects.toString(o));
}
""";
```
但是，涉及文本块的连接可能变得相当笨重。以下面文本块为基础：
```java
String code = """
    public void print(Object o) {
    System.out.println(Objects.toString(o));
}
""";
```
假设我们想把上面的Object改为来自某一变量，我们可能会这么写：
```java
String code = """
    public void print(""" + type + """
                      o) {
    System.out.println(Objects.toString(o));
}
""";
```
可以发现这种写法可读性是非常差的，更简洁的替代方法是使用String :: replace或String :: format，比如：另一个方法是使用String :: formatted，这是一个新方法，比如：
```java
String code = """
    public void print($type o) {
    System.out.println(Objects.toString(o));
}
""".replace("$type", type);
```
```java
String code = String.format("""
                            public void print(%s o) {
                                System.out.println(Objects.toString(o));
                            }
                            """, type);
```
另一个方法是使用String :: formatted，这是一个新方法，比如：
```java
String source = """
    public void print(%s object) {
    System.out.println(Objects.toString(object));
}
""".formatted(type);
```
