// $(document).ready(function() {

//   $("#slide-left").click(function() {
//     console.log("sliding left");
//   });

//   $("#slide-right").click(function() {
//     console.log("sliding right");
//   });

// });

$(document).ready(function() {
  if ($("body").hasClass("index")) {



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

    ///////// EVENT HANDLERS //////////

    // left slide button
    $("#slide-left").click(function() {
      if (!sliding) {
        sliding = true;

        nextSlide = curSlide - 1;
        if (nextSlide < 0)
          nextSlide = NUMSLIDES - 1;

        $slides.eq(curSlide).animate({
          'left': '100%',
        }, ANIMATIONSPEED, EASING, function() {
          $(this).css('display', 'none');
          sliding = false;
        });

        $slides.eq(nextSlide).css({
          'left': '-100%',
          'display': 'block'
        }).animate({
          'left': '0',
        }, ANIMATIONSPEED, EASING);

        $indicators.eq(curSlide).removeClass("current");
        $indicators.eq(nextSlide).addClass("current");

        curSlide = nextSlide;
      }
    });

    // right slide button
    $("#slide-right").click(function() {
      if (!sliding) {
        sliding = true;

        nextSlide = (curSlide + 1) % NUMSLIDES;

        $slides.eq(curSlide).animate({
          'left': '-100%'
        }, ANIMATIONSPEED, EASING, function() {
          $(this).css('display', 'none');
          sliding = false;
        });

        $slides.eq(nextSlide).css({
          'left': '100%',
          'display': 'block'
        }).animate({
          'left': '0'
        }, ANIMATIONSPEED, EASING);

        $indicators.eq(curSlide).removeClass("current");
        $indicators.eq(nextSlide).addClass("current");

        curSlide = nextSlide;
      }
    });
  }

  // box-04 adjustment
  adjustBox4();
  $(window).resize(adjustBox4);

  function adjustBox4 () {
    if ($('body').width() <= MOBILE_WIDTH) {
      $("#box-04").height($("#box-03").height());
    } else {
      $("#box-04").css('height', 'auto');
    }
  }
});
