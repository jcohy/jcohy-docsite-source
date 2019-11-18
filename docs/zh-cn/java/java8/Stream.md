---
title: Java8新特性
keywords: docs,jcohy-docs,java8,Stream
description: Stream
---

## 4.Stream API

#### 了解Stream

Java8中有两大最为重要的改变。第一个是Lambda 表达式；另外一个则是**Stream API(java.util.stream.*)。**
Stream 是Java8 中处理集合的关键抽象概念，它可以指定你希望对集合进行的操作，可以执行非常复杂的查找、过滤和映射数据等操作。使用Stream API 对集合数据进行操作，就类似于使用SQL 执行的数据库查询。也可以使用Stream API 来并行执行操作。简而言之，Stream API 提供了一种高效且易于使用的处理数据的方式。

#### 什么是Stream

流(Stream) 到底是什么呢？
是数据渠道，用于操作数据源（集合、数组等）所生成的元素序列。“集合讲的是数据，流讲的是计算！”

注意：
①Stream 自己不会存储元素。
②Stream 不会改变源对象。相反，他们会返回一个持有结果的新Stream。
③Stream 操作是延迟执行的。这意味着他们会等到需要结果的时候才执行。

#### Stream 的操作三个步骤

- 创建Stream

  一个数据源（如：集合、数组），获取一个流

- 中间操作

  一个中间操作链，对数据源的数据进行处理

