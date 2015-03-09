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

        this.step = $window.height(); //每次滚动位移
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

            // scroll to top
            self.doScroll(0, 500);
            if(self.count <=1) {
                return;
            }

            $window.on('resize', function() {
                self.step = $window.height();
                self.stages.css("height", self.step + 'px');
                self.doScroll(self.current * self.step, 500);
            });
            $container.on('mousewheel', function(e){
                e.preventDefault();
                e.stopPropagation();
                if(self.animating) {
                    return;
                }
                execute(e.originalEvent.wheelDelta);
            });
            self.indicators.each(function(i) {
                $(this).data('index', i);
            });
            self.indicators.on('click', function(e) {
                var current = self.current,
                    i = $(this).data('index');
                e.preventDefault();
                e.stopPropagation();
                if(i === current || self.animating) {
                    return;
                } else {
                    execute(current - i, Math.abs(i - current));
                }
            });

            function execute(wheelDelta, pages) {
                var scrollTop = $window.scrollTop(),
                    current = self.current,
                    max = self.count - 1;
                pages = pages || 1;
                if(wheelDelta > 0) {
                    //if(scrollTop < 1) return;
                    self.upOrDown = 'up';
                    current -= pages;
                } else {
                    //if(scrollTop + self.step + 10 >= $body.height()) return;
                    self.upOrDown = 'down';
                    current += pages;
                }
                current = current < 0 ? 0 : current > max ? max : current;
                if(current === self.current) {
                    return;
                }
                self.current = current;
                //self.current = current < 0 ? 0 : current > max ? max : current;
                self.scrollHander(scrollTop, self.ratio, pages);
            }
        },
        scrollHander: function(scrollTop, ratio, pages) {
            var self = this,
                step = self.step * (self.upOrDown == "up" ? -1 : 1),
                terminal = scrollTop + step * pages;
            self.indicators.removeClass(self.indicatorActiveClass);
            
            self.doScroll(terminal + "px", 500, function() {
                if (self.upOrDown == "up") { //代表转轮往上，文本内容其实是往下
                    bounce(terminal, 20, 150, ratio);
                } else {
                    bounce(terminal, -20, 150, ratio);
                }
            });
            self.indicators.eq(self.current).addClass(self.indicatorActiveClass);
            
        },
        doScroll: function(scrollTop, duration, cb) {
            var self = this;
            self.animating = true;
            $scrollEl.animate({
                scrollTop: scrollTop
            }, duration, function() {
                self.animating = false;
                cb && cb();
            });
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
        return this.each(function() {
            if (!$.data(this, "pluginPageScroll")) {
                $.data(this, "pluginPageScroll", new SmoothScroll(this, options));
            }
        });
    };

})(jQuery, window, document);