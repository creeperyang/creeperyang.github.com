---
layout: article
comments: true
title: AngularJs自定义指令
category: frontend
tags: [AngularJs, directive]
---

从一个简单的例子来看怎么自定义指令。

```javascript
var app = angular.module("myApp", [])

app.directive("myDirective", function(){
 return {
   restrict: "A",
   link: function(){
       alert("I'm working");
     }
  };
});
```

<!--view-break-->

##自定义指令的API和参数

上面的例子足够简单清晰，指令定义用指令注册API：`app.directive（name, fun）`。`fun`返回一个对象，指定指令的属性/行为。这个对象有许多可定义的属性，下面具体描述：

```javascript
myModule.directive('namespaceDirectiveName', function factory(injectables) {

    var directiveDefinitionObject = {
        restrict: string, //指令的使用方式，包括标签，属性，类，注释
        priority: number, //指令执行的优先级
        template: string, //指令使用的模板，用HTML字符串的形式表示
        templateUrl: string, //从指定的url地址加载模板
        replace: bool, //是否用模板替换当前元素，若为false，则append在当前元素上
        transclude: bool, //是否将当前元素的内容转移到模板中
        scope: bool or object, //指定指令的作用域
        controller: function controllerConstructor($scope, $element, $attrs, $transclude) {...
        }, //定义与其他指令进行交互的接口函数

        require: string, //指定需要依赖的其他指令
        link: function postLink(scope, iElement, iAttrs) {...
        }, //以编程的方式操作DOM，包括添加监听器等
        compile: function compile(tElement, tAttrs, transclude) {
            return :{
                pre: function preLink(scope, iElement, iAttrs, controller) {...
                },
                post: function postLink(scope, iElement, iAttrs, controller) {...
                }
            }
        } //编程的方式修改DOM模板的副本，可以返回链接函数
    };
    return directiveDefinitionObject;
    
});
```

restrict取值 | 含义 | 使用示例
---- | ---- | -------
E|标签|`<my-menu title=Products></my-menu>`
A|属性|`<div my-menu=Products></div>`
C|类|`<div class="my-menu":Products></div>`
M|注释|`<!--directive:my-menu Products-->`

- restrict指明了一个指令应该如何在HTML中使用，默认A，可以组合使用，如EA等。
- template指明了当指令被Angular编译和链接时生成的HTML标记。它不一定是一个简单的字符串。template可以很复杂，其中经常会涉及其它的指令，表达式（{{}}），等等。在大多数情况下你可能会想要使用templateUrl而不是template。因此，理想情况下你应该首先将模板放置在一个单独的HTML文件中然后让templateUrl指向它。
- replace指明了是否生成的模板会代替绑定指令的元素。默认为false，设为true时，指令标签将会替换为template中定义的内容。
- transclude指明了是否把绑定指令的元素的内容转移到模板中。

###自定义指令命名

- 推荐[命名空间-指令名称]的形式，如ng-controller;
- 不要用ng-前缀，防止与系统自带指令冲突；
- 指令命名时用驼峰式(ngController)，使用时用破折号连接（ng-controller）。

##指令和控制器交流

