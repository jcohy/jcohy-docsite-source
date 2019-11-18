---
title: 改进应用安全性能
keywords: docs,jcohy-docs,java9,改进应用安全性能
description: 改进应用安全性能
---

## 改进应用安全性能
Java 9 新增了 4 个 SHA- 3 哈希算法，SHA3-224、SHA3-256、SHA3-384 和 S HA3-512。另外也增加了通过 java.security.SecureRandom 生成使用 DRBG 算法的强随机数。 如下代码中给出了 SHA-3 哈希算法的使用示例
```java
import org.apache.commons.codec.binary.Hex; 
public class SHA3 { 
    public static void main(final String[] args) throws NoSuchAlgorithmException { 
        final MessageDigest instance = MessageDigest.getInstance("SHA3-224"); 
        final byte[] digest = instance.digest("".getBytes()); 
        System.out.println(Hex.encodeHexString(digest)); 
    } 
}
```
