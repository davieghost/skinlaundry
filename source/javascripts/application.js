//= require_tree .

$("#nav-open").click(function(e) {
    //sniff for iOS
    var $np = $('#nav-page');
    e.stopPropagation();
    
    //$np.addClass("open");

    if($np.hasClass('open')){
    	$np.removeClass('open');
      $(this).removeClass('close');
    }else {
    	$np.addClass('open');
      $(this).addClass('close');
    }

  });

  // if the nav is open, close it when the body is clicked
  $("body").click(function() {
    if ($("#nav-page").hasClass("open"))
      $("#nav-page").removeClass('open');
      $("#nav-open").removeClass('close');
    $(".hidden-list").animate({'opacity': '0'}, function() {
      $(".hidden-list").css('display', 'none');
    });

  });

  // but don't close it when the nav itself is clicked
  $("#nav-page").click(function(e) {
    e.stopPropagation();
    //e.preventDefault();
  });


$('#location-nav').hover(function(){
  var $hl = $(".hidden-list");
  if ($hl.css('display') == 'none') 
    $hl.css('display', 'block').animate({'opacity': '1'});
  else
    $hl.animate({'opacity': '0'}, function() {
      $hl.css('display', 'none');
    });
});

$('.location-mobile').click(function(e){
  e.stopPropagation();
  var $hl = $(".hidden-list");
  if ($hl.css('display') == 'none') 
    $hl.css('display', 'block').animate({'opacity': '1'});
  else
    $hl.animate({'opacity': '0'}, function() {
      $hl.css('display', 'none');
    });
});

$(document).ready(function(){
  resizeVideo();
});

window.onresize = function(){
  resizeVideo();
}

function resizeVideo()
{
  if(document.body.clientHeight)
  {
    var windowHeight = document.body.clientHeight;
    var vidAspectRatio = 1280 / 720;
    var windowAspectRatio = document.body.clientWidth / document.body.clientHeight;
    //scale width to match full height of window
    var newWidth = Math.round(document.body.clientHeight * vidAspectRatio);
    //console.log(newWidth);
    if(vidAspectRatio > windowAspectRatio)
    {
      //console.log('window taller');
      $('.videobg video').css('width', newWidth + 'px');
    }else
    {
      //console.log('video taller');
      $('.videobg video').css('width', '100%');
    }
  }
}