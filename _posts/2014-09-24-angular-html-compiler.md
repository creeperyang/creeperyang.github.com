---
layout: article
comments: true
title: AngularJs HTML Compiler
category: frontend
tags: [AngularJs, compile, compiler, scope]
---

html编译，这是angular的核心概念或者说重难点。这章就是围绕`HTML Compiler`展开，既算是自定义指令的深入，也算是对angular工作原理的一点解析。

首先**注意**：如果只是初学者，或者暂时不想深入，那么，跳过本章也可。

<!--view-break-->

##概览

angular的`HTML Compiler`允许开发人员教会浏览器新语法。编译器允许你为元素或属性添加新行为，甚至创建有自定义行为的新元素或新属性。**angular称这些行为扩展（behavior extensions）为指令。**

HTML有许多结构以声明的方式来为静态文档格式化html。（HTML has a lot of constructs for formatting the HTML for static documents in a declarative fashion.）例如，元素居中，不需要提供命令让浏览器计算中心的位置，为元素加上`align="center"`的属性就够了。这就是声明式语言的强大。

但声明式语言有时又是受限的，因为它不允许你教浏览器新语法。比如，你想让文本居中变成1/3对齐就比较难了。所以需要教浏览器新语法。

angular自带通用的指令，编写webapp时很有用。但你可以自定义指令。这些指令就是构建你app的“特定领域语言”（*Domain Specific Language*）。

所有的编译发生在浏览器端，无关服务器。

##编译器

编译器是一个angular服务，它会遍历DOM来查询属性。

>Compiler is an Angular service which traverses the DOM looking for attributes.

编译过程分为2个阶段：

1. 编译（*Compile*）：遍历DOM，收集这个DOM上的所有指令。结果是一个link函数。
2. 链接（*Link*）：用scope结合指令，生成动态视图。scope model的所有变动会影响视图，视图上的任何用户交互会影响scope model。这让scope model成为*single source of truth*。

一些指令如`ng-repeat`会为集合的每个元素克隆DOM元素。把编译分为compile和link两个过程有利于提高性能。因为克隆的模板只需要编译一次，然后为每个克隆实例link。

##指令

指令是一种行为（behavior），当编译过程中遇到特定html结构时会被触发。指令可以放在元素名、属性、类名和注释上。

**指令就是一个函数，编译器在DOM中遇到指令时执行它。**

##理解视图

大多模板系统是单向绑定，获取（consume）静态字符串模板，与数据结合，得出新字符串，插入元素内部（`innerHTML`）。

这意味着数据的任意改变需要重新与template结合编译，然后插入元素。这样做有些问题：

- 读取用户输入，合并到数据
- 通过重写会严重影响用户输入（clobbering user input by overwriting it）
- 控制整个更新过程
- 缺乏行为表现力（lack of behavior expressiveness）

angular不同。angular编译器接收（consume）DOM，不是字符串模板。结果是link函数，该函数与scope model结合生成live view。这个view和scope model绑定是透明的，开发者不用做任何事去更新视图。然后因为没有用到`innerHTML`，所以你不会影响到用户输入。更多的是，angular指令不仅包括文字绑定，还包括行为结构。

angular会生成稳定的DOM。绑定到模型的DOM元素实例在整个绑定期间不会变。这意味着可以访问到元素和注册事件处理，并且知道引用不会被模板数据合并破坏。

##指令怎么被编译？

**再次强调一点：angular在DOM节点上操作而不是字符串！**通常你是不会注意到这个限制的，因为当页面加载，浏览器会自动解析html为DOM。

html编译有3个阶段：

1. `$compile`遍历DOM并匹配指令（traverses the DOM and matches directives）

   如果编译器找到一个元素匹配指令，那么， 这个指令就会被添加到匹配这个DOM元素的指令列表。单个DOM元素可能匹配多个指令。

2. 一旦所有匹配这个DOM元素的指令都被标识出了，编译器按优先级`priority`排序它们。

    每个指令的`compile`函数被执行。每个`compile`函数都有一次机会修改DOM。每个`compile`函数返回一个`link`函数。这些`link`函数被组合成一个复合`link`函数（调用每个小`link`）。

3. `$compile`通过调用之前的复合`link`函数，把模板链接到scope。这会轮流调用每个小`link`函数，注册监听器，启动`$watch`s。

编译的结果是scope和DOM之间的动态绑定。因为这点，编译后的scope上的模型的任何变化都会反映到视图上。

---

*这里的遍历DOM，指的不是整个DOM树，而是DOM节点。如下面的`<div ng-bind="exp"></div>`。*

---

下面是使用`$compile`服务的对应代码，这应该会让你了解angular内部做了什么：

```javascript
var $compile = ...; // injected into your code
var scope = ...;
var parent = ...; // DOM element where the compiled template can be appended

var html = '<div ng-bind="exp"></div>';

// Step 1: parse HTML into DOM element
var template = angular.element(html);

// Step 2: compile the template
var linkFn = $compile(template);

// Step 3: link the compiled template with the scope.
var element = linkFn(scope);

// Step 4: Append to DOM (optional)
parent.appendChild(element);
```

###Compile和Link的不同之处

到这里你可能要问编译过程为什么要分为compile和link两个过程。简单点说，任何时候模型中的变化会导致**DOM结构(structure of the DOM)**的变化，那么compile和link的分离就是必要的。

