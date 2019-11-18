---
title: 微基准套件
keywords: docs,jcohy-docs,微基准套件，java12
description: 微基准套件
---

## 微基准套件
### 何为JMH?
JMH，即Java Microbenchmark Harness，是专门用于代码微基准测试的工具套件。何谓Micro Benchmark呢？简单的来说就是基于方法层面的基准测试，精度可以达到微秒级。当你定位到热点方法，希望进一步优化方法性能的时候，就可以使用JMH对优化的结果进行量化的分析。
### JMH比较典型的应用场景：
* 想准确的知道某个方法需要执行多长时间，以及执行时间和输入之间的相关性；
* 对比接口不同实现在给定条件下的吞吐量；
* 查看多少百分比的请求在多长时间内完成；
### JMH的使用
要使用JMH，首先需要准备好Maven环境，JMH的源代码以及官方提供的Sample就是使用Maven进行项目管理的，github上也有使用gradle的例子可自行搜索参考。使用mvn命令行创建一个JMH工程：
```java
mvn archetype:generate \
	-DinteractiveMode=false \
	-DarchetypeGroupId=org.openjdk.jmh \
	-DarchetypeArtifactId=jmh-java-benchmark-archetype \
	-DgroupId=co.speedar.infra \
	-DartifactId=jmh-test \
	-Dversion=1.0
```
如果要在现有Maven项目中使用JMH，只需要把生成出来的两个依赖以及shade插件拷贝到项目的pom中即可：
```maven
        <dependency>
            <groupId>org.openjdk.jmh</groupId>
            <artifactId>jmh-core</artifactId>
            <version>0.7.1</version>
        </dependency>
        <dependency>
            <groupId>org.openjdk.jmh</groupId>
            <artifactId>jmh-generator-annprocess</artifactId>
            <version>0.7.1</version>
            <scope>provided</scope>
        </dependency>
        ...
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-shade-plugin</artifactId>
            <version>2.0</version>
            <executions>
                <execution>
                    <phase>package</phase>
                    <goals>
                        <goal>shade</goal>
                    </goals>
                    <configuration>
                        <finalName>microbenchmarks</finalName>
                        <transformers>
                            <transformer
                                    implementation="org.apache.maven.plugins.shade.resource.ManifestResourceTransformer">
                                <mainClass>org.openjdk.jmh.Main</mainClass>
                            </transformer>
                        </transformers>
                    </configuration>
                </execution>
            </executions>
        </plugin>
```
### 新特性的说明
Java 12 中添加一套新的基本的微基准测试套件（microbenchmarks suite），此功能为JDK源代码添加了一套微基准测试（大约100个），简化了现有微基准测试的运行和新基准测试的创建过程。使开发人员可以轻松运行现有的微基准测试并创建新的基准测试，其目标在于提供一个稳定且优化过的基准。 它基于Java Microbenchmark Harness（JMH），可以轻松测试JDK性能，支持JMH更新。

微基准套件与 JDK 源代码位于同一个目录中，并且在构建后将生成单个 jar 文件。但它是一个单独的项目，在支持构建期间不会执行，以方便开发人员和其他对构建微基准套件不感兴趣的人在构建时花费比较少的构建时间。

要构建微基准套件，用户需要运行命令：make build-microbenchmark， 类似的命令还有：make test TEST="micro:java.lang.invoke" 将使用默认设置运行 java.lang.invoke 相关的微基准测试。
