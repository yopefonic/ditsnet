var mouseIsInside = false, openSection;
$(document).ready(function () {
  // scrolling navigation
  $(window).scroll(function () {
    checkNavigationPosition();
  });

  // open the section selected in the url, if none given the features are selected
  openSection = $.getUrlVar('section');
  if (openSection == null) {
    openSection = 'featured';
  }

  // click on a block
  $(".content .block").click(function () {
    // check of block is already open
    if ($(this).children(".detailed").css('display') != 'block') {
      $(".content .block .detailed").hide(200);
      $(".content .block").addClass('disabled');
    }

    // show block as enabled
    $(this).removeClass('disabled');

    // set the offset of the detail of a block
    determineDetailOffset(this);

    // show the detail of a block
    $(this).children(".detailed").show(200);

    var scrollOffset = $(this).offset().top - 100 - (($(window).height() - 400) / 2);
    $("html,body").animate({scrollTop:scrollOffset}, 300);
  });

  // determine if the user clicks outside the clocks and close
  // them if this is the case
  $(".content .block").hover(function () {
    mouseIsInside = true;
  }, function () {
    mouseIsInside = false;
  });

  $("body").click(function () {
    if (!mouseIsInside) {
      $(".content .block .detailed").hide();
      $(".content .block").removeClass('disabled');
    }
  });

  // the close button needs to be delayed due to open vs. closing issues.
  $(".closeDetail").click(function () {
    setTimeout(function () {
      $(".content .block .detailed").hide();
      $(".content .block").removeClass('disabled');
    }, 200);
  });

  // click on the menu and select a category
  $("header nav li a").click(function () {
    var name = $(this).attr('name');

    if (name != 'undefined') {
      switch (name) {
        case 'all':
          $(".content .block").animate({width:'show', opacity: 1}, 400, function () {
            $(this).attr('style', '');
          });
          break;
        default:
          $(".content .block").each(function () {
            if (!$(this).hasClass(name)) {
              $(this).animate({width: 'hide', opacity: 0}, 400);
            }
          });
          $(".content .block." + name).animate({width: 'show', opacity: 1}, 400, function () {
            $(this).attr('style', '');
          });
          break;
      }

      $("header nav ul ul li").removeClass('active');
      $(this).parent().addClass('active');
      openSection = name;
      History.pushState({section:name}, name + " | Joost Elfering | d-its.net:Portfiolio", "?section=" + name);
    }
  });

  //make sure that when it is navigated back the
  History.Adapter.bind(window, 'statechange', function () {
    var State = History.getState(); // Note: We are using History.getState() instead of event.state
    if (State.data.section != openSection) {
      goToSection(State.data.section);
    }
  });

  $(".content .scrollLink").click(function () {
    pos = $(this).attr('name') || 400;
    $(this).parents(".frame").animate({scrollTop:pos}, 200);
  });

  goToSection(openSection);
  checkNavigationPosition();
});

function goToSection(sectionName) {
  $("nav li a").each(function () {
    if ($(this).attr('name') == sectionName) {
      $(this).click();
    }
  });
}

function checkNavigationPosition() {
  var navigationOffset = $('header').height() - $('header nav').height();
  var scrollOffset = window.pageYOffset;

  if (scrollOffset > navigationOffset) {
    $('header nav').addClass('detached');
  } else {
    $('header nav').removeClass('detached');
  }
}

function determineDetailOffset(element) {
  var rightOverflow = $(window).width() - ($(element).offset().left + 400);
  var leftOverflow = ($(element).offset().left - 200);
  if (rightOverflow < -100) {
    $(element).children(".detailed").css('left', '-400px');
  } else if (rightOverflow < 0) {
    $(element).children(".detailed").css('left', '-300px');
  } else if (leftOverflow < -100) {
    $(element).children(".detailed").css('left', '0px');
  } else if (leftOverflow < 0) {
    $(element).children(".detailed").css('left', '-100px');
  } else {
    $(element).children(".detailed").css('left', '-200px');
  }
}