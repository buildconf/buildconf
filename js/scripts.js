$(document).ready(function(e) {
  var mastHeight = 156,
  mastheadWrap = $('#masthead .wrap'),
  userAgent = navigator.userAgent,
  uaCheck = { 
    ios: userAgent.match(/(iPhone|iPod|iPad)/),
    blackberry: userAgent.match(/BlackBerry/),
    android: userAgent.match(/Android/)
  },
  animSpeed = 4

  $(document).scroll(function() {
      
    // define some globals for our methods to hit
    scrollDist = document.body.scrollTop,
    opacityNum = 1-(scrollDist * (1/mastHeight) - 0.05),
    positionNum = Math.floor(scrollDist/animSpeed)
  
    // run our methods
    fadeHeader(opacityNum)
  });
        
    function fadeHeader() {
        
       // we dont care about this stuff on mobile devices            
       if (uaCheck.ios || uaCheck.blackberry || uaCheck.android) return
           
        // moving the header around     
        if (positionNum <= mastHeight) {
          mastheadWrap.css('top', positionNum + 'px')
        }
       
        // fading master wrap
        if (opacityNum > 1) { opacityNum = 1; }
        if (opacityNum <= 1 && opacityNum >= 0) {
          mastheadWrap.css('opacity', opacityNum)
        }
        
        // sticky pattern
        $el = $('.pattern'); 
        if ($(this).scrollTop() > mastHeight && $el.css('position') != 'fixed'){ 
          $el.css({'top': '0px', 'position': 'fixed'})
        } else if ( $(this).scrollTop() <= mastHeight && $el.css('position') == 'fixed' ) {
          $el.css({'position': 'absolute', 'top': mastHeight + 'px'})
        }        
    }
    
  $('a.nav-button').click(toggleNav);
  
  function toggleNav() {
    $('nav').toggleClass('open');
  }
  
  if ( $('section#attendees') ) {
	  $('label').inFieldLabels();
  }
  
});