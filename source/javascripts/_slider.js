$(document).ready(function() {

  $(".slider").each(function() {

    // slider elements
    var $slider = $(this);
    var $slides = $(this).find(".slide");
    var $indicators = $(this).find(".circle");
    var $slideLeft = $(this).find(".slide-left");
    var $slideRight = $(this).find(".slide-right");
    var sliding = false;
    var curSlide = 0, nextSlide;

    // constants
    var NUMSLIDES = $slides.length;
    var ANIMATIONSPEED = 1000;
    var EASING = 'easeInOutQuart';

    /// EVENT HANDLERS ///

    // left slide button
    $slideLeft.click(function() {
      if (!sliding) {
        nextSlide = curSlide - 1;
        if (nextSlide < 0)
          nextSlide = NUMSLIDES - 1;

        slideLeft(curSlide, nextSlide);
        curSlide = nextSlide;
      }
    });

    // right slide button
    $slideRight.click(function() {
      if (!sliding) {
        nextSlide = (curSlide + 1) % NUMSLIDES;
        slideRight(curSlide, nextSlide);
        curSlide = nextSlide;
      }
    });

    // circle clicks
    $indicators.click(function() {
      if (!sliding) {
        nextSlide = $(this).index() - 1;

        if (curSlide < nextSlide) 
          slideRight(curSlide, nextSlide);
        else if (curSlide > nextSlide) 
          slideLeft(curSlide, nextSlide);

        curSlide = nextSlide;
      }
    });
  
    /// SLIDE FUNCTIONS ///

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

    /// SLIDE TIMER ///
    
    var timer = null;

    function initAutoClick() {
      // auto-switch slides every 12 seconds
      clearInterval(timer);
      timer = setInterval(function() {
        $slideRight.trigger('click');
      }, 8000);
    }
    // stop the timer whenever a link is clicked
    $("a").hover(function() {
      clearInterval(timer);
    });
    // start the auto-switch
    initAutoClick();

  });
});