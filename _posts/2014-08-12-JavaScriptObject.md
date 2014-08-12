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

