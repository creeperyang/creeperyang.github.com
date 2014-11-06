---
layout: article
comments: true
title: JavaScript Scoping and Hoisting
category: frontend
tags: [scoping, hoisting]
---

这篇是[「JavaScript Hoisting」](/frontend/2014/10/javascript-hoisting/)的进阶篇，参照了大牛**Ben**的[「JavaScript Scoping and Hoisting」](http://www.adequatelygood.com/JavaScript-Scoping-and-Hoisting.html)。

首先介绍一下**Ben**：

>Ben is a 25 year-old software engineer. He lives and works in San Francisco. Many people think he invented the term "hoisting" in JavaScript, but this is untrue.

<!--view-break-->

但不管是不是Ben发明了"JavaScript Hoisting"，他关于Hoisting的阐释是透彻和深刻的。本文大部分内容是对它文章的翻译，英文好的同学可以直接阅读[原文](http://www.adequatelygood.com/JavaScript-Scoping-and-Hoisting.html)。英文吃力的或者嫌麻烦的可以接着看。

##让你大吃一惊的例子

```javascript
// example 1:
var foo = 1;
function bar() {
    if (!foo) {
        var foo = 10;
    }
    alert(foo);
}
bar();

// example 2:
var a = 1;
function b() {
    a = 10;
    return;
    function a() {}
}
b();
alert(a);
```

不妨先想想浏览器会输出什么，然后运行代码对照，那么结果会让大部分人大吃一惊，大部分人都会感到困惑不解。（上面的例子中，例1会输出`10`，例2会输出`1`。）

那么为什么会有这样的结果？这就是这篇文章要说的「JavaScript Hoisting」，但要理解这个概念必须先从scope说起。

##Scoping in JavaScript

js新手（可能不止新手）的一个困扰源就是作用域。js作用域为什么让人困惑的原因是js是一门类似C的语言，但它的作用域体系又和C不一样。

```c
#include <stdio.h>
int main() {
    int x = 1;
    printf("%d, ", x); // 1
    if (1) {
        int x = 2;
        printf("%d, ", x); // 2
    }
    printf("%d\n", x); // 1
}
```

这是一段C代码，C有块级作用域（` block-level scope`），所以进入if语句块后，新的变量可以定义在块内而不影响外部变量。但JS不一样：

```javascript
var x = 1;
console.log(x); // 1
if (true) {
    var x = 2;
    console.log(x); // 2
}
console.log(x); // 2
```

JS没有块级作用域！所以if内的`x`覆盖了外部的`x`。

但JS有函数级作用域（`function-level scope`）。例如if语句之类的不会创建新的作用域，在JS中只有函数会创建新的作用域。

##Declarations, Names, and Hoisting

在js中，一个name进入作用域的方式有4种：

1. Language-defined：所有的作用域默认都会给出`this`和`arguments`两个name;
2. Formal parameters（形参）：函数有形参，形参会添加到函数的作用域中;
3. Function declarations（函数声明）：如`function foo() {}`;
4. Variable declarations（变量声明）：如`var foo`。

函数声明和变量声明总是会被编译器移动（即hoist）到它们所在的作用域的顶部（这对你是透明的）。至于`Language-defined`和形参，显然，它们已经在顶部了。

注意，提升的只有变量声明，变量初始化是不会提升的。更具体的情况可以看前一篇[「JavaScript Hoisting」](/frontend/2014/10/javascript-hoisting/)。

###Name Resolution Order

最重要的特殊情况是变量解析顺序。这个顺序与前面提到的变量进入作用域的4种方式的顺序一致。

这说明，如果一个name已经被定义了，它就再也不会被重新声明。这也意味着，函数声明的优先级要高于变量声明。

当然，这不是说赋值无效了，而是变量声明部分被解释器忽略了。

```javascript
function testOrder(arg) {
    console.log(arg); // arg是形参，不会被重新定义
    console.log(a); // 因为函数声明比变量声明优先级高，所以这里a是函数
    var arg = 'hello'; // var arg;变量声明被忽略， arg = 'hello'被执行
    var a = 10; // var a;被忽视; a = 10被执行，a变成number
    function a() {
        console.log('fun');
    } // 被提升到作用域顶部
    console.log(a); // 输出10
    console.log(arg); // 输出hello
}; 
testOrder('hi');
/* 输出：
hi 
function a() {
        console.log('fun');
    }
10 
hello 
*/
```

相信上面的例子已经把意思阐述清楚了。但记住3个例外：

- 内置的name `arguments` 表现有点奇怪。它似乎在形参之后被声明，但在函数声明之前。这意味着如果一个形参叫`arguments`，那么这个形参的优先级比`arguments`要高（覆盖了内置的`arguments`，即使它是`undefined`）。请不要把形参命名为`arguments`。

    ```javascript
    function arg(arguments, b){
        console.log(arguments);
    }
    arg('hi', 2);

    // 输出：hi 
    ```

- 在任何地方试图把`this`作为标识符（`identifier`）都会报错。
- 如果多个形参同名，最后一个同名形参优先级高，即使它是`undefined`。

##How to Code With This Knowledge

强烈建议一个作用域只使用一个`var`语句，而且在作用域顶部。

```javascript
/*jslint onevar: true [...] */
function foo(a, b, c) {
    var x = 1,
        bar,
        baz = "something";
}
```

##What the Standard Says

[「ECMAScript262 Standard」](http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf)，section 12.2.2：

>If the variable statement occurs inside a FunctionDeclaration, the variables are defined with function-local scope in that function, as described in section 10.1.3. Otherwise, they are defined with global scope (that is, they are created as members of the global object, as described in section 10.1.3) using property attributes { DontDelete }. Variables are created when the execution scope is entered. A Block does not define a new execution scope. Only Program and FunctionDeclaration produce a new scope. Variables are initialised to undefined when created. A variable with an Initialiser is assigned the value of its AssignmentExpression when the VariableStatement is executed, not when the variable is created.