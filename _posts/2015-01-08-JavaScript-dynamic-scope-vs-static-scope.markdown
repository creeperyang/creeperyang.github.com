---
layout: article
comments: true
title: 从static/dynamic scope来谈JS的作用域
category: [frontend, JavaScript]
tags: [scope, static scope, lexical scope, dynamical scope， closure]
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

在上面一段JS代码中`printStr();`输出`"global"`是很自然的，但`testScope();`仍然输出`"global"`可能就要让部分（使用其他语言的）人惊讶不解了。本文将从这段代码展开，深入JS的作用域（体系）。

##变量、值与作用域

###从一般意义来理解变量、值与作用域

- **variable**：变量，就是值的符号名字（symbolic name）。变量的名字叫做标识符（identifier）。如`var x = 5;`中`x`就是变量。
- **value**：值，真实数据，如字符串、数字、对象甚至函数等等。
- **varaible scope**：`name bingding`（即变量和值的联系）的作用域，是指在部分程序（**part of a program**，大多数情况就是代码块）内，变量与值的联系是有效的（即变量可以用来引用值）。而在程序的另一部分，该变量可能指向另一个值，或者干脆没有任何绑定。作用域又称为值的可见性。

> In computer programming, the scope of a name binding – an association of a name to an entity, such as a variable – is the part of a computer program where the binding is valid: where the name can be used to refer to the entity. In other parts of the program the name may refer to a different entity (it may have a different binding), or to nothing at all (it may be unbound). The scope of a binding is also known as the **visibility** of an entity, particularly in older or more technical literature – this is from the perspective of the referenced entity, not the referencing name. A scope is a part of a program that is or can be the scope for a set of bindings – a precise definition is tricky (see below), but in casual use and in practice largely corresponds to a block, a function, or a file, depending on language and type of entity. The term "scope" is also used to refer to the set of all entities that are visible or names that are valid within a portion of the program or at a given point in a program, which is more correctly referred to as context or environment. <small>--http://en.wikipedia.org/wiki/Scope_(computer_science)</small>

（Lexial） scope的明确定义是*the portion of source code in which a binding of a name with an entity applies*，即scope就是一段源码（代码块），在这段代码内，变量到值的绑定应用。

###JavaScript中的变量、值与作用域

在JavaScript中，当你定义一个变量，这个变量的作用域要么是全局作用域（global scope），要么属于函数作用域。

> When you declare a variable outside of any function, it is called a global variable, because it is available to any other code in the current document. When you declare a variable within a function, it is called a local variable, because it is available only within that function. <small>--MDN</small>

JavaScript没有块级作用域，所以一个变量要么是全局变量（定义在任何函数之外），要么是局部变量（定义在函数内，属于该函数）。

全局变量的本质是全局对象（*global object*）的属性。在浏览器中，全局对象是`window`，所以全局变量可以通过`window.variable`来访问。

##Static/lexical scope vs dynamic scope

在了解完变量、值与作用域的知识后，我们正式来探索开头的那段代码。截取核心一段：

```javascript
var str = 'global';
function testScope() {
    var str = 'local';
    printStr();  // 当输出 "global" 时，代表这种语言是static scope，包括c/Java/JavaScript等等。
    // 当输出 "local" 时， 代表这种语言是 dynamic scope，如Perl等等。
}
```

- 当`testScope`中输出"global"时，语言采用的是lexical scope;
- 当输出local"时则采用的是dynamic scope。

关于scope的一个基本特征/最大区别就是**part of a program（部分代码）**到底指什么。

- 当*part of a program*指代码块时，scope就是*static/lexical scope*;
- 而*part of a program*指程序运行时状态时，scope就是*dynamic scope*。

所以说，区分*static/lexical scope*和*dynamic scope*的就是对*part of a program*的不同定义。

###Static/Lexical Scope

对*lexical scope*而言，变量解析依赖于变量在源码中的位置，即文本上下文（lexical context）。lexical resolution可以在编译期间搞定——这也叫做**early binding**。

既然所有的变量都可以在编译期间解析出（all variable references can be resolved at compile-time），*lexical scope*有时也叫*static scope*。

// 通常来说，由于变量在编译期间都解析完毕，*lexical scope*有更好的性能。

Lexical scoping目前为止广泛运用于`ALGOL-influenced`语言，包括C/Java/JavaScript等等。

###Dynamic Scope

对*dynamic scope*而言，解析变量名依赖于变量出现时程序的状态，即执行上下文或调用上下文（execution context or calling context）。dynamic resolution通常在运行时决定，也叫做`late binding`。

