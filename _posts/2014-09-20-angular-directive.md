---
layout: article
comments: true
title: AngularJs内置指令
category: frontend
tags: [AngularJs, directive]
---

指令是使angular特殊的基础。指令是angular这个框架最重要的部分之一。

指令是什么？

>At a high level, directives are markers on a DOM element (such as an attribute, element name, comment or CSS class) that tell AngularJS's HTML compiler ($compile) to attach a specified behavior to that DOM element or even transform the DOM element and its children.

<!--view-break-->

翻译一下，指令就是DOM元素上的标记，可以是属性、类、注释甚至元素本身。指令告诉angular的html编译器为该DOM元素附加特定行为，甚至转换该DOM元素及其后代。

##内置指令

angular内置许多指令，先介绍这些指令的含义及用法。

###样式相关指令

1.  ngClass
    
    ng-class用来给元素绑定类名，其表达式的返回值可以是以下三种：- 类名字符串，可以用空格分割多个类名，如"redtext boldtext"；- 类名数组，数组中的每一项都会层叠起来生效；- 一个名值对应的object，其键值为类名，值为boolean类型，当值为true时，该类会被加在元素上。
    
    例子：

    <iframe width="100%" height="300" src="http://jsfiddle.net/creeper/0cn2mzwz/1/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

2.  ngStyle
 
    ng-style用来绑定元素的css样式，其表达式的返回值为一个js对象，键为css样式名，值为该样式对应的合法取值。用法比较简单：
 
    例子：

    ```html
    <div ng-style="{color:'red'}">ng-style测试</div>
    <div ng-style="style">ng-style测试</div>
    $scope.style = {color:'red'};
    ```

3.  ngShow/ngHide

    控制显隐。表达式返回值应该是boolean。

###表单控件功能相关的

* ng-checked控制radio和checkbox的选中状态
* ng-selected控制下拉框的选中状态
* ng-disabled控制失效状态
* ng-multiple控制多选
* ng-readonly控制只读状态

以上指令的取值均为boolean类型，当值为true时相关状态生效，道理比较简单就不多做解释。
 
**注意：** 上面的这些只是单向绑定，即只是从数据到模板，不能反作用于数据。要双向绑定，还是要使用 ng-model 。

###事件绑定相关
 
`ng-change``ng-dblclick``ng-mousedown``ng-mouseenter``ng-mouseleave``ng-mousemove``ng-mouseover``ng-mouseup``ng-submit`
 
事件绑定指令的取值为函数，并且需要加上括号，例如：

```html
<select ng-change="change($event)"></select>
<script type="text/javascript">
    $scope.change = function($event){
        alert($event.target);
        //do something
    }
</script>
```
 
###特殊的ng-src和ng-href
 
我们使用ng-src指令，这样在路径被正确得到之前就不会显示找不到图片。同理，`<a>`标签的href属性也需要换成ng-href，这样页面上就不会先出现一个地址错误的链接。
 
ng中有一个与{{}}等同的指令:ng-bind，同样用于单向绑定，在页面刚加载的时候就不会显示出对用户无用的数据。

###控制相关的指令

如ngRepeat循环输出
    
```html
<li ng-repeat="o in question.options">
    <b>{{$index+1}}.</b>
    <input type="text" ng-model="o.content" value="o.content" />
    <a href="javascript:void(0);" ng-click="delOption($index)">删除</a>
</li>
```

##Matching Directives（匹配指令）

上面都是常用的内置指令，通过一些代码，对指令的使用应该有了基本了解，这里讲一讲指令的匹配，即编译器怎么决定/找到正确的指令。

```html
<input ng-model="foo">
<input data-ng:model="foo">
```

上面两个都匹配`ngModel`指令。

angular标准化（**normalize**）元素的标签和属性名来检测匹配哪个指令。

我们一般通过大小写敏感的驼峰式(*camelCase*)的标准化的名字去指代指令(如`ngModel`)，但html是不区分大小写的，于是，我们一般用小写的，破折线分离（* dash-delimited *）的属性名去指代指令（如`ng-model`）。

标准化处理如下：

1. 去除元素/属性前的`x-`和`data-`;
2. 把`:`，`-`或`_`分离的名字转换成驼峰式。

如下面的例子都匹配`ngBind`：

```html
<div ng-controller="Controller">
  Hello <input ng-model='name'> <hr/>
  <span ng-bind="name"></span> <br/>
  <span ng:bind="name"></span> <br/>
  <span ng_bind="name"></span> <br/>
  <span data-ng-bind="name"></span> <br/>
  <span x-ng-bind="name"></span> <br/>
</div>
```

**注意：**

- 最好用破折线分离的形式，如`ng-bind`，如果你想用html验证工具，也可以用`data-ng-bind`。其它形式都是历史遗留（问题）。
- 最好用标签名或者属性名，折会使angular更容易检测指令。

###Text and attribute bindings

在编译期间，编译器用`$interpolate`服务去检测文本和属性是否内嵌表达式。这些表达式会被注册为`watches`，并作为正常digest循环的一部分。

一个例子：`<a ng-href="img/{{username}}.jpg">Hello {{username}}!</a>`。

###`ngAttr` attribute bindings

浏览器有时会比较挑剔，对属性的值是否有效进行验证。

```html
<svg>
    <circle cx="{{cx}}"></circle>
</svg>
```

因为` SVG DOM API `的限制，有时会出行错误`Error: Invalid value for attribute cx="{{cx}}"`。

这时，你可以使用`ng-attr-cx`修复这种错误。
