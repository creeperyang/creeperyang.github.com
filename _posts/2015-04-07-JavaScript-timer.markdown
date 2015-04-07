---
layout: article
comments: true
title: JavaScript event loop and timing in-depth
category: [frontend, JavaScript]
tags: [event loop, timer, setTimeout, setInterval]
---

先看一道阿里面试题（来自[阿里2015春季前端实习校招笔试题](http://www.w3cfuns.com/blog-5448978-5404954.html)）:

对于下列程序运行结果，符合预期的是：

<!--view-break-->

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

答案是**B**，但为什么？

##Concurrency model and Event Loop

要理解定时器内部怎么工作的，首先要明白 JavaScript 的**Concurrency model and Event Loop(并发模型和事件回环)**。

JavaScript 有一个基于事件回环的并发模型，这与`C`或`Java`很不同。

###确立几个运行时概念（runtime concepts）

- **Stack**： 栈，函数调用形成帧栈（a stack of frames）。如调用函数A，那么首先第一个包含A的参数和局部变量的frame（frameA）被创建;当A中调用B，包含B的参数和局部变量的frame（frameB）被创建，并push到frameA上面。B`return`后，frameB从栈中pop出来，当A`return`后，栈就是空的了。
- **Heap**： 堆，对象被分配在堆中。
- **Queue**： 每个 JavaScript runtime 都包含一个消息队列（message queue），即一列要处理的消息。每个消息对应（associated）一个函数。当 stack 是空的，队列中的一个消息就被取出并处理。处理包括调用对应的（associated）那个函数（这会创建栈），当栈再次空了之后，这个处理就结束了。

###Event loop

事件回环（event loop）得名于它的实现：

```javascript
while(queue.waitForMessage()){
  queue.processNextMessage();
}
```

`queue.waitForMessage`同步等待一个消息到来，如果当前没有消息的话。

####"Run-to-completion"

每个消息会在任何其它消息被处理前处理完。

这有很多好处，但会有一个副作用：如果一个消息处理要花很长时间，那么这期间浏览器就不会响应用户交互（点击，滚动等等），即浏览器假死。好的方法是让消息处理过程短，并且可能的话把一个消息分割成若干消息。

####Adding messages

在浏览器中，任何时间有事件发生且该事件有监听函数的话，那么一个消息就会被添加。如果没有监听函数，该事件被忽略。

另外，调用`setTimeout`会在第二个参数指定的时间后添加消息到消息队列。如果此时队列中没有其它消息，那么这个消息会立即处理，如果有其它消息，那么`setTimeout`消息就必须等到其它消息处理后才会被处理。所以第二个参数指定的是最小时间，而不是保证的精确时间。

####Several Runtime communicating together

web worker 或者跨域的 iframe 有自己对立的堆、栈还有队列。两个不同的 runtime 只能通过`postMessage`来通信。

##JavaScript is single-threaded

**JavaScript是单线程的。**

这一段重点讲js是单线程的，或者说从单线程角度来理解js的并发和事件回环。正因为js是单线程的，所以js只能通过事件回环来实现并发。

**在浏览器中，每个 window 只有一个js线程。**其它如下载等等都是独立线程的。

既然js是单线程的，那么某段时间js只能执行一段代码，执行这段代码时，会阻塞其它异步事件的处理。这意味着异步事件只能加入消息队列等待处理。

##setTimeout与setInterval

正式来解答开头的题目，一探js定时器的秘密。

当执行`setTimeout/setInterval`时，js引擎会产生一个消息并添加到消息队列。

1. 当是`setTimeout`时，如`setTimeout(fn, delay)`

    js引擎会在delay毫秒后把消息添加到队列。如果消息队列是空的，那么立即处理消息，执行`fn`。而题目中，`waitForMs`会使当前处理过程持续500毫秒，此时两个`setTimeout`消息都被添加到消息队列中了，会顺序执行（时间间隔几乎为0）。

2. 当是`setInterval`时，如`setInterval(fn, delay)`

    `setInterval`在怎么执行异步代码上和`setTimeout`差别很大。假设`fn`执行时间小于`delay`，那么`setTimeout`是可以做到每`delay`执行一次，但如果`fn`执行时间很长，或者当前消息处理时间很长，那么`fn`可能紧贴着执行多次（没有`delay`）或者执行间隔很长。


---

备注：

- 异步事件： JavaScript 中大多数事件是异步的，如鼠标事件。当异步事件发生时，消息被添加到队列。
- 同步事件： 有些事件是同步的，事件处理函数会立即执行，而同步时间发生时，也不会添加消息到队列。同步事件有 DOM mutation 以及嵌套的 DOM 事件。

参考：

- [MDN: Concurrency model and Event Loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop)
- [Events and timing in-depth](http://javascript.info/tutorial/events-and-timing-depth#asynchronous-events)
- [How JavaScript Timers Work](http://ejohn.org/blog/how-javascript-timers-work/)

---

