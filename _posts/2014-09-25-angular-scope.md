---
layout: article
comments: true
title: AngularJs Scope
category: frontend
tags: [AngularJs, scope]
---

上一章末尾已经讲到了scope，其它地方也或多或少接触到了scope，这一章就来具体讲讲scope。

##什么是scope

scope是一个对象。scope是一个引用模型（refer to model）的对象。scope是一个提供给表达式的执行环境。scope是以层次结构来组织的，模拟了app的DOM结构。scope能检测表达式和传播事件。

>scope is an object that refers to the application model. It is an execution context for expressions. Scopes are arranged in hierarchical structure which mimic the DOM structure of the application. Scopes can watch expressions and propagate events.

<!--view-break-->

###Scope的特性（characteristics）

1. scope提供API（`$watch`）观察模型的变化。
2. scope提供API（`$apply`）把模型在"Angular realm"之外发生的变化从系统传播给视图。"Angular realm"，angular范围，指controllers, services, Angular event handlers。
3. scope提供执行环境，给表达式计算时使用。如`{ { username } }`是无意义的，除非指定到特定的scope（scope上定义了`username`）上执行时才有意义。
4. scope可以嵌套来限制对app组件属性的访问，同时也提供对共享模型属性的访问。嵌套的scope不是`child scope`就是`isolated scope`。`child scope`（原型式地）继承`parent scope`的属性。`isolated scope`不继承。

###Scope as Data-Model

scope是控制器和视图之间的“胶水”。在模板编译的*linking阶段*，指令在scope上建立`$watch`表达式。`$watch`允许指令在属性变化时收到通知，然后可以把更新过的值渲染到视图。

控制器和指令都有scope的引用（have reference to the scope），但它们两者之间没有。这种安排隔离了控制器和指令，同样隔离了控制器和DOM。

```html
<div ng-controller="MyController">
  Your name:
    <input type="text" ng-model="username">
    <button ng-click='sayHello()'>greet</button>
  <hr>
  { {greeting} }
</div>
<script type="text/javascript">
  angular.module('scopeExample', [])
  .controller('MyController', ['$scope', function($scope) {
    $scope.username = 'World';

    $scope.sayHello = function() {
      $scope.greeting = 'Hello ' + $scope.username + '!';
    };
  }]);
</script>
```

在上面的例子中注意到，`MyController`为scope的`username`属性赋值`World`。scope之后就通知`input`这个赋值，然后就会为`input`预先填充username再渲染。这演示了控制器怎么向scope写数据。

同样，控制器也可以向scope添加行为（`sayHello`）。

逻辑上`{ {greeting} }`的渲染包括2步：

1. 检索`{ {greeting} }`在模板中定义位置所在的DOM node的相关scope。在例子中，该scope就是传给`MyController`的scope。
2. 以上面找到的scope为上下文执行`greeting`表达式，把值传给DOM。

你可以把scope和它的属性视作用来渲染视图的数据。scope是与视图有关的所有事的唯一source-of-truth。

控制器与视图的分离是必要的，特别是有利于测试。

###Scope分层/继承（Hierarchies）

每个angular应用有且只有一个`root scope`，但也许有多个子scope。

每个app可以有多个scope，因为一些指令会创建新的子scope（参见指令文档去看哪些指令会创建新的scope）。当新的scope被创建，它们以父scope的孩子被添加。这样就创建了一棵树，平行于它们被attach到的DOM。

1. 当angular执行`{ {name} }`时，它首先查询给定元素相关的scope的name属性。
2. 如果没有找到，它会查询父scope直到root scope。这就是js中的原型继承。

<iframe width="100%" height="240" src="http://jsfiddle.net/creeper/6xt2psh7/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

**注意**：angular会自动在元素上添加`ng-scope`类，如果这个元素被附加scope的话。

###Retrieving Scopes from the DOM

scope会被以`$scope`data属性附加到DOM上，这可以用来debug时检索（在应用中用这种方法检索scope的不多见）。`root scope`附加的DOM就是`ng-app`所在的DOM。

调试时可以这么检索DOM的scope：

1. `inspect element`对应的DOM;
2. `$0`代表这个DOM;
3. `angular.element($0).scope()`。

###Scope Events Propagation

Scopes可以以类似DOM事件的方式传播事件. 事件可以被broadcasted到scope children或者emitted到scope parents.

##Scope生命周期

浏览器接收到事件的正常处理流程是：执行对应的JS回调。一旦回调结束，浏览器重新渲染DOM并且返回以等待更多事件。

当浏览器在angular执行上下文以外执行JS代码，这意味着angular不再知道模型的变化。正确处理模型变化应该是用`$apply`进入angular执行上下文，只有这样angular才会知道模型的变化。

在计算完表达式后，`$apply`方法会执行一个`$digest`。在$digest阶段，scope会检查所有的`$watch`表达式，并与之前的值比较。这种脏检查是异步执行的。这意味着`$scope.username="angular"`这种赋值不会立即通知`$watch`，而是延迟等到`$digest`阶段才通知。这种延迟是必要的，因为这可以把多个模型更新合并到一个`$watch`通知，而且还保证了在`$watch`通知时不会有其它的`$watch`运行。如果一个`$watch`改变了模型的值，那么会强制额外的一个`$digest`循环。

1. Creation

    `root scope`在app bootstrap时被`$injector`创建。在模板linking阶段，一些指令会创建新的子scope。

