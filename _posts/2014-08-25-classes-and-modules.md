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

在JS中，类的所有实例对象都从同一个原型对象继承属性。

```javascript
function range(from, to) {
    var r = inherit(range.methods);
    r.from = from;
    r.to = to;
    // Finally return the new object
    return r;
}
range.methods = {
    includes: function(x) { return this.from <= x && x <= this.to; },
    foreach: function(f) {
        for(var x = Math.ceil(this.from); x <= this.to; x++) f(x);
    },
    toString: function() { return "(" + this.from + "..." + this.to + ")"; }
};
```

可以看到from、to是不可继承的，可继承的方法的都用到了from、to。注意一下`this`的使用：类的方法可以通过this来访问对象的属性。

##类与构造函数（Classes and Constructors）

上面是一种构造类的方法，但不常用，因为没有定义构造函数。

构造函数用来初始化对象。构造函数用new关键字调用。因为使用new调用构造函数会自动创建对象，所以构造函数要做的就是初始化对象。

构造函数调用的一个重要特征是新对象都用构造函数的prototype属性作为自己的prototype。所以这些新对象都是同一class的实例。

```javascript
function Range(from, to) {
    this.from = from;
    this.to = to;
}
Range.prototype = {
    includes: function(x) { return this.from <= x && x <= this.to; },
    foreach: function(f) {
        for(var x = Math.ceil(this.from); x <= this.to; x++) f(x);
    },
    toString: function() { return "(" + this.from + "..." + this.to + ")"; }
};

var r = new Range(1,3); // Create a range object
r.includes(2); // => true: 2 is in the range
r.foreach(console.log); // Prints 1 2 3
console.log(r); // Prints (1...3)
```

###构造函数和类的标识（Constructors and Class Identity）

像我们看到的，原型对象是标识类的基础：两个对象从并且只从同一个原型对象继承属性时才是同一个类的实例对象。构造函数初始化对象的状态，但是不那么基础：两个构造函数可能原型属性指向同一个原型对象，那么这两个构造函数可以创建同一个类的实例对象。

但是，尽管构造函数不如原型重要，构造函数却是作为类的公共外观（public face）的。最明显的，构造函数的name常常用作类的name。另外，在测试对象是否是某个类的实例时，我们常用构造函数加`instanceof`操作符：

```javascript
r instanceof Range
```

`instanceof`操作符实际上不会检查r是不是由Range构造函数来初始化的，而是检查r是不是继承了`Range.prototype`。但`instanceof`的语法强化了构造函数作为类的公共外观。

###构造函数属性（The constructor Property）

