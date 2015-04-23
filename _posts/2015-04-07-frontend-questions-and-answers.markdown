---
layout: article
comments: true
title: 前端问题集锦
category: [frontend, JavaScript]
tags: [questions, 问题]
---

关于前端，工作和学习过程中遇到过许多问题，也解答过许多别人的问题。这篇博客权当一个记录，记录一些有价值的问题。

<!--view-break-->

## 1. JavaScript语法相关问题

### 1.1 对象字面值的点操作符问题

- 问题： 

    ```javascript
    {a:1}.a // Uncaught SyntaxError: Unexpected token .
    ```

- 解决：

    ```javascript
    ({a:1}.a) // 或
    ({a:1}).a
    ```

- 原因：

    [MDN: Object literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#Object_literals)

    > An object literal is a list of zero or more pairs of property names and associated values of an object, enclosed in curly braces ({}). You should not use an object literal at the beginning of a statement. This will lead to an error or not behave as you expect, because the { will be interpreted as the beginning of a block.

    简单说，就是声明对象字面值时，语句开头不应该用`{`，因为js解释器会认为这是语句块（`block`）的开始。

### 1.2 字符串字面值的点操作符问题

- 问题：
    
    ```javascript
    var num = 123; num.toFixed(2) // >> "123.00"
    123.toFixed(2) // Uncaught SyntaxError: Unexpected token ILLEGAL
    ```

- 解决：
    
    ```javascript
    (123).toFixed(2) // >> "123.00"
    ```

- 原因：

    很简单，js解释器会默认`.`应该是小数点而不是点操作符。

### 1.3 对象字面值的问题(*updated: 2015-04-13*)

- 问题： 在（chrome）控制台输入以下代码会发生什么？

    ```javascript
    { name: "mc", id: 1 } // Uncaught SyntaxError: Unexpected token :
    ```

- 解决：

    ```javascript
    ({ name: "mc", id: 1 })
    ```

- 原因：

    同**1.1**。但这里有个问题，`{name: "mc"}`是不会报错的。这行代码等同于`name: "mc"`，并返回一个字符串`"mc"`。具体colon（`:`）到底代表了什么操作，目前未知。


### 1.4 连等赋值问题(*updated: 2015-04-23*)

- 问题： javascript 连等赋值问题
    
    ```javascript
    var a = {n: 1};  
    var b = a; 
    a.x = a = {n: 2};  
    console.log(a.x);// --> undefined  
    console.log(b.x);// --> {n:2}
    ```

- 原因： 
    
    我们可以先尝试交换下连等赋值顺序（`a = a.x = {n: 2};`），可以发现输出不变，即顺序不影响结果。

    那么现在来解释对象连等赋值的问题：按照[ecma-262规范](http://www.ecma-international.org/ecma-262/5.1/#sec-11.13)，题中连等赋值等价于
    `a.x = (a = {n: 2});`，按优先获取左引用（`lref`），然后获取右引用（`rref`）的顺序，`a.x`和`a`中的a都指向了`{n: 1}`。至此，至关重要或者说最迷惑的一步明确。`(a = {n: 2})`执行完成后，变量`a`指向`{n: 2}`，并返回`{n: 2}`;接着执行`a.x = {n: 2}`，这里的`a`就是`b`（指向`{n: 1}`），所以`b.x`就指向了`{n: 2}`。

    搜索此题答案时，[颜海镜的一篇博客](http://yanhaijing.com/javascript/2012/04/05/javascript-continuous-assignment-operator/)关于此题也有讲述，不过没有讲清楚（或许是我没有领会 :P）。

## 2. JavaScript内置API相关问题

### 2.1 parseInt的问题(*updated: 2015-04-13*)

- 问题： 

    ```javascript
    parseInt(0.000008) // >> 0
    parseInt(0.0000008) // >> 8
    ```

- 原因：

    ```javascript
    (0.000008).toString() // "0.000008"
    (0.0000008).toString() // "8e-7"
    ```

    `parseInt(arg)`时会调用`arg.toString()`。

---

waiting... 