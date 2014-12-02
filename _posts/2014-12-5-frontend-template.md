---
layout: article
comments: true
title: 前端模板分析（一）
category: frontend
tags: [template, frontend template, 模板]
---

以一段简单的代码开始：

```html
<ul id='wrap'></ul>
<script type="text/javascript">
    $.ajax({
        'url': '/sample',
        'dataType': 'json'
    }).done(function(data) {
        var list = data && data.list, // will be like ['文艺', '博客', '摄影', '电影', '民谣', '旅行', '吉他']
            tmp = '',
            i, 
            len = list.length;
        for(i = 0; i < len; i++) {
            tmp += '<li> index: ' + (i + 1) + ', content: ' + list[i] + '</li>';
        }
        $('#wrap').append(tmp);
    });
</script>
```

每个前端程序员可能都写过，或这少熟悉类似上面的代码——根据数据拼接字符串，修改文档DOM。每当出现一大坨这种代码时，相信每个人都会忍不住吐嘈：逻辑和视图杂糅，代码难以阅读和维护...

如何避免写这种代码——模板，就是本章的核心。虽然本人一年多的前端之路不算长，但从苦逼的拼接字符串，到因为`Backbone`认识`underscore template`，到学习`angular`而被双向绑定惊叹，对模板的认识也在不断加深。期间因为工作原因学习过`thinkphp模板`、`django模板`、`express的ejs`的各种后端模板，应该说也算见多识广。从这一章开始，我打算用2～3篇文章分析前端模板，本章作为第一篇，专注于字符串模板;之后的一两篇会讲以DOM为基础的模板和两者的混合版。

<!--view-break-->

###字符串模板原理

如果网上搜一搜，前端模板引擎还真不少，尤其在node出现之后，不少js模板引擎更是横跨前后端。但虽然每个引擎的语法、解析方式、字符串拼接的实现各有不同，但关键的渲染原理仍然是**动态执行javascript字符串**。