Lisp，Perl等使用Dynamic Scope。

###Lexical scoping vs dynamic scoping

使用局部变量（local variables，仅存在于特定函数内部）可以避免变量冲突。但怎么让变量仅存在于函数内部，有两种方式：

在*lexical scoping*（lexical scope，也称作static scoping或static scope）中，如果一个变量名（name）的作用域是一个特定的函数，那么它的作用域就是这个函数定义的代码块：在代码块内，变量名是存在的，变量名绑定到变量的值;在代码块外，变量名不存在。

相反，在*dynamic scoping*(dynamic scope)中，如果一个变量的作用域是一个特定函数，那么它的作用域就是这个函数执行的时间段：函数执行时，变量名存在且绑定到变量的值;但函数返回后（after the function returns），变量不再存在。

*-----仍使用开头的代码说明-----*

那么这意味着，函数`testScope`调用单独定义的`printStr`，

- 在*lexical scoping*中，`printStr`无法访问`testScope`的局部变量（`printStr`不是在`testScope`内部定义的）。
- 在*dynamic scoping*中，`printStr`可以访问`testScope`的局部变量，因为`printStr`的调用是在`testScope`执行期间。

##JavaScript的作用域体系

前面提到JS是采用*lexical scoping*的，那么除了前面讲的关于*lexical scoping*的知识，还有什么要讲呢？

JS的scoping规则很简单，但是，变量初始化和名字解析可能会引发问题，而闭包的大量使用意味着函数定义时的词法环境（lexical environment）（用于变量名解析）和它执行时的词法环境（和变量名解析无关）可能有很大不同。另外，JS对象的属性名的名字解析又是另一个话题了（和变量、函数不同）。

###JavaScript的lexical scoping

JS有函数级嵌套的*lexical scoping*，而global scope是最外层的scope。这个作用域体系（scoping）用于**变量**和**函数（函数声明，与函数类型的变量相对）**。

尽管JS的作用域体系很简单：就是lexical的，function-level的。相关的初始化和名字解析规则却可能引起困惑。

1. 没var时声明的变量是全局作用域的;
2. 声明局部变量必须有var，变量提升（variable hoisting）;
3. 在变量初始化之前访问是`undefined`，而不是语法错误;
4. 函数声明的提升与变量提升不同;
5. 闭包 。

###JavaScript的闭包

单独提一个小章节来讲闭包是必要的。闭包让JS无比强大，也是很多错误的来源。

**当一个函数执行时，名字解析依赖于它定义的位置（定义时的词法环境），而不是它执行时的词法环境。**在JS中，特定函数（特别是闭包）的嵌套的作用域（从全局到最local的），有时也被称为作用域链，可以类比对象的原型链。

> The nested scopes of a particular function (from most global to most local) in JavaScript, particularly of a closure, used as a callback, are sometimes referred to as the scope chain, by analogy with the prototype chain of an object.

闭包可以通过嵌套函数来产生。假设一个封闭函数，返回其内部嵌套的函数，包括封闭函数的局部变量作为这个被返回的函数的词法环境——这就是闭包。

闭包在JS中经常使用，但使用闭包是有风险的。

一个函数作为回调或者在另一个函数中返回，这样创建了闭包。如果这个函数的函数体中有变量没有绑定（带着它的作用域链），就会有风险。当基于参数创建回调，参数必须在闭包中存储，否则就会创建一个闭包指向封闭环境中的变量，而这个变量可能会变。

> When creating a callback based on parameters, the parameters must be stored in a closure, otherwise it will accidentally create a closure that refers to the variables in the enclosing environment, which may change.

例子：

```javascript
for(var i = 0; i < 10; i++) {
    setTimeout(function() {
        console.log('i is ' + i);
    }, 1000);
}
// 输出 10次 "i is 10"
for(var i = 0; i < 10; i++) {
    print(i);
}
function print(str) {
    setTimeout(function() {
        console.log('i is ' + str);
    }, 1000);
}
// 输出 
// i is 0
// i is 1
// i is 2
// i is 3
// i is 4
// i is 5
// i is 6
// i is 7
// i is 8
// i is 9
```



---

注意，本文的大部分术语/名词都尽量可靠翻译了:)，而且基本还带着英文原文。但有些名词翻译为中文仍可能引起歧义，下面列出了一些：

- name resolution：名字解析，变量名解析，变量的名字解析。对JS而言，包括变量、函数甚至对象等等的名字解析。
- lexical environment：词法环境，指代码上下文/代码块。
- scoping：作用域体系。