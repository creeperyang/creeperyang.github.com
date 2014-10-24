---
layout: article
comments: true
title: JavaScript Hoisting
category: frontend
tags: [variable, function, declaration, hoisting]
---

先给一个高大上的术语「JavaScript Hoisting」——没听过的人可能是一头雾水，理解的人则可能会心一笑。hoist是提升的意思（[百度翻译](http://fanyi.baidu.com/#en/zh/hoist)）：

```
hoist：
-----------------------
vt.升起，提起; 
vi.被举起或抬高; 
n.起重机，升降机; 升起; <俚>推，托，举; 
```

但知道这个单词可能无助于理解这个术语。但一贯地，我认为概念可以提纲契领，所以定义先来：

> Hoisting is JavaScript's default behavior of moving all declarations to the top of the current scope (to the top of the current script or the current function).

<!--view-break-->

*在js中，解释器默认会把所有的（变量/函数）声明提升到当前作用域的顶部，这就叫hoisting。*

###Variable Hoisting

```javascript
// ReferenceError: undefinedVariable is not defined
console.log(undefinedVariable);
```

当我们访问未定义的变量时，会报ReferenceError，这很正常，再看：

```javascript
console.log(definedBelowVariable); // output --> undefined 
var definedBelowVariable = 'I am defined here.';
```

看到这段代码的输出，这一小节要讲的`Variable Hoisting`已经清晰了。在js中，变量的声明可以在使用之后，换句话说，变量可以先使用再声明。**但注意：变量的初始化不会提升（hoisting）。**

所以上面的代码相当于：

```javascript
var definedBelowVariable; // Variable Hoisting

console.log(definedBelowVariable); // output --> undefined 

definedBelowVariable = 'I am defined here.'; // 初始化不会提升
```

###Function Hoisting

js中函数定义（define）要用`function`关键词，定义有两种方式：函数声明或者函数表达式。

1. 函数声明（function declaration）

    ```javascript
    function functionName(parameters) {
        code to be executed
    }
    ```

2. 函数表达式（function expression）

    ```javascript
    var x = function (a, b) {return a * b};
    ```

了解了函数定义的两种方式，再从例子中看函数提升。

```javascript
isItHoisted(); // Outputs: "Yes!"

function isItHoisted() {
    console.log("Yes!");
}
```

很显然，函数被提升了，即函数定义可以在函数使用之后。**但请注意：Function Hoisting仅适用于使用函数声明方式定义的函数。**这是我要分开讲变量提升和函数提升的一个重要原因。

```javascript
// Outputs: "Definition hoisted!"
definitionHoisted();

// TypeError: undefined is not a function
definitionNotHoisted();

function definitionHoisted() {
    console.log("Definition hoisted!");
}

var definitionNotHoisted = function () {
    console.log("Definition not hoisted!");
};
```

从上面的代码中可以看出：`definitionNotHoisted`的声明被提升了，所以是`undefined`;但函数定义没有提升，所以是`TypeError`。

你可能想知道当你使用命名的函数表达式会怎么样：

```javascript
// ReferenceError: funcName is not defined
funcName();

// TypeError: undefined is not a function
varName();

var varName = function funcName() {
    console.log("Definition not hoisted!");
};
```

显然，当命名的函数作为函数表达式的一部分时，不会被提升。

---
参考：

- http://designpepper.com/blog/drips/variable-and-function-hoisting
- http://www.w3schools.com/js/js_function_definition.asp
- http://www.w3schools.com/js/js_hoisting.asp
- http://stackoverflow.com/questions/26542361/javascript-scopes#26542456

---
