$(document).ready(function() {
  if ($("body").hasClass("index")) {

    /////////////////// SLIDER ////////////////////

    // constants
    var MOBILE_WIDTH = 610;

    var NUMSLIDES = $(".slide").length;
    var ANIMATIONSPEED = 1000;
    var EASING = 'easeInOutQuart';

    // variables
    var $slider = $("#slider");
    var $slides = $(".slide");
    var $indicators = $(".circle");
    var sliding = false;
    var curSlide = 0, nextSlide;

    /// EVENT HANDLERS ///

    // left slide button
    $("#slide-left").click(function() {
      if (!sliding) {
        nextSlide = curSlide - 1;
        if (nextSlide < 0)
          nextSlide = NUMSLIDES - 1;

        slideLeft(curSlide, nextSlide);
        curSlide = nextSlide;
      }
    });

    // right slide button
    $("#slide-right").click(function() {
      if (!sliding) {
        nextSlide = (curSlide + 1) % NUMSLIDES;
        slideRight(curSlide, nextSlide);
        curSlide = nextSlide;
      }
    });

    // circle clicks (mobile only)
    $(".circle").click(function() {
      if ($('body').width() <= MOBILE_WIDTH && !sliding) {

        nextSlide = $(this).index() - 1;

        if (curSlide < nextSlide) 
          slideRight(curSlide, nextSlide);
        else if (curSlide > nextSlide) 
          slideLeft(curSlide, nextSlide);

        curSlide = nextSlide;

      }
    });
  }

  /// FUNCTIONS ///

  function slideLeft(cur, next) {
    sliding = true;

    $slides.eq(cur).animate({
      'left': '100%',
    }, ANIMATIONSPEED, EASING, function() {
      $(this).css('display', 'none');
      sliding = false;
    });

    $slides.eq(next).css({
      'left': '-100%',
      'display': 'block'
    }).animate({
      'left': '0',
    }, ANIMATIONSPEED, EASING);

    $indicators.eq(cur).removeClass("current");
    $indicators.eq(next).addClass("current");
  }

  function slideRight(cur, next) {
    sliding = true;

    $slides.eq(cur).animate({
      'left': '-100%'
    }, ANIMATIONSPEED, EASING, function() {
      $(this).css('display', 'none');
      sliding = false;
    });

    $slides.eq(next).css({
      'left': '100%',
      'display': 'block'
    }).animate({
      'left': '0'
    }, ANIMATIONSPEED, EASING);

    $indicators.eq(cur).removeClass("current");
    $indicators.eq(next).addClass("current");
  }
  
  var blurbTimer = null;

  function initAutoClick() {
    // auto-switch slides every 6 seconds
    clearInterval(blurbTimer);
    blurbTimer = setInterval(function() {
      $('#slide-right').trigger('click');
    }, 12000);
  }
  // stop the timer whenever a link is clicked
  $("a").hover(function() {
    clearInterval(blurbTimer);
  });
  // start the auto-switch
  initAutoClick();

  ///////////////// BOX 4 ADJUSTMENT /////////////////////

  function adjustBox4 () {
    if ($('body').width() <= MOBILE_WIDTH) {
      $("#box-04").height($("#box-03").height());
    } else {
      $("#box-04").css('height', 'auto');
    }
  }

  adjustBox4();
  $(window).resize(adjustBox4);

});
