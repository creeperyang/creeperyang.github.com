---
layout: article
comments: true
title: AngularJs的数据绑定
category: frontend
tags: [AngularJs, data binding, controller]
---

前面两章内容比较多，但看完前两章，对angular应该会有一个比较全面的了解。这章开始，会对angular中的每个部分做细致讲解，首先从数据绑定讲起。

```html
<body>
   <div ng-app="">
         { { "john" + "lindquist" } }
         <input type="text" ng-model='data.msg' />
         <h1>{ { data.msg } }</h1>
   </div>
   <script type="text/javascript" src="angular.js"></script>
</body>
```

<!--view-break-->

上面是很简单的例子，关注两点：

- 属性`ng-app`指定当前元素以及内部的一切都属于这个app;
- 绑定可以用`ng-bind`指令或双大括号来表示。但注意，为了防止liquid误解析，在大括号之间插入了空格（前面几章包括后面都会如此）。

###通过控制器获取数据

把上面例子中的`ng-model`去除，用控制器来提供数据。

```html
<div ng-app="">
  <div ng-controller="FirstCtrl">
    <h1>{ {data.message + " world"} }</h1>
    <div class="{{data.message}}">
      Wrap me in a foundation component
    </div>
  </div>
</div>
```

```javascript
function FirstCtrl($scope){
  $scope.data = {message: "Hello"};
}
```

上面展示了数据绑定时从控制器获取数据。正如之前所说，控制器是一个上下文，表达式可以通过它访问模型。

###点（dot）在数据绑定中的重要性

了解了数据绑定和控制器之后，我们讨论第一个重难点：dot的作用。

<iframe width="100%" height="300" src="http://jsfiddle.net/creeper/g85a63u4/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

代码很简单，效果很明显：

- 有点时，在3个输入框的输入彼此影响;
- 无点时，三个`msg`彼此独立不影响。

解释一下原因：scope默认是继承父scope的，`FirstCtrl`和`SecondCtrl`都继承了父scope（此处是`rootScope`，并且由于第一个`data.message`而创建了data属性），而`FirstCtrl`和`SecondCtrl`没有覆盖父scope的任何属性：

- 有点时，`FirstCtrl`和`SecondCtrl`都仅仅继承（引用）`rootScope`的`data`属性，那么`data.msg`的`data`都指向同一个`data`对象。
- 无点时，`FirstCtrl`、`SecondCtrl`和`rootScope`都会创建各自的`msg`属性，所以有三个互不影响的`msg`属性。

其实可以打开控制台看看输出，那么一切明晰：

`FirstCtrl`、`SecondCtrl`有`msg`属性而没有`data`属性！**证明有点时，scope会查寻自己及父scope（链）上的对应模型;没有点时，则首先创建自己的属性。**

###通过服务在控制器之间共享数据

```html
<div ng-app="myApp">
    <input type="text" ng-model="data.message">
    <h1>{ { data.message } }</h1>
    <div ng-controller="FirstCtrl">
        <input type="text" ng-model="data.message">
        <h1>{ { data.message } }</h1>
    </div>
    <div ng-controller="SecondCtrl">
        <input type="text" ng-model="data.message">
        <h1>{ { data.message } }</h1>
    </div>
</div>
<script type="text/javascript">
    var myApp = angular.module('myApp', []);
    myApp.factory('Data', function() {
        return { message: "I'm data from a service" };
    });
    function FirstCtrl($scope, Data) {
        $scope.data = Data;
    }
    function SecondCtrl($scope, Data) {
        $scope.data = Data;
    }
</script>
```

注意2点：

- 服务是单例的，所以`FirstCtrl`和`SecondCtrl`的data指向同一个对象，互相影响;
- `rootScope`的data不再影响`FirstCtrl`和`SecondCtrl`，这是因为`FirstCtrl`和`SecondCtrl`定义了自己的`data`属性（覆盖）。

###在scope上定义方法

表达式中可以调用方法。

```html
<div ng-controller="SecondCtrl">
    <input type="text" ng-model="data.message">
    <h1>{ { reversedMessage(data.message) } }</h1>
</div>
<script type="text/javascript">
    function SecondCtrl($scope, Data) {
        $scope.data = Data;
        $scope.reversedMessage = function(message) {
            return message.split("").reverse().join("");
        };
    }
</script>
```
