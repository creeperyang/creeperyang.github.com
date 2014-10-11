---
layout: article
comments: true
title: AngularJs Filter
category: frontend
tags: [AngularJs, filter]
---

[前一章](/frontend/2014/07/angular-data-binding/)在scope上定义了一个reverse函数，可以倒序输出字符串——这就是过滤器（filter）的雏形。

**定义：**filter格式化一个表达式的值，以展现给用户。filter可以在模板、控制器、指令或服务中使用，并且容易定义你自己的过滤器。

<!--view-break-->

filter的底层API是`filterProvider`。

###在视图/模板中用过滤器

filter的一般用法如`{ { expression | filter } }`。要应用多个filter时，直接链式使用即可。另外，filter是可以传入参数的。

```javascript
// 语法
{ { expression | filter1 | filter2 | ... } }
// 如果要传入参数
{ { expression | filter:argument1:argument2:... } }
// 实例
{ { 1234 | number:2 } } // ==>1,234.00
```

###在控制器、服务和指令中使用过滤器

在控制器、服务和指令中使用过滤器需要注入依赖，具体语法是`<filterName>Filter`。

```javascript
angular.module('oneModule', []).
controller('oneController', ['nameFilter',
    function(nameFilter) {
        this.filteredValue = nameFilter(inputValue, filterArg1, filterArg2, ...);
    }
]);
```

参数`nameFilter`就是过滤函数，它的参数和之前一样。

###自定义过滤器

定义过滤器很简单：把新的过滤器工厂（filter factory）注册到模块上即可。内部实现上angular使用了`filterProvider`。

这个工厂函数必须返回一个过滤函数，过滤函数的第一个参数是输入值，接下来的参数是过滤参数。

过滤函数必须是纯函数（pure function），即是无状态的和幂等的（stateless and idempotent）。angular依赖这些属性并且仅仅在输入改变时调用过滤器。

一个自定义过滤器：

```javascript
var myApp = angular.module('myApp', []);
// 注册reverse过滤器到模块myApp上
// 工厂函数返回一个过滤函数，工厂函数可以 注入依赖
myApp.filter('reverse', function() { //can inject dependency
    return function(text) {
        return text.split("").reverse().join("");
    }
});

// 使用： <h1>{ { data.message | reverse } }</h1>
```

###有状态的过滤器（Stateful filters）

强烈不建议写有状态的过滤器。

略。

###ngFilter

`ngFilter`会选取数组的一个子集并作为新数组返回。

`ngFilter`是angular的内置指令，但功能正如描述的——filter，可以作为搜索器使用（如下例）。

<iframe width="100%" height="300" src="http://jsfiddle.net/creeper/81jL8bu3/2/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

###内置的过滤器

angular内置了一些常用过滤器，你可以方便使用。

```html
<tr ng-repeat="actor in avengers cast | orderBy:'name'">
<tr ng-repeat="actor in avengers cast | limitTo:5">
<tr ng-repeat="actor in avengers cast | filter:search | orderBy:'name'  | limitTo: 5 ">
```

