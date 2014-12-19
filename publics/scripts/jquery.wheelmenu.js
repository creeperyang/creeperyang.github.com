/*
 * https://github.com/peachananr/wheel-menu
 **/

;(function($) {

    function WheelMenu(el, items, settings) {
        this.$el = $(el);
        this.$container = $(items);
        this.settings = settings;
        this.init();
    }

    WheelMenu.prototype.init = function() {
        var self = this,
            settings = self.settings,
            trigger = settings.trigger,
            angle = settings.angle,
            $el = self.$el,
            $container = self.$container,
            $items = $container.find('.item'),
            count = $items.length;
        
        if(!count) return;

        self.width = settings.width;
        self.height = settings.height;
        self.radius = self.width / 2;
        self.active = false;
        self.$items = $items;
        self.count = count;
        if(settings.smartAdjust && count > 1) {
            self.step = (angle[1] - angle[0]) / (count - 1);
        } else {
            self.step = (angle[1] - angle[0]) / count;
        }

        if(trigger === 'hover') {
            self.zindex = 3;
            $el.on('mouseenter', function() {
                self.show();
            });
            $container.on('mouseleave', function() {
                self.hide();
            });
        } else {
            self.zindex = 6;
            $el.on('click', function(ev) {
                ev.preventDefault();
                if(self.active) {
                    self.hide();
                } else {
                    self.show();
                }
            });
        }

        // init style
        $container.css({ // center and display:block;
            'position': 'absolute',
            'width': self.width + 'px',
            'height': self.height + 'px',
            'margin-left': -(self.width / 2) + 'px',
            'margin-top': -(self.height / 2) + 'px',
            'z-index': '5',
            'padding': '30px' // add safe zone for mouseover
        });

    };

    WheelMenu.prototype.show = function() {
        var self = this,
            $container = self.$container,
            $el = self.$el,
            $items = self.$items,
            settings = self.settings,
            angle = settings.angle,
            count = self.count,
            step = self.step;
        
        $el.css('z-index', self.zindex);
        $el.addClass('active');
        $container.show().addClass("active");
        if(!self.itemWidth) {
            self.itemWidth = $items.width();
            self.itemHeight = $items.height();
            self.cx = self.width / 2 - self.itemWidth / 2;
            self.cy = self.height / 2 - self.itemHeight / 2;
            self.itemStyle = {
                opacity: 0,
                left: self.cx + 'px',
                top: self.cy + 'px',
                transform: 'rotateZ(0)'
            };
        }

        flyIn(self.$items, self.cx, self.cy, angle, step, 
            self.radius, settings.animationSpeed, self.itemStyle);

        self.active = true;
    };

    WheelMenu.prototype.hide = function() {
        var self = this,
            settings = self.settings;

        flyOut(self.$items, self.$el, self.itemStyle, function() {
            self.$container.hide().removeClass('active');
        });
        self.active = false;
    };

    var flyIn = function($items, cx, cy,
        angle, step, radius, animationSpeed, style) {
        var deltaTime = 0,
            deltaAngle = 0,
            $item;
        $items.stop(true, true);
        $items.each(function(index) {
            $item = $(this);
            deltaAngle = (angle[0] + (step * index)) * (Math.PI / 180);
            var x = Math.round(cx + radius * Math.cos(deltaAngle) ),
                y = Math.round(cy + radius * Math.sin(deltaAngle) );
            $item.css(style)
                .delay(deltaTime)
                .animate({
                    opacity: 1,
                    left: x + 'px',
                    top: y + 'px',
                    transform: 'rotateZ(360deg)'
                }, animationSpeed[1]);
            deltaTime += animationSpeed[0];
        });
    };

    var flyOut = function($items, $menuBtn, style, cb) {
        var d = 0;
        $items.stop(true, true);
        $($items.get().reverse()).each(function() {
            $(this).delay(d).animate(style, 150);
            d += 15;
        }).promise().done(function() {
            $menuBtn.removeClass("active");
            cb && cb();
        });
    };

    function processAngle(angle) {
        if($.type(angle) === 'array') return angle;
        switch (angle) {
            case 'N':
                angle = [180, 360];
                break;
            case 'NE':
                angle = [270, 380]
                break;
            case 'E':
                angle = [270, 450]
                break;
            case 'SE':
                angle = [360, 470]
                break;
            case 'S':
                angle = [360, 540]
                break;
            case 'SW':
                angle = [90, 200]
                break;
            case 'W':
                angle = [90, 270]
                break;
            case 'NW':
                angle = [180, 290]
                break;
            case 'all':
                angle = [0, 360]
                break;
            default:
                angle = [0, 360]
                break;
        }
        return angle;
    }

    function processSpeed(speed) {
        var speed = speed || 'medium';
        if ($.type(speed) === "string") {
            switch (speed) {
                case 'slow':
                    speed = [75, 700];
                    break;
                case 'medium':
                    speed = [50, 500];
                    break;
                case 'fast':
                    speed = [25, 250];
                    break;
                case 'instant':
                    speed = [0, 0];
                    break;
                default: 
                    speed = [50, 500];
                    break;
            }
        } 
        if($.type(speed) !== 'array') {
            speed = [50, 500];
        }
        return speed;
    }

    $.fn.wheelMenu = function(options) {
        var settings = $.extend({}, defaults, options);
        settings.animationSpeed = processSpeed(settings.animationSpeed);
        settings.angle = processAngle(settings.angle);
        return this.each(function() {
            var $menuBtn = $(this);
            var target = $menuBtn.attr("href");
            
            if(!$menuBtn.data('z-wheelMenu-instance')) {
                $menuBtn.data('z-wheelMenu-instance', new WheelMenu($menuBtn, target, settings));
            }
        });
    };

    var defaults = $.fn.wheelMenu.defaults = {
        trigger: "click",
        angle: [0, 360],
        animationSpeed: "medium",
        smartAdjust: true, // 如果n/s/e/w, 尽可能方向更正
        width: 160,
        height: 160
    };

})(jQuery);
