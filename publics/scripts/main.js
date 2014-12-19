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
    $(".wheel-button").wheelMenu({
        trigger: "click", // Can be "click" or "hover". Default: "click"
        animationSpeed: "fast", // Entrance animation speed. Can be "instant", "fast", "medium", or "slow". Default: "medium"
        angle: [200, 340],
        width: 120,
        height: 120
    });
});
