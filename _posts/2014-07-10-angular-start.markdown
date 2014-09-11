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

##AngularJs是什么

>AngularJS诞生于Google是一款优秀的前端JS框架，已经被用于Google的多款产品当中。AngularJS有着诸多特性，最为核心的是：MVC、模块化、自动化双向数据绑定、语义化标签、依赖注入，等等。

这段定义引用自[百度百科](http://baike.baidu.com/view/9604951.htm?fr=aladdin)，而angular官网也有自己的一句概括：

>HTML enhanced for web apps!

先理解一下**前端框架**这个概念：

- 类库 - 类库是一些函数的集合，它能帮助你写WEB应用。起主导作用的是你的代码，由你来决定何时使用类库。类库有：jQuery等。
- 框架 - 框架是一种特殊的、已经实现了的WEB应用，你只需要对它填充具体的业务逻辑。这里框架是起主导作用的，由它来根据具体的应用逻辑来调用你的代码。框架有：knockout、sproutcore等。

AngularJS不是类库。它没有抽象html、css、js，也不需要继承特殊的类型，不使用单向绑定并且重视测试。angular是一个扩展html，使html更具表现力、更可读的js框架。正如angular自我描述的：HTML enhanced for web apps。

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
