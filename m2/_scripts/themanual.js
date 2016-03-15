/*
 * THE MANUAL CONTROLLER - Javascript controller for the The Manual's website.
 */

/* Initialize the global namespace. */
window.TheManual = window.TheManual || {};

TheManual = (function() {
    /* Private members */

    /* Private methods */
    
    // Local scrolling for top nav
    function _localScroll() {
        $('#nav ul, .section .explore .current, #buy-it-now, .jump-to').localScroll();
            
        $.localScroll.hash({reset: true})
    }
    
    // Show/hide side navs
    function _sideMore() {
        $('.sidenav .see-more a').live('click', function(e) {
            // Prevent the default behaviour
            e.preventDefault();
                        
            $(this).parent('li').hide()
                   .parent('ul').next('.sidenav-more').show();
        });
    }
        
    // Explore prev and next articles/items
    function _explore() {
        $('.explore .next a, .explore .prev a, #blog .explore .current a').live('click', function(e) {
            e.preventDefault();
            
            var content = $(this).closest('.section').find(".loadable"),
                cacheBuster = parseInt(Math.random()*99999999);
            content.load($(this).attr("href") + "?c=" + cacheBuster, function() {
                _lightbox();
            });
        });
    }
    
    function _mailme() {
        // Replace all of the mailto hrefs (avoid spam)
        var at = / at /;
        var dot = / dot /g;
        $('span.mailme').each(function() {
          var addr = $(this).text().replace(at,"@").replace(dot,".");
          $(this).after('<a href="mailto:'+addr+'" title="Send an email">'+ addr +'</a>')
                .hover(function(){window.status="Send a letter!";}, function(){window.status="";})
                .remove();
        });
    }
    
    
    function _example() {
        $("#email").example('me@mywebsite.com');
    }
        
    function _shopAdd() {
        $("input.add-to-cart").live("click", function(e){
            e.preventDefault();
            
            var $self = $(this),
                slug = $self.siblings("input[name='slug']").val() || $self.siblings("select[name='description']").val(),
                description = $self.siblings("input[name='description']").val() || $self.siblings("select[name='description']").find("option:selected").text(),
                price = $self.siblings("input[name='price']").val();
                                    
            // Make the input
            var input = $("<input />").attr("type", "text")
                                      .attr("name", slug)
                                      .attr("data-price", price)
                                      .val(1);
            
            // A cancel button
            var a = $("<a />").attr("href", "#")
                              .text("x");
                                                 
            // Put everything into a span
            var span = $("<span />").append(a)
                                    .append(input);
            
            // Does this cart item already exist?
            var $existing = $("input[name='" + slug + "']");
            if( $existing.length > 0 ) {
                $existing.val( parseInt($existing.val()) + 1 );
            } else {
                $("<li/ >").text(description +  " ($" + parseInt(price) + ")")
                           .prepend( span )
                           .appendTo($(".shop-cart-items ul"));
            }
            
            _calculateTotals();
            
            $(".shop-actions").show();
        });
        
        // Don't show the totals until they've selected a shipping options
        $(".shop-shipping select").change(function() {
            var $doms = $(".shop-shipping-total, .shop-grand-total, .shop-checkout, .shop-note");
            
            if( $(this).val() )
                $doms.show();
            else
                $doms.hide();
        });
        
        // When to recalculate
        $(".shop-cart-items input, .shop-shipping select").live("change", _calculateTotals);
    }
    
    function _calculateTotals() {
        var costItems = costShipping = grandTotal = 0.0;
        
        // Cost of Items
        $(".shop-cart-items input").each(function() {
           costItems += $(this).attr("data-price") * $(this).val();
        });
        $(".shop-subtotal span").text("$" + costItems.toFixed(2));
        
        // Cost of Shipping
        costShipping = parseFloat($(".shop-shipping option:selected").attr("data-price")) || 0.0;
        $(".shop-shipping-total span").text("$" + costShipping.toFixed(2));
        
        // Grand Total
        grandTotal = costItems + costShipping;
        
        $(".shop-grand-total span").text("$" + grandTotal.toFixed(2));
    }
    
    function _shopRemove() {
        $(".shop-cart-items span a").live("click", function(e) {
            e.preventDefault();
        
            $(this).closest("li").remove();
            
            if( $(".shop-cart-items ul li").length == 0 ) {
                $(".shop-actions").hide();
            }
            
            _calculateTotals();
        });
    }

    // What runs on document.ready
    function _init() {
        // Local scrolling for top nav
        _localScroll();
        
        // Current issue slideshow
        //_slideshow();
        
        // Show/hide side navs
        _sideMore();
        
        // Lightbox
        //_lightbox();
        
        // Explore prev and next articles/items
        _explore();
        
        // Mail spam guard
        _mailme();
        
        // Subscribe example
        _example();
        
        // Fixed nav
/*         _sticky(); */
        
        // Shop
        _shopAdd();
        _shopRemove();
        
    };
    $(document).ready(_init);

    /* Public methods */
    return {}
  
})();

