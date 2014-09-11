---
layout: article
comments: true
title: 初识AngularJS
category: frontend
tags: [AngularJs]
---

14年4月入职新公司，跟着Eyal开始接触、使用node.js，angular.js，d3.js等等，感觉到前端世界一扇不同的大门为我开启了。angular.js不同于以前接触过的Backbone，“增强HTML”是新奇的、不错的想法。在我的angular.js学习之路上，有了这几篇或十几篇有关angular的文章。

首先声明学习过的资料（这些资料可能会出现在文章中）：

- Angular官网：<https://angularjs.org/>
- A Better Way to Learn AngularJS：<https://thinkster.io/angulartutorial/a-better-way-to-learn-angularjs/>
- 吕大豹「走进AngularJs」：<http://www.cnblogs.com/lvdabao/tag/AngularJs/>

##AngularJs是什么?

AngularJS是为动态web应用设计的结构化框架。它让你可以用html作为模板语言，让你扩展html语法来更清晰简洁地展现你的应用组件。angular的数据绑定和依赖注入可以让你少写大量代码。angular是前端框架，可以搭配任意后台。

html作为声明式语言对静态文档而言是不错的，但不能满足动态web应用的需要。一些解决方案是使用类库或框架：

- 类库：类库是一些函数的集合，它能帮助你写Web应用。起主导作用的是你的代码，由你来决定何时使用类库。类库有：`jQuery`等。
- 框架：框架是一种特殊的、已经实现的Web应用，你只需要对它填充具体的业务逻辑。这里框架是起主导作用的，由它来根据具体的应用逻辑来调用你的代码。框架有：`durandal`, `ember`等。

angular采用了另一个解决方案。它试图缩小以静态文档为核心的html和web应用需要的创建新html结构的不匹配。angular通过指令教会浏览器新语法。

一句话概括angular：

>HTML enhanced for web apps!

###全面的客户端解决方案

angular是web应用在客户端一侧的全面解决方案。

- 构建CRUD应用所需要的全部：数据绑定，模板指令，表格验证，路由，重用组件。依赖注入。
- 测试：单元测试，端到端测试，mocks和测试工具。
- 种子应用和测试脚本作为开发起点。

###适用范围

angular为CRUD应用而设计。游戏和GUI编辑器等需要密集、复杂DOM操作不适合angular，用抽象度更低的类库可能更好，如`jQuery`。

##AngularJS概览

学习新知识前，要在深入细节前，先树立有关话题的正确框架。所以可以先在[官网](https://docs.angularjs.org/guide/concepts)看看一些基本概念。

概念 | 描述
-----------|---------
Template   | 有额外标签的html（HTML with additional markup）
Directives | 用自定义属性或元素扩展html（extend HTML with custom attributes and elements）
Model      | 数据，在视图中展示，并和用户交互（the data shown to the user in the view and with which the user interacts）
Scope      | 上下文（环境），model存储在其上，model因此可以被指令、控制器、表达式访问（context where the model is stored so that controllers, directives and expressions can access it）
Expressions| 访问scope上的变量与方法（access variables and functions from the scope）
Compiler   | 解析模板，实例化指令和表达式（parses the template and instantiates directives and expressions）
Filter     | 格式化表达式的结果（formats the value of an expression for display to the user）
View       | 用户见到的（Dom）（what the user sees (the DOM)）
Data Binding| 同步模型与视图的数据（sync data between the model and the view）
Controller | 视图背后的业务逻辑（the business logic behind views）
Dependency Injection | 创建并引入对象和方法（Creates and wires objects and functions）
Injector   | 依赖注入的容器（dependency injection container）
Module     | 指令、控制器、服务等等的容器，可以配置注入（a container for the different parts of an app including controllers, services, filters, directives which configures the Injector）
Service    | 可重用的并且独立于视图的业务逻辑（reusable business logic independent of views）

##AngularJS禅理

angular基于这样的理念而开发：在一起构建UI和软件组件时，声明式语言比命令式语言更好;命令式语言更适合写业务逻辑。

- 把Dom操作和应用逻辑解耦非常好，折显著提高代码可测试性。
- 测试和编程一样重要，测试难度取决于代码结构。
- 客户端和服务端解偶很好，这使开发可以并行，并且两边都可以复用。
- 框架如果能从头到尾给予开发人员引导，则很好。从ui设计到编写到测试。
- 使一般任务容易，使难度任务可以完成总是好的。

angular让你免于以下痛苦：

- 注册回调。
- 以编程操作DOM。
- 把数据填充到UI/从UI取数据。
- 写一堆初始化代码只是让程序可以启动。

##运行angular

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>运行ng</title>
    <!-- 引入angular.js -->
    <script type="text/javascript" src="../angular.js"></script>
</head>
<body>
    <div>
        1+1={{1+1}}<!-- 输出：1+1=2 -->
    </div>
    <script>
        angular.bootstrap(document, []);
    </script>
</body>
</html>
```

以上是angular最简单的运用，通过调用bootstrap方法传入作用域和初始化的模块数组（此处为空）初始化angular。当然，我们可以不用bootstrap来初始化，仅改变2处：

```html
<!DOCTYPE html>
<html ng-app="myApp">
...
    <script>
        var app = angular.module("myApp", [], function(){
                console.log("start");
            })
    </script>
</body>
</html>
```

在`<html>`标签上多了一个属性ng-app="MyApp"，它就是用来指定ng的作用域是在`<html>`标签以内部分。js中，我们用module方法定义了模块，名字与ng-app对应。关于这些代码的具体说明先不急，但我们已经能让angular运行起来了。

##模板与数据绑定

*模板是什么？*

1. 没有模板概念时，我们通过字符串拼接，然后append到dom实现dom更新。
2. underscore等类库实现了前端模板，用`<script>`标签来实现。
3. angular更进一步，HTML代码就是模板，突破了`<script>`的限制。

*绑定是什么？*

绑定就是数据与视图之间的绑定。angular强大之处在于数据与视图之间的双向绑定，即数据变化，dom相应更新；dom交互，数据也会变化。

```html
<!DOCTYPE html>
<html ng-app="MyApp">
<head>
    <meta charset="utf-8" />
    <title>模板数据绑定</title>
    <script type="text/javascript" src="../angular.js"></script>
</head>
<body>
    <div ng-controller="testC">
        <h1>{{newtitle}}</h1>
        题目:<input type="text" ng-model="name" /><br />
        分数:<input type="text" ng-model="fraction" /><br />
        <hr>
        <h1>{{previewtitle}}</h1>
        <b>{{name}}</b>({{fraction}}分)
    </div>
    <script type="text/javascript" charset="utf-8">
    var app = angular.module('MyApp', [], function() {
        console.log('started')
    });
    var testC = function($scope) {
        $scope.newtitle = '新建试题';
        $scope.previewtitle = '预览试题';
        $scope.name = $scope.fraction = '';
    }
    </script>
</body>
</html>
```

这是模板与绑定的简单demo，可以看出以下几点：

* {{}}实现数据到模板的单向绑定；
* ng-model双向绑定；
* ng-controller声明控制器，控制器建立数据到视图之间的联系。

到此，对angular有了基本的认识，更多的留到后面吧。
