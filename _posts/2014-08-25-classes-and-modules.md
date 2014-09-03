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
r instanceof Range // => true
```

###构造函数和类的标识（Constructors and Class Identity）

像我们看到的，原型对象是标识类的基础(fundamental)：两个对象从并且只从同一个原型对象继承属性时才是同一个类的实例对象。构造函数初始化对象的状态，但是不那么基础：两个构造函数可能原型属性指向同一个原型对象，那么这两个构造函数可以创建同一个类的实例对象。

但是，尽管构造函数不如原型重要，构造函数却是作为类的公共外观（public face）的。最明显的，构造函数的name常常用作类的name。另外，在测试对象是否是某个类的实例时，我们常用构造函数加`instanceof`操作符：

```javascript
r instanceof Range
```

`instanceof`操作符实际上不会检查r是不是由Range构造函数来初始化的，而是检查r是不是继承了`Range.prototype`。但`instanceof`的语法强化了构造函数作为类的公共外观。

###构造函数属性（The constructor Property）

任意js函数可以作为构造函数，而构造函数必须有prototype属性。

**每个js函数F（除去 Function.bind()方法的返回值）自动有一个prototype属性，这个prototype属性的值有一个不可枚举的contructor属性。这个constructor属性的值就是这个函数对象F：**

>Therefore, every JavaScript function (except functions returned by the EC-
MAScript 5  Function.bind() method) automatically has a  prototype property. The value of this property is an object that has a single nonenumerable  constructor property. The value of the  constructor property is the function object:

```javascript
var F = function() {}; // This is a function object.
var p = F.prototype; // This is the prototype object associated with it.
var c = p.constructor; // This is the function associated with the prototype.
c === F // => true: F.prototype.constructor==F for any function
```

预定义的原型对象（原型对象有个constructor属性）的存在表明：新创建对象一般继承了constructor属性，这个constructor属性指向它们的构造函数。因此，构造函数可以作为类的公共标识，因为这个constructor属性指出了对象所属的类。

```javascript
var o = new F(); // Create an object o of class F
o.constructor === F // => true: the constructor property specifies the class
o instanceof F // => true
```

前面`Range`的例子中我们覆盖了预定义的` Range.prototype`，因此就没有constructor属性来，但我们可以显示添加：

```javascript
Range.prototype = {
    constructor: Range, // Explicitly set the constructor back-reference
    ...
};
```

注：

```javascript
//在没添加前
r.constructor  // => function Object() { [native code] }
//添加后
r.constructor // =>
//function Range(from, to) {
//    this.from = from;
//    this.to = to;
//}
```

---

一点疑问：

`F.prototype.constructor.prototype.constructor...`这种循环引用有没有性能问题？jQuery对象的定义好像也用到循环引用。

---

##JS中Java风格的类（Java-Style Classes in JavaScript）

如果接触过Java之类的强类型面向对象语言，那么你可能习惯于想到四种类成员（class members）：

- 实例字段（instance fields）：每个实例的属性或变量，保存独立实例对象的状态；
- 实例方法（Instance methods）：类的所有实例共享的方法，被每个实例调用；
- 类字段（Class fields）：属于类而不是某个实例的属性或变量；
- 类方法（Class methods）：属于类而不是某个实例的方法。

JavaScript与Java的一个不同之处是：函数也是值（its functions are values），方法与字段没有明显区别。

除去这个不同之处，JavaScript可以模拟Java的四种类成员。在JS中，有3种不同的对象与类定义相关，而这3个对象的属性就可以模拟Java的四种类成员。

- 构造器对象（Constructor object）。如上所说，JS中构造函数（也是对象）定义了类的名字。添加到构造函数上的属性相当于类属性和类方法。
- 原型对象（Prototype object）。原型对象的属性被所有实例继承，因此，如果原型对象的属性的值是函数时，就相当于实例方法。
- 实例对象（Instance object）。类的每个实例都是独立的对象，直接给实例定义的属性不会被其他实例共享，即实例字段。

##增强类（Augmenting Classes）

JS的基于原型的继承机制是动态的：对象被创建后，原型变化也会影响这个对象。这意味着我们可以通过简单的添加新方法来增强类。

JS内置类也是开放的，你可以添加方法。

##类和类型（Classes and Types）

JS定义了一些类型（types）：null, undefined, boolean, number, string, function, object。

`typeof`操作符可以区分这些类型。但是，把类当作对象的类型，并且以此区分对象可能更有用。JS内置对象（包括宿主对象）可以通过`Object.prototype.toString.call(obj).slice(8,-1);`来获取类名，但自定义对象则要通过本节介绍的一些方法来获取。

###instanceof操作符

`obj instanceof fun`，左边是对象，右边是构造函数，测试obj是否继承了fun的prototype。这种继承可以是间接的（多层继承）。

注意：构造函数是类的public identity，但原型才是最关键的。instanceof检查的是原型继承，而不是对象是否由该构造函数初始化。

如果你想测试原型链，可以用`prototypeObj.isPrototypeOf(obj)`。

这两个方法的缺点是无法知道对象的类名。而且在客户端（浏览器）中，多窗口和多框架子页面中web兼容性不佳。每个窗口和子页面都有单独的执行上下文，每个上下文都有独有的全局对象和一组构造函数：一个框架页面的数组instanceof另一个框架页面Array构造函数结果是false。

###构造函数属性（constructor property）

```javascript
function typeAndValue(x) {
    if (x == null) return ""; // Null and undefined don't have constructors
    switch(x.constructor) {
        case Number: return "Number: " + x; // Works for primitive types
        case String: return "String: '" + x + "'";
        case Date: return "Date: " + x; // And for built-in types
        case RegExp: return "Regexp: " + x;
        case Complex: return "Complex: " + x; // And for user-defined types
    }
}
```

注意上面的case后表达式都是函数，而typeof之类的返回值是字符串。

同instanceof一样，探测构造函数属性的方法没法在不同上下文下（不同框架页面、窗口）工作。另外，并非所有对象都有constructor属性，有的对象的constructor属性被覆盖，无法探测。

###构造函数名字（The Constructor Name）

>The main problem with using the  instanceof operator or the  constructor property for determining the class of an object occurs when there are multiple execution contexts and thus multiple copies of the constructor functions. 

前面两种方法的一个重要缺陷是不同上下文时无法工作，所以我们可以尝试使用构造函数的名字而非构造函数本身。一些js实现（引擎）通过name属性让函数的名字可以被获取，而对一些没有name属性的JS实习来说，可以把函数转化为字符串，然后提取函数名。

```javascript
function type(o) {
    var t, c, n; // type, class, name
    // Special case for the null value:
    if (o === null) return "null";
    // Another special case: NaN is the only value not equal to itself:
    if (o !== o) return "nan";
    // Use typeof for any value other than "object".
    // This identifies any primitive value and also functions.
    if ((t = typeof o) !== "object") return t;
    // Return the class of the object unless it is "Object".
    // This will identify most native objects.
    if ((c = classof(o)) !== "Object") return c;
    // Return the object's constructor name, if it has one
    if (o.constructor && typeof o.constructor === "function" &&
    (n = o.constructor.getName())) return n;
    // We can't determine a more specific type, so return "Object"
    return "Object";
}
// Return the class of an object.
function classof(o) {
    return Object.prototype.toString.call(o).slice(8,-1);
};
// Return the name of a function (may be "") or null for nonfunctions
Function.prototype.getName = function() {
    if ("name" in this) return this.name;
    return this.name = this.toString().match(/function\s*([^(]*)\(/)[1];
};
```

构造函数名字的方法仍然有问题，即不是所有对象都有constructor属性。另外，constructor属性的值可以是匿名函数。

###鸭式辨型（Duck-Typing）

上面的区分对象类型的方法都有问题（至少在客户端JS）。一个可替代方法是回避“what is the class of this object?”问题，转而回答 “what can this object do?”。

这种思考问题的方式与python和ruby很像，而Duck-Typing的称谓来源于这样一个表达：

>When I see a bird that walks like a duck and swims like a duck and quacks like a duck, I call that bird a duck.

```javascript
// A function for duck-type checking
// Return true if o implements the methods specified by the remaining args.
function quacks(o /*, ... */) {
    for(var i = 1; i < arguments.length; i++) { // for each argument after o
        var arg = arguments[i];
        switch(typeof arg) { // If arg is a:
        case 'string': // string: check for a method with that name
            if (typeof o[arg] !== "function") return false;
            continue;
        case 'function': // function: use the prototype object instead
            // If the argument is a function, we use its prototype object
            arg = arg.prototype;
            // fall through to the next case
        case 'object': // object: check for matching methods
            for(var m in arg) { // For each property of the object
                if (typeof arg[m] !== "function") continue; // skip non-methods
                if (typeof o[m] !== "function") return false;
            }
        }
    }
    // If we're still here, then o implements everything
    return true;
}
```

##JS中的面向对象技术