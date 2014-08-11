---
layout: article
comments: true
title: CSS Visual Formatting Model
category: tech
tags: [CSS, Box model]
description: <p>wait...</p>
---


声明：

本文参考<http://topic.csdn.net/u/20100719/17/ff203b89-135e-46cf-8fce-705f16e37beb.html?006156676166584196>

定义以下术语：

1. visual formatting model： 可视化格式模型，下文中简称模型。
2. media： 媒介，CSS中的重要概念，即展示页面的介质，最常见的是screen（显示器），其它还有纸媒介等待。
3. user agent： 用户代理，即浏览器。
4. dom tree： 文档树，下文中简称树。
5. box model： 盒模型。
6. positioning scheme： 定位体系。
7. containing blocks： 包含块，元素生成box，该box就是子元素的包含块。
8. block-level elements, block box: 块级元素，块框
9. inline-level elements, inline box： 行内级别元素，行内框
10. inline-level box： 行内级别框
11. replaced element: 其内容不受CSS视觉格式化模型控制的元素,比如image,嵌入的文档(iframe之类)或者applet,叫做替换元素。

    比如,img元素的内容通常会被其src属性指定的图像替换掉。替换元素通常有其固有的尺寸:一个固有的宽度,一个固有的高度和一个固有的比率。比如一幅位图有固有用绝对单位指定的宽度和高度,从而也有固有的宽高比率。另一方面,其他文档也可能没有固有的尺寸,比如一个空白的html文档。

    CSS渲染模型不考虑替换元素内容的渲染。这些替换元素的展现独立于CSS。object,video,textarea,input也是替换元素,audio和canvas在某些特定情形下为替换元素。使用CSS的content属性插入的对象是匿名替换元素。

12. non-replaced element: 非替换元素，替换元素之外的所有其他元素都是非替换元素,由CSS的视觉格式化模型负责非替换元素的渲染。

##Introduction to the visual formatting model

本章及下章描述了可视化格式模型：浏览器怎么为可视媒介处理文档树？

在模型中，根据盒模型，树中每个元素生成0个或多个盒子。这些盒子的布局受以下因素影响：

1.  box尺寸和类型。
    
    类型特指`display`特性决定的元素类型，如`div`是块级元素，`span`是行内元素。

2.  定位体系。

    元素在布局时，根据3种定位体系定位。分别是，常规流、浮动和绝对定位。

3.  文档树中元素之间的关系。

    比如，一个块元素包含两个互为兄弟节点的浮动元素，后面那个浮动元素的布局，会受前面元素以及它包含块的影响。

4. 外部信息。
    
    比如，可视窗口的大小，我们有时候会做页面自适应窗口大小的功能，就是因为，窗口大小对布局有影响。再如，图片的固有尺寸，会影响行内替换元素的尺寸，进而影响整个布局。

模型没有定义格式的所有细节，所以在没有定义的方面（比如letter-spacing）各浏览器可能表现有差异。

###The viewport

视口，显示屏上的窗口或其它显示区域。视口尺寸大小改变时，浏览器会改变文档的布局。比如，有些值是依赖于视口大小的，`div` width的auto值，等等。

当视口的尺寸小于文档渲染的画布（也就是页面）的大小时，浏览器应该提供滚动机制。每个画布最多有一个视口。但是，浏览器可以同时渲染多个画布。也就是说，浏览器可以打开多个页面，但是每个页面最多只有一个视口。

###Containing blocks

在CSS2.1中，很多box的定位和尺寸的计算，都取决于一个矩形的边界，这个矩形，就被称作是包含块(containing block)。一般来说，(元素)生成的box会扮演它子孙元素包含块的角色；我们称之为：一个元素的box为它的子孙节点创建了包含块。

包含块是一个相对的概念。“一个box的包含块”，指的是“该box所存在的那个包含块”，并不是它建造的包含块。

每个box相对于它的包含块都有一个位置，但是它不会被包含块限制；它可以溢出(包含块)。

##Controlling box generation(控制框的生成)

我们经常用到块元素、行内元素的概念，那么，到底什么是块元素，什么是行内元素，它们有什么特点，怎么形成的，有什么作用呢？什么是块框，什么又是行内框呢？

