---
layout: article
comments: true
title: JavaScript Object
category: tech
tags: [JavaScript, Object]
description: <p>wait...</p>
---

JavaScript对象是什么？

*   js的基础数据类型（fundamental datatype）是对象（*object*）；
*   对象是无序的属性（*properties*）集合，每个属性是个key-value对；
*   但对象不仅仅是字符串到值的映射。除去有自己的属性集合，每个js对象都会从另一个对象继承属性，即原型（*prototype*）；
*   原型式继承（*prototypal inheritance*）是js的核心特性。

JS对象是动态的，属性可以添加或删除。除去string、number、true/false、null、undefined，在js中其他值都是对象。

property有name和value，name可以是任意字符串，包括空字符串（empty string），但一个对象不可能有相同的name。value可以任意js value，或者setter或/和getter方法（ecma5）。但除去name和value，对象还有3个相关的“属性特性”（*property attribute*）：

-  writable attribute，指定value是否可以设置；
-  enumerable attribute，指定是否可以通过`for in`返回属性的name；
-  configurable attribute，指定是否可以删除该属性，或者属性的"属性特性"是否可以修改。

除去属性，每个对象还拥有3个相关的对象特性（*object attribute*）：

-  prototype，另一个对象的引用，本对象继承另一个对象的属性；
-  class，标识对象类型的字符串；
-  extensible flag（可扩展标记，ecma5），表明是否可以为对象添加新属性。

最后，下面这些术语可以区分3类js对象和2类属性：

-  内置对象（*native object*），ecma规范定义的对象或类，如Array等；
-  宿主对象（*host object*），js解释器嵌入的宿主环境（如web浏览器）所定义的，如DOM对象等；
-  自定义对象（*user-defined object*），运行js代码创建的对象。
-  自有属性（*own property*），直接在对象中定义的属性。
-  继承属性（*inherited property*），继承的属性。


##创建对象

 可以通过对象直接量（*object literals*）、new关键字、`Object.create()`（ecma5）方法创建对象。

 ###对象直接量

 ```javascript
 var book = {
    author: {
        firstname: "David",
        lastname: "Yang"
    },
    "main title": "JavaScript"
 }
 ```

 注意： 

 -  保留字作属性name时最好加引号，虽然ecma5与一部分3可以不加引号；
 -  对象直接量最后一个属性后的逗号会忽略，但ie报错。

对象直接量是一个表达式，这个表达式创建并初始化一个新的不同的对象。这意味着在loop中，对象直接量将创建很多新对象，并且每个对象的属性值可能也不同。

###new创建对象

new运算符创建并初始化一个新对象。关键字new后面必须跟着一个函数调用，这个函数就叫构造函数（*constructor*）。构造函数用以初始化一个新创建的对象。

###原型

介绍第三种创建方法前，必须先解释一下原型。

**原型：**每个js对象都有第二个js对象（可能是`null`，但很少见）与之相关，这个第二个js对象就是原型，并且第一个对象从原型继承属性。

> Every JavaScript object has a second JavaScript object (or  null ,
but this is rare) associated with it. This second object is known as a prototype, and the first object inherits properties from the prototype.


-  所有对象直接量的原型都一样，即Object.prototype;
-  **new创建的对象的原型就是构造函数的原型！**所以：

```javascript
var arr = new Array(); // arr.prototype 就是 Array.prototype
```

`var obj = Object.prtotype;`，obj就是很少的没有原型的对象之一：它不继承任何属性。

###第3种对象创建方法：Object.create()

ecma5定义了`Object.create()`。这个方法创建一个新对象，方法的第一个参数就是新对象的原型。可选的第二个参数描述新对象的属性。

`Object.create()`是静态方法，不是提供给某个对象调用的方法。

```javascript
var o1 = Object.create({x:1, y:2}); // o1 inherits properties x and y.
var o2 = Object.create(null); // o2 inherits no props or methods.
var o3 = Object.create(Object.prototype); // o3 is like {} or new Object().
```

一个简单的inherit方法：

```javascript
function inherit(p) {
    if (p == null) throw TypeError(); // p must be a non-null object
    if (Object.create) // If Object.create() is defined...
        return Object.create(p); // then just use it.
    var t = typeof p; // Otherwise do some more type checking
    if (t !== "object" && t !== "function") throw TypeError();
    function f() {}; // Define a dummy constructor function.
    f.prototype = p; // Set its prototype property to p.
    return new f(); // Use f() to create an "heir" of p.
}
```

##查询和设置属性（Querying and Setting Properties）

js通过 点dot ( . )或方括号 square bracket ( [] ) 访问/设置属性。

点运算符后的标识不能是保留字，但ecma5放宽了限制。

方括号内的表达式必须是字符串，更严格讲，是可以转化为字符串的值。

###作为关联数组的对象（Objects As Associative Arrays）

用方括号时，对象就类似于数组，只是下标是字符串而非数字。这种数组就叫关联数组。

对象作为关联数组使用时非常方便：

```javascript
var addr = "";
for(i = 0; i < 4; i++) {
    addr += customer["address" + i] + '\n';
```

这是点操作符难以做到的。

###继承

属性查询时会顺着原型链查找，但设置属性时只会在对象上创建或修改属性，不会修改原型链。

###属性访问错误

查询一个不存在的属性会返回undefined，但对象不存在，查询其属性则报错。但可以这样来避免错误：

```javascript
// A concise and idiomatic alternative to get subtitle length or undefined
var len = book && book.subtitle && book.subtitle.length;
```

有些属性是只读的，不能重新赋值；有些对象不允许新增属性，但设置这些属性的失败操作不会报错。ecma5的严格模式已经修复。

```javascript
// The prototype properties of built-in constructors are read-only.
Object.prototype = 0; // Assignment fails silently; Object.prototype unchanged
```

在这些场景下设置对象o的属性p会失败：

-  o的属性p是只读的（有个例外：`defineProperty()`方法可以配置只读属性可以被设置）；
-  o有个继承的只读属性p：不可能通过设置同名属性来隐藏原型链上的只读属性；
-  o不可扩展。


