---
layout: article
comments: true
title: AngularJs的启动和基本概念
category: frontend
tags: [AngularJs]
---

angular的一个闪光点是你只需要对框架有个很少的了解就能顺利跑起Demo了。这很好，你可以边学边实际做，毕竟自学最重要的一点是动手，而不是哗啦哗啦地看些文档或视频就好。

那么，开始启动Angular吧。

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

###手动初始化M(anual Initialization)

如果你希望控制初始化过程，你可以手动初始化。

```html
<!doctype html>
<html>
<body>
  Hello {{greetMe}}!
  <script src="http://code.angularjs.org/snapshot/angular.js"></script>

  <script>
    angular.module('myApp', [])
      .controller('MyController', ['$scope', function ($scope) {
        $scope.greetMe = 'World';
      }]);

    angular.element(document).ready(function() {
      angular.bootstrap(document, ['myApp']);
    });
  </script>
</body>
</html>
```

##表达式(Angular Expressions)

angular表达式是类js代码（`JavaScript-like code snippets`），经常放在绑定中，如`{{ expression }}`。

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

###表达式执行上下文

angular不使用`eval()`来计算表达式。angular使用`$parse`服务来处理表达式。

angular表达式无法访问全局变量如`window`, `document`或者`location`。这种严格是故意的。
