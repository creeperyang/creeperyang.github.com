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

问题： 

```javascript
{a:1}.a // Uncaught SyntaxError: Unexpected token .
```

解决：

```javascript
({a:1}.a) // 或
({a:1}).a
```

原因：

[MDN: Object literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#Object_literals)

> An object literal is a list of zero or more pairs of property names and associated values of an object, enclosed in curly braces ({}). You should not use an object literal at the beginning of a statement. This will lead to an error or not behave as you expect, because the { will be interpreted as the beginning of a block.

简单说，就是声明对象字面值时，语句开头不应该用`{`，因为js解释器会认为这是语句块（`block`）的开始。

### 1.2 字符串字面值的点操作符问题

问题： 

```javascript
var num = 123; num.toFixed(2) // >> "123.00"
123.toFixed(2) // Uncaught SyntaxError: Unexpected token ILLEGAL
```

解决：

```javascript
(123).toFixed(2) // >> "123.00"
```

原因：

很简单，js解释器会默认`.`应该是小数点而不是点操作符。

---

waiting... 