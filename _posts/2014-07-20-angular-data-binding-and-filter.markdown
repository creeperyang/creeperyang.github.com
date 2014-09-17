---
layout: article
comments: true
title: AngularJs的数据绑定、控制器和过滤器
category: frontend
tags: [AngularJs]
---

不多说，以最简单的数据绑定例子开始。

```html
<body>
   <div ng-app="">
         { {"john" + "lindquist"} }
         <input type="text" ng-model='data.msg' />
         <h1>{ { data.msg } }</h1>
   </div>
   <script type="text/javascript" src="angular.js"></script>
</body>
```

- 属性`ng-app`指定当前元素以及内部的一切都属于这个app;
- 绑定可以用`ng-bind`指令或双大括号来表示，但注意，为了防止liquid误解析，我在大括号之间插入了空格。

-----------


