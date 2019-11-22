---
title: 摘要
keywords: docs，jcohy-docs，spring cloud gateway,summary
description: Spring  Cloud  Gateway 中文文档
---

# Spring  Cloud  Gateway 中文文档
> #### Version 2.1.3.RELEASE
>

* 1. 如何接入SpringCloud Gateway
* 2. 概念
* 3. 如何工作的
* 4. 路由断言工厂（Route Predicate Factory）
    *    4.1. After 路由断言工厂
    *    4.2. Before 路由断言工厂
    *    4.3. Between 路由断言工厂
    *    4.4. Cookie 路由断言工厂
    *    4.5. Header 路由断言工厂
    *    4.6. Host 路由断言工厂
    *    4.7. Method 路由断言工厂
    *    4.8. Path 路由断言工厂
    *    4.9. Query 路由断言工厂
    *    4.10. RemoteAddr 路由断言工厂
* 5. 网关过滤器工厂（GatewayFilter Factory）
	*	5.1. AddRequestHeader 过滤器工厂
	*	5.2. AddRequestParameter 过滤器工厂
	*	5.3. AddResponseHeader 过滤器工厂
	*	5.4. DedupeResponseHeader 过滤器工厂
	*	5.5. Hystrix 过滤器工厂
	*	5.6. FallbackHeaders 过滤器工厂
	*	5.7. MapRequestHeader 过滤器工厂
	*	5.8. PrefixPath 过滤器工厂
	*	5.9. PreserveHostHeader 过滤器工厂
	*	5.10. RequestRateLimiter 过滤器工厂
	*	5.11. RedirectTo 过滤器工厂
	*	5.12. RemoveHopByHopHeadersFilter 过滤器工厂
	*	5.13. RemoveRequestHeader 过滤器工厂
	*	5.14. RemoveResponseHeader 过滤器工厂
	*	5.15. RewritePath 过滤器工厂
	*	5.16. RewriteLocationResponseHeader 过滤器工厂
	*	5.17. RewriteResponseHeader 过滤器工厂
	*	5.18. SaveSession 过滤器工厂
	*	5.19. SecureHeaders 过滤器工厂
	*	5.20. SetPath 过滤器工厂
	*	5.21. SetRequestHeader 过滤器工厂
	*	5.22. SetResponseHeader 过滤器工厂
	*	5.23. SetStatus 过滤器工厂
	*	5.24. StripPrefix 过滤器工厂
	*	5.25. Retry 过滤器工厂
	*	5.26. RequestSize 过滤器工厂
	*	5.27. Modify Request Body 过滤器工厂
	*	5.28. Modify Response Body 过滤器工厂
	*	5.29. Default Filters  	
* 6. 全局过滤器（Global Filters）
	*  6.1. 过滤器的执行顺序
	*  6.2. Forward Routing Filter
	*  6.3. LoadBalancerClient Filter
	*  6.4. Netty Routing Filter
	*  6.5. Netty Write Response Filter
	*  6.6. RouteToRequestUrl Filter
	*  6.7. Websocket Routing Filter
	*  6.8. Gateway Metrics Filter
	*  6.9. Marking An Exchange As Routed
* 7. TLS / SSL
	*  7.1. TLS 握手机制（Handshake	）
* 8. 配置
	*	8.1. Fluent Java Routes API 
	*	8.2. DiscoveryClient Route Definition Locator
* 9. Reactor Netty 访问日志
* 10. CORS 配置
* 11. Actuator API
	*	11.1. 详细的监控格式
	*	11.2. 路由过滤器
	*	11.3. 刷新路由
	*	11.4. 查看路由定义信息
	*	11.5. 查看指定路由信息
	*	11.6. 创建和删除指定路由
	*	11.7. Actuator API汇总
* 12. 故障排除
	*	12.1. 日志
	*	12.2. 监听 
* 13. 开发指南
	*	13.1. 自定义 Route Predicate Factories
	*	13.2. 自定义 GatewayFilter Factories
	*	13.3. 自定义 Global Filters
	*	13.4. 自定义 Route Locators and Writers 
* 14. 使用Spring MVC或 Webflux 构建简单的网关
