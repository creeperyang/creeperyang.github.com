---
layout: article
comments: true
title: JavaScript Classes and Modules
category: tech
tags: [JavaScript, class, module]
description: <p>wait...</p>
---

JavaScript对象在第六章讲过了，之前我们只是把对象当作独一无二的属性的集合，每个对象都不同。但现在，我们要讲讲一类对象（a class of objects）共享某些属性。类的实例（instance）有自己的自由属性存储或定义自己的状态，也会有属性（方法）来定义自己的行为，这种行为通常是由类来定义并被所有实例共享。

在JavaScript中，类基于JavaScript的以原型为基础的继承机制。

- 如果两个对象继承自同一个原型，我们称这两个对象是同一个类的实例。
- 如果两个对象继承自同一个原型，这典型（但不是必然）表明两个对象被同一个构造函数创建和初始化。

JavaScript的一个重要特征是动态可扩展（dynamically extendable）。

##类与原型（Classes and Prototypes）
