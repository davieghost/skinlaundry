//= require_tree .

$(document).ready(function() {

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
    if ($(window).scrollTop() > 100 ) {
      $('#header').css('display', 'none');
    } else {
      $('#header').css('display', 'block');
    }
  });

  /////////////////// BACKGROUND VIDEO ///////////////

  // resize the video on document ready and window resize
  resizeVideo();
  $(window).resize(resizeVideo);

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

});