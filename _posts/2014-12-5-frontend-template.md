---
layout: article
comments: true
title: 前端模板分析（一）
category: frontend
tags: [template, string-based template, 模板]
---

以一段简单的代码开始：

```javascript
    $.ajax({/*...*/}).done(function(data) {
        var list = data.list, // will be like ['文艺', '博客', '摄影', '电影', '民谣', '旅行', '吉他']
            tmp = '',
            i, 
            len = list.length;
        for(i = 0; i < len; i++) {
            tmp += '<li> index: ' + (i + 1) + ', content: ' + list[i] + '</li>';
        }
        $('#wrap').append(tmp);
    });
```

这段代码就是实现*根据数据拼接字符串，修改文档DOM*的功能，很简单，大概每个前端程序员都写过，或至少感到熟悉。

<!--view-break-->

但当这种代码大片大片出现时，由于逻辑和视图杂糅，拼接字符串天然就让代码难以阅读和维护。如何避免写这种代码，或者说一种解决方案——模板，就是本章的核心。

从苦逼的拼接字符串，到因为`Backbone`认识`underscore template`，到学习`angular`而被双向绑定惊叹，再到了解`React`等新技术，我对模板的认识也在不断加深。而且近来因为工作原因，从`thinkphp模板`到`django模板`的各种后端模板，应该说也算熟练使用。

从这一章开始，我打算用2～3篇文章分析前端模板，本章作为第一篇，专注于字符串模板;之后的一两篇会讲以DOM为基础的模板和两者的混合版。


###字符串模板原理

如果网上搜一搜，前端模板引擎真不少，尤其在node出现之后，不少js模板引擎更是横跨前后端。虽然每个引擎的语法、解析方式、字符串拼接的实现可能各有不同，但关键的渲染原理仍然是**动态执行javascript字符串**。

####模板使用和模板特征

首先假设有这样一段模板使用示例（以underscore为例）：

```html
<div id='container'></div>
<script type="text/template" id="tpl">
    <% _.each(games, function(game) { %>
        <li class="item-vertical">
            <a href='/games/?uuid=<%= game.id %>'> <%- game.name %> </a>
        </li>
    <% });%>
</script>
<script type="text/javascript">
    var compiled = _.template($('#tpl').html());
    $('#container').html(compiled(data));
</script>
```

可以看出，相比原始的字符串拼接，模板在可读性、可维护性和易用性上有极大提升。

前端模板引擎的3个特征：

1. 前端模板一般有3种标签，分别是
    - js代码执行标签（evaluate tag），标签内可以执行任意js代码，如`<% _.each(games, function(game) { %>`;
    - 插值标签（interpolate tag），输出变量的对应值，如`<%= game.id %>`；
    - 转义标签（escape tag），输出变量前先转义，如`<%- game.name %>`。注意：部分模板引擎可能省略这个标签。

2. 模板一般可以写在`script`标签里，但注意改写type为`text/template`之类的。当然，用ajax加载等其它方法也可以，模板只是含有模板标签的字符串而已。

3. 模板引擎的接口基本一致： `template(tpl, data, options)`。如果模板和数据都传入，返回渲染好的html字符串;如果只传了模板，则返回一个模板函数，该函数接收data返回字符串。


####以unserscore模板为例分析模板实现

废话不多说，以常用的unserscore内置模板讲解字符串模板的实现原理。

```javascript
// 3种标签，可配置更改
_.templateSettings = { // 注意`？`——非贪婪匹配
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
    escape: /<%-([\s\S]+?)%>/g
};

var noMatch = /(.)^/; // 什么都不匹配

// 需要转义的字符，转义后才能放入字符串中
var escapes = {
    "'": "'",
    '\\': '\\',
    '\r': 'r',
    '\n': 'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
};
var escaper = /\\|'|\r|\n|\u2028|\u2029/g;
var escapeChar = function(match) {
    return '\\' + escapes[match];
};

// Underscore模板可以处理任意分隔符，保留空白，正确处理转义（在转义标签内）
_.template = function(text, settings, oldSettings) {
    // oldSettings只是为了兼容之前版本
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // 组合分隔符为一个正则，分隔符是可选的
    var matcher = RegExp([
        (settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // 编译模板字符串, 正确转义字符
    var index = 0; // 配合offset来slice出3种标签之外的字符串
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
        // offset是匹配到的子串的start index，所以下面一行是把匹配子串之前的子串转义并加入source
        source += text.slice(index, offset).replace(escaper, escapeChar);
        index = offset + match.length;
        // 3种标签内的内容不同处理
        if (escape) { // 是转义，则把变量的值转义后加到source
            source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
        } else if (interpolate) { // 插值，则把变量的值直接加到source
            source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
        } else if (evaluate) { // 是js代码，则原样添加到source
            source += "';\n" + evaluate + "\n__p+='";
        }
        return match;// Adobe VMs必须返回match来正确生成offset
    });
    source += "';\n";

    // 如果settings.variable没有指定，那么用with来限制data到本地作用域
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';
    // 完整的source
    // print函数可以用来代替`=`： <%= a %> --> <% print(a) %>
    source = "var __t,__p='',__j=Array.prototype.join," +
        "print=function(){__p+=__j.call(arguments,'');};\n" +
        source + 'return __p;\n';

    try { // 构造编译函数，此处为模板引擎核心：
        // 通过构造Function来动态执行js字符串
        var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
        e.source = source;
        throw e;
    }

    var template = function(data) { // 编译好的模板函数，调用只需传入数据即可
        return render.call(this, data, _); // 此处传入unserscore(_)作为参数，所以模板中可以使用unsercore的各种工具函数
    };

    // 把编译好的源码暴露到template.source，外部可以查看
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
};

var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
};
// 用来转义/逆转义
var createEscaper = function(map) {
    var escaper = function(match) {
        return map[match];
    };
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
        string = string == null ? '' : '' + string;
        return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
};
_.escape = createEscaper(escapeMap);
```