指令很少会有`compile function`，因为大多情况下，指令被考虑到工作在特定结构的DOM而不是改变DOM结构。

指令一般都有`link function`，link函数允许指令注册监听器到特定的克隆的DOM元素实例，而不是改变DOM结构。

**注意**：出于性能考虑，任何可被指令实例共享（shared among the instance of directives）的操作应该放到compile函数中。

####"Compile" Vs "Link"的一个例子

为了理解，以真实的`ngRepeat`为例：

```html
Hello { {user.name} }, you have these actions:
<ul>
  <li ng-repeat="action in user.actions">
    { { action.description } }
  </li>
</ul>
```

当上面这个例子被编译时，编译器访问每个节点并查找指令。

`{ {user.name} }`匹配`interpolation`指令，而`ng-repeat`匹配`ngRepeat`指令。

但`ngRepeat`有个问题：

它需要为`user.actions`中的每个`action`克隆新的`<li>`元素。这乍一看没什么特别的，但考虑到`user.actions`以后可能会添加项目，情况变得复杂了。这意味着为了（以后的）克隆，需要保存一份干净的`<li>`元素拷贝。

当新的`action`被添加，模板`<li>`元素需要被克隆并插入到`ul`。但克隆`<li>`是不够的，还需要编译`<li>`，这样它的指令，如`{ { action.description } }`，才能在正确的scope下执行。

解决这个问题的一个笨方法是插入一份拷贝然后编译一次这个拷贝。这样做的问题是编译这个拷贝会重复很多工作。特别的，我们不得不每次在克隆前去遍历这个`<li>`来查找它的指令。这会有性能问题。

解决方案是把编译分成compile和link：

1. compile阶段，所有指令都被识别，并被按优先级排序;
2. link阶段，执行有关”链接“scope的一个特定实例与`<li>`的一个特定实例的任何工作。

**注意**：`link`意味着在DOM上建立监听器，在scope上建立`$watch`，以保持模型和视图的同步。

>Note: *Link means setting up listeners on the DOM and setting up $watch on the Scope to keep the two in sync.*

`ngRepeat`阻止编译过程下沉到`<li>`内，所以它能有一个原始的`<li>`克隆，能自己处理插入和删除节点。

`ngRepeat`指令把编译分为compile和link。`<li>`元素的compile结果是一个link函数，该link函数包含了`<li>`元素内部的所有指令，准备被附加到一个特定的`<li>`元素克隆实例（ready to be attached to a specific clone of the `<li>` element）。

在运行（runtime）时，`ngRepeat`监测表达式`"action in user.actions"`，一旦新项目添加到数组，它会克隆`<li>`元素，为这个`<li>`元素创建一个新的`scope`，并在克隆的`<li>`元素上调用link函数。

###理解Scope怎么与 Transcluded Directives协同工作

指令的一个常用情况是创建复用组件。下面是一个简化的对话框组件例子。

下面展示`dialog`指令怎么在html中使用：

```html
<!-- html to make dialog directive work -->
<div>
<button ng-click="show=true">show</button>

<dialog title="Hello {{username}}."
        visible="show"
        on-cancel="show = false"
        on-ok="show = false; doSomething()">
   Body goes here: {{username}} is {{title}}.
</dialog>
</div>
```

下面是`dialog`的模板：

```html
<!-- dialog template -->
<div ng-show="visible">
<h3>{ {title} }</h3>
<div class="body" ng-transclude></div>
<div class="footer">
  <button ng-click="onOk()">Save changes</button>
  <button ng-click="onCancel()">Close</button>
</div>
</div>
```

上面的例子中`dialog`不会被正确渲染，除非对scope进行处理。一个问题是`dialog`希望模板scope的`title`属性已被定义，但我们希望`title`是`dialog`元素的title attribute的插值结果。另外，按钮希望`onOk`，`onCancel`已经在scope中存在——这会限制`dialog`指令的用处。解决方案是用`locals`来创建local变量：

```javascript
scope: {
  title: '@',       // the title uses the data-binding from the parent scope
  onOk: '&',        // create a delegate onOk function
  onCancel: '&',    // create a delegate onCancel function
  visible: '='      // set up visible to accept data-binding
}
```

创建local properties会有两个问题：

1. 隔离（isolation）：如果用户忘记在`<dialog>`上设置`title` attribute，那么dialog模板会绑定到父scope的同名属性。
2. 嵌入（transclusion）：被嵌入的（ transcluded）DOM可以访问到locals，但locals可能覆写了某些属性，比如这里的`title`，但嵌入的DOM其实希望访问外部的scope。

为了解决隔离问题，指令会创建一个新的`isolated` scope。`isolated` scope不继承任何父scope，所以不用担心问题一。

但`isolated` scope导致了新问题：被嵌入的DOM是指令的`isolated` scope的孩子，不能绑定到任何其它东西。因为这个原因，the transcluded scope 将会是原来的scope的child，在指令创建`isolated` scope之前。**这使`isolated` scope和`transcluded` scope是兄弟。**

因此，最终代码是：

```javascript
transclude: true,
scope: {
    title: '@',             // the title uses the data-binding from the parent scope
    onOk: '&',              // create a delegate onOk function
    onCancel: '&',          // create a delegate onCancel function
    visible: '='            // set up visible to accept data-binding
},
restrict: 'E',
replace: true
```

