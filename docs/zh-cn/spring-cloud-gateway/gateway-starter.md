---
title: 
keywords: docs，jcohy-docs,
description: 
---

# 1. 如何接入SpringCloud Gateway

如果你需要在项目中使用SpringCloud Gateway，请使用 group为 org.springframework.cloud，artifact id为 spring-cloud-starter-gateway 的starter。
有关使用当前 [Spring Cloud Release](https://projects.spring.io/spring-cloud/) 设置构建系统的详细信息，请参见Spring Cloud Project页面。

如果包括启动器，但由于某种原因，您不希望启用网关，请设置 `spring.cloud.gateway.enabled = false`。

> Spring Cloud Gateway基于Spring Boot 2.x，Spring WebFlux和Project Reactor构建。 因此，在使用Spring Cloud Gateway时，许多不熟悉的 synchronous 库（例如，Spring Data和Spring Security）和相应模式可能不适用。 如果您对这些项目不熟悉，建议您在使用Spring Cloud Gateway之前先阅读它们的文档，以熟悉一些新概念。

> Spring Cloud Gateway 运行需要Spring Boot和Spring Webflux提供的Netty。所以， 它不能在传统的Servlet容器中运行或作为WAR构建。

