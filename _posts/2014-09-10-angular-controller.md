---
layout: article
comments: true
title: AngularJs控制器
category: frontend
tags: [AngularJs, controller]
---

控制器可能是angular中最常接触的部分，前面几章都说到或者在用控制器，这章具体说一说。

##理解控制器

在angular中，控制器是一个js构造函数**（`constructor function`）**，这个构造函数用来扩张**Angular Scope**(augment the Angular Scope，为scope添加属性)。

<!--view-break-->

当一个控制器通过`ng-controller`指令被附加（attach）到DOM，angular会用指定的控制器的`constructor function`实例化一个新的控制器对象（Controller object）。一个新的子scope会作为注入参数（`$scope`）传给构造函数。

我们用控制器来：

- 设置`$scope`对象的初始状态;
- 为`$scope`对象添加行为。

不要用控制器来：

- 操作DOM——控制器只应该包含业务逻辑（business logic）。把任何展示逻辑（presentation logic）放入控制器会严重影响控制器的可测试性。angular的数据绑定可以应付绝大多数情况，并且指令封装了DOM操作。
- 格式化输入——用[angular form controls](https://code.angularjs.org/1.3.0-rc.4/docs/guide/forms)代替。
- 格式化输出——用过滤器代替。
- 在控制器之间共享代码或者状态——用服务代替。
- 控制其它组件的生命周期（例如，创建服务实例）。

##设置`$scope`对象的初始状态

一般的，当你创建app时你需要设置`$scope`的初始状态。你通过为`$scope`对象添加属性来设置初始状态。这些属性包括**view model**(the model that will be presented by the view)。在控制器注册到的DOM的范围内，`$scope`的所有属性都是模板可访问的。

```javascript
var myApp = angular.module('myApp',[]);

myApp.controller('GreetingController', ['$scope', function($scope) {
  $scope.greeting = 'Hola!';
}]);
```

我们创建了`GreetingController`控制器，为其附加属性`greeting`。

我们创建模块`myApp`，用`controller`方法把控制器的构造函数添加到模块上。这样使构造函数不会暴露到全局。

##为scope对象添加行为

为了与事件交互或者在视图中执行运算，必须为scope添加行为。我们通过为`$scope`对象添加方法来添加行为。这些方法可以在模板/视图中调用。

```html
<div ng-controller="DoubleController">
Two times <input ng-model="num"> equals { { double(num) } }
</div>
<script type="text/javascript">
var myApp = angular.module('myApp',[]);

myApp.controller('DoubleController', ['$scope', function($scope) {
  $scope.double = function(value) { return value * 2; };
}]);
</script>
```

如之前所说，附加到scope上的任意对象/基本类型（objects/primitives）都会成为模型属性，任何附加到scope的方法都可以在模板/视图中访问，通过表达式或`ng`事件处理指令（如`ng-click`）调用。

##正确使用控制器

总体来说，一个控制器不要尝试做太多的事。一个控制器只应该包含一个单独的视图所需要的业务逻辑。

保持控制器瘦身的最通常做法是把不属于控制器的工作封装到服务，然后通过依赖注入来使用这些服务。具体的可以看看[Dependency Injection](https://code.angularjs.org/1.3.0-rc.4/docs/guide/di)和[Services](https://code.angularjs.org/1.3.0-rc.4/docs/guide/services)。

##Associating Controllers with Angular Scope Objects

你可以通过`ngController`指令和`$route`服务来显示地把控制器和scope联系起来。

###简单的”辣味“控制器例子

为进一步描述控制器在angular中怎么工作的，让我们创建一个有以下组件的简单app：

- 有2个buttons和一个简单的message的模板
- 一个模型，有叫spice的字符串
- 有2个函数设置spice值的控制器

```html
<div ng-controller="SpicyController">
  <button ng-click="chiliSpicy()">Chili</button>
  <button ng-click="jalapenoSpicy()">Jalapeño</button>
  <p>The food is {{spice}} spicy!</p>
</div>
<script type="text/javascript">
  var myApp = angular.module('spicyApp1', []);

  myApp.controller('SpicyController', ['$scope', function($scope) {
    $scope.spice = 'very';
    $scope.chiliSpicy = function() {
        $scope.spice = 'chili';
    };
    $scope.jalapenoSpicy = function() {
        $scope.spice = 'jalapeño';
    };
  }]);
</script>
```

由上面例子可知：

- `ng-controller`指令（显然是）用来为模板创建一个scope的，并且这个scope会传给`SpicyController`控制器。
- `SpicyController`仅仅是个JS函数。作为可选的命名惯例，名字以大写字母开头，以"Controller"结尾。
- 为`$scope`赋值一个属性会创建/更新模型。Assigning a property to `$scope` creates or updates the model.
- 控制器的方法可以通过直接为scope赋值来创建，如`chiliSpicy`方法。
- 控制器的方法/属性在模板中可以访问。

###”辣味“有参数的例子

```html
<div ng-controller="SpicyController">
  <input ng-model="customSpice">
  <button ng-click="spicy('chili')">Chili</button>
  <button ng-click="spicy(customSpice)">Custom spice</button>
  <p>The food is {{spice}} spicy!</p>
</div>
<script type="text/javascript">
  var myApp = angular.module('spicyApp2', []);

  myApp.controller('SpicyController', ['$scope', function($scope) {
      $scope.customSpice = "wasabi";
      $scope.spice = 'very';

      $scope.spicy = function(spice) {
          $scope.spice = spice;
      };
  }]);
</script>
```

注意一下，`ng-click="spicy('chili')"`是直接传入字符串，`ng-click="spicy(customSpice)"`传入模型属性。

###scope继承的例子

在不同层级的DOM上附加不同级别的控制器很正常。因为`ng-controller`指令会创建新的子scope（new child scope），因而控制器有继承体系。低级别的控制器可以访问高级别的控制器的属性。具体可参考[Understanding Scopes](https://github.com/angular/angular.js/wiki/Understanding-Scopes)。

```html
<div class="spicy">
  <div ng-controller="MainController">
    <p>Good {{timeOfDay}}, {{name}}!</p>

    <div ng-controller="ChildController">
      <p>Good {{timeOfDay}}, {{name}}!</p>

      <div ng-controller="GrandChildController">
        <p>Good {{timeOfDay}}, {{name}}!</p>
      </div>
    </div>
  </div>
</div>
<script type="text/javascript">
var myApp = angular.module('scopeInheritance', []);
myApp.controller('MainController', ['$scope', function($scope) {
  $scope.timeOfDay = 'morning';
  $scope.name = 'Nikki';
}]);
myApp.controller('ChildController', ['$scope', function($scope) {
  $scope.name = 'Mattie';
}]);
myApp.controller('GrandChildController', ['$scope', function($scope) {
  $scope.timeOfDay = 'evening';
  $scope.name = 'Gingerbread Baby';
}]);
</script>
```

子scope中有同名属性则覆盖父scope的属性，没有则继承。