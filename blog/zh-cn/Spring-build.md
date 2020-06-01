---
title: 如何构建Spring系列源码
keywords: spring, 构建,Spring 源码
description: 如何构建Spring源码
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
          <id>aliyun</id>
          <name>aliyunmaven</name>
          <url>https://maven.aliyun.com/nexus/content/groups/public/</url>
      </repository>
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
          <id>aliyun</id>
          <name>aliyunmaven</name>
          <url>https://maven.aliyun.com/nexus/content/groups/public/</url>
      </repository>
      
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

## 二、如何构建Sagan源码

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

在 sagan-renderer,sagan-site 模块中找到 repositories 标签添加阿里云仓库

	maven {url 'http://maven.aliyun.com/nexus/content/groups/public/' }


​	
#### 4、构建

```shell
    
    //windowns
    gradlew.bat build
    
    ./gradlew :sagan-site:bootRun

```

#### 5、删除 git 信息

如果你下载的是 源码zip 包。则需要删除 git 信息。在 sagan-site 目录下的 build.gradle 删除 com.gorylenko.gradle-git-properties 插件

```shell
plugins {
	id 'java'
	id "org.asciidoctor.convert" version "1.5.3"
	//注释或者删除
//	id "com.gorylenko.gradle-git-properties" version "1.5.2"
}
```

#### 6、数据源

此项目默认使用 h2 数据库并默认开启了 h2 控制台。项目运行起来后。可以访问 http://localhost:8080/h2-console 

在默认的情况下，Spring Boot 将会配置 H2 数据库使用 sa 为用户名，用户名密码为空。数据库 url 为 **jdbc:h2:mem:testdb**

当然你可以可以通过修改 application.properties  文件中配置文件来为你的 H2 数据库指定登录的用户名和密码。


```properties
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=password
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
```

当然我们也可以切换数据源。比如切换到 mysql

首先需要删除 h2 相关依赖，并添加 mysql 依赖

```build.gradle
compile "mysql:mysql-connector-java:8.0.19"
// datasource and connection pool dependencies
runtime 'org.postgresql:postgresql:9.4.1212'
//	runtime 'com.h2database:h2'
```

修改 application.properties 。添加 mysql 配置

```yaml
spring:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/spring-sagan?useUnicode=true&characterEncoding=UTF-8&serverTimezone=GMT%2B8&useSSL=false
    username: root
    password: 输入自己的密码
```

修改 sql 脚本

V1__initialize.sql:

```sql
CREATE TABLE member_profile (
  id                   SERIAL                 NOT NULL PRIMARY KEY,
  avatar_url           CHARACTER VARYING(255),
  bio                  VARCHAR(255),
  latitude             double,
  longitude            double,
  github_id            BIGINT(11),
  github_username      CHARACTER VARYING(255),
  gravatar_email       CHARACTER VARYING(255),
  hidden               BOOLEAN,
  lanyrd_username      CHARACTER VARYING(255),
  location             CHARACTER VARYING(255),
  name                 CHARACTER VARYING(255),
  speakerdeck_username CHARACTER VARYING(255),
  twitter_username     CHARACTER VARYING(255),
  username             CHARACTER VARYING(255) NOT NULL,
  video_embeds         VARCHAR(255),
  job_title            CHARACTER VARYING(255)
)ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci;

CREATE TABLE post (
  id               SERIAL                 NOT NULL PRIMARY KEY,
  broadcast        BOOLEAN                NOT NULL,
  category         CHARACTER VARYING(255) NOT NULL,
  created_at       TIMESTAMP              NOT NULL,
  draft            BOOLEAN                NOT NULL,
  format           CHARACTER VARYING(255),
  public_slug      CHARACTER VARYING(255) UNIQUE,
  publish_at       TIMESTAMP,
  raw_content      VARCHAR(255)                NOT NULL,
  rendered_content VARCHAR(255)                NOT NULL,
  rendered_summary VARCHAR(255)                NOT NULL,
  title            CHARACTER VARYING(255) NOT NULL,
  author_id        INTEGER                NOT NULL REFERENCES member_profile (id)
)ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci;


CREATE TABLE post_public_slug_aliases (
  post_id             INT                    NOT NULL,
  public_slug_aliases CHARACTER VARYING(255) NOT NULL UNIQUE,
  PRIMARY KEY (post_id, public_slug_aliases)
)ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci;


CREATE INDEX idx_category
  ON POST (category);
CREATE INDEX idx_draft
  ON POST (draft);
CREATE INDEX idx_publish_at
  ON POST (publish_at);

CREATE TABLE project (
  id                  CHARACTER VARYING(255) NOT NULL PRIMARY KEY,
  name                CHARACTER VARYING(255),
  repo_url            CHARACTER VARYING(255),
  category            CHARACTER VARYING(255),
  site_url            CHARACTER VARYING(255),
  is_aggregator       BOOLEAN,
  stack_overflow_tags CHARACTER VARYING(255)
)ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci;


CREATE TABLE project_release_list (
  project_id     CHARACTER VARYING(255) NOT NULL,
  repository_id  CHARACTER VARYING(255),
  api_doc_url    CHARACTER VARYING(255),
  artifact_id    CHARACTER VARYING(255),
  group_id       CHARACTER VARYING(255),
  is_current     BOOLEAN,
  ref_doc_url    CHARACTER VARYING(255),
  release_status INT,
  version_name   CHARACTER VARYING(255),
  PRIMARY KEY (project_id, version_name)
)ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci;


CREATE TABLE project_repository (
  id                CHARACTER VARYING(255) NOT NULL PRIMARY KEY,
  name              CHARACTER VARYING(255),
  url               CHARACTER VARYING(255),
  snapshots_enabled BOOLEAN
)ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci;
```

