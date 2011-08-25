var mouseIsInside = false, openSection;
$(document).ready(function () {
    // adjust height on load, resize and change
    $(window).resize(function() {
        $.footerResize();
    });

    // open the section selected in the url, if none given the features are selected
    openSection = $.getUrlVar('section');
    if (openSection == null) {
        openSection = 'featured';
    }

    // click on a block
    $(".advContent .block").click(function () {
        if ($(this).children(".detailed").css('display') != 'block') {
            $(".advContent .block .detailed").hide(200);
            $(".advContent .block").addClass('disabled');
        }
        $(this).removeClass('disabled');
        leftOffset = 0;
        rightOverflow = $(window).width() - ($(this).offset().left + 600);
        if (rightOverflow < -200) {
            $(this).children(".detailed").css('left', '-400px');
        } else if (rightOverflow < 0) {
            $(this).children(".detailed").css('left', '-200px');
        } else {
            $(this).children(".detailed").css('left', '0px');
        }
        $(this).children(".detailed").show(200);

        scrollOffset = $(this).offset().top - (($(window).height()-400)/2);
        $("html,body").animate({scrollTop: scrollOffset}, 300);
    });

    // determine if the user clicks outside the clocks and close
    // them if this is the case
    $(".advContent .block").hover(function(){
        mouseIsInside=true;
    }, function(){
        mouseIsInside=false;
    });
    $(".canvas").click(function(){
        if(! mouseIsInside) {
            $(".advContent .block .detailed").hide();
            $(".advContent .block").removeClass('disabled');
        }
    });

    // click the focus frame to close it and open the about block
    $(".header .info .description .openFirstFrame").click(function () {
        $(".about").click();
    });

    // hover for the first item opening link
    $(".header .info .description a.openFirstFrame").hover(
        function () {
            if ($(".about").css('display') != 'none') {
                $(".firstItemFrame").stop(true, true).fadeIn(200);
            }
        },
        function () {
            $(".firstItemFrame").stop(true, true).fadeOut(200);
        }
    );

    // click on the menu and select a category
    $(".header .leftBlock ul li").click(function () {
        name = $(this).children("a").attr('name');
        
        if (name != 'undefined') {
            switch (name) {
                case 'all':
                    $(".advContent .block").animate({width: 'show'}, 400, function() {
                        $.footerResize();
                    });
                    break;
                default:
                    $(".advContent .block").each(function () {
                        if (! $(this).hasClass(name)) {
                            $(this).animate({width: 'hide'}, 400, function() {
                                $.footerResize();
                            });
                        }
                    });
                    $(".advContent .block." + name).animate({width: 'show'}, 400, function() {
                        $.footerResize();
                    });
                    break;
            }

            $(".header .leftBlock ul li").removeClass('active');
            $(this).addClass('active');
            openSection = name;
            History.pushState({section:name}, "section:" + name, "?section="+name);
        }
    });

    //make sure that when it is navigated back the
    History.Adapter.bind(window, 'statechange', function () {
        var State = History.getState(); // Note: We are using History.getState() instead of event.state
        if (State.data.section != openSection) {
            goToSection(State.data.section);
        }
    });

    $(".advContent .scrollLink").click(function () {
        pos = $(this).attr('name') || 400;
        $(this).parents(".frame").animate({scrollTop: pos}, 200);
    });

    goToSection(openSection);
});

function goToSection(sectionName) {
    $(".leftBlock li a").each(function () {
        if ($(this).attr('name') == sectionName) {
            $(this).click();
        }
    });
}