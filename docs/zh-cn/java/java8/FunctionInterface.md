---
title: Java8新特性
keywords: docs,jcohy-docs,java8,函数式接口
description: 函数式接口
---

## 2.函数式接口

####  什么是函数式接口

- 只包含一个抽象方法的接口，称为函数式接口。
- 你可以通过Lambda 表达式来创建该接口的对象。（若Lambda 表达式抛出一个受检异常，那么该异常需要在目标接口的抽象方法上进行声明）。
- 我们可以在任意函数式接口上使用@FunctionalInterface注解，这样做可以检查它是否是一个函数式接口，同时javadoc也会包含一条声明，说明这个接口是一个函数式接口。

#### Java8中内置的四大核心函数式接口

| 函数式接口               | 参数类型 | 返回类型 | 用途                                                         |
| ------------------------ | -------- | -------- | ------------------------------------------------------------ |
| Consumer&lt;T&gt; 消费型接口    | T        | void     | 对类型为T的对象应用操作，包含方法：void accept(T t)          |
| Supplier&lt;T&gt;供给型接口    | 无       | T        | 返回类型为T的对象，包含方法：T get();                        |
| Function<T, R> 函数型接口 | T        | R        | 对类型为T的对象应用操作，并返回结果。结果是R类型的对象。包含方法：R apply(T t); |
| Predicate&lt;T&gt;断定型接口   | T        | boolean  | 确定类型为T的对象是否满足某约束，并返回boolean 值。包含方法boolean test(T t); |



- Consumer<T>：消费型接口

  void accept(T t)；

  ```java
  @Test
  public void test1(){
      happy(100000,(m) -> System.out.println("吃饭花费了"+m+"元"));
  }
  
  public void happy(double money, Consumer<Double> consumer){
      consumer.accept(money);
  }
  ```

- Supplier<T>：供给型接口

  T get();

  ```java
  //获取指定个数数字
  public List<Integer> getNumList(int num, Supplier<Integer> supplier){
      List<Integer> list = new ArrayList<>();
      for(int i=0;i<num;i++){
          Integer integer = supplier.get();
          list.add(integer);
      }
      return list;
  }
  
  @Test
  public void test2(){
      List<Integer> numList = getNumList(10, () -> (int)(Math.random() * 100) );
      for (Integer integer:numList ) {
          System.out.println(integer);
      }
  }
  ```

- Function<T,R>：函数型接口

  R apply(T t);

  ```java
  @Test
  public void test3(){
     String newStr = strHandler("\t\t\t 哈哈哈哈哈哈哈",(str) -> str.trim());
      System.out.println(newStr);
  }
  
  
  public String strHandler(String str, Function<String,String> function){
      return function.apply(str);
  }
  ```

- Predicate<T>：断言型接口

  boolean test(T t)

  ```java
  @Test
  public void test4(){
      List<String> list = Arrays.asList("hellsssso","world","atcj","jcohy");
      List<String> str = filterStr(list, (x) -> x.length() > 4);
     for(String str1 :str){
         System.out.println(str1);
     }
  }
  
  public List<String> filterStr(List<String> list, Predicate<String> pre){
      List<String> strList = new ArrayList<>();
      for(String str:list){
          if(pre.test(str)){
              strList.add(str);
          }
      }
      return strList;
  }
  ```

#### 其他接口

| 函数式接口                                                | 参数类型        | 返回类型        | 用途                                                         |
| --------------------------------------------------------- | --------------- | --------------- | -----------------------------------|
| BiFunction<T,U,R>    | T,U             | R       | 对类型为T,U参数应用操作，返回R类型的结果。包含方法为Rapply(Tt,Uu); |
| UnaryOperator&lt;T&gt;(Function子接口)| T   | T    | 对类型为T的对象进行一元运算，并返回T类型的结果。包含方法为Tapply(Tt); |
| BinaryOperator&lt;T&gt;(BiFunction子接口)  | T,T    | T    | 对类型为T的对象进行二元运算，并返回T类型的结果。包含方法为Tapply(Tt1,Tt2); |
| BiConsumer<T,U>       | T,U             | void            | 对类型为T,U参数应用操作。包含方法为voidaccept(Tt,Uu)    |
| ToIntFunction&lt;T&gt; ToLongFunction&lt;T&gt;ToDoubleFunction&lt;T&gt; | T| int,long,double | 分别计算int、long、double、值的函数   |
| IntFunction&lt;R&gt;LongFunction&lt;R&gt;DoubleFunction&lt;R&gt; | int,long,double | R | 参数分别为int、long、double类型的函数       |

