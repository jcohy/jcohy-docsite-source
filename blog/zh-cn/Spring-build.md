---
title: 如何构建Spring系列源码
keywords: spring, 构建,Spring Boot 2.2.3.RELEASE
description: 如何构建SpringBoot源码
---

## 一、如何构建SpringBoot源码

#### 1、环境准备

JDK8 以上。

#### 2、下载SpringBoot源码
我们可以在github上下载SpringBoot源码，本文下载的是SpringBoot最新的版本 2.2.3.RELEASE。下载地址：

```java
https://codeload.github.com/spring-projects/spring-boot/tar.gz/v2.2.3.RELEASE
```

#### 3、解压

我们将下载后的文件上传到服务器上，解压。我这里上传到了 /home 目录下
```shell
tar -zxvf  spring-boot-2.2.3.RELEASE.tar.gz
```

#### 4、修改配置

SpringBoot 是使用 Maven 构建的，并提供了 maven-wrapper ，这样我们就无须下载安装 Maven 也可以进行构建。SpringBoot项目在构建中也使用了 Gradle。这一点需要注意。
为了加速构建，我们这里可以修改一下参数：

首先我们看一下SpringBoot的目录结构

![image-20200119133128642](http://docs.jcohy.com/img/spring-boot1.png)

- 修改内存大小

  默认maven构建时的内存大小为 1536m，我们可以根据本机实际内存进行修改，不然会出错。。修改下面的文件。

  ```
  root --> ./mvn --> jvm.config
  ```

- 修改pom文件。在 repositories 标签和 pluginRepositories 分别加入
  
    ```xml
      <repository>
          <id>spring-release</id>
          <name>Spring Release</name>
          <url>https://repo.spring.io/release</url>
      </repository>
    ```

    ```xml
    <pluginRepository>
      <id>aliyunmaven</id>
      <name>aliyunmaven Release</name>
      <url>https://maven.aliyun.com/nexus/content/groups/public</url>
    </pluginRepository>
    ```

  修改后的部分pom如下：

    ```xml
    <repositories>
      <!-- Repositories to allow snapshot and milestone BOM imports during development.
     This section is stripped by the flatten plugin during install/deploy. -->
    
      <repository>
          <id>spring-release</id>
          <name>Spring Release</name>
          <url>https://repo.spring.io/release</url>
      </repository>
    
      <repository>
          <id>central</id>
          <url>https://repo.maven.apache.org/maven2</url>
          <snapshots>
              <enabled>false</enabled>
          </snapshots>
      </repository>
      <repository>
          <id>spring-milestone</id>
          <name>Spring Milestone</name>
          <url>https://repo.spring.io/milestone</url>
          <snapshots>
              <enabled>false</enabled>
          </snapshots>
      </repository>
      <repository>
          <id>spring-snapshot</id>
          <name>Spring Snapshot</name>
          <url>https://repo.spring.io/snapshot</url>
          <snapshots>
              <enabled>true</enabled>
          </snapshots>
      </repository>
      <repository>
          <id>rabbit-milestone</id>
          <name>Rabbit Milestone</name>
          <url>https://dl.bintray.com/rabbitmq/maven-milestones</url>
          <snapshots>
              <enabled>false</enabled>
          </snapshots>
      </repository>
    </repositories>
    <pluginRepositories>
      <pluginRepository>
          <id>aliyunmaven</id>
          <name>aliyunmaven Release</name>
          <url>https://maven.aliyun.com/nexus/content/groups/public</url>
      </pluginRepository>
    
      <pluginRepository>
          <id>central</id>
          <url>https://repo.maven.apache.org/maven2</url>
          <snapshots>
              <enabled>false</enabled>
          </snapshots>
      </pluginRepository>
      <pluginRepository>
          <id>spring-release</id>
          <name>Spring Release</name>
          <url>https://repo.spring.io/release</url>
      </pluginRepository>
      <pluginRepository>
          <id>spring-milestone</id>
          <name>Spring Milestone</name>
          <url>https://repo.spring.io/milestone</url>
          <snapshots>
              <enabled>false</enabled>
          </snapshots>
      </pluginRepository>
      <pluginRepository>
          <id>spring-snapshot</id>
          <name>Spring Snapshot</name>
          <url>https://repo.spring.io/snapshot</url>
          <snapshots>
              <enabled>true</enabled>
          </snapshots>
      </pluginRepository>
    </pluginRepositories>
    ```

  

- 修改 build.gradle 文件

  ```shell
  cd /home/spring-boot-2.2.3.RELEASE/spring-boot-project/spring-boot-tools/spring-boot-gradle-plugin
  vim build.gradle
  ```

  修改后的文件如下：

  ```groovy
  buildscript {
  	repositories {
  		maven { url "https://maven.aliyun.com/nexus/content/groups/public/" }
  		mavenLocal()
  		mavenCentral()
  	}
  	dependencies {
  		classpath("io.spring.javaformat:spring-javaformat-gradle-plugin:0.0.15")
  	}
  }
  
  plugins {
  	id 'java'
  	id 'eclipse'
  }
  
  apply plugin: 'io.spring.javaformat'
  
  repositories {
  	maven { url "https://maven.aliyun.com/nexus/content/groups/public/" }
  	mavenLocal()
  	mavenCentral()
  }
  
  dependencies {
  	implementation localGroovy()
  	implementation gradleApi()
  	implementation fileTree(dir: 'target/dependencies/compile', include: '*.jar')
  	testImplementation gradleTestKit()
  	testImplementation 'org.apache.commons:commons-compress:1.13'
  	testImplementation fileTree(dir: 'target/dependencies/test', include: '*.jar')
  }
  
  jar {
  	manifest {
  		attributes 'Implementation-Version': (version ? version : 'unknown')
  	}
  }
  
  test {
  	useJUnitPlatform()
  	testLogging {
  		events "passed", "skipped", "failed"
  	}
  }
  
  javadoc {
  	options {
  		author()
  		stylesheetFile = file('src/main/javadoc/spring-javadoc.css')
  		links = [
  			'https://docs.oracle.com/javase/8/docs/api/',
  			'https://docs.gradle.org/current/javadoc/'
  		]
  		source = '8'
  	}
  	title = "${project.description} $version API"
  }
  
  task sourcesJar(type: Jar) {
  	classifier = 'sources'
  	from sourceSets.main.allSource
  }
  
  task javadocJar(type: Jar) {
  	classifier = "javadoc"
  	from javadoc
  }
  
  artifacts {
  	archives sourcesJar
  	archives javadocJar
  }
  ```

   #### 5、源码构建

- 构建

  ```shell
  # 下面的命令会将执行所有测试用例，所以消耗时间比较长。
  $ ./mvnw clean install
  # 如果不需要执行测试用例，可以使用以下命令
  $ ./mvnw clean install -DskipTests
  ```
  
- 构建参考文档首先要构建 Maven 插件。

  ```shell
  $ ./mvnw clean install -pl spring-boot-project/spring-boot-tools/spring-boot-maven-plugin -Pdefault,full
  ```
  
- 该文档还包括自动生成 Starter 的一些信息。 您可能已经将其存储在本地存储库中（第一步），但是如果要刷新它，可以执行以下命令

  ```shell
  $ ./mvnw clean install -f spring-boot-project/spring-boot-starters
  ```
  
- 构建参看文档

  ```shell
  $ ./mvnw clean prepare-package -pl spring-boot-project/spring-boot-docs -Pdefault,full
  ```
  
  #### 6、更快
  
  由于SpringBoot引入的依赖比较多，所有在执行第一步的时候还是比较耗时，为了更快的构建，我已经将 SpringBoot 2.2.3.RELEASE 构建需要的 Jar 包打包。共享到百度云盘，大家只需要下载，解压到maven本地存储库中，即可。
  
  ``` shell
  百度云链接：
  链接：https://pan.baidu.com/s/1a9NGtgxzvdVtpnetQACudQ 
  提取码：lqmh 
  
  默认解压目录：
  Linux：./root/.m2
  windowns:C:\Users\PC\.m2
  ```

## 一、如何构建Sagan源码

#### 1、下载源码


```java
https://github.com/spring-io/sagan
```

#### 2、进入 sagan-client ,修改 webpack.config.js

找到下面这句

```json
            {
                test: /.*\/fonts\/.*/,
                loader: 'file-loader',
                options: {
                    name: 'fonts/[name].[ext]',
                },
            },
```

修改为：

```text

            {
                test: /\.(ttf|eot|woff|woff2|svg)$/,
                loader: 'file-loader',
                options: {
                    name: 'fonts/[name].[ext]',
                },
            },
```

#### 3、添加阿里云镜像，加速构建

在 sagan-common,sagan-renderer,sagan-site 模块中找到 repositories 标签添加阿里云仓库

	maven {url 'http://maven.aliyun.com/nexus/content/groups/public/' }
	
#### 4、构建

```shell
    
    //windowns
    gradlew.bat build
    
    ./gradlew :sagan-site:bootRun

```
