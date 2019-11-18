---
title: 变量句柄
keywords: docs,jcohy-docs,java9,变量句柄
description: 变量句柄
---

## 变量句柄
变量句柄是一个变量或一组变量的引用，包括静态域，非静态域，数组元素和堆外数据结构中的组成部分等。变量句柄的含义类似于已有的方法句柄。变量句柄由 J ava 类 java.lang.invoke.VarHandle 来表示。可以使用类 j ava.lang.invoke.MethodHandles.Looku p 中的静态工厂方法来创建 VarHandle 对 象。通过变量句柄，可以在变量上进行各种操作。这些操作称为访问模式。不同的访问模式尤其在内存排序上的不同语义。目前一共有 31 种 访问模式，而每种访问模式都 在 VarHandle 中 有对应的方法。这些方法可以对变量进行读取、写入、原子更新、数值原子更新和比特位原子操作等。VarHandle 还 可以用来访问数组中的单个元素，以及把 byte[]数组 和 ByteBuffer 当成是不同原始类型的数组来访问。

在如下代码 中，我们创建了访问 HandleTarget 类中的域 count 的变量句柄，并在其上进行读取操作。
```java
public class HandleTarget { 
    public int count = 1; 
} 
public class VarHandleTest {
    private HandleTarget handleTarget = new HandleTarget(); 
    private VarHandle varHandle; 
    @Before 
    public void setUp() throws Exception { 
        this.handleTarget = new HandleTarget(); 
        this.varHandle = MethodHandles 
            .lookup() 
            .findVarHandle(HandleTarget.class, "count", int.class); 
    } 
    @Test 
    public void testGet() throws Exception { 
        assertEquals(1, this.varHandle.get(this.handleTarget)); 
        assertEquals(1, this.varHandle.getVolatile(this.handleTarget)); 
        assertEquals(1, this.varHandle.getOpaque(this.handleTarget)); 
        assertEquals(1, this.varHandle.getAcquire(this.handleTarget)); 
    } 
}
```

<p id="改进方法句柄">

类 java.lang.invoke.MethodHandles 增加了更多的静态方法来创建不同类型的方法句柄。

* arrayConstructor：创建指定类型的数组。
* arrayLength：获取指定类型的数组的大小。
* varHandleInvoker 和 varHandleExactInvoker：调用 VarHandle 中的访问模式方法。
* zero：返回一个类型的默认值。
* empty：返 回 MethodType 的返回值类型的默认值。
* loop、countedLoop、iteratedLoop、whileLoop 和 doWhileLoop：创建不同类型的循环，包括 * for 循环、while 循环 和 do-while 循环。
* tryFinally：把对方法句柄的调用封装在 try-finally 语句中。
* 在 下面代码中，我们使用 iteratedLoop 来创建一个遍历 S tring 类型迭代器的方法句柄，并计算所有字符串的长度的总和。
```java
public class IteratedLoopTest { 
    static int body(final int sum, final String value) { 
        return sum + value.length(); 
    } 
    @Test 
    public void testIteratedLoop() throws Throwable { 
        final MethodHandle iterator = MethodHandles.constant( 
            Iterator.class, 
            List.of("a", "bc", "def").iterator()); 
        final MethodHandle init = MethodHandles.zero(int.class); 
        final MethodHandle body = MethodHandles 
            .lookup() 
            .findStatic( 
                IteratedLoopTest.class, 
                "body", 
                MethodType.methodType( 
                    int.class, 
                    int.class, 
                    String.class)); 
        final MethodHandle iteratedLoop = MethodHandles 
            .iteratedLoop(iterator, init, body); 
        assertEquals(6, iteratedLoop.invoke()); 
    } 
}
```
