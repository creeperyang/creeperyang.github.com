---
layout: article
comments: true
title: JavaScript基础——变量、作用域、命名空间和预编译
category: frontend
tags: [scoping, hoisting]
---

什么是命名空间，变量污染，变量声明提升，预编译？如何检查一段代码执行后是否声明了全局变量？

这些问题聚焦于一个核心：变量与作用域，而这恰恰是JavaScript作为一门语言没有处理好的地方，所以有很多疑问都很正常。

<!--view-break-->

这篇文章其实是前面文章[JavaScript Scoping and Hoisting](/frontend/2014/11/javascript-scoping-and-hoisting/)的后续，如果能阅读前一篇之后再来看这篇，可能会更好，因为许多关于变量提升的解释都在里面。

进入正文，列下几点分别解释：

## 1. 变量与作用域

JavaScript是一门弱类型语言，这意味着你*不需要提前声明变量的类型*，变量的类型是程序执行时由引擎自动确定的。这既是JavaScript的强大之处，也是许多bug出现或代码质量差的一个原因。


###变量与变量声明

JS的数据类型有7种，其中基本类型6种，分别是`Boolean`,`NUll`,`Undefined`,`Number`,`String`,`Symbol`（ECMAScript6新提出）;然后对象`Object`一种。

在JS中，我们通过`var`关键字即可声明一个局部变量：

```javascript
var foo = 42;    // foo is a Number now
var foo = "bar"; // foo is a String now
```

变量声明是如此简单，但请**注意**，变量声明中一旦缺失`var`关键字，那么声明的变量就是全局变量！

这样相当危险，因为你不知道这个变量会不会覆盖/污染某个全局变量，比如在一个基于`jQuery`的页面中写一句`$ = 'whatever';`很可能造成程序崩溃。过多的全局变量会加大引起冲突的可能。

###作用域

与变量密切相关的一个概念就是作用域。JS的作用域容易困惑的一点就是：JS本身是类C语言，但它的作用域体系与C完全不同。

在C中，一个`if`语句块可以有自己的作用域，但在JS中，没有块级作用域，JS中**唯一能创建新的作用域的只有函数**。所以JS中只有**全局作用域**和**函数级作用域**。而基于这一点，匿名自执行函数就成了绝大多数JS类库创建自己作用域的唯一选择。

```javascript
// 匿名自执行函数
; (function(args) {
    // 创建new scope, 不会污染全局作用域
})(args);
```

以上写法是包括`jQuery`在内的很多类库采用的。

## 2. 命名空间

JS是没有命名空间这个概念的，所以只能模拟。至于为什么需要命名空间，很简单，命名空间可以显著减少命名冲突，并很好的组织代码。

```javascript
var namespace = namespace || {};
namespace.AModule = {};
namespace.AModule.name = "Kate";
namespace.BModule = {};
```

上面是一段简单的命名空间模拟，更具体深入的阐述可以参考<http://www.kenneth-truyers.net/2013/04/27/javascript-namespaces-and-modules/>。

##3. 预编译

JavaScript预编译听起来高大上，但其实还是比较简单的。

首先，对一段JS代码，JS引擎并不是读一句执行一句，而是读取一段、解释执行一段。而一段一段执行，JS会对读取的这段JS代码整体有个预处理，这个预处理就是所谓的预编译。

预编译阶段，JS引擎会进行变量提升，详细可看[JavaScript Scoping and Hoisting](/frontend/2014/11/javascript-scoping-and-hoisting/)。

```html
<script type="text/javascript">
var name = 'Jerry';
sayHi(name);  // 输出 'Hi Jerry!'
var sayHi = function(name) {
    alert('Hello ' + name + '!');
};
function sayHi(name) {
    alert('Hi ' + name + '!');
}
sayHi(name);  // 输出 'Hello Jerry!'
</script>
```

如上，因为JS的预编译，所以执行第一个`sayHi(name);`可以正常输出`Hi Jerry!`而不是`sayHi`未定义。而第二个`sayHi(name);` 执行时函数`sayHi`也被重新赋值，会输出`Hello Jerry!`。

再看下面一段代码：

```html
<script type="text/javascript">
var name = 'Jerry';
sayHi(name);  // 输出 'Hi Jerry!'
function sayHi(name) {
    alert('Hi ' + name + '!');
}
</script>

<script type="text/javascript">
var name = 'Jerry';
sayHi(name);  // 输出 'Hello Jerry!'
function sayHi(name) {
    alert('Hello ' + name + '!');
}
</script>
```

因为JS的预编译，两个`script`标签分成2段代码分别读取解释执行，所以两个`script`标签内我们都可以得到预期的输出，而不是第二个`sayHi`覆盖了第一个`sayHi`。