V2__projectpages.sql

```sql
ALTER TABLE project ADD raw_boot_config VARCHAR(255);
ALTER TABLE project ADD rendered_boot_config VARCHAR(255);

ALTER TABLE project ADD raw_overview VARCHAR(255) DEFAULT '';
ALTER TABLE project ADD rendered_overview VARCHAR(255) DEFAULT '';

ALTER TABLE project DROP COLUMN is_aggregator;
ALTER TABLE project ADD parent_project_id CHARACTER VARYING(255) DEFAULT NULL;

ALTER TABLE project ADD display_order INT NOT NULL DEFAULT 255;

CREATE TABLE project_sample_list (
  title          VARCHAR(255),
  description    VARCHAR(255),
  url            VARCHAR(255),
  display_order  INT NOT NULL,
  project_id     CHARACTER VARYING(255) NOT NULL,
  PRIMARY KEY (project_id, display_order)
)ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci;
```

V3__springtools.sql

```sql
CREATE TABLE spring_tools_platform
(
  id   CHARACTER VARYING(255) NOT NULL PRIMARY KEY
);

CREATE TABLE spring_tools_platform_downloads
(
  spring_tools_platform_id CHARACTER VARYING(255) NOT NULL,
  download_url             CHARACTER VARYING(255) NOT NULL,
  variant                  CHARACTER VARYING(255) NOT NULL,
  label                    CHARACTER VARYING(255) NOT NULL,
  PRIMARY KEY (spring_tools_platform_id, variant)
)ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci;
```

V4__projects.sql

```sql
ALTER TABLE project ADD tag_line CHARACTER VARYING(255) DEFAULT '';
ALTER TABLE project ADD featured BOOLEAN;
ALTER TABLE project ADD image_path CHARACTER VARYING(255) DEFAULT '';

UPDATE project SET featured = FALSE WHERE featured IS NULL;

-- create a new groups reference table
CREATE TABLE project_groups
(
    id   SERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(255) UNIQUE,
    label VARCHAR(255)
)ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- relation table between project and project_groups tables
create table project_groups_rel
(
    project_id VARCHAR(255) REFERENCES project (id),
    group_id   INT REFERENCES project_groups (id),
    CONSTRAINT id PRIMARY KEY (project_id, group_id)
)ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci;
```

V99__fixtures.sql 不用变

创建 spring-sagan 数据库。项目运行的时候会根据脚本自动创建表结构。

#### 7、 参考地址

https://github.com/spring-io/sagan/wiki

## 如何构建Spring源码

### 下载源码

```shell
git clone git@github.com:spring-projects/spring-framework.git
cd spring-framework
```



### 修改仓库地址

* 修改 根目录下的 settings.gradle 文件,找到 pluginManagement 元素，修改为以下内容

```pom
pluginManagement {
	repositories {
		maven {
			url 'https://maven.aliyun.com/repository/gradle-plugin'
		}
		maven {
			url 'https://maven.aliyun.com/repository/gradle-plugin'
		}
		gradlePluginPortal()
		maven { url 'https://repo.spring.io/plugins-release' }
	}
}
```

* 修改根目录下的 build.gradle 文件，找到 repositories 元素，修改里面内容为以下内容

```pom
repositories {
	maven {
		url 'http://maven.aliyun.com/nexus/content/groups/public/'
	}
	mavenCentral()
	maven { url "https://repo.spring.io/libs-spring-framework-build" }
}
```

* 进入到 buildSrc 目录下的 build.gradle 文件中，找到  repositories 元素，修改里面内容为以下内容

```pom
repositories {
	maven {
		url 'http://maven.aliyun.com/nexus/content/groups/public/'
	}
	mavenCentral()
	gradlePluginPortal()
}
```

### 构建

```shell
./gradlew build
```

首次运行构建时，可能需要一段时间才能下载 Gradle 和所有构建依赖项，以及运行所有测试。 一旦启动了Gradle 发行版并下载了依赖项，它们就会被缓存在 $HOME/.gradle 目录中。

Gradle具有良好的增量构建支持，因此请运行时保持整洁，以免发生问题。 您也可以使用 -a 标志和 :project 前缀来构建测试其他模块。 例如，如果要遍历 spring-webmvc 中的更改，请使用以下命令运行测试构建该模块：

```shell
./gradlew -a :spring-webmvc:test
```

要在本地 Maven 存储库中安装所有 Spring Framework jar，请使用以下命令。

请注意，**-x...** 参数跳过文档的生成。

```shell
./gradlew publishToMavenLocal -x javadoc -x dokka -x asciidoctor
```

如果要构建框架的早期版本（例如，Spring Framework 5.1.x），请使用：

```shell
./gradlew install -x javadoc
```

