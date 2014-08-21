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

> null is not an object, it is a primitive value. For example, you cannot add properties to it. Sometimes people wrongly assume that it is an object, because typeof null returns "object". But that is actually a bug (that might even be fixed in ECMAScript 6).    ------From <http://stackoverflow.com/questions/801032/why-is-null-an-object-and-whats-the-difference-between-null-and-undefined/802371#802371>
> null不是对象，是基础类型。不要被`typeof null;  // object`迷惑，这是js解释器的错误。 

property有name和value，name可以是任意字符串，包括空字符串（empty string），但一个对象不可能有相同的name。value可以任意js value，或者setter或/和getter方法（ecma5）。但除去name和value，对象还有3个相关的“属性特性”（*property attribute*）：

-  writable attribute，指定value是否可以设置；
-  enumerable attribute，指定是否可以通过`for in`返回属性的name；
-  configurable attribute，指定是否可以删除该属性，或者属性的"属性特性"是否可以修改。

除去属性，每个对象还拥有3个相关的“对象特性”（*object attribute*）：

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
arr.__proto__ // []
Array.prototype // []
Array.prototype === arr.__proto__ // true
```

`var obj = Object.prtotype;`，obj就是很少的没有原型(**原型是null**)的对象之一：它不继承任何属性。

```javascript
var obj = {x: 1}; // 对象直接量
obj.__proto__ // Object {}
Object.prototype // Object {}
Object.prototype === obj.__proto__ // true
Object.prototype.__proto__ // null 
```

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

##删除属性

`delete`操作符删除对象的属性。操作数必须是一个属性访问表达式。

`delete`只能删除自有属性，不能删除继承属性。要删除继承的属性，必须从定义这个属性的原型对象上删除它。

`delete`删除成功或没起作用时返回true；`delete`后面不是属性访问表达式时也返回true。

```javascript
o = {x:1}; // o has own property x and inherits property toString
delete o.x; // Delete x, and return true
delete o.x; // Do nothing (x doesn't exist), and return true
delete o.toString; // Do nothing (toString isn't an own property), return true
delete 1; // Nonsense, but evaluates to true
```

*configurable*设为false的属性不会被`delete`删除。某些内置对象的属性是不可配置的，比如通过变量声明和函数声明创建的全局对象的属性。严格模式中，删除不可配置属性会报TypeError，但ecma3并且是非严格模式下，仅仅是`return false；`：

```javascript
delete Object.prototype; // Can't delete; property is non-configurable
var x = 1; // Declare a global variable
delete this.x; // return false; Can't delete this property
function f() {} // Declare a global function
delete this.f; // Can't delete this property either
```

非严格模式下，删除可配置属性时，可以省略对全局对象的引用，直接在`delete`操作符后跟上属性名即可：

```javascript
this.x = 1; // Create a configurable global property (no var)
delete x; // And delete it
```

但在严格模式下，上述做法会报SyntaxError，必须：

```javascript
delete x; // SyntaxError in strict mode
delete this.x; // This works
```

##检测属性

`in`运算符, `hasOwnProperty()`和`propertyIsEnumerable()`方法可以检测一个对象是否有某属性，或者简单的通过属性查询来完成。

`in`运算符左侧是属性名（字符串），右侧是对象，如果对象的自有属性或继承属性包含这个属性的话，返回true。

```javascript
var o = { x: 1 }
"x" in o; // true: o has an own property "x"
"y" in o; // false: o doesn't have a property "y"
"toString" in o;// true: o inherits a toString property
```

`hasOwnProperty()`检测自有属性。

```javascript
var o = { x: 1 }
o.hasOwnProperty("x"); // true: o has an own property x
o.hasOwnProperty("y"); // false: o doesn't have a property "y"
o.hasOwnProperty("toString"); // false: toString is an inherited property
```

`propertyIsEnumerable()`是`hasOwnProperty()`的增强版：只有是自有属性，并且属性的可枚举性（enumerable attribute）为true时才返回true。

```javascript
var o = inherit({ y: 2 });
o.x = 1;
o.propertyIsEnumerable("x"); // true: o has an own enumerable property x
o.propertyIsEnumerable("y"); // false: y is inherited, not own
Object.prototype.propertyIsEnumerable("toString"); // false: not enumerable
```

其实除去用`in`， `！==undefined`在大部分情况下可替代。但这种情况只能用in：

```javascript
var o = { x: undefined }
```

##枚举属性

除去验证某个属性的存在，我们有时会列举对象所有属性，这常常也用`for/in`来做，但ecma5提供了2个便捷的替代方法。

1. `Object.keys()`， 返回 **可枚举的自有属性** 的name组成的数组。
2. `Object.getOwnPropertyNames()`，类似`Object.keys()`，但返回自有属性而不止可枚举属性。

```javascript
var obj = Object.create({x:1});
obj.y = 2;
obj.toString() // "[object Object]"
Object.keys(obj);
["y"]
Object.getOwnPropertyNames(obj)
["y"]
```

##属性Getter和Setter

我们说过，属性是由name、value以及一组特性attribute构成的。

ecma5中，属性的value可以被1个或2个函数替代，这两个函数就是getter/setter。由getter/setter定义的属性常被称作“访问器属性”（“accessor property”），以区别于“数据属性”（“data property”），数据属性只有一个简单的值。

当程序查询“访问器属性”时，js调用getter方法（不传参），方法返回值就是属性值。js调用setter时，赋值表达式右侧的值就作为参数传入setter。忽略setter的返回值。

“访问器属性”没有*writable*特性：

- 同时有setter/getter，读/写属性;
- 只有setter，只写属性（“数据属性”不可能做到这一点），读取时得到undefined;
- 只有getter，只读属性。

```javascript
var o = {
    // An ordinary data property
    data_prop: value,
    // An accessor property defined as a pair of functions
    // 访问器属性一般成对定义
    get accessor_prop() { /* function body here */ },
    set accessor_prop(value) { /* function body here */ }
};
var p= {
    // x and y are regular read-write data properties.
    x:1.0,
    y:1.0,
    // r is a read-write accessor property with getter and setter.
    // Don't forget to put a comma after accessor methods.
    get r() { return Math.sqrt(this.x*this.x + this.y*this.y); },
    set r(newvalue) {
        var oldvalue = Math.sqrt(this.x*this.x + this.y*this.y);
        var ratio = newvalue/oldvalue;
        this.x *= ratio;
        this.y *= ratio;
    }, 
    // theta is a read-only accessor property with getter only.
    get theta() { return Math.atan2(this.y, this.x); 
}
```

“访问器属性”和“数据属性”一样可以被继承。

##属性特性（Property Attributes）

属性特性指定属性是否可写、可枚举、可配置。ecma3无法设置这些，ecma5提供了查询和设置这些特性的api。这些api对类库来说很重要，因为：

- 允许为原型对象添加方法，并让方法不可枚举，跟内置的方法一样;
- 允许锁住对象，定义不可更改、删除的属性。

我们把“访问器属性”的setter/getter看作特性，按这个逻辑，“数据属性”的值也可以看作特性。因此，可以说一个属性有一个名字和4个特性：value、writable、enumerable、configurable。

>we can say that a property has a name and four attributes. The four attributes of a data property are value, writable, enumerable, and configurable.

为了实现属性特性的查询和设置，ecma5定义了一个叫“属性描述符”（property descriptor）的对象来代表那4个特性。描述符对象的属性和它们所描述的属性特性是同名的，因此：

- “数据属性”的描述符对象有value、writable、enumerable、configurable等4个属性；
- “访问器属性”的描述符对象则用getter/setter代替value和writable。

writable、enumerable、configurable都是布尔值。getter/setter是函数。

通过`Object.getOwnPropertyDescriptor()`可以对指定对象获取指定属性的描述符对象：

```javascript
// Returns {value: 1, writable:true, enumerable:true, configurable:true}
Object.getOwnPropertyDescriptor({x:1}, "x");

// This object has accessor properties that return random numbers.
var random = {
    get octet() { return Math.floor(Math.random()*256); },
    get uint16() { return Math.floor(Math.random()*65536); },
    get int16() { return Math.floor(Math.random()*65536)-32768; }
};
// Returns { get: /*func*/, set:undefined, enumerable:true, configurable:true}
Object.getOwnPropertyDescriptor(random, "octet");

Object.getOwnPropertyDescriptor({}, "x"); // undefined, no such prop
Object.getOwnPropertyDescriptor({}, "toString"); // undefined, inherited
```

`Object.getOwnPropertyDescriptor()`只能获取自有属性的描述符对象，对继承的属性，要遍历原型链（` Object.getPrototypeOf()`）。

要设置属性特性，用` Object.defineProperty()`，传入参数：要修改的对象、属性、描述符对象。

```javascript
var o = {}; // Start with no properties at all
// Add a nonenumerable data property x with value 1.
Object.defineProperty(o, "x", { value : 1,
    writable: true,
    enumerable: false,
    configurable: true});
// Check that the property is there but is nonenumerable
o.x; // => 1
Object.keys(o) // => []

// Now modify the property x so that it is read-only
Object.defineProperty(o, "x", { writable: false });
// Try to change the value of the property
o.x = 2; // Fails silently or throws TypeError in strict mode
o.x // => 1

// The property is still configurable, so we can change its value like this:
Object.defineProperty(o, "x", { value: 2 });
o.x // => 2
// Now change x from a data property to an accessor property
Object.defineProperty(o, "x", { get: function() { return 0; } });
o.x // => 0
```

` Object.defineProperty()`创建/修改自有属性，不能修改继承的属性。

` Object.defineProperties()`同时创建或修改多个属性,返回修改过的对象。

```javascript
var p = Object.defineProperties({}, {
    x: { value: 1, writable: true, enumerable:true, configurable:true },
    y: { value: 1, writable: true, enumerable:true, configurable:true },
    r: {
        get: function() { return Math.sqrt(this.x*this.x + this.y*this.y) },
        enumerable:true,
        configurable:true
    }
});
```

对不允许修改/创建的属性用上述2个方法，会报错：TypeError。一般说，writable特性控制着value特性，configurable特性控制着其它特性，但这不是绝对的，具体规则如下：

- 如果对象是不可扩展的，则可以编辑已有属性，但不能添加新属性；
- 如果“访问器属性”是不可配置的，则不能修改getter和setter方法，也不能转为“数据属性”；
- 如果“数据属性”是不可配置的，则不能将它转换为“访问器属性”；
- 如果“数据属性”是不可配置的，则不能将它的writable从false修改为true，但可以从true修改为false；
- 如果“数据属性”是不可配置且不可写的，则不能修改它的值。

###getter和setter的老式API

在ecma5标准被采纳之前，一些浏览器已经可以支持set和get。具体略。

##对象特性/属性（Object Attributes）

每个对象都有`prototype、class、extensible`3个特性。

###prototype属性

prototype特性指定对象从哪个对象继承属性。这个属性非常重要，因此我们常简称为“对象o的原型”，而非“对象o的原型属性”。

原型属性是对象创建之初就设置好的。复述一下之前提到的：

- 对象字面量的原型是Object.prototype;
- new创建的对象的原型是构造函数的原型；
- Object.create()用第一个参数（可以是null）作为原型。

在ecma5中，`Object.getPrototypeOf()`可以查询对象的原型，而ecma3没有对应的方法。但我们可以通过`o.constructor.prototype `来检测对象o的原型。**通过new创建的对象，通常继承一个constructor属性，该属性指代创建这个对象的构造函数。**如上所说，构造函数的prototype就是新建对象的prototype。这一点在之后会详细解释，并且同时会解释为什么用这种方法检测原型不太可靠。

对象直接量或者通过`Object.create()`创建的对象有一个constructor属性，该属性值为` Object()`构造函数：

```javascript
var o = Object.create({x:1});
o.constructor // =>function Object() { [native code] }
o.constructor.prototype  // => Object {}
```

因此，对对象直接量而言，`constructor.prototype`指向正确的原型，但对`Object.create()`创建的对象而言，指向原型常常不正确。

要想检测一个对象是否是另一个对象的原型（或处于原型链中），用` isPrototypeOf()`方法。

```javascript
var p = {x:1}; // Define a prototype object.
var o = Object.create(p); // Create an object with that prototype.
p.isPrototypeOf(o) // => true: o inherits from p
Object.prototype.isPrototypeOf(o) // => true: p inherits from Object.prototype
```

###class特性（The class Attribute）

一个对象的class特性是一个字符串，代表对象的类型信息。

ecma3，ecma5都没有提供设置这个特性的方法，并且只有一个间接的技术去查询它。默认的`toString`方法（继承自Object.prototype）返回这种形式的字符串：

```javascript
[object class]
```

可以查询类特性的方法：

```javascript
function classof(o) {
    if (o === null) return "Null";
    if (o === undefined) return "Undefined";
    return Object.prototype.toString.call(o).slice(8,-1);
}
```

`classof`函数可以传入任何类型的参数。number、string、bool都可以正确得出class，null和undefined也特殊对待了。内建的对象也可以正常得出同名class，如Date、Array等。另外，宿主对象一般也可以得出有意义的class名（取决于实现方式）。但是，自定义的对象、对象字面量、Object.create创建的对象都只能得出`Object`。所以对自定义的类来说，无法通过class来区分。

###可扩展特性（The extensible Attribute）

