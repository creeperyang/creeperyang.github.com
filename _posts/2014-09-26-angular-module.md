---
layout: article
comments: true
title: AngularJs Modules
category: frontend
tags: [AngularJs, module]
---

##什么是模块

你可以把模块当作你app不同部分（控制器、指令、过滤器等等）的容器。

##为什么需要模块

大多应用有个main方法实例化app的各个部分并把它们联系起来。

angular app没有main方法。作为代替，模块声明性地指定一个app怎么启动。这样做的几个优点：

- 声明性的处理更易理解;
- 可以打包代码作为可复用模块;
- 因为模块的延迟执行，不同模块可以以任意顺序（甚至并行）加载;
- 单元测试更快;
- 端到端测试可以用模块来覆写配置。

<!--view-break-->

##基础

```html
<div ng-app="myApp">
  <div>
    {{ 'World' | greet }}
  </div>
</div>
<script type="text/javascript">
    var myAppModule = angular.module('myApp', []);

    myAppModule.filter('greet', function() {
        return function(name) {
            return 'hello, ' + name + '!';
        };
    });
</script>
```

注意：

- `module` API;
- `<div ng-app="myApp">`引用`myApp`模块。这是用`myApp`模块启动应用。
- `angular.module('myApp', [])`的空数组是`myApp`的依赖。

##推荐形式

上面的例子是简单的，但不容易适配大型应用。相反，我们推荐你把app分解成多个模块：

- 每个特性一个模块
- 每个可重用组件一个模块（特别是指令和过滤器）
- app级别的模块依赖上面的模块，并可以包括任意初始化代码。

```javascript
angular.module('xmpl.service', [])

  .value('greeter', {
    salutation: 'Hello',
    localize: function(localization) {
      this.salutation = localization.salutation;
    },
    greet: function(name) {
      return this.salutation + ' ' + name + '!';
    }
  })

  .value('user', {
    load: function(name) {
      this.name = name;
    }
  });

angular.module('xmpl.directive', []);

angular.module('xmpl.filter', []);

angular.module('xmpl', ['xmpl.service', 'xmpl.directive', 'xmpl.filter'])

  .run(function(greeter, user) {
    // This is effectively part of the main method initialization code
    greeter.localize({
      salutation: 'Bonjour'
    });
    user.load('World');
  })

  .controller('XmplController', function($scope, greeter, user){
    $scope.greeting = greeter.greet(user.name);
  });
```

##模块加载和依赖

模块是configuration和run blocks的集合，这些block在app启动阶段被应用到app。最简形式，模块由两种block的集合组成：

- 配置block：在provider registrations 和 configuration阶段执行。只有provider和常数可以注入配置block。这可以防止在服务所有的配置完成前被初始化。
- 运行block：在注入器被创建并用来启动app之后执行。只有实例和常数可以注入到运行block。这可以防止运行阶段做更多配置。

```javascript
angular.module('myModule', []).
config(function(injectables) { // provider-injector
  // This is an example of config block.
  // You can have as many of these as you want.
  // You can only inject Providers (not instances)
  // into config blocks.
}).
run(function(injectables) { // instance-injector
  // This is an example of a run block.
  // You can have as many of these as you want.
  // You can only inject instances (not Providers)
  // into run blocks
});
```

###配置block

有些快捷方法等同于`config` block，如：

```javascript
angular.module('myModule', []).
value('a', 123).
factory('a', function() { return 123; }).
directive('directiveName', ...).
filter('filterName', ...);

// is same as

angular.module('myModule', []).
config(function($provide, $compileProvider, $filterProvider) {
  $provide.value('a', 123);
  $provide.factory('a', function() { return 123; });
  $compileProvider.directive('directiveName', ...);
  $filterProvider.register('filterName', ...);
});
```

*当启动时，angular首先应用所有的常数定义;然后以注册时顺序应用配置block。*

###运行block

运行block是angular中最接近main方法的东西。运行block是需要运行来启动app的代码。

运行block在所有服务被注册，injector被创建之后执行。运行block一般包含一些难以单元测试的代码。

###依赖

模块可以把其它模块作为依赖。作为依赖的模块必须在依赖它的模块之前加载。

每个模块只加载一次，即使一个模块被很多其它模块依赖。

###异步加载

模块是管理$injector配置的一种方式，并且与加载脚本到VM无关。有其他已存在的方案来管理脚本，可以与angular合作。因为模块在加载时什么都不做，所以它们可以以任意顺序加载。

###创建与检索

注意使用`angular.module('myModule', [])`会创建`myModule`，并覆盖已经存在的同名模块。使用`angular.module('myModule')`检索模块。

```javascript
var myModule = angular.module('myModule', []);

// add some directives and services
myModule.service('myService', ...);
myModule.directive('myDirective', ...);

// overwrites both myService and myDirective by creating a new module
var myModule = angular.module('myModule', []);

// throws an error because myOtherModule has yet to be defined
var myModule = angular.module('myOtherModule');
```

