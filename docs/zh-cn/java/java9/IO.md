---
title: I/O 流新特性
keywords: docs,jcohy-docs,java9,I/O 流新特性
description: I/O 流新特性
---

## I/O 流新特性
类 java.io.InputStream 中增加了新的方法来读取和复制 InputStream 中包含的数据。

* readAllBytes：读取 InputStream 中的所有剩余字节。
* readNBytes： 从 InputStream 中读取指定数量的字节到数组中。
* transferTo：读取 InputStream 中的全部字节并写入到指定的 OutputStream 中 。
如下代码中给出了这些新方法的使用示例。
```java
public class TestInputStream {
    private InputStream inputStream; 
    private static final String CONTENT = "Hello World"; 
    @Before 
    public void setUp() throws Exception { 
        this.inputStream = 
            TestInputStream.class.getResourceAsStream("/input.txt"); 
    }
    @Test 
    public void testReadAllBytes() throws Exception { 
        final String content = new String(this.inputStream.readAllBytes()); 
        assertEquals(CONTENT, content); 
    } 
    @Test 
    public void testReadNBytes() throws Exception { 
        final byte[] data = new byte[5]; 
        this.inputStream.readNBytes(data, 0, 5); 
        assertEquals("Hello", new String(data)); 
    } 
    @Test 
    public void testTransferTo() throws Exception { 
        final ByteArrayOutputStream outputStream = new ByteArrayOutputStream(); 
        this.inputStream.transferTo(outputStream); 
        assertEquals(CONTENT, outputStream.toString()); 
    } 
}
```
ObjectInputFilter 可以对 ObjectInputStream 中 包含的内容进行检查，来确保其中包含的数据是合法的。可以使用 ObjectInputStream 的方法 setObjectInputFilter 来设置。ObjectInputFilter 在 进行检查时，可以检查如对象图的最大深度、对象引用的最大数量、输入流中的最大字节数和数组的最大长度等限制，也可以对包含的类的名称进行限制。
