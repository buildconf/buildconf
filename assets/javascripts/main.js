// @codekit-prepend "jquery.min.js"
// @codekit-prepend "waypoints.min.js"
// @codekit-prepend "jquery.fitvids.min.js"
// @codekit-prepend "jquery.scrollTo.min.js"

$(document).ready(function() {
  
  $(".video").fitVids();
  $("a[rel='external']").click(function(event) {
    window.open($(this).attr('href'));
    return false;
  });

  var getMQ = function() {
    var size = window.getComputedStyle(document.body,':after').getPropertyValue('content');
    return size;
  };

  var isMQ = function(test) {
    var mq = getMQ();
    return (mq.indexOf(test) !== -1);
  };
  
  var $nav = $("body > nav");
  var currentNav = function(id, set) {
    $nav.find("a[href='#" + id + "']").toggleClass('current', set);
  };

  $nav.find(".background").click(function(event) {
    $(this).toggleClass('expanded');
  });

  $nav.find("a[href^=#]").click(function(event) {
    var $target         = $($(this).attr('href'));
    var $first_section  = $("body > header + section");

    if ($target[0] === $first_section[0] && !isMQ('large')) {
      $.scrollTo($target, {offset: -$nav.outerHeight()+1});
    }
    else {
      $.scrollTo($target);
    }
    
    $nav.find(".background").trigger('click');
    return false;
  });

  $('#opening, #film, #practical, #conference, #guide')
    
    .waypoint(function(direction) {
      // sticky header
      $(this).find('> div > header').toggleClass('sticky', direction === 'down');
      // nav .current
      currentNav($(this).attr('id'), direction === 'down');
    })
    
    .waypoint(function(direction){
      // nav .current
      currentNav($(this).attr('id'), direction === 'up');
    }, { 
      offset: function() { return -$(this).outerHeight(); }
    })

    .waypoint(function(direction){
      // sticky header
      $(this).find('> div > header').toggleClass('sticky-bottom', direction === 'down');
    }, {
      offset: function() { return -$(this).outerHeight() + $(this).find('> div > header').outerHeight(); }
    });

  $('body > header + section').waypoint(function(direction) {
    $nav.toggleClass('wide', direction === 'down');
  });

  

});