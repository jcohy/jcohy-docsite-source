---
title: 进程 API
keywords: docs,jcohy-docs,java9,进程 API
description: 进程 API
---

## 进程 API
Java 9 增加了 ProcessHandle 接口，可以对原生进程进行管理，尤其适合于管理长时间运行的进程。在使用 P rocessBuilder 来启动一个进程之后，可以通过 Process.toHandle()方法来得到一个 ProcessHandl e 对象的实例。通过 ProcessHandle 可以获取到由 ProcessHandle.Info 表 示的进程的基本信息，如命令行参数、可执行文件路径和启动时间等。ProcessHandle 的 onExit()方法返回一个 C ompletableFuture<ProcessHandle>对象，可以在进程结束时执行自定义的动作。 下面代码 中给出了进程 API 的使用示例。
```java
final ProcessBuilder processBuilder = new ProcessBuilder("top") 
    .inheritIO(); 
final ProcessHandle processHandle = processBuilder.start().toHandle(); 
processHandle.onExit().whenCompleteAsync((handle, throwable) -> { 
    if (throwable == null) { 
        System.out.println(handle.pid()); 
    } else { 
        throwable.printStackTrace(); 
    } 
});
```
