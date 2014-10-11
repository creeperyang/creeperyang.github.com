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

理解双向数据绑定的核心指令是`ngModel`。`ngModel`提供了[API](https://docs.angularjs.org/api/ng/type/ngModel.NgModelController)让其它指令扩展它的行为。下面是一个简单表单：

<iframe width="100%" height="220" src="http://jsfiddle.net/creeper/4p3cczm2/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

注意`novalidate`用来禁用浏览器原生的表单验证。

##使用CSS类

为了能改变控件和表单的样式，`ngModel`会添加以下CSS类：

- `ng-valid`
- `ng-invalid`
- `ng-pristine`
- `ng-dirty`
- `ng-touched`
- `ng-untouched`

对上面的例子做些改变：依据`ngModel`添加的css类来改变表单的样式。

<iframe width="100%" height="220" src="http://jsfiddle.net/creeper/4p3cczm2/1/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

##Binding to form and control state

A form is an instance of [FormController](https://docs.angularjs.org/api/ng/type/form.FormController). The form instance can optionally be published into the scope using the `name` attribute.

相似的，一个有`ngModel`指令的input控件持有一个`NgModelController`实例。同样，有`name`属性时，Such a control instance can be published as a property of the form instance。

这意味着，表单、控件的内部状态is available for binding in the view using the standard binding primitives.

这允许我们扩展上面的例子，有以下新特性：

- reset按钮只有在表单有变动时可用;
- save按钮只有在表单有变动且输入有效时可用;
- 自定义`user.email`和`user.agree`的错误信息。

<iframe width="100%" height="300" src="http://jsfiddle.net/creeper/4p3cczm2/2/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

注意`name="form"`之类name的添加，然后表达式中可以访问。

##Custom triggers

默认情况下，内容的改变都会触发模型的更新和表单验证。但你可以通过`ngModelOptions`来覆写这种行为。

- 比如`ng-model-options="{ updateOn: 'blur' }"`，则只在`blur`时更新和验证。
- 当然，你可以指定多个事件`ng-model-options="{ updateOn: 'mousedown blur' }"`。
- 如果你希望保留原来的事件，添加新事件，用default，`ng-model-options="{ updateOn: 'default blur' }"`。

```html
<div ng-controller="ExampleController">
  <form>
    Name:
    <input type="text" ng-model="user.name" ng-model-options="{ updateOn: 'blur' }" /><br />
    Other data:
    <input type="text" ng-model="user.data" /><br />
  </form>
  <pre>username = "{{user.name}}"</pre>
  <pre>userdata = "{{user.data}}"</pre>
</div>
<script type="text/javascript">
  angular.module('customTriggerExample', [])
  .controller('ExampleController', ['$scope', function($scope) {
    $scope.user = {};
  }]);
</script>
```

##Non-immediate (debounced) model updates

你可以通过在`ngModelOptions`内添加`debounce`来延迟模型的更新和验证。这种延迟同样会应用到parsers、validators和模型标志如`$dirty`、`$pristine`。

- `ng-model-options="{ debounce: 500 }"`会在最后一次内容更改后延迟500ms，然后触发模型更新和验证。
- 如果设置了Custom triggers，debounce可以对每个事件分别设置。这很有用，比如说`blur`可以立即更新。`ng-model-options="{ updateOn: 'default blur', debounce: { default: 500, blur: 0 } }"`。

*如果这些属性被加到元素上了，它们会应用到所有子元素和控件，除非子元素和控件被覆写了。*

```html
<div ng-controller="ExampleController">
  <form>
    Name:
    <input type="text" ng-model="user.name" ng-model-options="{ debounce: 250 }" /><br />
  </form>
  <pre>username = "{{user.name}}"</pre>
</div>
<script type="text/javascript">
  angular.module('debounceExample', [])
  .controller('ExampleController', ['$scope', function($scope) {
    $scope.user = {};
  }]);
</script>
```

##Custom Validation

angular提供了大多数html5`input`类型（text, number, url, email, radio, checkbox）的基本实现，以及一些验证指令（`required`, `pattern`, `minlength`, `maxlength`, `min`, `max`）。

<iframe width="100%" height="300" src="http://jsfiddle.net/creeper/obuoms0u/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>