---
layout: article
comments: true
title: 初识AngularJS
category: frontend
tags: [AngularJs]
---

14年4月入职新公司，跟着Eyal开始接触、使用node.js，angular.js，d3.js等等，感觉到前端世界一扇不同的大门为我开启了。angular.js不同于以前接触过的Backbone，“增强HTML”是新奇的、不错的想法。在我的angular.js学习之路上，有了这几篇或十几篇有关angular的文章。

<!--view-break-->

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

以上是对angular的概览，基本是对<https://docs.angularjs.org/guide/introduction>的翻译与精简，并再次强调：一个正确的印象要比急于深入细节重要。

##我希望我早知道这些关于AngularJS的

这是一段补充，来自[Ruoyu Sun's博客|Things I Wish I Were Told About Angular.js](http://ruoyusun.com/2013/05/25/things-i-wish-i-were-told-about-angular-js.html)。在开始深入学习angular前读一读这篇文章可能会比较好。但请注意：这一段基于`angularJS 1.0.x`，一些内容可能已经不再合适。

###关于学习曲线

Backbone.js在前期就有很陡峭的学习曲线，写一个最简单的应用可能就需要学很多，但一旦你学会，写任何Backbone的应用可能也不需要更多知识了。

Angular.js不同，你可能只需要知道控制器与一些指令就能开始写简单应用，但后面的学习曲线陡峭。

###在开始前就要理解模块

不要把代码仍在一个大文件里，学会模块化。可以把`controllers`分解到不同模块里，按需加载。可以从`controllers`中分解出通用的`filter`和`services`。另外，理解`dependency injection (DI)`。依赖注入可以使代码解耦合并更易维护。

###When Your Controllers Get Bigger, Learn Scope

你一开始不必理解`scope`，把它当作魔法就好。但你可能已经、或者必然会遇到以下问题：

**为什么我的视图不更新？**

```javascript
function SomeCtrl($scope) {
    setTimeout(function() {
        $scope.message = "I am here!";
    }, 1000);
}
```

**为什么`ng-model="touched" `不像预期那样工作？**

```html
<script type="text/javascript">
function SomeCtrl($scope) {
    $scope.items = [{ value: 2 }];
    $scope.touched = false;
}
</script>
<ul>
    <li ng-repeat="item in items">
        <input type="text" ng-model="item.value">
        <input type="checkbox" ng-model="touched">
    </li>   
</ul>
```

以上都跟`$scope`有关。更重要的是，当你的控制器越来越大，是时候拆分为子控制器了，并且继承与`$scope`密切相关。你应该知道`$scope`怎么工作：

- 数据绑定和`$scope.$watch()`、`$scope.$apply()`的关系？
- 控制器和其子控制器怎么分享`$scope`？
- angular什么时候会自动创建新的`$scope`？
- 事件（`$scope.$on`, `$scope.$emit`, `$scope.$broadcast`）怎么在`scopes`之间传递？

回到上面两个问题，答案仅供参考：

1. 你需要`$scope.$apply()`;
2. 在`ng-repeat`内，angular自动创建新的`scope`。

###当你在控制器内操作DOM，那么写指令

angular推荐控制器和视图（DOM）之间的分离。

但需要在控制器中操作DOM的情况有时不可避免，典型的例子如jQuery的插件。尽管jQuery插件已经有点过时了，但它的生态系统不会那么快消失。然而，在控制器中使用jQuery插件非常**糟糕**：你的控制器将很难测试，而且难以复用。

最好的方法是写自定义指令。指令可以当作可复用的组件：不仅是jQuery插件，还可以是在多处使用的你自己的控制器。最好的地方在于，你的控制器不必知道指令的存在，交流由scope共享和$scope事件来完成。

对自定义指令的一句话总结：控制逻辑放在指令控制器中，DOM操作放在`link`函数中，scope共享是胶水。

>For any of you who look for a word of wisdom, here is my one sentence summary: put control logic in directive controller, and DOM logic in link function; scope sharing is the glue.

###angular的路由可能不是你所想的

路由可能是个陷阱。不像Backbone，angular监视`location.hash`，当路由符合某个规则时调用回调。Angular.js路由工作时与服务器端路由类似，它与`ng-view`协同工作。当符合一种路由时，angular会加载模板并注入ng-view，一些控制器会被实例化。

你可以写自己的服务来代替路由，如果你不喜欢这种工作机制的话。

-----

这篇文章作为「angular学习系列」的开篇可能有点冗长，一下子抛出这么多概念也可能超出了初学者的舒适范围，但正如前面提到的：树立正确的框架要比管中窥豹好。

另外，感谢[thinkster](https://thinkster.io/angulartutorial)的angular集成，对学习angular真是再好不过。[Ruoyu Sun's](http://ruoyusun.com/)的博客很不错，感兴趣的可以多看看。

-----
