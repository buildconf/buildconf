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
    
    // Current issue slideshow
    function _slideshow() {
        var slideshow = $('.slideshow');
            imageLinks = $('.current-nav a'),
            count = imageLinks.length;
        
        // Preload images
        imageLinks.each(function(k, v) {
            var self = $(this);
            
            // Preload the image
            if(k > 0) {
                $('<img />').attr({
                    src: self.attr('href'),
                    title: self.attr('title'),
                    width: 1440,
                    height: 500
                })
                .appendTo(slideshow);
            }
            
            // If we're at the end of the list, create the slideshow
            if (!--count) {
                $(".slideshow").cycle({
                    fx: 'fade',
                    after: function(curr, next) {
                        // Set the correct nav dot
                        var index = $('img', slideshow).index(next);
                        imageLinks.filter('.selected').removeClass('selected').end()
                                  .eq(index).addClass('selected');
                        
                       
                    }
                })
            };
                      
        }).live('click', function(e) {
            // Prevent Default Behaviour
            e.preventDefault();
            
            // Set the live event for clicking on the dots
            var index = imageLinks.index(this);
            slideshow.cycle('pause');
            slideshow.cycle(index);
            imageLinks.filter('.selected').removeClass('selected').end()
                      .eq(index).addClass('selected');
        });
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
    
    // Lightbox
    function _lightbox() {
	    $('a.zoom').unbind('click').fancyZoom({directory: "_gfx/fancyzoom"});
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
        $("#contact #email").example('me@mywebsite.com');
    }
    
/*
    function _sticky() {
        var $stickyWrap = $(".wrap-sticky"),
            $sticky = $(".sticky"),
            stickyOffset = $sticky.offset().top;
        
        // Make the wrap the same height as the sticky element
        $stickyWrap.height( $sticky.height() );
        
        $(window).scroll(function() {
            if( stickyOffset - $(document).scrollTop() <= 0 ) {
                $sticky.addClass("fixed");
            } else {
                $sticky.removeClass("fixed");
            }
        });
    }
*/
    
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
        _slideshow();
        
        // Show/hide side navs
        _sideMore();
        
        // Lightbox
        _lightbox();
        
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
* FancyZoom
* https://github.com/jnunemaker/fancy-zoom/
*/
(function(a){a.fn.fancyZoom=function(p){var p=p||{};var m=p&&p.directory?p.directory:"images";var e=false;if(a("#zoom").length==0){var f=a.browser.msie?"gif":"png";var k='<div id="zoom" style="display:none;">                   <table id="zoom_table" style="border-collapse:collapse; width:100%; height:100%;">                     <tbody>                       <tr>                         <td class="tl" style="background:url('+m+"/tl."+f+') 0 0 no-repeat; width:20px; height:20px; overflow:hidden;" />                         <td class="tm" style="background:url('+m+"/tm."+f+') 0 0 repeat-x; height:20px; overflow:hidden;" />                         <td class="tr" style="background:url('+m+"/tr."+f+') 100% 0 no-repeat; width:20px; height:20px; overflow:hidden;" />                       </tr>                       <tr>                         <td class="ml" style="background:url('+m+"/ml."+f+') 0 0 repeat-y; width:20px; overflow:hidden;" />                         <td class="mm" style="background:#fff; vertical-align:top; padding:10px;">                           <div id="zoom_content">                           </div>                         </td>                         <td class="mr" style="background:url('+m+"/mr."+f+') 100% 0 repeat-y;  width:20px; overflow:hidden;" />                       </tr>                       <tr>                         <td class="bl" style="background:url('+m+"/bl."+f+') 0 100% no-repeat; width:20px; height:20px; overflow:hidden;" />                         <td class="bm" style="background:url('+m+"/bm."+f+') 0 100% repeat-x; height:20px; overflow:hidden;" />                         <td class="br" style="background:url('+m+"/br."+f+') 100% 100% no-repeat; width:20px; height:20px; overflow:hidden;" />                       </tr>                     </tbody>                   </table>                   <a href="#" title="Close" id="zoom_close" style="position:absolute; top:0; left:0;">                     <img src="'+m+"/closebox."+f+'" alt="Close" style="border:none; margin:0; padding:0;" />                   </a>                 </div>';a("body").append(k);a("html").click(function(q){if(a(q.target).parents("#zoom:visible").length==0){l();}});a(document).keyup(function(q){if(q.keyCode==27&&a("#zoom:visible").length>0){l();}});a("#zoom_close").click(l);}var o=a("#zoom");var j=a("#zoom_table");var i=a("#zoom_close");var h=a("#zoom_content");var b=a("td.ml,td.mm,td.mr");this.each(function(q){a(a(this).attr("href")).hide();a(this).click(n);});return this;function n(w){if(e){return false;}e=true;var q=a(a(this).attr("href"));var u=p.width;var v=p.height;var r=window.innerWidth||(window.document.documentElement.clientWidth||window.document.body.clientWidth);var E=window.innerHeight||(window.document.documentElement.clientHeight||window.document.body.clientHeight);var C=window.pageXOffset||(window.document.documentElement.scrollLeft||window.document.body.scrollLeft);var B=window.pageYOffset||(window.document.documentElement.scrollTop||window.document.body.scrollTop);var F={width:r,height:E,x:C,y:B};var r=(u||q.width())+60;var E=(v||q.height())+60;var z=F;var A=Math.max((z.height/2)-(E/2)+B,0);var D=(z.width/2)-(r/2);var s=w.pageY;var t=w.pageX;i.attr("curTop",s);i.attr("curLeft",t);i.attr("scaleImg",p.scaleImg?"true":"false");a("#zoom").hide().css({position:"absolute",top:s+"px",left:t+"px",width:"1px",height:"1px"});g();i.hide();if(p.closeOnClick){a("#zoom").click(l);}if(p.scaleImg){h.html(q.html());a("#zoom_content img").css("width","100%");}else{h.html("");}a("#zoom").animate({top:A+"px",left:D+"px",opacity:"show",width:r,height:E},500,null,function(){if(p.scaleImg!=true){h.html(q.html());}d();i.show();e=false;});return false;}function l(){if(e){return false;}e=true;a("#zoom").unbind("click");g();if(i.attr("scaleImg")!="true"){h.html("");}i.hide();a("#zoom").animate({top:i.attr("curTop")+"px",left:i.attr("curLeft")+"px",opacity:"hide",width:"1px",height:"1px"},500,null,function(){if(i.attr("scaleImg")=="true"){h.html("");}d();e=false;});return false;}function c(s){a("#zoom_table td").each(function(u){var t=a(this).css("background-image").replace(/\.(png|gif|none)\"\)$/,"."+s+'")');a(this).css("background-image",t);});var r=i.children("img");var q=r.attr("src").replace(/\.(png|gif|none)$/,"."+s);r.attr("src",q);}function g(){if(a.browser.msie&&parseFloat(a.browser.version)>=7){c("gif");}}function d(){if(a.browser.msie&&a.browser.version>=7){c("png");}}};})(jQuery);

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

/*
 * jQuery Cycle Plugin (core engine only)
 * Examples and documentation at: http://jquery.malsup.com/cycle/
 * Copyright (c) 2007-2010 M. Alsup
 * Version: 2.99 (12-MAR-2011)
 * Dual licensed under the MIT and GPL licenses.
 * http://jquery.malsup.com/license.html
 * Requires: jQuery v1.3.2 or later
 */
(function($){var ver="2.99";if($.support==undefined){$.support={opacity:!($.browser.msie)};}function debug(s){$.fn.cycle.debug&&log(s);}function log(){window.console&&console.log&&console.log("[cycle] "+Array.prototype.join.call(arguments," "));}$.expr[":"].paused=function(el){return el.cyclePause;};$.fn.cycle=function(options,arg2){var o={s:this.selector,c:this.context};if(this.length===0&&options!="stop"){if(!$.isReady&&o.s){log("DOM not ready, queuing slideshow");$(function(){$(o.s,o.c).cycle(options,arg2);});return this;}log("terminating; zero elements found by selector"+($.isReady?"":" (DOM not ready)"));return this;}return this.each(function(){var opts=handleArguments(this,options,arg2);if(opts===false){return;}opts.updateActivePagerLink=opts.updateActivePagerLink||$.fn.cycle.updateActivePagerLink;if(this.cycleTimeout){clearTimeout(this.cycleTimeout);}this.cycleTimeout=this.cyclePause=0;var $cont=$(this);var $slides=opts.slideExpr?$(opts.slideExpr,this):$cont.children();var els=$slides.get();if(els.length<2){log("terminating; too few slides: "+els.length);return;}var opts2=buildOptions($cont,$slides,els,opts,o);if(opts2===false){return;}var startTime=opts2.continuous?10:getTimeout(els[opts2.currSlide],els[opts2.nextSlide],opts2,!opts2.backwards);if(startTime){startTime+=(opts2.delay||0);if(startTime<10){startTime=10;}debug("first timeout: "+startTime);this.cycleTimeout=setTimeout(function(){go(els,opts2,0,!opts.backwards);},startTime);}});};function handleArguments(cont,options,arg2){if(cont.cycleStop==undefined){cont.cycleStop=0;}if(options===undefined||options===null){options={};}if(options.constructor==String){switch(options){case"destroy":case"stop":var opts=$(cont).data("cycle.opts");if(!opts){return false;}cont.cycleStop++;if(cont.cycleTimeout){clearTimeout(cont.cycleTimeout);}cont.cycleTimeout=0;$(cont).removeData("cycle.opts");if(options=="destroy"){destroy(opts);}return false;case"toggle":cont.cyclePause=(cont.cyclePause===1)?0:1;checkInstantResume(cont.cyclePause,arg2,cont);return false;case"pause":cont.cyclePause=1;return false;case"resume":cont.cyclePause=0;checkInstantResume(false,arg2,cont);return false;case"prev":case"next":var opts=$(cont).data("cycle.opts");if(!opts){log('options not found, "prev/next" ignored');return false;}$.fn.cycle[options](opts);return false;default:options={fx:options};}return options;}else{if(options.constructor==Number){var num=options;options=$(cont).data("cycle.opts");if(!options){log("options not found, can not advance slide");return false;}if(num<0||num>=options.elements.length){log("invalid slide index: "+num);return false;}options.nextSlide=num;if(cont.cycleTimeout){clearTimeout(cont.cycleTimeout);cont.cycleTimeout=0;}if(typeof arg2=="string"){options.oneTimeFx=arg2;}go(options.elements,options,1,num>=options.currSlide);return false;}}return options;function checkInstantResume(isPaused,arg2,cont){if(!isPaused&&arg2===true){var options=$(cont).data("cycle.opts");if(!options){log("options not found, can not resume");return false;}if(cont.cycleTimeout){clearTimeout(cont.cycleTimeout);cont.cycleTimeout=0;}go(options.elements,options,1,!options.backwards);}}}function removeFilter(el,opts){if(!$.support.opacity&&opts.cleartype&&el.style.filter){try{el.style.removeAttribute("filter");}catch(smother){}}}function destroy(opts){if(opts.next){$(opts.next).unbind(opts.prevNextEvent);}if(opts.prev){$(opts.prev).unbind(opts.prevNextEvent);}if(opts.pager||opts.pagerAnchorBuilder){$.each(opts.pagerAnchors||[],function(){this.unbind().remove();});}opts.pagerAnchors=null;if(opts.destroy){opts.destroy(opts);}}function buildOptions($cont,$slides,els,options,o){var opts=$.extend({},$.fn.cycle.defaults,options||{},$.metadata?$cont.metadata():$.meta?$cont.data():{});if(opts.autostop){opts.countdown=opts.autostopCount||els.length;}var cont=$cont[0];$cont.data("cycle.opts",opts);opts.$cont=$cont;opts.stopCount=cont.cycleStop;opts.elements=els;opts.before=opts.before?[opts.before]:[];opts.after=opts.after?[opts.after]:[];if(!$.support.opacity&&opts.cleartype){opts.after.push(function(){removeFilter(this,opts);});}if(opts.continuous){opts.after.push(function(){go(els,opts,0,!opts.backwards);});}saveOriginalOpts(opts);if(!$.support.opacity&&opts.cleartype&&!opts.cleartypeNoBg){clearTypeFix($slides);}if($cont.css("position")=="static"){$cont.css("position","relative");}if(opts.width){$cont.width(opts.width);}if(opts.height&&opts.height!="auto"){$cont.height(opts.height);}if(opts.startingSlide){opts.startingSlide=parseInt(opts.startingSlide);}else{if(opts.backwards){opts.startingSlide=els.length-1;}}if(opts.random){opts.randomMap=[];for(var i=0;i<els.length;i++){opts.randomMap.push(i);}opts.randomMap.sort(function(a,b){return Math.random()-0.5;});opts.randomIndex=1;opts.startingSlide=opts.randomMap[1];}else{if(opts.startingSlide>=els.length){opts.startingSlide=0;}}opts.currSlide=opts.startingSlide||0;var first=opts.startingSlide;$slides.css({position:"absolute",top:0,left:0}).hide().each(function(i){var z;if(opts.backwards){z=first?i<=first?els.length+(i-first):first-i:els.length-i;}else{z=first?i>=first?els.length-(i-first):first-i:els.length-i;}$(this).css("z-index",z);});$(els[first]).css("opacity",1).show();removeFilter(els[first],opts);if(opts.fit&&opts.width){$slides.width(opts.width);}if(opts.fit&&opts.height&&opts.height!="auto"){$slides.height(opts.height);}var reshape=opts.containerResize&&!$cont.innerHeight();if(reshape){var maxw=0,maxh=0;for(var j=0;j<els.length;j++){var $e=$(els[j]),e=$e[0],w=$e.outerWidth(),h=$e.outerHeight();if(!w){w=e.offsetWidth||e.width||$e.attr("width");}if(!h){h=e.offsetHeight||e.height||$e.attr("height");}maxw=w>maxw?w:maxw;maxh=h>maxh?h:maxh;}if(maxw>0&&maxh>0){$cont.css({width:maxw+"px",height:maxh+"px"});}}if(opts.pause){$cont.hover(function(){this.cyclePause++;},function(){this.cyclePause--;});}if(supportMultiTransitions(opts)===false){return false;}var requeue=false;options.requeueAttempts=options.requeueAttempts||0;$slides.each(function(){var $el=$(this);this.cycleH=(opts.fit&&opts.height)?opts.height:($el.height()||this.offsetHeight||this.height||$el.attr("height")||0);this.cycleW=(opts.fit&&opts.width)?opts.width:($el.width()||this.offsetWidth||this.width||$el.attr("width")||0);if($el.is("img")){var loadingIE=($.browser.msie&&this.cycleW==28&&this.cycleH==30&&!this.complete);var loadingFF=($.browser.mozilla&&this.cycleW==34&&this.cycleH==19&&!this.complete);var loadingOp=($.browser.opera&&((this.cycleW==42&&this.cycleH==19)||(this.cycleW==37&&this.cycleH==17))&&!this.complete);var loadingOther=(this.cycleH==0&&this.cycleW==0&&!this.complete);if(loadingIE||loadingFF||loadingOp||loadingOther){if(o.s&&opts.requeueOnImageNotLoaded&&++options.requeueAttempts<100){log(options.requeueAttempts," - img slide not loaded, requeuing slideshow: ",this.src,this.cycleW,this.cycleH);setTimeout(function(){$(o.s,o.c).cycle(options);},opts.requeueTimeout);requeue=true;return false;}else{log("could not determine size of image: "+this.src,this.cycleW,this.cycleH);}}}return true;});if(requeue){return false;}opts.cssBefore=opts.cssBefore||{};opts.cssAfter=opts.cssAfter||{};opts.cssFirst=opts.cssFirst||{};opts.animIn=opts.animIn||{};opts.animOut=opts.animOut||{};$slides.not(":eq("+first+")").css(opts.cssBefore);$($slides[first]).css(opts.cssFirst);if(opts.timeout){opts.timeout=parseInt(opts.timeout);if(opts.speed.constructor==String){opts.speed=$.fx.speeds[opts.speed]||parseInt(opts.speed);}if(!opts.sync){opts.speed=opts.speed/2;}var buffer=opts.fx=="none"?0:opts.fx=="shuffle"?500:250;while((opts.timeout-opts.speed)<buffer){opts.timeout+=opts.speed;}}if(opts.easing){opts.easeIn=opts.easeOut=opts.easing;}if(!opts.speedIn){opts.speedIn=opts.speed;}if(!opts.speedOut){opts.speedOut=opts.speed;}opts.slideCount=els.length;opts.currSlide=opts.lastSlide=first;if(opts.random){if(++opts.randomIndex==els.length){opts.randomIndex=0;}opts.nextSlide=opts.randomMap[opts.randomIndex];}else{if(opts.backwards){opts.nextSlide=opts.startingSlide==0?(els.length-1):opts.startingSlide-1;}else{opts.nextSlide=opts.startingSlide>=(els.length-1)?0:opts.startingSlide+1;}}if(!opts.multiFx){var init=$.fn.cycle.transitions[opts.fx];if($.isFunction(init)){init($cont,$slides,opts);}else{if(opts.fx!="custom"&&!opts.multiFx){log("unknown transition: "+opts.fx,"; slideshow terminating");return false;}}}var e0=$slides[first];if(opts.before.length){opts.before[0].apply(e0,[e0,e0,opts,true]);}if(opts.after.length){opts.after[0].apply(e0,[e0,e0,opts,true]);}if(opts.next){$(opts.next).bind(opts.prevNextEvent,function(){return advance(opts,1);});}if(opts.prev){$(opts.prev).bind(opts.prevNextEvent,function(){return advance(opts,0);});}if(opts.pager||opts.pagerAnchorBuilder){buildPager(els,opts);}exposeAddSlide(opts,els);return opts;}function saveOriginalOpts(opts){opts.original={before:[],after:[]};opts.original.cssBefore=$.extend({},opts.cssBefore);opts.original.cssAfter=$.extend({},opts.cssAfter);opts.original.animIn=$.extend({},opts.animIn);opts.original.animOut=$.extend({},opts.animOut);$.each(opts.before,function(){opts.original.before.push(this);});$.each(opts.after,function(){opts.original.after.push(this);});}function supportMultiTransitions(opts){var i,tx,txs=$.fn.cycle.transitions;if(opts.fx.indexOf(",")>0){opts.multiFx=true;opts.fxs=opts.fx.replace(/\s*/g,"").split(",");for(i=0;i<opts.fxs.length;i++){var fx=opts.fxs[i];tx=txs[fx];if(!tx||!txs.hasOwnProperty(fx)||!$.isFunction(tx)){log("discarding unknown transition: ",fx);opts.fxs.splice(i,1);i--;}}if(!opts.fxs.length){log("No valid transitions named; slideshow terminating.");return false;}}else{if(opts.fx=="all"){opts.multiFx=true;opts.fxs=[];for(p in txs){tx=txs[p];if(txs.hasOwnProperty(p)&&$.isFunction(tx)){opts.fxs.push(p);}}}}if(opts.multiFx&&opts.randomizeEffects){var r1=Math.floor(Math.random()*20)+30;for(i=0;i<r1;i++){var r2=Math.floor(Math.random()*opts.fxs.length);opts.fxs.push(opts.fxs.splice(r2,1)[0]);}debug("randomized fx sequence: ",opts.fxs);}return true;}function exposeAddSlide(opts,els){opts.addSlide=function(newSlide,prepend){var $s=$(newSlide),s=$s[0];if(!opts.autostopCount){opts.countdown++;}els[prepend?"unshift":"push"](s);if(opts.els){opts.els[prepend?"unshift":"push"](s);}opts.slideCount=els.length;$s.css("position","absolute");$s[prepend?"prependTo":"appendTo"](opts.$cont);if(prepend){opts.currSlide++;opts.nextSlide++;}if(!$.support.opacity&&opts.cleartype&&!opts.cleartypeNoBg){clearTypeFix($s);}if(opts.fit&&opts.width){$s.width(opts.width);}if(opts.fit&&opts.height&&opts.height!="auto"){$s.height(opts.height);}s.cycleH=(opts.fit&&opts.height)?opts.height:$s.height();s.cycleW=(opts.fit&&opts.width)?opts.width:$s.width();$s.css(opts.cssBefore);if(opts.pager||opts.pagerAnchorBuilder){$.fn.cycle.createPagerAnchor(els.length-1,s,$(opts.pager),els,opts);}if($.isFunction(opts.onAddSlide)){opts.onAddSlide($s);}else{$s.hide();}};}$.fn.cycle.resetState=function(opts,fx){fx=fx||opts.fx;opts.before=[];opts.after=[];opts.cssBefore=$.extend({},opts.original.cssBefore);opts.cssAfter=$.extend({},opts.original.cssAfter);opts.animIn=$.extend({},opts.original.animIn);opts.animOut=$.extend({},opts.original.animOut);opts.fxFn=null;$.each(opts.original.before,function(){opts.before.push(this);});$.each(opts.original.after,function(){opts.after.push(this);});var init=$.fn.cycle.transitions[fx];if($.isFunction(init)){init(opts.$cont,$(opts.elements),opts);}};function go(els,opts,manual,fwd){if(manual&&opts.busy&&opts.manualTrump){debug("manualTrump in go(), stopping active transition");$(els).stop(true,true);opts.busy=0;}if(opts.busy){debug("transition active, ignoring new tx request");return;}var p=opts.$cont[0],curr=els[opts.currSlide],next=els[opts.nextSlide];if(p.cycleStop!=opts.stopCount||p.cycleTimeout===0&&!manual){return;}if(!manual&&!p.cyclePause&&!opts.bounce&&((opts.autostop&&(--opts.countdown<=0))||(opts.nowrap&&!opts.random&&opts.nextSlide<opts.currSlide))){if(opts.end){opts.end(opts);}return;}var changed=false;if((manual||!p.cyclePause)&&(opts.nextSlide!=opts.currSlide)){changed=true;var fx=opts.fx;curr.cycleH=curr.cycleH||$(curr).height();curr.cycleW=curr.cycleW||$(curr).width();next.cycleH=next.cycleH||$(next).height();next.cycleW=next.cycleW||$(next).width();if(opts.multiFx){if(opts.lastFx==undefined||++opts.lastFx>=opts.fxs.length){opts.lastFx=0;}fx=opts.fxs[opts.lastFx];opts.currFx=fx;}if(opts.oneTimeFx){fx=opts.oneTimeFx;opts.oneTimeFx=null;}$.fn.cycle.resetState(opts,fx);if(opts.before.length){$.each(opts.before,function(i,o){if(p.cycleStop!=opts.stopCount){return;}o.apply(next,[curr,next,opts,fwd]);});}var after=function(){opts.busy=0;$.each(opts.after,function(i,o){if(p.cycleStop!=opts.stopCount){return;}o.apply(next,[curr,next,opts,fwd]);});};debug("tx firing("+fx+"); currSlide: "+opts.currSlide+"; nextSlide: "+opts.nextSlide);opts.busy=1;if(opts.fxFn){opts.fxFn(curr,next,opts,after,fwd,manual&&opts.fastOnEvent);}else{if($.isFunction($.fn.cycle[opts.fx])){$.fn.cycle[opts.fx](curr,next,opts,after,fwd,manual&&opts.fastOnEvent);}else{$.fn.cycle.custom(curr,next,opts,after,fwd,manual&&opts.fastOnEvent);}}}if(changed||opts.nextSlide==opts.currSlide){opts.lastSlide=opts.currSlide;if(opts.random){opts.currSlide=opts.nextSlide;if(++opts.randomIndex==els.length){opts.randomIndex=0;}opts.nextSlide=opts.randomMap[opts.randomIndex];if(opts.nextSlide==opts.currSlide){opts.nextSlide=(opts.currSlide==opts.slideCount-1)?0:opts.currSlide+1;}}else{if(opts.backwards){var roll=(opts.nextSlide-1)<0;if(roll&&opts.bounce){opts.backwards=!opts.backwards;opts.nextSlide=1;opts.currSlide=0;}else{opts.nextSlide=roll?(els.length-1):opts.nextSlide-1;opts.currSlide=roll?0:opts.nextSlide+1;}}else{var roll=(opts.nextSlide+1)==els.length;if(roll&&opts.bounce){opts.backwards=!opts.backwards;opts.nextSlide=els.length-2;opts.currSlide=els.length-1;}else{opts.nextSlide=roll?0:opts.nextSlide+1;opts.currSlide=roll?els.length-1:opts.nextSlide-1;}}}}if(changed&&opts.pager){opts.updateActivePagerLink(opts.pager,opts.currSlide,opts.activePagerClass);}var ms=0;if(opts.timeout&&!opts.continuous){ms=getTimeout(els[opts.currSlide],els[opts.nextSlide],opts,fwd);}else{if(opts.continuous&&p.cyclePause){ms=10;}}if(ms>0){p.cycleTimeout=setTimeout(function(){go(els,opts,0,!opts.backwards);},ms);}}$.fn.cycle.updateActivePagerLink=function(pager,currSlide,clsName){$(pager).each(function(){$(this).children().removeClass(clsName).eq(currSlide).addClass(clsName);});};function getTimeout(curr,next,opts,fwd){if(opts.timeoutFn){var t=opts.timeoutFn.call(curr,curr,next,opts,fwd);while(opts.fx!="none"&&(t-opts.speed)<250){t+=opts.speed;}debug("calculated timeout: "+t+"; speed: "+opts.speed);if(t!==false){return t;}}return opts.timeout;}$.fn.cycle.next=function(opts){advance(opts,1);};$.fn.cycle.prev=function(opts){advance(opts,0);};function advance(opts,moveForward){var val=moveForward?1:-1;var els=opts.elements;var p=opts.$cont[0],timeout=p.cycleTimeout;if(timeout){clearTimeout(timeout);p.cycleTimeout=0;}if(opts.random&&val<0){opts.randomIndex--;if(--opts.randomIndex==-2){opts.randomIndex=els.length-2;}else{if(opts.randomIndex==-1){opts.randomIndex=els.length-1;}}opts.nextSlide=opts.randomMap[opts.randomIndex];}else{if(opts.random){opts.nextSlide=opts.randomMap[opts.randomIndex];}else{opts.nextSlide=opts.currSlide+val;if(opts.nextSlide<0){if(opts.nowrap){return false;}opts.nextSlide=els.length-1;}else{if(opts.nextSlide>=els.length){if(opts.nowrap){return false;}opts.nextSlide=0;}}}}var cb=opts.onPrevNextEvent||opts.prevNextClick;if($.isFunction(cb)){cb(val>0,opts.nextSlide,els[opts.nextSlide]);}go(els,opts,1,moveForward);return false;}function buildPager(els,opts){var $p=$(opts.pager);$.each(els,function(i,o){$.fn.cycle.createPagerAnchor(i,o,$p,els,opts);});opts.updateActivePagerLink(opts.pager,opts.startingSlide,opts.activePagerClass);}$.fn.cycle.createPagerAnchor=function(i,el,$p,els,opts){var a;if($.isFunction(opts.pagerAnchorBuilder)){a=opts.pagerAnchorBuilder(i,el);debug("pagerAnchorBuilder("+i+", el) returned: "+a);}else{a='<a href="#">'+(i+1)+"</a>";}if(!a){return;}var $a=$(a);if($a.parents("body").length===0){var arr=[];if($p.length>1){$p.each(function(){var $clone=$a.clone(true);$(this).append($clone);arr.push($clone[0]);});$a=$(arr);}else{$a.appendTo($p);}}opts.pagerAnchors=opts.pagerAnchors||[];opts.pagerAnchors.push($a);$a.bind(opts.pagerEvent,function(e){e.preventDefault();opts.nextSlide=i;var p=opts.$cont[0],timeout=p.cycleTimeout;if(timeout){clearTimeout(timeout);p.cycleTimeout=0;}var cb=opts.onPagerEvent||opts.pagerClick;if($.isFunction(cb)){cb(opts.nextSlide,els[opts.nextSlide]);}go(els,opts,1,opts.currSlide<i);});if(!/^click/.test(opts.pagerEvent)&&!opts.allowPagerClickBubble){$a.bind("click.cycle",function(){return false;});}if(opts.pauseOnPagerHover){$a.hover(function(){opts.$cont[0].cyclePause++;},function(){opts.$cont[0].cyclePause--;});}};$.fn.cycle.hopsFromLast=function(opts,fwd){var hops,l=opts.lastSlide,c=opts.currSlide;if(fwd){hops=c>l?c-l:opts.slideCount-l;}else{hops=c<l?l-c:l+opts.slideCount-c;}return hops;};function clearTypeFix($slides){debug("applying clearType background-color hack");function hex(s){s=parseInt(s).toString(16);return s.length<2?"0"+s:s;}function getBg(e){for(;e&&e.nodeName.toLowerCase()!="html";e=e.parentNode){var v=$.css(e,"background-color");if(v&&v.indexOf("rgb")>=0){var rgb=v.match(/\d+/g);return"#"+hex(rgb[0])+hex(rgb[1])+hex(rgb[2]);}if(v&&v!="transparent"){return v;}}return"#ffffff";}$slides.each(function(){$(this).css("background-color",getBg(this));});}$.fn.cycle.commonReset=function(curr,next,opts,w,h,rev){$(opts.elements).not(curr).hide();if(typeof opts.cssBefore.opacity=="undefined"){opts.cssBefore.opacity=1;}opts.cssBefore.display="block";if(opts.slideResize&&w!==false&&next.cycleW>0){opts.cssBefore.width=next.cycleW;}if(opts.slideResize&&h!==false&&next.cycleH>0){opts.cssBefore.height=next.cycleH;}opts.cssAfter=opts.cssAfter||{};opts.cssAfter.display="none";$(curr).css("zIndex",opts.slideCount+(rev===true?1:0));$(next).css("zIndex",opts.slideCount+(rev===true?0:1));};$.fn.cycle.custom=function(curr,next,opts,cb,fwd,speedOverride){var $l=$(curr),$n=$(next);var speedIn=opts.speedIn,speedOut=opts.speedOut,easeIn=opts.easeIn,easeOut=opts.easeOut;$n.css(opts.cssBefore);if(speedOverride){if(typeof speedOverride=="number"){speedIn=speedOut=speedOverride;}else{speedIn=speedOut=1;}easeIn=easeOut=null;}var fn=function(){$n.animate(opts.animIn,speedIn,easeIn,function(){cb();});};$l.animate(opts.animOut,speedOut,easeOut,function(){$l.css(opts.cssAfter);if(!opts.sync){fn();}});if(opts.sync){fn();}};$.fn.cycle.transitions={fade:function($cont,$slides,opts){$slides.not(":eq("+opts.currSlide+")").css("opacity",0);opts.before.push(function(curr,next,opts){$.fn.cycle.commonReset(curr,next,opts);opts.cssBefore.opacity=0;});opts.animIn={opacity:1};opts.animOut={opacity:0};opts.cssBefore={top:0,left:0};}};$.fn.cycle.ver=function(){return ver;};$.fn.cycle.defaults={activePagerClass:"activeSlide",after:null,allowPagerClickBubble:false,animIn:null,animOut:null,autostop:0,autostopCount:0,backwards:false,before:null,cleartype:!$.support.opacity,cleartypeNoBg:false,containerResize:1,continuous:0,cssAfter:null,cssBefore:null,delay:0,easeIn:null,easeOut:null,easing:null,end:null,fastOnEvent:0,fit:0,fx:"fade",fxFn:null,height:"auto",manualTrump:true,next:null,nowrap:0,onPagerEvent:null,onPrevNextEvent:null,pager:null,pagerAnchorBuilder:null,pagerEvent:"click.cycle",pause:0,pauseOnPagerHover:0,prev:null,prevNextEvent:"click.cycle",random:0,randomizeEffects:1,requeueOnImageNotLoaded:true,requeueTimeout:250,rev:0,shuffle:null,slideExpr:null,slideResize:1,speed:1000,speedIn:null,speedOut:null,startingSlide:0,sync:1,timeout:4000,timeoutFn:null,updateActivePagerLink:null};})(jQuery);
