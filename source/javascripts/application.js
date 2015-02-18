//= require _index


$(window).load(function(){

  /////////////// DELAY DOM SHOWING ////////////////
  
  var COOKIE_NAME = "dont-fade-agin"
  $show = $.cookie(COOKIE_NAME);
  
  if ($show == null) {
    $.cookie(COOKIE_NAME, 'test', {function: $('body').animate({opacity: '1'}, 1500)});
  }else {
    $('body').animate({opacity: '1'});
  }
});



$(document).ready(function() {
  
  var MOBILE_WIDTH = 610;

  /////////////// NAV PAGE OPEN/CLOSE //////////////

  $("#nav-open").click(function(e) {
    var $np = $('#nav-page');
    e.stopPropagation();
    
    if($np.hasClass('open')) {
    	$np.removeClass('open');
      $(this).removeClass('close');
      $('body').css('overflow', 'auto');
    } else {
    	$np.addClass('open');
      $(this).addClass('close');
      $('body').css('overflow', 'hidden');
    }

  });

  // if the nav is open, close it when the body is clicked
  $("body").click(function() {
    if ($("#nav-page").hasClass("open")) {
      $("#nav-page").removeClass('open');
      $("#nav-open").removeClass('close');
      $('body').css('overflow', 'auto');
    }

    $(".hidden-list").animate({'opacity': '0'}, function() {
      $(".hidden-list").css('display', 'none');
    });
  });

  // but don't close it when the nav itself is clicked
  $("#nav-page").click(function(e) {
    e.stopPropagation();
  });

  //////////////////// HEADER //////////////////////

  $('#location-nav').hover(function(){
    var $hl = $(".hidden-list");

    if ($hl.css('display') == 'none') {
      $hl.css('display', 'block').animate({'opacity': '1'});
    } else {
      $hl.animate({'opacity': '0'}, function() {
        $hl.css('display', 'none');
      });
    }
  });

  $('.location-mobile').click(function(e){
    e.stopPropagation();
    var $hl = $(".hidden-list");

    if ($hl.css('display') == 'none') {
      $hl.css('display', 'block').animate({'opacity': '1'});
    } else {
      $hl.animate({'opacity': '0'}, function() {
        $hl.css('display', 'none');
      });
    }
  });

  $(window).scroll(function(){
    if ($(window).scrollTop() > 100 && $('body').width() > MOBILE_WIDTH) {
      $('#nav-open').addClass('nav-open-scrolled');
      $('#header').addClass('header-scrolled');
    } else {
      $('#nav-open').removeClass('nav-open-scrolled');
      $('#header').removeClass('header-scrolled');
    }
  });

  $(window).resize(function(){
    $(window).trigger('scroll');
  });

  //////// PLACEHOLDER TEXT DISAPPEARS ON FOCUS ///////

  var placeText;
 
  $('.focus-hide').focus(function() {
    placeText = $(this).attr('placeholder');
    $(this).css('color', 'transparent');
    $(this).attr('placeholder','').delay('500').css('color', 'black');
  }).blur(function() {
    $(this).attr('placeholder', placeText);
  }).blur();

});
