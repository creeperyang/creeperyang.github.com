(function($, window, document, undefined) {
    "use strict";

    var $window = $(window);
    var $body = $(document.body);
    var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
    var $scrollEl = $body;
    var config = {
        step: null,
        ratio: 0.6,
        indicator: '.indicator',
        indicatorActiveClass: 'active'
    };

    function SmoothScroll(container, options) {
        var opt = $.extend({}, config, options);
        this.$container = $(container);
        this.timeStamp = new Date().getTime();

        this.step = opt.step || $window.height(); //每次滚动位移
        this.animating = false;
        this.upOrDown = "";
        this.ratio = opt.ratio > 1 ? 0.6 : opt.ratio; //缓动系数
        this.stages = this.$container.find('.stage');
        this.indicators = $(opt.indicator);
        this.indicatorActiveClass = opt.indicatorActiveClass;
        this.current = 0;
        this.init();
    }

    SmoothScroll.prototype = {
        constructor: SmoothScroll,
        init: function() {
            var self = this,
                $container = self.$container;

            self.stages.css("height", self.step + 'px');
            self.count = self.stages.length;
            $scrollEl.animate({
                "scrollTop": 0
            }, 500);
            if(self.count <=1) {
                return;
            }
            $container.on('mousewheel', function(e){
                e.preventDefault();
                e.stopPropagation();
                execute(e.originalEvent.wheelDelta);
            });
            self.indicators.each(function(item, i) {
                $(this).on('click', function(e) {
                    var current = self.current;
                    e.preventDefault();
                    e.stopPropagation();
                    if(i === current) {
                        return;
                    } else {
                        execute(i < current ? -120 : 120);
                    }
                })
            });

            function execute(wheelDelta) {
                var scrollTop = $window.scrollTop(),
                    current = self.current,
                    max = self.count - 1;
                console.log(wheelDelta);
                if(wheelDelta > 0) {
                    if(scrollTop < 1) return;
                    self.upOrDown = 'up';
                    current--;
                } else {
                    if(scrollTop + self.step + 10 >= $body.height()) return;
                    self.upOrDown = 'down';
                    current++;
                }
                self.current = current < 0 ? 0 : current > max ? max : current;
                console.log('handle scroll', self.current);
                self.scrollHander(scrollTop, self.ratio);
            }
        },
        scrollHander: function(scrollTop, ratio) {
            var self = this, 
                step = self.step * (self.upOrDown == "up" ? -1 : 1),
                terminal = scrollTop + step;
            self.indicators.removeClass(self.indicatorActiveClass);
            if (scrollTop + step < $body.height() - 10) {
                if (!$scrollEl.is(":animated")) { //避免多次滚轮造成的多次滚动
                    $scrollEl.animate({
                        "scrollTop": terminal + "px"
                    }, 800, 'linear', function() {
                        if (self.upOrDown == "up") { //代表转轮往上，文本内容其实是往下
                            bounce(terminal, 20, 150, ratio);
                        } else {
                            bounce(terminal, -20, 150, ratio);
                        }
                    });
                    self.indicators.eq(self.current).addClass(self.indicatorActiveClass);
                }
            }
        }
    };

    function bounce(terminal, distant, time, ratio) {
        $scrollEl.animate({
            "scrollTop": (terminal + distant) + "px"
        }, time, function() {
            if (distant <= 15) {
                $scrollEl.animate({
                    "scrollTop": terminal + "px"
                }, time, function() {});
            } else {
                bounce(terminal, -distant * ratio, time);
            }
        });
    }

    $.fn.pageScroll = function(options) {
        console.log(this);
        return this.each(function() {
            if (!$.data(this, "pluginPageScroll")) {
                $.data(this, "pluginPageScroll", new SmoothScroll(this, options));
            }
        });
    };

})(jQuery, window, document);