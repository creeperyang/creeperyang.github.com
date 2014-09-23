---
layout: article
comments: true
title: AngularJs入门（启动、表达式和数据绑定）
category: frontend
tags: [AngularJs]
---

angular的一个闪光点是你只需要对框架有个很少的了解就能顺利跑起Demo了。这很好，你可以边学边实际做，毕竟自学最重要的一点是动手，而不是`biabiabia`看些文档或视频就好。

首先，看怎么启动最简单的Angular应用。

<!--view-break-->

##启动angular

angular可以自动启动或手动启动。

###Angular `<script>` Tag

下面是官方推荐的启动方式，可以自动初始化。

```html
<!doctype html>
<html ng-app>
  <body>
    ...
    <script src="angular.js" />
  </body>
</html>
```

- 把`script`标签放在页面底部，这样可以防止html加载不被angular加载阻塞。
- 把`ng-app`放在app的根上，一般是`<html>`标签，这样angular可以自动初始化app。

###自动初始化(Automatic Initialization)

angular会自动初始化，一般在`DOMContentLoaded`事件发生时或者`document.readyState`是`complete`时且`angular.js`脚本被执行。这时，angular会寻找`ng-app`指令，`ng-app`就指定了app root。一旦`ng-app`被找到，angular会做以下事情：

- 加载与指令相关的模块（module）;
- 创建注入器;
- 编译dom，把`ng-app`指令当作编译开始的根元素。

###手动初始化(Manual Initialization)

如果你希望控制初始化过程，你可以手动初始化。

```html
<!doctype html>
<html>
<body>
  Hello { {greetMe} }!
  <script src="http://code.angularjs.org/snapshot/angular.js"></script>

  <script>
    // 先定义app 模块
    angular.module('myApp', [])
      .controller('MyController', ['$scope', function ($scope) {
        $scope.greetMe = 'World';
      }]);
    // 载入app模块，应用启动后不能在添加controllers, services, directives等等
    angular.element(document).ready(function() {
      angular.bootstrap(document, ['myApp']);
    });
  </script>
</body>
</html>
```

##表达式(Angular Expressions)

angular表达式是类js代码（`JavaScript-like code snippets`），经常放在绑定中，如`{ { expression } }`。

一些合法的例子：

- `1+2`
- `a+b`
- `user.name`
- `items[index]`

###angular表达式与js代码的区别

- **context**：js代码一般以`window`为全局对象执行，angular表达式一般是`scope`;
- **Forgiving**：js中，计算`undefined`的属性时报错，angular会宽容forgiving to `undefined` and `null`;
- **No Control Flow Statements**：没有流程控制，如条件、循环或例外（exceptions）;
- **Filters**：可以使用过滤器格式化表达式的输出。

####Context

angular不使用`eval()`来计算表达式。angular使用`$parse`服务来处理表达式。

angular表达式无法访问全局变量如`window`, `document`或者`location`。这种严格是故意的，可以防止意外改变全局变量——这常常会导致bug。

可以在函数中使用`$window`和`$location`服务代替。

####Forgiving

表达式执行会forgiving to undefined and null。在js中，如果a不是对象，执行`a.b.c`会抛出异常。

表达式执行通常是为了数据绑定，形式如`{ { a.b.c } }`，a是`undefined`（通常是等待服务器response，然后a会被定义）则会抛出异常，这很不好。如果没有Forgiving，我们可能不得不写这样的表达式：

```javascript
{ { ((a||{}).b||{}).c } }
```

####No Control Flow Statements

除了三元操作符（`a ? b : c`），angular表达式中不允许任何流程控制语句。

有这种限制的原因是angular的哲学：应用逻辑应该在控制器中，而不是在视图中。

####Filter

看例子：

<iframe width="100%" height="300" src="http://jsfiddle.net/creeper/vbd4qdwm/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

这里面`{ {clickEvent | json} }`就有过滤器json。

注意：

- 我们怎么把`$event`传给`clickMe`函数的。
- `$event`在第一处为什么不能显示？因为`$event`不在绑定的`scope`范围内。



##数据绑定（Data Binding）

Angular的数据绑定就是**模型（model）**和**视图组件（view components）**之间的数据的自动同步。

angular实现数据绑定的方式让你把模型看作app中唯一真相的来源（lets you treat the model as the single-source-of-truth in your application）。视图是模型的投影，模型的任何改动将会影响视图，反之亦然。

###经典模板系统中的数据绑定

![例图](https://docs.angularjs.org/img/One_Way_Data_Binding.png)

绝大多数模板系统的数据绑定都是单向的：它们把模型组件和模板合并得出视图。一旦合并后，视图或模型某一方的改动都不会影响到另一方，即开发者必须自己写代码去保持两者同步。

###angular模板的数据绑定

![例图](https://docs.angularjs.org/img/Two_Way_Data_Binding.png)

angular模板不同。

首先，angular模板（未编译的html，包括任意额外的标签或指令）是在浏览器端编译。

编译阶段生成活动视图（live view）：视图上的任何改变将反馈给模型，模型的任何改变将传播到视图。模型是app状态的唯一可信来源（single-source-of-truth），这大大简化了编程模型——你可以把视图当作模型的一个投影。

因为视图只是模型的投影，控制器就和视图完全分离了。这又使测试更容易了，因为测试的控制器与视图分离，不依赖DOM/浏览器环境。

###一次性绑定（One-time binding）

以`::`开头的表达式是一次性绑定，即一旦有稳定值（不是undefined）后不再重新计算。

####为什么要有这种特性？

One-time binding的主要目的是提供这样一种绑定：一旦有稳定值后绑定可以注销并释放资源。简而言之，为提高性能而设计。

####值稳定算法（Value stabilization algorithm）

在每个digest循环结束时，One-time binding会获取表达式的值，只要这个值不是undefined。具体算法如下：

1. 给定的表达式以`::`开头，当一次digest循环开始，expression is dirty-checked store the value as V；
2. 如果V不是undefined，标记表达式结果是stable，计划一个任务（schedule a task ），在一次digest循环结束时去注销监视（deregister the watch）；
3. 像正常情况一样处理digest循环；
4. 当digest循环结束，并且所有值都稳定了，处理watch deregistration tasks队列。对每个注销任务而言，检查值是否计算后仍然不为undefined，如果不是undefined，注销监视，否则转第一步。

####怎么利用一次性绑定

当插入文字或属性时，如果这个表达式的值一旦确定就不再改变，那么这就适合用一次性绑定。

```html
<div name="attr: {{::color}}">text: {{::name}}</div>

<script>
someModule.directive('someDirective', function() {
  return {
    scope: {
      name: '=',
      color: '@'
    },
    template: '{{name}}: {{color}}'
  };
});
</script>
```

----------------

这篇是「angular学习系列」第2篇，讲了怎么启动angular应用，讲了基本的表达式和数据绑定。但文章仍然侧重介绍，对angular官网guide的翻译居多，下一篇会侧重数据绑定来讲，结合更多代码，阐述实际应用中的重点。

----------------