以上是[underscore.js 1.7.0](http://underscorejs.org/underscore.js)的前端模板相关代码。

通过上面的源码以及注释可以看出，模板引擎实现很简单，就是分析处理模板，然后构造一个函数动态执行js字符串。下面罗列几个需要注意的点：

- 模板分析的正则：（1）非贪婪匹配，（2）全局匹配`/g`，（3）组合正则时添加`|$`。结合这3点，replace时就可以正确处理模板。其中非贪婪匹配保证每个标签是逐一处理（匹配`<%str%>`而不是`<%str%><%str%>`）;全局则是让匹配进行到底，处理完整个模板;`|$`保证模板一定被匹配，从而保证非标签内的字符串都被转义了。
- `with`的使用。`with`在JavaScript中算是臭名昭著，但前端模板应该是普遍使用了`with`，这里必然是有原因的。这里先不说，后面会专门一个小节来讲。

###高效的字符串模板引擎

知道了字符串模板引擎是怎么回事后，我们更近一步，来谈谈众多前端模板引擎的性能比较，并谈谈高效的原因。

*注意：这里的模板引擎仅仅指基于字符串的模板引擎，像angular之类的并不包括在内。公平而言，基于DOM的模板引擎（angular等）编译模板时会进行双向绑定，干的事远比字符串模板更多、更复杂，与字符串模板放在一起比较不合适。*

参考`artTemplate`项目的测试<http://aui.github.io/artTemplate/test/test-speed.html>

![speed-test](http://creeper-static.qiniudn.com/stc-tpl-speed-test.png)

从图中可以看出，`artTemplate`的速度在主流的几款前端模板中，速度突出。那么，比较上面分析的`unsercore template`来看看`artTemplate`做了哪些特殊处理/优化。

####artTemplate模板引擎实现分析

去除一些细枝末节，直接分析artTemplate的核心实现。

```javascript
function compiler(source, options) {
    var debug = options.debug;
    var openTag = options.openTag;
    var closeTag = options.closeTag;
    var parser = options.parser;
    var compress = options.compress;
    var escape = options.escape; // 以上为配置项

    var line = 1; // 记录行号
    var uniq = { // flag，用来标志该变量是否在函数（最终构造的模板函数）顶部已声明
        $data: 1,
        $filename: 1,
        $utils: 1,
        $helpers: 1,
        $out: 1,
        $line: 1
    };

    // 通过是否有 ''.trim 方法来判断ie6-8还是现代浏览器
    var isNewEngine = ''.trim; // '__proto__' in {}

    // 按是否是现代浏览器准备了2套处理方式
    var replaces = isNewEngine
    ? ["$out='';", "$out+=", ";", "$out"]
    : ["$out=[];", "$out.push(", ");", "$out.join('')"];

    var concat = isNewEngine
        ? "$out+=text;return $out;"
        : "$out.push(text);";
    
    // 工具函数：print函数、include函数
    var print = "function(){"
    +      "var text=''.concat.apply('',arguments);"
    +       concat
    +  "}";

    var include = "function(filename,data){"
    +      "data=data||$data;"
    +      "var text=$utils.$include(filename,data,$filename);"
    +       concat
    +   "}";

    // 准备工作：初始化headerCode、mainCode、footerCode
    var headerCode = "'use strict';"
    + "var $utils=this,$helpers=$utils.$helpers,"
    + (debug ? "$line=0," : "");
    var mainCode = replaces[0];
    var footerCode = "return new String(" + replaces[3] + ");"

    // 核心：html与逻辑语法分别处理
    // 首先通过openTag split成数组A; A中的元素要么是纯html字符串，要么含有closeTag
    forEach(source.split(openTag), function(code) {
        code = code.split(closeTag); // 尝试用closeTag切分A中的每个元素
        var $0 = code[0];
        var $1 = code[1];
        if (code.length === 1) { // 说明该code是纯html字符串，$1为空
            mainCode += html($0);
        } else { // 此时$0是标签之间的逻辑代码，$1是纯html字符串
            mainCode += logic($0);
            if ($1) {
                mainCode += html($1);
            }
        }
    });
    // 模板分析处理完毕，组合成new Function所需的source
    var code = headerCode + mainCode + footerCode;
    // 调试语句
    if (debug) {
        code = "try{" + code + "}catch(e){" + "throw {" + "filename:$filename," + "name:'Render Error'," + "message:e.message," + "line:$line," + "source:" + stringify(source) + ".split(/\\n/)[$line-1].replace(/^\\s+/,'')" + "};" + "}";
    }
    try { // 新建函数，source就是code。
        var Render = new Function("$data", "$filename", code);
        Render.prototype = utils; // 这个很有意思，通过原型（因为utils = template.utils），让函数内部（也就是模板中）可以使用模板自带的/自己扩展的各种工具函数
        return Render;
    } catch (e) {
        e.temp = "function anonymous($data,$filename) {" + code + "}";
        throw e;
    }
    // 处理 HTML 语句
    function html(code) {
        line += code.split(/\n/).length - 1; // 记录行号
        if (compress) { // 压缩多余空白与注释
            code = code.replace(/\s+/g, ' ').replace(/<!--[\w\W]*?-->/g, '');
        }
        if (code) { // $out+= 转义后的code ; 或者 $out.push(转义后的code);
            code = replaces[1] + stringify(code) + replaces[2] + "\n";
        }
        return code;
    }
    // 处理逻辑语句
    function logic(code) {
        var thisLine = line;
        if (parser) {
            code = parser(code, options);// artTemplate的语法转换插件钩子，如果原生语法用不到，当然，也可以自己挂进来另一套语法处理规则。
        } else if (debug) {
            code = code.replace(/\n/g, function() { // 记录行号
                line++;
                return "$line=" + line + ";";
            });
        }
        // 输出语句. 编码: <%=value%> 不编码:<%=#value%>
        // <%=#value%> 等同 v2.0.3 之前的 <%==value%>
        if (code.indexOf('=') === 0) {
            var escapeSyntax = escape && !/^=[=#]/.test(code); // escape为true，且标签不是 不编码输出 标签
            code = code.replace(/^=[=#]?|[\s;]*$/g, '');
            if (escapeSyntax) { // 需要对内容编码
                var name = code.replace(/\s*\([^\)]+\)/, '');
                // 排除 utils.* | include | print
                if (!utils[name] && !/^(include|print)$/.test(name)) {
                    code = "$escape(" + code + ")";
                }
            } else { // 不编码
                code = "$string(" + code + ")";
            } 
            // code = $out+= "$escape/string(" + code + ")" ;
            code = replaces[1] + code + replaces[2];
        }
        if (debug) {
            code = "$line=" + thisLine + ";" + code;
        }
        // 提取模板中的变量名
        forEach(getVariable(code), function(name) {
            // name 值可能为空，在安卓低版本浏览器下
            if (!name || uniq[name]) { // 该name已经在变量声明中声明，直接返回
                return;
            }
            var value; // 声明模板变量
            // 赋值优先级: [include, print] > utils > helpers > data
            if (name === 'print') {
                value = print;
            } else if (name === 'include') {
                value = include;
            } else if (utils[name]) { // $escape, $string在这一步处理
                value = "$utils." + name;
            } else if (helpers[name]) {
                value = "$helpers." + name;
            } else {
                value = "$data." + name;
            }
            // 在开头中添加变量声明
            headerCode += name + "=" + value + ",";
            uniq[name] = true; // flag设为true
        });
        // 可以看到，artTemplate只对输出标签做了处理，js代码标签原样输出
        return code + "\n"; // 返回code，code加换行
    }
};
```

artTemplate的工具函数分析：

```javascript
// 字符串转义 ---> 处理html时使用
function stringify (code) {
    return "'" + code
    .replace(/('|\\)/g, '\\$1') // 单引号与反斜杠转义
    .replace(/\r/g, '\\r') // 换行符转义(windows + linux)
    .replace(/\n/g, '\\n') + "'";
}
// 内置的一些工具函数，可以扩展
var utils = template.utils = {
    $helpers: {},
    $include: renderFile,
    $string: toString,
    $escape: escapeHTML,
    $each: each
};
var toString = function (value, type) {
    if (typeof value !== 'string') { // 如果不是字符串
        type = typeof value;
        if (type === 'number') { // 数字则转字符串
            value += '';
        } else if (type === 'function') { // 是函数则取执行结果
            value = toString(value.call(value));
        } else { // 其它返回空字符串
            value = '';
        }
    }
    return value;
};


var escapeMap = {
    "<": "&#60;",
    ">": "&#62;",
    '"': "&#34;",
    "'": "&#39;",
    "&": "&#38;"
};


var escapeFn = function (s) {
    return escapeMap[s];
};

var escapeHTML = function (content) {
    return toString(content)
    .replace(/&(?![\w#]+;)|[<>"']/g, escapeFn);
};


var isArray = Array.isArray || function (obj) {
    return ({}).toString.call(obj) === '[object Array]';
};


var each = function (data, callback) {
    var i, len;        
    if (isArray(data)) {
        for (i = 0, len = data.length; i < len; i++) {
            callback.call(data, data[i], i, data);
        }
    } else {
        for (i in data) {
            callback.call(data, data[i], i);
        }
    }
};
```