// Run immediately
$('body').addClass('tm-loaded');

$(document).ready(function() {
  // image gallery
  $('.image-thumbs img').click(function() {
    var image_path = $(this).attr('src');
    $('.image-main img').attr('src', image_path);
  });
  
  $('.footer_twitter_container').tweet({
        username: "themanual",
        join_text: "auto",
        avatar_size: null,
        count: 1,
        auto_join_text_default: "", 
        auto_join_text_ed: "",
        auto_join_text_ing: "",
        auto_join_text_reply: "",
        auto_join_text_url: "",
        loading_text: "loading tweet"
    });
  
    $('.issue1-trigger').click(function() {
      $('body').removeClass('blue');
      $('body').addClass('red');
      $('.issue2-trigger').removeClass('active');
      $(this).addClass('active');
      return false;
    });
    
    $('.issue2-trigger').click(function() {
      $('body').removeClass('red');
      $('body').addClass('blue');
      $('.issue1-trigger').removeClass('active');
      $(this).addClass('active');
      return false;
    });
});

/**
 * jQuery.ScrollTo - Easy element scrolling using jQuery.
 * Copyright (c) 2007-2009 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 5/25/2009
 * @author Ariel Flesler
 * @version 1.4.2
 *
 * http://flesler.blogspot.com/2007/10/jqueryscrollto.html
 */
;(function(d){var k=d.scrollTo=function(a,i,e){d(window).scrollTo(a,i,e)};k.defaults={axis:'xy',duration:parseFloat(d.fn.jquery)>=1.3?0:1};k.window=function(a){return d(window)._scrollable()};d.fn._scrollable=function(){return this.map(function(){var a=this,i=!a.nodeName||d.inArray(a.nodeName.toLowerCase(),['iframe','#document','html','body'])!=-1;if(!i)return a;var e=(a.contentWindow||a).document||a.ownerDocument||a;return d.browser.safari||e.compatMode=='BackCompat'?e.body:e.documentElement})};d.fn.scrollTo=function(n,j,b){if(typeof j=='object'){b=j;j=0}if(typeof b=='function')b={onAfter:b};if(n=='max')n=9e9;b=d.extend({},k.defaults,b);j=j||b.speed||b.duration;b.queue=b.queue&&b.axis.length>1;if(b.queue)j/=2;b.offset=p(b.offset);b.over=p(b.over);return this._scrollable().each(function(){var q=this,r=d(q),f=n,s,g={},u=r.is('html,body');switch(typeof f){case'number':case'string':if(/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(f)){f=p(f);break}f=d(f,this);case'object':if(f.is||f.style)s=(f=d(f)).offset()}d.each(b.axis.split(''),function(a,i){var e=i=='x'?'Left':'Top',h=e.toLowerCase(),c='scroll'+e,l=q[c],m=k.max(q,i);if(s){g[c]=s[h]+(u?0:l-r.offset()[h]);if(b.margin){g[c]-=parseInt(f.css('margin'+e))||0;g[c]-=parseInt(f.css('border'+e+'Width'))||0}g[c]+=b.offset[h]||0;if(b.over[h])g[c]+=f[i=='x'?'width':'height']()*b.over[h]}else{var o=f[h];g[c]=o.slice&&o.slice(-1)=='%'?parseFloat(o)/100*m:o}if(/^\d+$/.test(g[c]))g[c]=g[c]<=0?0:Math.min(g[c],m);if(!a&&b.queue){if(l!=g[c])t(b.onAfterFirst);delete g[c]}});t(b.onAfter);function t(a){r.animate(g,j,b.easing,a&&function(){a.call(this,n,b)})}}).end()};k.max=function(a,i){var e=i=='x'?'Width':'Height',h='scroll'+e;if(!d(a).is('html,body'))return a[h]-d(a)[e.toLowerCase()]();var c='client'+e,l=a.ownerDocument.documentElement,m=a.ownerDocument.body;return Math.max(l[h],m[h])-Math.min(l[c],m[c])};function p(a){return typeof a=='object'?a:{top:a,left:a}}})(jQuery);