###块级元素和块框

块级元素是源文档中那些在视觉上被格式化为块的元素（如：段落）。下面这些'display'属性的取值会产生块级元素：'block'，'list-item'，以及'table'。

块级框是参与block formatting context的框。每个块级元素会生成一个主块级框（principal block-level box），这个主块级框包含后代框、生成的内容，并且也是涉及所有定位体系的框。一些块级元素会生成主块级框之外的框（additional boxes），比如`'list-item'`元素。这些额外的框相对于主块级框来定位。

除去table框和替换元素，其它块级框也是块级容器框（a block container box），它可能仅包含块级框，或者仅包含行内框（会创建inline formatting context）。不是所有的块级容器框都是块级框：非替换的行内框和非替换的表格单元格（cell）是块级容器框但不是块级框。块级框简称块框。

三个术语 *[块级框block-level box、块级容器框block container box、块框block box]* 在不严格区分时都可以缩写为 *块（block）*。

####匿名块框

```html
// example 1
<DIV>
  Some text
  <P>More text
</DIV>
```

（并假定DIV和P都设置了 'display: block'），DIV看来包含行内内容和块内容。为了使格式化简单一些，我们假定有一个匿名块框围绕在"Some text"周围。

![示意图](http://www.w3.org/TR/CSS21/images/anon-block.png)

换句话说，如果块级容器框（上面的DIV）内有一个块级框（上面P），那么我们将强制它（DIV）内部只有块级框（这里是插入匿名块框）。

当一个行内框(inline box)包含一个块级框时，这个行内框（和与它处于同一行框内的祖先行内框）会围绕着块级框被截断。行内框会被分成两个行框（line boxes），块级框（们）两边各一个。断点之前和之后的行框(line box)会被封装到匿名的块框里，并且，原来的块级框会成为这些匿名块框的兄弟框。当这样的行内框受到相对定位的影响时，相对定位也会影响它内部的块框。

<iframe width="100%" height="300" src="http://jsfiddle.net/creeper/1r1x0gp0/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

上述代码中，P元素包含匿名文本区块 C1，后跟块级元素SPAN，最后是匿名文本区块C2。最终生成的框(boxes)是代表BODY的块框，包含着围绕C1的匿名块框，SPAN的块框，和另一个围绕C2的匿名块框。

匿名框的属性(properties)从包含它的非匿名框那里继承而来（比如，例1中，匿名框会继承包含它的DIV的属性）。非继承属性会使用初始值。比如，匿名框会从DIV继承字体，但是margin会是0 。

匿名框不会影响元素的原有属性设置。如例2中P设置了border，产生匿名框后，C1、C2还是被红色的边框包围。

子框计算百分比时匿名父块框被忽略，即：最近的非匿名祖先框被用来代替匿名框计算百分比。比如，一个在DIV里的匿名块框的子元素需要知道它的包含块的高度以用来处理百分比高度。它将使用DIV创建的包含块的高度，而非匿名块框。

###行内级别元素和行内框

行内元素是源文档中那些不形成新的内容块的元素；内容在行内分布（如，段落内着重的文本，行内图形等等）。某些'display'特性的值形成行内元素：'inline'，'inline-table'，'inline-table'。行内级别元素生成行内框（inline box）。行内框参与 inline formatting context。

行内框肯定是行内级别（inline-level），并且它的内容参与它包含的inline formatting context。非替换元素（并且display: inline）生成行内框。不是行内框的行内级别框（Inline-level boxes），比如行内级别的替换元素、inline-block元素、inline-table元素被称为原子行内级别框，因为它们作为单一不透明框参与inline formatting context。

####匿名行内框

任何被块容器元素直接包含（不是行内元素）的文字都被当作匿名行内元素。

```html
<p>Some <em>emphasized</em> text</p>
```

P元素生成一个块控制框，其内还有几个行内框。"emphasized"的框是一个行内元素（`<em>`）产生的行内框，而其它的框（"Some"和"text"）是块级元素（P）产生的行内框。后者就称为匿名行内控制框，因为它们没有与之相关的行内元素，所以，这些框被叫做匿名行内框。

这样的行内框从其父块框那里继承可以继承的属性。非继承属性取它们的初始值。例子中，初始匿名框的颜色继承自P，而背景是透明的。

空格内容会根据 'white-space' 属性被压缩，不会创建任何匿名行内框。

匿名行内框和匿名块框可以被统称为匿名框。

在格式化 table 时，会形成更多的匿名框。

###插入框（run-in box）

插入框的表现如下：

1. 如果插入框包含一个块框，那么插入框会成为一个块框；
2. 如果一个块框（不是浮动，也不是绝对定位）跟随在一个插入的控制框之后，则该插入框成为该块框的第一个行内框。
3. 否则，该插入框成为一个块框。

```html
<H3 style="display:run-in">A run-in heading.</H3>
<P>And a paragraph of text that follows it.
```

若浏览器支持run-in，则显示如下：

**A run-in heading.** And a paragraph of text that follows it.

尽管，从视觉看，它成为后面块框的一部分，插入元素的属性仍然继承自源树中它的父元素。

###display 属性

display可取值：

inline | block | list-item | run-in | compact | marker |table | inline-table | table-row-group | table-header-group |table-footer-group | table-row | table-column-group | table-column |table-cell | table-caption | none | inherit|

display  | 样式
------------- | -------------
block  | 该值使一个元素生成一个块框。
inline-block  | 该值使一个元素生成一个块框，自身在文档流中像一个行内元素，跟替换元素相似。元素的内部按照块框格式化，自身按照一个行内替换元素格式化。
inline | 该值使一个元素生成一个或多个行内框。
list-item | 该值使一个元素（如HTML中的LI）生成一个原始块框和一个列表项行内框。
none | 该值使一个元素在格式化结构中不显示（换言之，该元素对布局没有影响）。子孙元素也不产生任何框；该行为不能由设置子孙元素的 'display' 属性而被覆盖。请注意 'none' 的显示特性并不生成一个不可见的框；它根本不生成框。CSS包含了机制使一个元素能够在格式化结构中生成框而影响格式化，但本身不可见( visible 特性)。
run-in | 根据上下文，这些值要么生成块框，要么生成行内框。


##定位体系（Positioning schemes）

CSS2.1中，一个框(box，就是元素形成的方块等)可以根据三种定位体系布局。

1. 常规流(Normal flow)
    
    包括块框的块格式化（block formatting），行级框的行格式化（inline formatting），块框与行框的相对定位。

2. 浮动(Floats)

    在浮动模型中，一个框(box)首先根据常规流布局，再将它从流中取出并尽可能地向左或向右偏移。内容可以沿浮动区的侧面排列。

3. 绝对定位(Absolute positioning)

    在绝对定位模型中，一个框(box)整个地从常规流向中脱离（它对后续的兄弟元素没有影响），并根据它的包含块来分配其位置。

>An element is called out of flow if it is floated, absolutely positioned, or is the root element. An element is called in-flow if it is not out-of-flow. The flow of an element A is the set consisting of A and all in-flow elements whose nearest out-of-flow ancestor is A.

元素如果浮动、绝对定位或者是根元素，那么它被称为out-of-flow; 元素如果不是out-of-flow，那么它就是in-flow。

###选择定位方案："position"属性

position 取值 | 含义
------------- | --------------
static | 该框(box)是一个常规框，布局根据常规流，'left' 、’right’、’bottom’和 'top'属性不适用。如果 ‘position’没有设置，默认值也是’static’。
relative | 框的位置根据常规流计算（被称为常规流中的位置）。然后框相对于它的常规位置而偏移。如果框 B 是相对定位的，其后框的定位计算并不考虑B的偏移。 table-row-group, table-header-group, table-footer-group, table-row, table-column-group, table-column, table-cell, 和 table-caption 元素的'position:relative' 效果没有被定义。
absolute | 框的位置（可能还有它的尺寸）是由'left'，'right'，'top'和'bottom'特性决定。这些特性指定了框相对于它包含块的偏移量。绝对定位的框从常规流向中脱离。这意味着它们对其后的兄弟元素的定位没有影响。另外，尽管绝对定位框有外边距(margin)，它们不会和其它任何 margin 发生折叠（Collapsing margins）。
fixed | 框位置的计算根据'absolute'模型，不过框要额外地根据一些参考而得到固定。跟绝对定位一样，fixed定位元素的margin不会和任何其他margin发生margin折叠。应用于手持终端、投影设备、屏幕、TTY、电视媒体类型时，框相对于 viewport 固定，滚动时不移动。应用于打印媒介类型时，框被渲染于每一页，并相对于页框固定，就好象是通过viewport查看该页一样（例如，打印预览）。对于其他的媒介类型，表现没有被定义。

对根元素的 position，用户端(UA)可以视为“static”。

###框偏移: 'top'，'right'，'bottom'，'left'

如果一个元素的'position'特性值不是'static'，该元素被称为定位元素。定位的元素生成定位框，其定位基于四个特性：'top'，'right'，'bottom'，'left'。

关键词 | 描述
----- | ------
值： | 这四个特性的值可以是：`<length> | <percentage> | auto | inherit` 之一。
初始值： | ‘auto’
适用于： | 定位的元素，即 position特性的值为非 ‘static’的值。
可否继承： | 否
百分比值： | 百分比值基于包含块的高度(top, bottom)或者宽度(left, right)
计算值：| 对于position:relative 参见相对定位(后续会介绍)；对于position:static 取值auto；其他情况，如果值为长度，取相应的绝对长度，如果标值为百分比，取指定的值，否则，取auto。
定位作用的具体位置： | 对于绝对定位元素(absolutely positioned)的框，这四个特性的值表示，元素的外边界(margin边界)相对于 包含块 的边界的位移。而对于相对定位元素(relatively positioned)的框，偏移量相对于它自己的相应的边界。比如，top是相对于它的顶边界，right相对于右边界。

4个值有以下含义：

*   length: 偏移量是距离参照边的固定值。
*   percentage: 偏移量是包含块宽度（对于'left'和'right'）或高度（对于'top' 和'bottom'）的百分比。对于'top'和'bottom'，如果包含块的高度没有显式指定（即它取决于内容的高度），百分比值将解释为'auto'。
*   auto: 该值的效果取决于与之相关的属性中的哪一个也设置了'auto'。


##常规流（Normal flow）

在常规流中的框（boxes，元素形成的矩形区域），都属于一个格式化的上下文中，可能是块的，也可能是行内的，但不可能同时是行内的又是块的。块框参与块格式化上下文。行内框参与行内格式化上下文。

###块格式化上下文(Block formatting contexts)

浮动元素，绝对定位元素，inline-blocks，table-cells，table-captions，以及 'overflow'不是 'visible'的元素，会创建新的block formatting context。


















##Containing blocks详细

上面说道，一个元素box的定位和尺寸，有时候会跟某一矩形框有关，这个矩形框，就被称作元素的包含块。而元素会为它的子孙元素创建包含块，那么，是不是说，元素的包含块就是它的父元素呢？答案是否定的，这是一个误区。也正因为如此，才会专门来说明它。

**一个元素包含块的确定，跟元素自身和它的祖先元素的样式等有关系。**

###根元素的包含块

根元素，就是处于文档树最顶端的元素，它没有父节点。

根元素存在的包含块，被叫做初始包含块 (initial containing block)。具体，跟用户端有关。

*  在(X)HTML中，根元素是html元素（尽管有的浏览器会不正确地使用body元素）。
*  初始包含块的direction属性与根元素相同。

###"static"和"relative"定位的元素

对于其它元素：如果该元素的定位（position）为 "relative" （相对定位）或者 "static"（静态定位），它的包含块由它最近的块级、单元格（table cell）或者行内块（inline-block）祖先元素的box创建。

元素如果未声明"position"特性 ，那么就会采用"position"的默认值 ”static”。所以，一般元素都是静态定位的。

###"position:fixed" 定位的元素

如果元素是固定定位 ("position:fixed") 元素，那么它的包含块是当前可视窗口。

###"position: absolute" 定位的元素

如果元素是绝对定位（"position: absolute"）元素，包含块由离它最近的position属性为 "absolute"、"relative" 或者 "fixed" 的祖先元素创建。

...

...

...

