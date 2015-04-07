---
layout: article
comments: true
title: JavaScript Event Loop and Timer
category: [frontend, JavaScript]
tags: [event loop, timer, setTimeout, setInterval]
---

先看一道阿里面试题（来自[阿里2015春季前端实习校招笔试题](http://www.w3cfuns.com/blog-5448978-5404954.html)）:

<!--view-break-->

---

对于下列程序运行结果，符合预期的是：

```javascript
function f1 () {
    console.time('time span');
}
function f2 () {
    console.timeEnd('time span');
}
setTimeout (f1, 100);
setTimeout (f2, 200);

function waitForMs(n) {
    var now = Date.now();
    while (Date.now() - now < n) {}
}
waitForMs(500);
```

- A. time span :700.077ms
- B. time span :0.066ms
- C. time span :500.077ms
- D. time span :100.077ms

---

答案是B，但为什么？

##Concurrency model and Event Loop

要理解定时器内部怎么工作的，首先要明白：**JavaScript是单线程的。**

###JavaScript is single-threaded




###定时器相关API

- `var id = setTimeout(fn, delay);`开始一个定时器，在`delay`延迟后调用`fn`。方法返回一个唯一 ID ，可以在之后用这个 ID 取消定时器。
- `var id = setInterval(fn, delay);`类似`setTimeout`，但会持续调用`fn`（每次都延迟`delay`），除非定时器被取消。
- `clearInterval(id);, clearTimeout(id);`传入定时器 ID ，取消定时器。

###浏览器中JavaScript是怎么工作的？

为了理解定时器内部是怎么工作的，必须引入这样一个概念：**定时器的延迟不保证是精准的。**因为浏览器中js是在单线程上执行的，异步事件（如鼠标事件，定时器等等）仅仅在有

---

参考：

- [MDN: Concurrency model and Event Loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop)
- [Events and timing in-depth](http://javascript.info/tutorial/events-and-timing-depth#asynchronous-events)
- [How JavaScript Timers Work](http://ejohn.org/blog/how-javascript-timers-work/)

---

