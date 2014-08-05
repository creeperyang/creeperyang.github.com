$(function(){
    var cyDropdown = new $.CyDropdown($(".cy-dropdown")[0]);

    // page scroll
    var $window = $(window),
        $headerPage = $("#user-info"),
        $desPage = $("#des-page"),
        windowHeight = $window.outerHeight(),
        headerPageHeight = $headerPage.outerHeight(),
        desPageHeight = $desPage.height();
    console.log(windowHeight, headerPageHeight, desPageHeight);
    /*var delta = windowHeight - headerPageHeight - desPageHeight;
    var paddingTop = $headerPage.css("padding-top");
    if(delta > 0) {
        console.log(delta, paddingTop)
        $headerPage.css({
            "padding-top": delta + parseInt(paddingTop) + "px"
        });
    }*/
});