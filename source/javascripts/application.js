//= require_tree .

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
    //e.preventDefault();
  });

  // ///////////// NAV PAGE LINK ROLLOVER /////////////

  // var rolloverAnimSpeed = 200;
  // var laundryBlack = "#53534A";
  // var laundryGreen = "#00b194";

  // $("#nav-page #main-menu a").hover(function() {
  //   console.log("hovering on");
  //   $(this).animate({opacity: '0'}, rolloverAnimSpeed, function() {
  //     $(this).css('color', laundryGreen);
  //     $(this).animate({opacity: '1'}, rolloverAnimSpeed);
  //   });
  // }, function() {
  //   console.log("hovering off");
  //   $(this).animate({opacity: '0'}, rolloverAnimSpeed, function() {
  //     $(this).css('color', laundryBlack);
  //     $(this).animate({opacity: '1'}, rolloverAnimSpeed);
  //   });  
  // });

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
    $(window).trigger('scroll', function(){
      if ($('body').width() >= MOBILE_WIDTH) {
        $('#nav-open').removeClass('nav-open-scrolled');
        $('#header').removeClass('header-scrolled');
      }else if($(window).scrollTop() > 100 && $('body').width() > MOBILE_WIDTH){
        $('#nav-open').addClass('nav-open-scrolled');
        $('#header').addClass('header-scrolled');
      }
    });
    
  });

  /////////////////// BACKGROUND VIDEO ///////////////

  // resize the video on document ready and window resize
  function resizeVideo() {
    if (document.body.clientHeight) {

      var windowHeight = document.body.clientHeight;
      var vidAspectRatio = 1280 / 720;
      var windowAspectRatio = document.body.clientWidth / document.body.clientHeight;

      // scale width to match full height of window
      var newWidth = Math.round(document.body.clientHeight * vidAspectRatio);
      //console.log(newWidth);

      if (vidAspectRatio > windowAspectRatio) {
        //console.log('window taller');
        $('.videobg video').css('width', newWidth + 'px');
      } else {
        //console.log('video taller');
        $('.videobg video').css('width', '100%');
      }
    }
  }

  resizeVideo();
  $(window).resize(resizeVideo);

  //////// PLACEHOLDER TEXT DISAPPEARS ON FOCUS ///////

  var placeText;
 
  $('.focus-hide').focus(function() {
    placeText = $(this).attr('placeholder');
    $(this).css('color', 'transparent');
    $(this).attr('placeholder','').delay('500').css('color', 'black');
  }).blur(function() {
    $(this).attr('placeholder', placeText);
  }).blur();













  ////////////// GET INSTAGRAM IMAGES ////////////////

  // instagram doesn't seem to return jsonp

  // window.callback = function(data) {
  //   console.log(data);
  // }

  // $.ajax({
  //   type: 'GET',
  //   dataType: 'jsonp',
  //   url: "https://instagram.com/skinlaundry/media/",
  //   cache: true,
  //   jsonpCallback: 'jake_asked_to_be_called_but_jake',
  //   contentType: 'text/javascript',
  //   success: function(data) {
  //     console.log(data);
  //   },
  //   error: function(jqxhr, status, error) {
  //     console.log(status);
  //     console.log(error);
  //   }
  // });

});