- 终止操作(终端操作)

  一个终止操作，执行中间操作链，并产生结果

  ![](https://github.com/jiachao23/jcohy-study-sample/blob/master/jcohy-study-java/src/main/resources/static/images/1.jpg)

##### 创建Stream

###### 1）、Java8 中的Collection 接口被扩展，提供了两个获取流的方法

   ```java
  //Java8 中的Collection 接口被扩展，提供了两个获取流的方法：
     default Stream<E> stream() : //返回一个顺序流
     default Stream<E> parallelStream() : //返回一个并行流
   ```

```java
List<String> list = new ArrayList<>();
Stream<String> stream = list.stream(); //获取一个顺序流
Stream<String> parallelStream = list.parallelStream(); //获取一个并行流
```



###### 2）、由数组创建流

  ```java
  static <T> Stream<T> stream(T[] array): 返回一个流
  重载形式，能够处理对应基本类型的数组：
  public static IntStream stream(int[] array)
  public static LongStream stream(long[] array)
  public static DoubleStream stream(double[] array)
  ```

```java
Integer[] nums = new Integer[10];
Stream<Integer> stream1 = Arrays.stream(nums);
```



###### 3）、由值创建流

  ```java
  //可以使用静态方法Stream.of(), 通过显示值创建一个流。它可以接收任意数量的参数。
  public static<T> Stream<T> of(T... values) : 返回一个流
  ```

```java
Stream<Integer> stream2 = Stream.of(1,2,3,4,5,6);
```

###### 4）、由函数创建流：创建无限流

  ```java
  //可以使用静态方法Stream.iterate() 和Stream.generate(), 创建无限流。
  //迭代
  public static<T> Stream<T> iterate(final T seed, final UnaryOperator<T> f)
  //生成
  public static<T> Stream<T> generate(Supplier<T> s) :
  ```

```java
//迭代
Stream<Integer> stream3 = Stream.iterate(0, (x) -> x + 2).limit(10);
stream3.forEach(System.out::println);

//生成
Stream<Double> stream4 = Stream.generate(Math::random).limit(2);
stream4.forEach(System.out::println);
```



##### Stream 的中间操作

  多个中间操作可以连接起来形成一个流水线，除非流水线上触发终止操作，否则中间操作不会执行任何的处理！
  而在终止操作时一次性全部处理，称为“惰性求值”。

  ###### 筛选与切片

| 方法                | 描述                                                         |
| ------------------- | ------------------------------------------------------------ |
| filter(Predicate p) | 接收Lambda ，从流中排除某些元素。                            |
| distinct()          | 筛选，通过流所生成元素的hashCode() 和equals() 去除重复元素   |
| limit(long maxSize) | 截断流，使其元素不超过给定数量。                             |
| skip(long n)        | 跳过元素，返回一个扔掉了前n 个元素的流。若流中元素不足n 个，则返回一个空流。与limit(n) 互补 |

###### 映射

| 方法                            | 描述                                                         |
| ------------------------------- | ------------------------------------------------------------ |
| map(Function f)                 | 接收一个函数作为参数，该函数会被应用到每个元素上，并将其映射成一个新的元素。 |
| mapToDouble(ToDoubleFunction f) | 接收一个函数作为参数，该函数会被应用到每个元素上，产生一个新的DoubleStream。 |
| mapToInt(ToIntFunction f)       | 接收一个函数作为参数，该函数会被应用到每个元素上，产生一个新的IntStream。 |
| mapToLong(ToLongFunction f)     | 接收一个函数作为参数，该函数会被应用到每个元素上，产生一个新的LongStream。 |
| flatMap(Function f)             | 接收一个函数作为参数，将流中的每个值都换成另一个流，然后把所有流连接成一个流 |

###### 排序

| 方法                    | 描述                               |
| ----------------------- | ---------------------------------- |
| sorted()                | 产生一个新流，其中按自然顺序排序   |
| sorted(Comparator comp) | 产生一个新流，其中按比较器顺序排序 |

##### Stream 的终止操作

###### 查找与匹配

| 方法                  | 描述                                                         |
| --------------------- | ------------------------------------------------------------ |
| allMatch(Predicate p) | 检查是否匹配所有元素                                         |
| anyMatch(Predicate p) | 检查是否至少匹配一个元素                                     |
| noneMatch(Predicatep) | 检查是否没有匹配所有元素                                     |
| findFirst()           | 返回第一个元素                                               |
| findAny()             | 返回当前流中的任意元素                                       |
| count()               | 返回流中元素总数                                             |
| max(Comparator c)     | 返回流中最大值                                               |
| min(Comparator c)     | 返回流中最小值                                               |
| forEach(Consumer c)   | 内部迭代(使用Collection 接口需要用户去做迭代，称为外部迭代。相反，Stream API 使用内部迭代——它帮你把迭代做了) |

######  归约

| 方法                             | 描述                                                    |
| -------------------------------- | ------------------------------------------------------- |
| reduce(T iden, BinaryOperator b) | 可以将流中元素反复结合起来，得到一个值。返回T      |
| reduce(BinaryOperator b)         | 可以将流中元素反复结合起来，得到一个值。返回Optional<T> |
	
**备注：map 和reduce 的连接通常称为map-reduce 模式，因Google 用它来进行网络搜索而出名。**

###### 收集

| 方法                 | 描述                                                         |
| -------------------- | ------------------------------------------------------------ |
| collect(Collector c) | 将流转换为其他形式。接收一个Collector接口的实现，用于给Stream中元素做汇总的方法 |

  Collector 接口中方法的实现决定了如何对流执行收集操作(如收集到List、Set、Map)。但是Collectors 实用类提供了很多静态方法，可以方便地创建常见收集器实例，具体方法与实例如下表：

| 方法   | 返回类型 | 作用                 |
| ------ | -------- | -------------------- |
| toList | List<T>  | 把流中元素收集到List |
| toSet | Set<T>   | 把流中元素收集到Set |
| toCollection | Collection<T> | 把流中元素收集到创建的集合 |
| counting | Long     | 计算流中元素的个数 |
| summingInt | Integer  | 对流中元素的整数属性求和 |
| averagingInt | Double   | 计算流中元素Integer属性的平均值 |
| summarizingInt | IntSummaryStatistics | 收集流中Integer属性的统计值。如：平均值 |
| joining | String | 连接流中每个字符串 |
| maxBy | Optional<T> | 根据比较器选择最大值 |
| minBy | Optional<T> | 根据比较器选择最小值 |
| reducing | 归约产生的类型 | 从一个作为累加器的初始值开始，利用BinaryOperator与流中元素逐个结合，从而归约成单个值 |
| collectingAndThen | 转换函数返回的类型 | 包裹另一个收集器，对其结果转换函数 |
| groupingBy | Map<K,List<T>> | 根据某属性值对流分组，属性为K，结果为V |
| partitioningBy | Map<Boolean,List<T>> | 根据true或false进行分区Map<Boolean, |

  ```java
  //toList
  List<Employee> emps=list.stream().collect(Collectors.toList());
  
  //toSet
  Set<Employee> emps=list.stream().collect(Collectors.toSet());
  
  //toCollection
  Collection<Employee> emps=list.stream().collect(Collectors.toCollection(ArrayList::new));
  
  //counting
  long count=list.stream().collect(Collectors.counting());
  
  //summingInt
  int total=list.stream().collect(Collectors.summingInt(Employee::getSalary));
  
  //averagingInt
  double avg=list.stream().collect(Collectors.averagingInt(Employee::getSalary));
  
  //summarizingInt
  IntSummaryStatistic siss=list.stream().collect(Collectors.summarizingInt(Employee::getSalary));
  
  //joining
  String str=list.stream().map(Employee::getName).collect(Collectors.joining());
  
  //maxBy
  Optional<Emp> max=list.stream().collect(Collectors.maxBy(comparingInt(Employee::getSalary)));
  
  //minBy
  Optional<Emp> min=list.stream().collect(Collectors.minBy(comparingInt(Employee::getSalary)));
  
  //reducing
  int total=list.stream().collect(Collectors.reducing(0,Employee::getSalar,Integer::sum));
  
  //collectingAndThen
  int how=list.stream().collect(Collectors.collectingAndThen(Collectors.toList(),List::size));
  
  //groupingBy
  Map<Emp.Status, List<Emp>> map= list.stream()
  .collect(Collectors.groupingBy(Employee::getStatus));
  
  //partitioningBy
  Map<Boolean,List<Emp>> vd=list.stream().collect(Collectors.partitioningBy(Employee::getManage));
  ```

###### 练习

1）、给定一个数字列表，如何返回一个由每个数的平方构成的列表呢？
    		给定【1，2，3，4，5】， 应该返回【1，4，9，16，25】。

```java
@Test
public void test1(){
    Integer[] arrays = new Integer[]{1,2,3,4,5};
    Arrays.stream(arrays)
        .map((x) -> x * x)
        .collect(Collectors.toList())
        .forEach(System.out::println);
}
```

2）、怎样用 map 和 reduce 方法数一数流中有多少个Employee呢？

```java
List<Employee> emps = Arrays.asList(
			new Employee(102, "李四", 59, 6666.66, Status.BUSY),
			new Employee(101, "张三", 18, 9999.99, Status.FREE),
			new Employee(103, "王五", 28, 3333.33, Status.VOCATION),
			new Employee(104, "赵六", 8, 7777.77, Status.BUSY),
			new Employee(104, "赵六", 8, 7777.77, Status.FREE),
			new Employee(104, "赵六", 8, 7777.77, Status.FREE),
			new Employee(105, "田七", 38, 5555.55, Status.BUSY)
	);
	
@Test
public void test2(){
    Optional<Integer> count = emps.stream()
        .map((e) -> 1)
        .reduce(Integer::sum);

    System.out.println(count.get());
}
```

3）、

交易员类

```java
//交易员类
public class Trader {

	private String name;
	private String city;

	public Trader() {
	}

	public Trader(String name, String city) {
		this.name = name;
		this.city = city;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	@Override
	public String toString() {
		return "Trader [name=" + name + ", city=" + city + "]";
	}

}

```

交易类

```java
//交易类
public class Transaction {

	private Trader trader;
	private int year;
	private int value;

	public Transaction() {
	}

	public Transaction(Trader trader, int year, int value) {
		this.trader = trader;
		this.year = year;
		this.value = value;
	}

	public Trader getTrader() {
		return trader;
	}

	public void setTrader(Trader trader) {
		this.trader = trader;
	}

	public int getYear() {
		return year;
	}

	public void setYear(int year) {
		this.year = year;
	}

	public int getValue() {
		return value;
	}

	public void setValue(int value) {
		this.value = value;
	}

	@Override
	public String toString() {
		return "Transaction [trader=" + trader + ", year=" + year + ", value="
				+ value + "]";
	}

}

```

```java
public class TestTransaction {
	
	List<Transaction> transactions = null;
	
	@Before
	public void before(){
		Trader raoul = new Trader("Raoul", "Cambridge");
		Trader mario = new Trader("Mario", "Milan");
		Trader alan = new Trader("Alan", "Cambridge");
		Trader brian = new Trader("Brian", "Cambridge");
		
		transactions = Arrays.asList(
				new Transaction(brian, 2011, 300),
				new Transaction(raoul, 2012, 1000),
				new Transaction(raoul, 2011, 400),
				new Transaction(mario, 2012, 710),
				new Transaction(mario, 2012, 700),
				new Transaction(alan, 2012, 950)
		);
	}
	
	//1. 找出2011年发生的所有交易， 并按交易额排序（从低到高）
	@Test
	public void test1(){
		transactions.stream()
					.filter((t) -> t.getYear() == 2011)
					.sorted((t1, t2) -> Integer.compare(t1.getValue(), t2.getValue()))
					.forEach(System.out::println);
	}
	
	//2. 交易员都在哪些不同的城市工作过？
	@Test
	public void test2(){
		transactions.stream()
					.map((t) -> t.getTrader().getCity())
					.distinct()
					.forEach(System.out::println);
	}
	
	//3. 查找所有来自剑桥的交易员，并按姓名排序
	@Test
	public void test3(){
		transactions.stream()
					.filter((t) -> t.getTrader().getCity().equals("Cambridge"))
					.map(Transaction::getTrader)
					.sorted((t1, t2) -> t1.getName().compareTo(t2.getName()))
					.distinct()
					.forEach(System.out::println);
	}
	
	//4. 返回所有交易员的姓名字符串，按字母顺序排序
	@Test
	public void test4(){
		transactions.stream()
					.map((t) -> t.getTrader().getName())
					.sorted()
					.forEach(System.out::println);
		
		System.out.println("-----------------------------------");
		
		String str = transactions.stream()
					.map((t) -> t.getTrader().getName())
					.sorted()
					.reduce("", String::concat);
		
		System.out.println(str);
		
		System.out.println("------------------------------------");
		
		transactions.stream()
					.map((t) -> t.getTrader().getName())
					.flatMap(TestTransaction::filterCharacter)
					.sorted((s1, s2) -> s1.compareToIgnoreCase(s2))
					.forEach(System.out::print);
	}
	
	public static Stream<String> filterCharacter(String str){
		List<String> list = new ArrayList<>();
		
		for (Character ch : str.toCharArray()) {
			list.add(ch.toString());
		}
		
		return list.stream();
	}
	
	//5. 有没有交易员是在米兰工作的？
	@Test
	public void test5(){
		boolean bl = transactions.stream()
					.anyMatch((t) -> t.getTrader().getCity().equals("Milan"));
		
		System.out.println(bl);
	}
	
	
	//6. 打印生活在剑桥的交易员的所有交易额
	@Test
	public void test6(){
		Optional<Integer> sum = transactions.stream()
					.filter((e) -> e.getTrader().getCity().equals("Cambridge"))
					.map(Transaction::getValue)
					.reduce(Integer::sum);
		
		System.out.println(sum.get());
	}
	
	
	//7. 所有交易中，最高的交易额是多少
	@Test
	public void test7(){
		Optional<Integer> max = transactions.stream()
					.map((t) -> t.getValue())
					.max(Integer::compare);
		
		System.out.println(max.get());
	}
	
	//8. 找到交易额最小的交易
	@Test
	public void test8(){
		Optional<Transaction> op = transactions.stream()
					.min((t1, t2) -> Integer.compare(t1.getValue(), t2.getValue()));
		System.out.println(op.get());
	}
}
```



  #### 并行流与串行流

  并行流就是把一个内容分成多个数据块，并用不同的线程分别处理每个数据块的流。
  Java 8 中将并行进行了优化，我们可以很容易的对数据进行并行操作。**Stream API 可以声明性地通过parallel() 与sequential() 在并行流与顺序流之间进行切换。**

  #### 了解Fork/Join 框架

  Fork/Join 框架：就是在必要的情况下，将一个大任务，进行拆分(fork)成若干个小任务（拆到不可再拆时），再将一个个的小任务运算的结果进行join 汇总.

  ![](https://github.com/jiachao23/jcohy-study-sample/blob/91bd78d2d059f56b2090ea52e53e61b194788628/jcohy-study-java/src/main/resources/static/images/2.jpg)

  ##### Fork/Join 框架与传统线程池的区别

  采用“工作窃取”模式（work-stealing）：
  当执行新的任务时它可以将其拆分分成更小的任务执行，并将小任务加到线程队列中，然后再从一个随机线程的队列中偷一个并把它放在自己的队列中。
  相对于一般的线程池实现,fork/join框架的优势体现在对其中包含的任务的处理方式上.在一般的线程池中,如果一个线程正在执行的任务由于某些原因无法继续运行,那么该线程会处于等待状态.而在fork/join框架实现中,如果某个子问题由于等待另外一个子问题的完成而无法继续运行.那么处理该子问题的线程会主动寻找其他尚未运行的子问题来执行.这种方式减少了线程的等待时间,提高了性能.

```java
public class ForkJoinCalculate extends RecursiveTask<Long>{

	/**
	 * 
	 */
	private static final long serialVersionUID = 13475679780L;
	
	private long start;
	private long end;
	
	private static final long THRESHOLD = 10000L; //临界值
	
	public ForkJoinCalculate(long start, long end) {
		this.start = start;
		this.end = end;
	}
	
	@Override
	protected Long compute() {
		long length = end - start;
		
		if(length <= THRESHOLD){
			long sum = 0;
			
			for (long i = start; i <= end; i++) {
				sum += i;
			}
			
			return sum;
		}else{
			long middle = (start + end) / 2;
			
			ForkJoinCalculate left = new ForkJoinCalculate(start, middle);
			left.fork(); //拆分，并将该子任务压入线程队列
			
			ForkJoinCalculate right = new ForkJoinCalculate(middle+1, end);
			right.fork();
			
			return left.join() + right.join();
		}
		
	}

}

```



```java
public class TestForkJoin {
	
	@Test
	public void test1(){
		long start = System.currentTimeMillis();
		
		ForkJoinPool pool = new ForkJoinPool();
		ForkJoinTask<Long> task = new ForkJoinCalculate(0L, 10000000000L);
		
		long sum = pool.invoke(task);
		System.out.println(sum);
		
		long end = System.currentTimeMillis();
		
		System.out.println("耗费的时间为: " + (end - start)); //112-1953-1988-2654-2647-20663-113808
	}
	
	@Test
	public void test2(){
		long start = System.currentTimeMillis();
		
		long sum = 0L;
		
		for (long i = 0L; i <= 10000000000L; i++) {
			sum += i;
		}
		
		System.out.println(sum);
		
		long end = System.currentTimeMillis();
		
		System.out.println("耗费的时间为: " + (end - start)); //34-3174-3132-4227-4223-31583
	}
	
	@Test
	public void test3(){
		long start = System.currentTimeMillis();
		
		Long sum = LongStream.rangeClosed(0L, 10000000000L)
							 .parallel()
							 .sum();
		
		System.out.println(sum);
		
		long end = System.currentTimeMillis();
		
		System.out.println("耗费的时间为: " + (end - start)); //2061-2053-2086-18926
	}

}
```
