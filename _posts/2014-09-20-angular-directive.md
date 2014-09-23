---
layout: article
comments: true
title: AngularJs内置指令
category: frontend
tags: [AngularJs, directive]
---

指令是使angular特殊的基础。指令是angular这个框架最重要的部分之一。

>At a high level, directives are markers on a DOM element (such as an attribute, element name, comment or CSS class) that tell AngularJS's HTML compiler ($compile) to attach a specified behavior to that DOM element or even transform the DOM element and its children.

<!--view-break-->

angular内置许多指令，这章主要是介绍这些指令的含义及用法。

###样式相关指令

既然模板就是普通的HTML，那首先看看常用的样式控制指令。

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
$scope.change = function($event){
     alert($event.target);
     //……………………
}
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
