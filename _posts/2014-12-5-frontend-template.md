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

这段代码就是实现*根据数据拼接字符串，修改文档DOM*的功能，很简单，大概每个前端程序员都写过，或至少感到熟悉。

但当这种代码大片大片出现时，相信每个人都要忍不住吐嘈，逻辑和视图杂糅，代码难以阅读和维护。

如何避免写这种代码，或者说一种解决方案——模板，就是本章的核心。

虽然本人一年多的前端之路不算长，但从苦逼的拼接字符串，到因为`Backbone`认识`underscore template`，到学习`angular`而被双向绑定惊叹，再到了解`React`等新技术，对模板的认识也在不断加深。而且近来因为工作原因，从`thinkphp模板`到`django模板`的各种后端模板，应该说也算熟练使用。

见多了、用多了就有感慨想法。从这一章开始，我打算用2～3篇文章分析前端模板，本章作为第一篇，专注于字符串模板;之后的一两篇会讲以DOM为基础的模板和两者的混合版。

<!--view-break-->

###字符串模板原理

如果网上搜一搜，前端模板引擎真不少，尤其在node出现之后，不少js模板引擎更是横跨前后端。虽然每个引擎的语法、解析方式、字符串拼接的实现可能各有不同，但关键的渲染原理仍然是**动态执行javascript字符串**。

####从unserscore的template讲起

废话不多说，以常用的unserscore内置模板讲解字符串模板的工作原理。

```javascript
$.template = function(text, data, settings) {
        var render;
        settings = $.extend({}, settings, $.templateSettings);

        // 把（3种）可选的分隔符组合成正则
        var matcher = new RegExp([
            (settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source
        ].join('|') + '|$', 'g');

        // 编译模板源码, 转义相应的字符串.
        var index = 0;
        var source = "__p+='";
        text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
            source += text.slice(index, offset)
                .replace(escaper, function(match) {
                    return '\\' + escapes[match];
                });

            if (escape) {
                source += "'+\n((__t=(" + escape + "))==null?'':$.templateUtil.escape(__t))+\n'";
            }
            if (interpolate) {
                source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
            }
            if (evaluate) {
                source += "';\n" + evaluate + "\n__p+='";
            }
            index = offset + match.length;
            return match;
        });
        source += "';\n";

        // 如果settings.variable没有指定, 把data放到本地作用域local scope.
        if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

        source = "var __t,__p='',__j=Array.prototype.join," +
            "print=function(){__p+=__j.call(arguments,'');};\n" +
            source + "return __p;\n";

        try {
            // 核心，构造一个函数，第一个参数obj，就是我们的data; 第二个参数$，就是jQuery
            render = new Function(settings.variable || 'obj', '$', source);
        } catch (e) {
            e.source = source;
            throw e;
        }

        if (data) return render(data, $);
        var template = function(data) {
            return render.call(this, data, $);
        };

        // Provide the compiled function source as a convenience for precompilation.
        template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

        return template;
    };
```