2. Watcher registration

    在模板linking时，指令会在scope上注册watches。这些watches被用来把模型的值传给DOM。

3. Model mutation（变化）

    模型变化要被正确检测到，你应该用`scope.$apply()`。angular的API都内置这种做法，所以当你在控制器内部做同步工作时不需要`$apply`调用，另外异步的`$http, $timeout or $interval`也不需要。

4. Mutation observation（变化观察）

    在`$apply`结束时，angular会在`root scope`上启动一个`$digest` cycle，这个`$digest`之后会传播到所有子scope。在`$digest` cycle，所有`$watch`ed表达式或者函数被检查来判断模型是否变化了;如果一个变化被探测到，`$watch`的listener被调用。

5. Scope destruction

    当子scope不再需要，子scope的创建者有责任去通过`scope.$destroy()`API去destroy这些scope。这会阻止`$digest`的传播进入子scope并且允许垃圾收集器收回这个子scope的内存占用。

###Scopes and Directives

在编译阶段，编译器匹配DOM模板的指令。指令通常可以分为2个类型：

- 观察型指令（*Observing directives*）,如双括号表达式`{ {expression} }`，它会用`$watch()`方法注册listeners。这种类型的指令在任何时候表达式（值）改变时必须被通知以便它能更新视图。
- 监听型指令（*Listener directives*）,如`ng-click`，在DOM上注册listener。当DOM listener触发，指令执行相关的表达式并用`$apply()`方法更新视图。

###Directives that Create Scopes

在大多情况下，指令和scope交互但不会创建scope的新实例。然而，一些指令，比如`ng-controller`和`ng-repeat`，创建新的子scopes并且附加（attach）这个子scope到相应的DOM元素。

你可以调用`angular.element(aDomElement).scope()`为任何DOM元素检索scope。

###Controllers and Scopes

scope和controller有以下交互方式：

- 控制器用scope暴露方法给模板;
- 控制器定义能改变模型的方法/行为;
- 控制器可以在模型上注册watches。这些watches会在控制器行为执行后立即执行。

###Scope `$watch` Performance Considerations（注意事项）

scope属性改变的脏检查是angular常用的操作，所以脏检查必须高效。

脏检查一定不能做任何DOM访问，因为DOM访问比JS对象的属性访问慢很多很多。

##Integration with the browser event loop

下面的草图和例子描述了angular怎么和浏览器的事件回环交互。

![event loop](https://docs.angularjs.org/img/guide/concepts-runtime.png)

1. 浏览器的事件loop等待一个事件发生。事件可能是用户交互、timer事件或者网络事件（服务器response）。
2. 事件回调执行。这时进入JS上下文（JavaScript context）。回调可以改变DOM结构。
3. 一旦回调执行完，浏览器离开JS上下文并根据DOM变化重新渲染视图。

angular通过提供自己的事件处理回环改变了正常的JavaScript流程。这把JavaScript分为经典的和angular的执行上下文。只有应用在angular执行上下文的操作可以利用angular的数据绑定、异常处理、属性监测等等。你也可以用`$apply()`从js执行上下文进入angular执行上下文。

**注意**：大多情况下，angular已经为你调用了`$apply`。只有实现自定义事件回调、第三方库回调时才会需要显示调用`$apply`。

1. 调用`scope.$apply(stimulusFn)`可以进入angular执行上下文，`stimulusFn`是你希望在angular执行上下文中做的工作。
2. angular执行`stimulusFn`，一般是修改app状态。
3. angular进入`$digest`回环。这个回环由两个小的回环组成，一个处理`$evalAsync` queue，一个处理`$watch()` list。`$digest`回环一直重复（keeps iterating）直到模型稳定，即`$evalAsync` queue为空而且`$watch()` list探测不到任何改变。
4. `$evalAsync` queue用来安排需要在当前栈帧（`current stack frame`）外，但必须在浏览器视图渲染前发生的工作。这通常用`setTimeout(0)`来做，但`setTimeout(0)`可能比较慢，还可能引起视图闪烁，因为浏览器在每个事件之后都会渲染视图。（The $evalAsync queue is used to schedule work which needs to occur outside of current stack frame, but before the browser's view render. This is usually done with setTimeout(0), but the setTimeout(0) approach suffers from slowness and may cause view flickering since the browser renders the view after each event.）
5. `$watch()` list是一系列可能在上个循环后值改变的表达式。如果改变被探测到，`$watch`函数通常会以新值更新视图。
6. 一旦angular`$digest`回环结束，则离开angular执行上下文，回到JS上下文。之后会跟着浏览器重新渲染视图。

`hello world`例子的解释。

1. 在编译阶段
    - `ng-model`和`input directive`在`<input>`上建立`keydown` listener。
    - `interpolation`建立一个`$watch`（`name`属性变化时被通知）。

2. 在运行阶段

    1. 按下`X`键，浏览器在`<input>`上emit `keydown`事件;
    2. `input directive`捕获input元素值的改变，调用`$apply("name = 'X';")`在angular上下文下更新模型;
    3. angular把`name = 'X';`应用到模型;
    4. `$digest`回环启动;
    5. `$watch()` list探测到`name`属性上的变动，通知`interpolation`，它会更新DOM;
    6. angular退出执行上下文，释放`keydown`事件给JS上下文;
    7. 浏览器重新渲染视图，更新文字。
