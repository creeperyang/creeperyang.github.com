---
layout: article
comments: true
title: AngularJs自定义指令
category: frontend
tags: [AngularJs, directive]
---

[前一章](/frontend/2014/09/angular-directive/)介绍了指令的基础知识，这一章则关注自定义指令。从一个简单的例子来看怎么自定义指令。

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

像控制器一样，指令注册到模块上。指令注册API是：`module.directive（name, fun）`。

- `name`是标准化的指令名。
- `fun`是工厂函数，返回一个对象，指定指令的行为。工厂函数只在编译器第一次匹配到该指令时调用一次，你可以在里面做些初始化工作。

<iframe width="100%" height="200" src="http://jsfiddle.net/creeper/L50h9eh1/1/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

这个例子验证了工厂函数只执行一次。

###工厂函数返回的对象的参数（可设置选项）

下面具体讲解工厂函数返回的对象的参数：

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

下面具体解释常用的参数：

restrict指明了一个指令应该如何在HTML中使用，默认A，可以组合使用，如EA等。

restrict取值 | 含义 | 使用示例
---- | ---- | -------
E|标签|`<my-menu title=Products></my-menu>`
A|属性|`<div my-menu=Products></div>`
C|类|`<div class="my-menu":Products></div>`
M|注释|`<!--directive:my-menu Products-->`

**什么时候用属性vs元素？**当你创建组件（需要控制模板）时用元素;当你只是修饰已存在的元素，为其添加新功能时用属性。

template指明了当指令被Angular编译和链接时生成的HTML标记。它不一定是一个简单的字符串。template可以很复杂，其中经常会涉及其它的指令，表达式（{{}}），等等。在大多数情况下你可能会想要使用templateUrl而不是template。因此，理想情况下你应该首先将模板放置在一个单独的HTML文件中然后让templateUrl指向它。

replace指明了是否生成的模板会代替绑定指令的元素。默认为false，设为true时，指令标签将会替换为template中定义的内容。

transclude指明了是否把绑定指令的元素的内容转移到模板中。

##Isolating the Scope of a Directive

不设置`scope`属性时，指令的scope就是父scope。

可以通过

```javascript
//...
scope: {
  customerInfo: '=info'
},
//...
```

此时，指令的scope选项是对象，里面的每个属性都是isolate scope binding。

- name（`customerInfo`）就是指令独立的scope的属性名;
- value（`=info`）告诉`$compile`绑定到`info`属性。

##指令与控制器/指令的交流

###指令与控制器的交流

如前一小节所示，通过scope和attribute，指令可以与外部控制器交流。这方面更多的可以看有关scope的一章。

下面讲通过`scope.$apply()`与外部控制器交流。

```html
<div ng-controller="AppCtrl">
    <div enter="deleteTweets()">Roll over to load more tweets</div>
</div>

<script type="text/javascript">
    var app = angular.module('twitterApp', []);

    app.controller("AppCtrl", function ($scope) {
      $scope.loadMoreTweets = function () {
        alert("Loading tweets!");
      }
      $scope.deleteTweets = function () {
        alert("deleting tweets!");
      }
    });

    app.directive("enter", function () {
      return function (scope, element, attrs) {
        element.bind("mouseenter", function () {
          scope.$apply(attrs.enter);
        })
      }
    });
</script>
```

###指令间交流

```html
<div ng-app="app">
    <country>
        <state>
            <city></city>
        </state>
    </country>
</div>
<script type="text/javascript">
    var app = angular.module("app", []);
    app.directive("country", function() {
        return {
            restrict: "E",
            controller: function() {
                this.makeAnnouncement = function(message) {
                    console.log("Country says: " + message);
                };
            }
        };
    });
    app.directive("state", function() {
        return {
            restrict: "E",
            controller: function() {
                this.makeLaw = function(law) {
                    console.log("Law: " + law);
                };
            }
        };
    });
    app.directive("city", function() {
        return {
            restrict: "E",
            require: ["^country","^state"],
            link: function(scope, element, attrs, ctrls) {
                ctrls[0].makeAnnouncement("This city rocks");
                ctrls[1].makeLaw("Jump higher");
            }
        };
    });
</script>
```

如果嵌套的指令间存在分层关系（*hierarchical relationship*），那么可以通过使用控制器来在指令间交流：

- 父指令可以通过控制器来暴露一些东西，比如这里的`makeAnnouncement`方法，并传给子指令。
- 我们可以把父指令的控制器注入到子指令中，这由`require`命名体系完成。通过这个，子指令可以使用父指令的控制器。
- 这种控制器的继承只要是祖先与后代的关系就可用。


