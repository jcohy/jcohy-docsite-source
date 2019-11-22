---
title: Reactor Netty 访问日志
keywords: docs，jcohy-docs,gateway,log
description: Reactor Netty 访问日志
---

# 9. Reactor Netty 访问日志

要启用Reactor Netty访问日志，请设置 `-Dreactor.netty.http.server.accessLogEnabled = true`。 

 因为Reactor Netty不是基于spring boot的，所以它并不会去spring boot的配置中获取上面的配置，所以只能在Java System Property中获取。 

 可以在常用的日志系统中配置日志的打印文件和格式，如logback的配置： 

**logback.xml.** 

```xml
    <appender name="accessLog" class="ch.qos.logback.core.FileAppender">
        <file>access_log.log</file>
        <encoder>
            <pattern>%msg%n</pattern>
        </encoder>
    </appender>
    <appender name="async" class="ch.qos.logback.classic.AsyncAppender">
        <appender-ref ref="accessLog" />
    </appender>

    <logger name="reactor.netty.http.server.AccessLog" level="INFO" additivity="false">
        <appender-ref ref="async"/>
    </logger>
```

