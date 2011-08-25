$.extend({
    footerResize: function(){
        var windowHeight = $(window).height();
        var footerPosition = $(".footer").position();

        if (windowHeight > (footerPosition.top + 200)) {
            var footerHeight = windowHeight - footerPosition.top - 50;
            $('.footer .leftBlock').css('height', footerHeight + 'px');
        } else {
            $('.footer .leftBlock').css('height', '');
        }
    }
});