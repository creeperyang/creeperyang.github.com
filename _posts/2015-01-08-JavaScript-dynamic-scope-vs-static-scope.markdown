---
layout: article
comments: true
title: JavaScript static VS dynamic Scope
category: [frontend, JavaScript]
tags: [scope, static scope, lexical scope, dynamical scope]
---

```javascript
var str = 'global';

function printStr() {
    console.log(str);
}

function testScope() {
    var str = 'local';
    printStr();
}

printStr(); // 毫无疑问，输出 "global"
testScope(); // 还是输出 "global"
```

<!--view-break-->

在上面的代码中`printStr();`输出`"global"`是很自然的，但`testScope();`仍然输出`"global"`可能就要让部分人惊讶不解了。别急着想知道为什么，本文会从这段代码展开，深入JS的作用域（体系）。

##预备知识：变量、值与作用域

- **variable**：变量，就是值的符号名字（symbolic name）。变量的名字叫做标识符（identifier）。如`var x = 5;`中`x`就是变量。
- **value**：值，真实数据，如字符串、数字、对象甚至函数等等。
- **varaible scope**：作用域，是指`name bingding`中，在部分程序内（绝大多数情况就是代码块），名字与实体的联系（即变量与值的联系）是有效的，名字指向的实体没有变化。<http://en.wikipedia.org/wiki/Scope_(computer_science)>

###Variable scope

在JavaScript中，当你定义一个变量，这个变量的作用域要么是全局作用域（global scope），要么属于函数作用域。

> When you declare a variable outside of any function, it is called a global variable, because it is available to any other code in the current document. When you declare a variable within a function, it is called a local variable, because it is available only within that function. <small>--MDN</small>

JavaScript没有块级作用域，所以一个变量要么是全局变量（定义在任何函数之外），要么是局部变量（定义在函数内，属于该函数）。

全局变量的本质是全局对象（*global object*）的属性。在浏览器中，全局对象是`window`，所以全局变量可以通过`window.variable`来访问。

##static/lexical scope vs dynamic scope

在了解完预备知识后，我们正式来探索开头的那段代码。截取核心一段：

```javascript
var str = 'global';
function testScope() {
    var str = 'local';
    printStr();  // 当输出 "global" 时，代表这种语言是static scope，包括c/Java/JavaScript等等。
    // 当输出 "local" 时， 代表这种语言是 dynamic scope，如Perl等等。
}
```

###Static/Lexical Scope

一个变量的lexical scope是变量定义所在的文本区域（textual region），也叫代码块（code block），以及这个代码块的子代码块。

Lexical scoping目前为止广泛运用于`ALGOL-influenced`语言，包括C/Java等等。当编译器解析变量的引用时，它首先查找最内层的代码块，然后一直向上层代码块查找，直到找到变量的定义。

Lexical scope有时也叫static scope，因为**所有的变量都可以在编译期间解析出（all variable references can be resolved at compile-time）**。相反，dynamic scope需要运行时信息。

###Dynamic Scope

Dynamic scope是解析变量名的另一种方法。

所谓dynamic scope，回到预备知识中的**varaible scope**定义，部分程序指的是运行时的部分（time period during execution）。而lexical scope的部分是指代码块，显然，dynamic scope会伤害程序的可读性和可测试性。

Dynamic scoping意味着
Dynamic scoping means that when a symbol is referenced, the compiler/interpreter will walk up the symbol-table stack to find the correct instance of the variable to use. This can be a cool tool to use when writing software, but also a huge source of errors if it is used accidentally.

###static vs dynamic

waiting...