/**
 * jQuery.LocalScroll - Animated scrolling navigation, using anchors.
 * Copyright (c) 2007-2009 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 3/11/2009
 * @author Ariel Flesler
 * @version 1.2.7
 **/
;(function($){var l=location.href.replace(/#.*/,'');var g=$.localScroll=function(a){$('body').localScroll(a)};g.defaults={duration:1e3,axis:'y',event:'click',stop:true,target:window,reset:true};g.hash=function(a){if(location.hash){a=$.extend({},g.defaults,a);a.hash=false;if(a.reset){var e=a.duration;delete a.duration;$(a.target).scrollTo(0,a);a.duration=e}i(0,location,a)}};$.fn.localScroll=function(b){b=$.extend({},g.defaults,b);return b.lazy?this.bind(b.event,function(a){var e=$([a.target,a.target.parentNode]).filter(d)[0];if(e)i(a,e,b)}):this.find('a,area').filter(d).bind(b.event,function(a){i(a,this,b)}).end().end();function d(){return!!this.href&&!!this.hash&&this.href.replace(this.hash,'')==l&&(!b.filter||$(this).is(b.filter))}};function i(a,e,b){var d=e.hash.slice(1),f=document.getElementById(d)||document.getElementsByName(d)[0];if(!f)return;if(a)a.preventDefault();var h=$(b.target);if(b.lock&&h.is(':animated')||b.onBefore&&b.onBefore.call(b,a,f,h)===false)return;if(b.stop)h.stop(true);if(b.hash){var j=f.id==d?'id':'name',k=$('<a> </a>').attr(j,d).css({position:'absolute',top:$(window).scrollTop(),left:$(window).scrollLeft()});f[j]='';$('body').prepend(k);location=e.hash;k.remove();f[j]=d}h.scrollTo(f,b).trigger('notify.serialScroll',[f])}})(jQuery);

/*
* jQuery Form Example Plugin 1.4.2
* Populate form inputs with example text that disappears on focus.
*
* e.g.
* $('input#name').example('Bob Smith');
* $('input[@title]').example(function() {
* return $(this).attr('title');
* });
* $('textarea#message').example('Type your message here', {
* className: 'example_text'
* });
*
* Copyright (c) Paul Mucur (http://mucur.name), 2007-2008.
* Dual-licensed under the BSD (BSD-LICENSE.txt) and GPL (GPL-LICENSE.txt)
* licenses.
*
* This program is free software; you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation; either version 2 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU General Public License for more details.
*/
(function(a){a.fn.example=function(e,c){var d=a.isFunction(e);var b=a.extend({},c,{example:e});return this.each(function(){var f=a(this);if(a.metadata){var g=a.extend({},a.fn.example.defaults,f.metadata(),b)}else{var g=a.extend({},a.fn.example.defaults,b)}if(!a.fn.example.boundClassNames[g.className]){a(window).unload(function(){a("."+g.className).val("")});a("form").submit(function(){a(this).find("."+g.className).val("")});a.fn.example.boundClassNames[g.className]=true}if(a.browser.msie&&!f.attr("defaultValue")&&(d||f.val()==g.example)){f.val("")}if(f.val()==""&&this!=document.activeElement){f.addClass(g.className);f.val(d?g.example.call(this):g.example)}f.focus(function(){if(a(this).is("."+g.className)){a(this).val("");a(this).removeClass(g.className)}});f.change(function(){if(a(this).is("."+g.className)){a(this).removeClass(g.className)}});f.blur(function(){if(a(this).val()==""){a(this).addClass(g.className);a(this).val(d?g.example.call(this):g.example)}})})};a.fn.example.defaults={className:"example"};a.fn.example.boundClassNames=[]})(jQuery);

/* jQuery Tweet plugin */
// code has been modified
(function($) {

  $.fn.tweet = function(o){
    var s = $.extend({
      username: null,                           // [string or array] required unless using the 'query' option; one or more twitter screen names
      list: null,                               // [string]   optional name of list belonging to username
      favorites: false,                         // [boolean]  display the user's favorites instead of his tweets
      query: null,                              // [string]   optional search query
      avatar_size: null,                        // [integer]  height and width of avatar if displayed (48px max)
      count: 3,                                 // [integer]  how many tweets to display?
      fetch: null,                              // [integer]  how many tweets to fetch via the API (set this higher than 'count' if using the 'filter' option)
      retweets: true,                           // [boolean]  whether to fetch (official) retweets (not supported in all display modes)
      intro_text: null,                         // [string]   do you want text BEFORE your your tweets?
      outro_text: null,                         // [string]   do you want text AFTER your tweets?
      join_text:  null,                         // [string]   optional text in between date and tweet, try setting to "auto"
      auto_join_text_default: "i said,",        // [string]   auto text for non verb: "i said" bullocks
      auto_join_text_ed: "i",                   // [string]   auto text for past tense: "i" surfed
      auto_join_text_ing: "i am",               // [string]   auto tense for present tense: "i was" surfing
      auto_join_text_reply: "i replied to",     // [string]   auto tense for replies: "i replied to" @someone "with"
      auto_join_text_url: "i was looking at",   // [string]   auto tense for urls: "i was looking at" http:...
      loading_text: null,                       // [string]   optional loading text, displayed while tweets load
      refresh_interval: null ,                  // [integer]  optional number of seconds after which to reload tweets
      twitter_url: "twitter.com",               // [string]   custom twitter url, if any (apigee, etc.)
      twitter_api_url: "api.twitter.com",       // [string]   custom twitter api url, if any (apigee, etc.)
      twitter_search_url: "search.twitter.com", // [string]   custom twitter search url, if any (apigee, etc.)
      template: "{avatar}{join}{text}{time}",   // [string or function] template used to construct each tweet <li> - see code for available vars
      comparator: function(tweet1, tweet2) {    // [function] comparator used to sort tweets (see Array.sort)
        return tweet2["tweet_time"] - tweet1["tweet_time"];
      },
      filter: function(tweet) {                 // [function] whether or not to include a particular tweet (be sure to also set 'fetch')
        return true;
      }
    }, o);

    $.fn.extend({
      linkUrl: function() {
        var returning = [];
        // See http://daringfireball.net/2010/07/improved_regex_for_matching_urls
        var regexp = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?Â«Â»â€œâ€â€˜â€™]))/gi;
        this.each(function() {
          returning.push(this.replace(regexp,
                                      function(match) {
                                        var url = (/^[a-z]+:/i).test(match) ? match : "http://"+match;
                                        return "<a href=\""+url+"\">"+match+"</a>";
                                      }));
        });
        return $(returning);
      },
      linkUser: function() {
        var returning = [];
        var regexp = /[\@]+([A-Za-z0-9-_]+)/gi;
        this.each(function() {
          returning.push(this.replace(regexp,"<a href=\"http://"+s.twitter_url+"/$1\">@$1</a>"));        });
        return $(returning);
      },
      linkHash: function() {
        var returning = [];
        var regexp = /(?:^| )[\#]+([A-Za-z0-9-_]+)/gi;
        var usercond = s.username ? '&from='+s.username.join("%2BOR%2B") : '';
        this.each(function() {
          returning.push(this.replace(regexp, ' <a href="http://'+s.twitter_search_url+'/search?q=&tag=$1&lang=all'+usercond+'">#$1</a>'));
        });
        return $(returning);
      },
      capAwesome: function() {
        var returning = [];
        this.each(function() {
          returning.push(this.replace(/\b(awesome)\b/gi, '<span class="awesome">$1</span>'));
        });
        return $(returning);
      },
      capEpic: function() {
        var returning = [];
        this.each(function() {
          returning.push(this.replace(/\b(epic)\b/gi, '<span class="epic">$1</span>'));
        });
        return $(returning);
      },
      makeHeart: function() {
        var returning = [];
        this.each(function() {
          returning.push(this.replace(/(&lt;)+[3]/gi, "<tt class='heart'>&#x2665;</tt>"));
        });
        return $(returning);
      }
    });

    function parse_date(date_str) {
      // The non-search twitter APIs return inconsistently-formatted dates, which Date.parse
      // cannot handle in IE. We therefore perform the following transformation:
      // "Wed Apr 29 08:53:31 +0000 2009" => "Wed, Apr 29 2009 08:53:31 +0000"
      return Date.parse(date_str.replace(/^([a-z]{3})( [a-z]{3} \d\d?)(.*)( \d{4})$/i, '$1,$2$4$3'));
    }

    function relative_time(date) {
      var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
      var delta = parseInt((relative_to.getTime() - date) / 1000, 10);
      var r = '';
      if (delta < 60) {
        r = delta + ' seconds ago';
      } else if(delta < 120) {
        r = 'a minute ago';
      } else if(delta < (45*60)) {
        r = (parseInt(delta / 60, 10)).toString() + ' minutes ago';
      } else if(delta < (2*60*60)) {
        r = 'an hour ago';
      } else if(delta < (24*60*60)) {
        r = '' + (parseInt(delta / 3600, 10)).toString() + ' hours ago';
      } else if(delta < (48*60*60)) {
        r = 'a day ago';
      } else {
        r = (parseInt(delta / 86400, 10)).toString() + ' days ago';
      }
      return 'about ' + r;
    }

    function build_url() {
      var proto = ('https:' == document.location.protocol ? 'https:' : 'http:');
      var count = (s.fetch === null) ? s.count : s.fetch;
      if (s.list) {
        return proto+"//"+s.twitter_api_url+"/1/"+s.username[0]+"/lists/"+s.list+"/statuses.json?per_page="+count+"&callback=?";
      } else if (s.favorites) {
        return proto+"//"+s.twitter_api_url+"/favorites/"+s.username[0]+".json?count="+s.count+"&callback=?";
      } else if (s.query === null && s.username.length == 1) {
        return proto+'//'+s.twitter_api_url+'/1/statuses/user_timeline.json?screen_name='+s.username[0]+'&count='+count+(s.retweets ? '&include_rts=1' : '')+'&callback=?';
      } else {
        var query = (s.query || 'from:'+s.username.join(' OR from:'));
        return proto+'//'+s.twitter_search_url+'/search.json?&q='+encodeURIComponent(query)+'&rpp='+count+'&callback=?';
      }
    }

    return this.each(function(i, widget){
      var list = $('<ul class="tweet_list">').appendTo(widget);
      var intro = '<p class="tweet_intro">'+s.intro_text+'</p>';
      var outro = '<p class="tweet_outro">'+s.outro_text+'</p>';
      var loading = $('<p class="loading">'+s.loading_text+'</p>');

      if(s.username && typeof(s.username) == "string"){
        s.username = [s.username];
      }

      var expand_template = function(info) {
        if (typeof s.template === "string") {
          var result = s.template;
          for(var key in info) {
            var val = info[key];
            result = result.replace(new RegExp('{'+key+'}','g'), val === null ? '' : val);
          }
          return result;
        } else return s.template(info);
      };

      if (s.loading_text) $(widget).append(loading);
      $(widget).bind("load", function(){
        $.getJSON(build_url(), function(data){
          if (s.loading_text) loading.remove();
          if (s.intro_text) list.before(intro);
          list.empty();

          var tweets = $.map(data.results || data, function(item){
            var join_text = s.join_text;

            // auto join text based on verb tense and content
            if (s.join_text == "auto") {
              if (item.text.match(/^(@([A-Za-z0-9-_]+)) .*/i)) {
                join_text = s.auto_join_text_reply;
              } else if (item.text.match(/(^\w+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&\?\/.=]+) .*/i)) {
                join_text = s.auto_join_text_url;
              } else if (item.text.match(/^((\w+ed)|just) .*/im)) {
                join_text = s.auto_join_text_ed;
              } else if (item.text.match(/^(\w*ing) .*/i)) {
                join_text = s.auto_join_text_ing;
              } else {
                join_text = s.auto_join_text_default;
              }
            }

            // Basic building blocks for constructing tweet <li> using a template
            var screen_name = item.from_user || item.user.screen_name;
            var source = item.source;
            var user_url = "http://"+s.twitter_url+"/"+screen_name;
            var avatar_size = s.avatar_size;
            var avatar_url = item.profile_image_url || item.user.profile_image_url;
            var tweet_url = "http://"+s.twitter_url+"/"+screen_name+"/statuses/"+item.id_str;
            var retweet = (typeof(item.retweeted_status) != 'undefined');
            var retweeted_screen_name = retweet ? item.retweeted_status.user.screen_name : null;
            var tweet_time = parse_date(item.created_at);
            var tweet_relative_time = relative_time(tweet_time);
            var tweet_raw_text = retweet ? ('RT @'+retweeted_screen_name+' '+item.retweeted_status.text) : item.text; // avoid '...' in long retweets
            var tweet_text = $([tweet_raw_text]).linkUrl().linkUser().linkHash()[0];

            // Default spans, and pre-formatted blocks for common layouts
            var user = '<a class="tweet_user" href="'+user_url+'">'+screen_name+'</a>';
            var join = ((s.join_text) ? (join_text) : ' ');
            var avatar = (avatar_size ?
                          ('<a class="tweet_avatar" href="'+user_url+'"><img src="'+avatar_url+
                           '" height="'+avatar_size+'" width="'+avatar_size+
                           '" alt="'+screen_name+'\'s avatar" title="'+screen_name+'\'s avatar" border="0"/></a>') : '');
            var time = '<span class="tweet_time"><a href="'+tweet_url+'" title="view tweet on twitter">'+tweet_relative_time+'</a></span>';
            var text = '<span class="tweet_text">'+$([tweet_text]).makeHeart().capAwesome().capEpic()[0]+ '</span>';

            return { item: item, // For advanced users who want to dig out other info
                     screen_name: screen_name,
                     user_url: user_url,
                     avatar_size: avatar_size,
                     avatar_url: avatar_url,
                     source: source,
                     tweet_url: tweet_url,
                     tweet_time: tweet_time,
                     tweet_relative_time: tweet_relative_time,
                     tweet_raw_text: tweet_raw_text,
                     tweet_text: tweet_text,
                     retweet: retweet,
                     retweeted_screen_name: retweeted_screen_name,
                     user: user,
                     join: join,
                     avatar: avatar,
                     time: time,
                     text: text
                   };
          });

          tweets = $.grep(tweets, s.filter).slice(0, s.count);
          list.append($.map(tweets.sort(s.comparator),
                            function(t) { return "<li>" + expand_template(t) + "</li>"; }).join('')).
              children('li:first').addClass('tweet_first').end().
              children('li:odd').addClass('tweet_even').end().
              children('li:even').addClass('tweet_odd');

          if (s.outro_text) list.after(outro);
          $(widget).trigger("loaded").trigger((tweets.length === 0 ? "empty" : "full"));
          if (s.refresh_interval) {
            window.setTimeout(function() { $(widget).trigger("load"); }, 1000 * s.refresh_interval);
          }
        });
      }).trigger("load");
    });
  };
})(jQuery);