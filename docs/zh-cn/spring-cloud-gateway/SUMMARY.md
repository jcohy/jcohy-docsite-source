---
title: 摘要
keywords: docs，jcohy-docs，spring cloud gateway,summary
description: Spring  Cloud  Gateway 中文文档
---

# Spring  Cloud  Gateway 中文文档
> #### Version 2.1.3.RELEASE
>

* 1. 如何接入SpringCloud Gateway
* 2. 词汇
* 3. 如何运行
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
	*  6.1.  Global Filter 和 GatewayFilter 结合
	*  6.2. Forward Routing Filter
	*  6.3. LoadBalancerClient Filter
	*  6.4. Netty Routing Filter
	*  6.5. Netty Write Response Filter
	*  6.6. RouteToRequestUrl Filter
	*  6.7. Websocket Routing Filter
	*  6.8. Gateway Metrics Filter
	*  6.9. Marking An Exchange As Routed
* 7. TLS / SSL
	*  7.1. TLS Handshake	
* 8. Configuration
	*	8.1. Fluent Java Routes API 
	*	8.2. DiscoveryClient Route Definition Locator
* 9. Reactor Netty Access Logs
* 10. CORS Configuration
* 11. Actuator API
	*	11.1. Verbose Actuator Format
	*	11.2. Retrieving route filters
	*	11.3. Refreshing the route cache
	*	11.4. Retrieving the routes defined in the gateway
	*	11.5. Retrieving information about a particular route
	*	11.6. Creating and deleting a particular route
	*	11.7. Recap: list of all endpoints 
* 12. Troubleshooting
	*	12.1. Log Levels
	*	12.2. Wiretap 
* 13. Developer Guide
	*	13.1. Writing Custom Route Predicate Factories
	*	13.2. Writing Custom GatewayFilter Factories
	*	13.3. Writing Custom Global Filters
	*	13.4. Writing Custom Route Locators and Writers 
* 14. Building a Simple Gateway Using Spring MVC or Webflux
