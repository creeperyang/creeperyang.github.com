;(function($){

    "use strict";

    if(!$) {
        throw new Error("jQuery未加载");
    }

    function CyDropdown(el, options) {
        this.el = el;
        this.options = $.extend({}, this.defaults, options);
        this.init();
    };

    CyDropdown.prototype.defaults = {
        onChange: function( val ) { return false; }
    };

    CyDropdown.prototype.init = function() {
        this.current = 0;
        this.isOpen = false;
        this.bindEvents();
    };

    CyDropdown.prototype.bindEvents = function() {
        var self = this;
        var $el = $(self.el);
        $el.on("click", function() {
            self.isOpen = !self.isOpen;
            self.toggle();
        });
    };

    CyDropdown.prototype.toggle = function() {
        if(this.isOpen) {
            this.hide();
        }
        else {
            this.show();
        }
    };
    CyDropdown.prototype.show = function() {
        var $el = $(this.el);
        $el.addClass("cy-active");
    };
    CyDropdown.prototype.hide = function() {
        var $el = $(this.el);
        $el.removeClass("cy-active");
    };

    $.extend({
        CyDropdown: CyDropdown
    });

})(jQuery);