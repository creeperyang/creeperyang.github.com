$(function() {
    var $backToTop = $('#back-to-top'),
        $window = $(window);

    function toggleSideMenu() {
        if ($window.scrollTop() > 400) {
            $backToTop.show();
        } else {
            $backToTop.hide();
        }
    };
    toggleSideMenu();
    $window.scroll(function() {
        toggleSideMenu();
    });
    $backToTop.on('click', function() {
        $('html, body').animate({
            scrollTop: 0
        }, 1000);
    });

    // wheel menu
    $(".wheel-button").wheelmenu({
        trigger: "click", // Can be "click" or "hover". Default: "click"
        animation: "fly", // Entrance animation. Can be "fade" or "fly". Default: "fade"
        animationSpeed: "fast", // Entrance animation speed. Can be "instant", "fast", "medium", or "slow". Default: "medium"
        angle: "S", // Angle which the menu will appear. Can be "all", "N", "NE", "E", "SE", "S", "SW", "W", "NW", or even array [0, 360]. Default: "all" or [0, 360]
    });
});
