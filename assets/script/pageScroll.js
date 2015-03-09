/*
 * @name: pageScroll
 * @description: a simple jQuery plugin to scroll page.
 * @version: 0.0.1
 * @date: 2015-03-09 
 * @author: creeperyang <pashanhu6@hotmail.com>
 */

;(function($, window, document, undefined) {
    "use strict";

    var $window = $(window);
    var $body = $(document.body);
    var $scrollEl = $body;
    var config = {
        step: null,
        ratio: 0.6,
        indicator: '.indicator',
        indicatorActiveClass: 'active'
    };

    function PageScroller(container, options) {
        var opt = $.extend({}, config, options);
        this.$container = $(container);
        this.timeStamp = new Date().getTime();

        this.step = $window.height(); //每次滚动位移
        this.animating = false;
        this.upOrDown = "";
        this.ratio = opt.ratio > 1 ? 0.6 : opt.ratio; //缓动系数
        this.stages = this.$container.find('.stage');
        this.count = this.stages.length;
        this.indicators = $(opt.indicator);
        this.indicatorActiveClass = opt.indicatorActiveClass;
        this.current = 0;
        this.init();
    }

    PageScroller.prototype = {
        constructor: PageScroller,
        init: function() {
            var self = this,
                $container = self.$container;

            // set scrollTop 0 and set stages correct height
            self.stages.css("height", self.step + 'px');
            self.doScroll(0, 500);
            
            // break if only one stage
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
                    self.upOrDown = 'up';
                    current -= pages;
                } else {
                    self.upOrDown = 'down';
                    current += pages;
                }
                current = current < 0 ? 0 : current > max ? max : current;
                if(current === self.current) {
                    return;
                }
                self.current = current;
                self.scrollHandler(scrollTop, self.ratio, pages);
            }
        },
        scrollHandler: function(scrollTop, ratio, pages) {
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

    // bounce animation
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

    // expose plugin
    $.fn.pageScroll = function(options) {
        return this.each(function() {
            if (!$.data(this, "pluginPageScroll")) {
                $.data(this, "pluginPageScroll", new PageScroller(this, options));
            }
        });
    };

    // expose default setting
    $.fn.pageScroll.config = config;

})(jQuery, window, document);