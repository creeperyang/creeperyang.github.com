---
layout: article
title: Javascript的技巧与细节
category: tech
tags: JavaScript
description: <p>Javascript是一种动态类型、弱类型、基于原型的语言，有很多不同于一般编程语言的特性。对于从Java或C++之类语言转学Javascript的，必然有很多不易理解或容易出错的<b>小细节</b>，本文从博主自己学习使用js的过程出发，罗列了一些。</p><p>这些细节可能是某个运算符的使用，也可能是对象的构造函数解说。</p>
---

Javascript是门很有意思的语言，是一种直译式脚本语言，是一种动态类型、弱类型、基于原型的语言。

因为它的动态类型、弱类型、基于原型，所以有很多不同于一般编程语言的特性。当然，这篇文章不会从宏观概括的方面来解释这种特性，而是以一些小细节、小样例来说明。

<!--view-break-->

###赋值与运算上的小细节

####赋值

好吧，js在赋值符号上没有搞特殊，就是一般的`=`，当然，也支持`-=`和`+=`等等。但是，js在赋值上的确有其特别的地方：

1.  `||`参与赋值

        类型：var arr = a || [];
        解释：a为假（!a===true）时，arr=[]。这是一种赋值技巧，保证arr不为空。

        同理，可以： var obj=a || {}; 等等。

2.  `&&`参与赋值

        类型：var prop = obj && obj.property;
        解释：obj存在（!obj===false）时，prop=obj.property。这是一种赋值技巧，保证obj为空时不会抛出错误。

3.  更复杂

        类型：rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
        解释：&&先运算，得出bool值B，那么就转化为第一种：B || context。该例子来源于jQuery源码。

        更多：

        1&&false || 'hello'    // 输出'hello'
        0&&true || {}          // 输出Object {}
        ---
        1&&true || {}          // 输出true
        true&&[] || 'hi'       // 输出[]


####运算

1.  "+"与任意变量

    **+会尝试把变量转换成数字输出**

        +-5    // 输出-5
        +"5"    // 输出5
        +""     // 输出0 
        +null    // 输出0
        +undefined    // 输出NaN
        +{}     // 输出NaN
        +'str'   // 输出NaN
        +function(){}   // 输出NaN


2.  数字与boolean类型的运算，**true转换成1而false转换成0**

        2*true    // 输出2，true被转换成1
        2*false    // 输出1，false被转换成0

        +true    // 输出1
        +false    // 输出0

**待续...**