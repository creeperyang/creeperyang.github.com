(function(global, factory) {
    if (typeof module === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        if (global.jQuery) {
            global.jQuery.fn.module = factory();
        }
    }
})(this, function(undefined) {

    var $window = $(window);
    var $body = $(document.body);
    var config = {
        step: null,
        f: 1
    };

    function SmoothScroll(container, options) {
        var opt = $.extend({}, config, options);
        this.$container = $(container);
        this.timeStamp = new Date().getTime();
        //每次滚动位移
        this.step = opt.step || $window.height();
        //缓动系数
        this.f = opt.f;
        this.upOrDown = "";

        // -----------
        this.animating = false;
        this.stages = this.container.find('.stage');
        this.init();
    }

    SmoothScroll.prototype = {
        constructor: SmoothScroll,
        init: function() {
            var self = this,
                $container = self.$container;

            self.stages.css("height", self.step + 'px');

            $container.on('mousewheel', function(e){
                e.preventDefault();
                e.stopPropagation();
                self.upOrDown = e.wheelDelta > 0 ? "up" : "down";
                if(self.stages.length <=1) {
                    return;
                }
                self.scrollHander();
            });
        },
        scrollHander: function() {
            var self = this, 
                step = self.step * (self.upOrDown == "up" ? -1 : 1),
                scrollTop = $window.scrollTop();
            var tar = scrollTop + step;

            if (tar < $body.height() - 10) {
                if (!$(windowobject).is(":animated")) { //避免多次滚轮造成的多次滚动

                    $(windowobject).animate({
                        "scrollTop": "+=" + step + "px"
                    }, 600, function() {
                        if (self.upOrDown == "up") { //代表转轮往上，文本内容其实是往下
                            crash_bottom(1, scrollTop, 20, 150);
                        } else {
                            crash(0, scrollTop, 20, 150);
                        }
                    });
                }
            }

        }
    };

    function crash_bottom(direction, termin, distant, time) {
        if (!stop) {
            var scrollTop = $(window).scrollTop();
            if (direction == 1) { //向上
                direction = 0;
                $(windowobject).animate({
                    "scrollTop": "+=" + distant + "px"
                }, time, function() {
                    crash_bottom(direction, termin, distant * 0.6, time);
                    if (distant <= 15 || time > 150) {
                        stop = 1; //代表开始停止碰撞

                        $(windowobject).animate({
                            "scrollTop": termin + "px"
                        }, time, function() {
                            //为0代表碰撞结束
                            crollNow = termin;
                            stop = 0;
                            /*setTimeout(function(){
                                setTimeDown();
                            },500);*/
                        });
                    }
                });
            } else if (direction == 0) { //向下
                direction = 1;
                $(windowobject).animate({
                    "scrollTop": termin + "px"
                }, time, function() {
                    crash_bottom(direction, termin, distant * 0.6, time);
                    if (distant <= 15 || time > 150) {
                        stop = 1;
                        $(windowobject).animate({
                            "scrollTop": termin + "px"
                        }, time, function() {
                            crollNow = termin;
                            stop = 0;
                        });
                    }
                });
            }
        }
    }

    function crash(direction, termin, distant, time) {
        if (!stop) {
            var scrollTop = $(window).scrollTop();
            if (direction == 0) { //向下
                direction = 1;
                $(windowobject).animate({
                    "scrollTop": "-=" + distant + "px"
                }, time, function() {
                    crash(direction, termin, distant * 0.6, time);
                    if (distant <= 15 || time > 150) {
                        stop = 1;
                        $(windowobject).animate({
                            "scrollTop": termin + "px"
                        }, time, function() {
                            crollNow = termin;
                            stop = 0;
                        });
                    }
                });
            } else if (direction == 1) { //向上
                direction = 0;
                $(windowobject).animate({
                    "scrollTop": termin + "px"
                }, time, function() {
                    crash(direction, termin, distant * 0.6, time);
                    if (distant <= 15 || time > 150) {
                        stop = 1;
                        $(windowobject).animate({
                            "scrollTop": termin + "px"
                        }, time, function() {
                            crollNow = termin;
                            stop = 0;
                        });
                    }
                });
            }
        }
    }









    //-------------------
    return SmoothScroll;
});


var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
if (is_chrome) {
    //判断是chrome、搜狗chrome内核, 供scrollTop兼容性使用
    windowobject = "body";
} else {
    //支持ie和ff
    windowobject = "html";
}