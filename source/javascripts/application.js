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