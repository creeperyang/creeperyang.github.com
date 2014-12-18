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
            $el = self.$el,
            $container = self.$container;

        self.width = settings.width;
        self.height = settings.height;
        self.radius = self.width / 2;
        self.active = false;
        self.$items = $container.find('.item');
        self.count = self.$items.length;

        if(trigger === 'hover') {
            self.zindex = 3;
            $el.on('mouseenter', function() {
                self.show();
            }).on('mouseleave', function() {
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
            settings = self.settings,
            angle = settings.angle,
            animation = settings.animation,
            step = (angle[1] - angle[0]) / self.count;
        
        $el.css('z-index', self.zindex);
        $container.show().addClass("active");

        if(animation === 'fly') {
            flyIn(self.$items, self.width, self.height, angle, step, self.radius, settings.animationSpeed);
        }
        self.active = true;
    };

    WheelMenu.prototype.hide = function() {
        var self = this,
            settings = self.settings,
            animation = settings.animation;
        
        if(animation === 'fly') {
            flyOut(self.$items, self.$el);
        }
        self.active = false;
    };

    var flyIn = function($items, width, height, angle, step, radius, animationSpeed) {
        var deltaTime = 0,
            deltaAngle = 0,
            $item;
        $items.stop(true, true);
        $items.each(function(index) {
            $item = $(this);
            deltaAngle = (angle[0] + (step * index)) * (Math.PI / 180);
            var x = Math.round(width / 2 + radius * Math.cos(deltaAngle) - $item.outerWidth() / 2),
                y = Math.round(height / 2 + radius * Math.sin(deltaAngle) - $item.outerHeight() / 2);
            $item.animateRotate(360).css({
                position: 'absolute',
                opacity: 0,
                left: "50%",
                top: "50%",
                marginLeft: "-" + $item.outerWidth() / 2,
                marginTop: "-" + $item.outerHeight() / 2
            }).delay(deltaTime).animate({
                opacity: 1,
                left: x + 'px',
                top: y + 'px'
            }, animationSpeed[1]);
            deltaTime += animationSpeed[0];
        });
    };

    var flyOut = function($items, $menuBtn) {
        var d = 0;
        $items.stop(true, true);
        $($items.get().reverse()).each(function() {
            $(this).animateRotate(-360).delay(d).animate({
                opacity: 0,
                left: 100 + "px",
                top: 100 + "px"
            }, 150);
            d += 15;
        }).promise().done(function() {
            $items.removeClass("active");
            $menuBtn.removeClass("active");
        });
    };

    $.fn.animateRotate = function(angle, duration, easing, complete) {
        return this.each(function() {
            var $elem = $(this);

            $({
                deg: 0
            }).animate({
                deg: angle
            }, {
                duration: duration,
                easing: easing,
                step: function(now) {
                    $elem.css({
                        transform: 'rotate(' + now + 'deg)'
                    });
                },
                complete: complete || $.noop
            });
        });
    };

    function processAngle(angle) {
        if($.type(angle) === 'array') return angle;
        switch (angle) {
            case 'N':
                angle = [180, 380]
                break;
            case 'NE':
                angle = [270, 380]
                break;
            case 'E':
                angle = [270, 470]
                break;
            case 'SE':
                angle = [360, 470]
                break;
            case 'S':
                angle = [360, 560]
                break;
            case 'SW':
                angle = [90, 200]
                break;
            case 'W':
                angle = [90, 290]
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
        settings.angle = processAngle(self.angle);

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
        animation: "fade",
        angle: [0, 360],
        animationSpeed: "medium",
        width: 200,
        height: 200
    };

})(jQuery);
