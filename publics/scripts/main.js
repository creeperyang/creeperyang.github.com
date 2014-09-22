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
});
