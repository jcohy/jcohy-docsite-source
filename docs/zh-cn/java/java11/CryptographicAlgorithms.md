---
title: ChaCha20 和 Poly1305 加密算法
keywords: docs,jcohy-docs,ChaCha20,Poly1305,java11
description: ChaCha20 和 Poly1305 加密算法
---

## ChaCha20 和 Poly1305 加密算法
实现 RFC 7539的ChaCha20 and ChaCha20-Poly1305加密算法
RFC 7539定义的秘钥协商方案更高效, 更安全. JDK增加两个新的接口
XECPublicKey 和 XECPrivateKey

```java
KeyPairGenerator kpg = KeyPairGenerator.getInstance(“XDH”);
NamedParameterSpec paramSpec = new NamedParameterSpec(“X25519”);
kpg.initialize(paramSpec);
KeyPair kp = kgp.generateKeyPair();

KeyFactory kf = KeyFactory.getInstance(“XDH”);
BigInteger u = new BigInteger(“xxx”);
XECPublicKeySpec pubSpec = new XECPublicKeySpec(paramSpec, u);
PublicKey pubKey = kf.generatePublic(pubSpec);

KeyAgreement ka = KeyAgreement.getInstance(“XDH”);
ka.init(kp.getPrivate());
ka.doPhase(pubKey, true);
byte[] secret = ka.generateSecret();

```
