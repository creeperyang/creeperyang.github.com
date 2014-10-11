---
layout: article
comments: true
title: AngularJs Forms（格式化输入）
category: frontend
tags: [AngularJs, form]
---

表单控件（`input`、`select`、`textarea`）是用户输入数据的途径。一个表单（form）是表单控件的集合，用来组织相关的表单控件。

表单和表单控件提供验证服务，所以无效输入时会提示用户。这会提高用户体验，因为用户可以获得连续的提示来改正错误。但注意，客户端的验证不能代替服务端验证，因为客户端验证容易被绕过而不太可信，必须在服务端再次验证以保证安全。

<!--view-break-->

##简单表单（Simple form）

理解双向数据绑定的核心指令是`ngModel`。

<iframe width="100%" height="300" src="http://jsfiddle.net/creeper/4p3cczm2/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

注意`novalidate`用来禁用浏览器原生的表单验证。