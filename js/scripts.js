$(document).ready(function(){
    $('.footer_twitter_container').tweet({
        username: "buildconf",
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
    
	$('.gift_pass').click(function() {
	
		if ($(this).hasClass('active')) {
			$(this).removeClass('active');
			$(this).siblings().removeClass('active');
			$(this).parent().siblings('.registration_block_container').children('.gifted_pass').animate({ top: '-200px' });
			$(this).parent().siblings('.registration_block_container').children('.registrant_info').animate({ top: '0px' });
		} else {
			$(this).siblings().removeClass('active');
			$(this).addClass('active');
			$(this).parent().siblings('.registration_block_container').children('.changed_workshop').animate({ top: '-200px' });
			$(this).parent().siblings('.registration_block_container').children('.registrant_info').animate({ top: '-200px' });
			$(this).parent().siblings('.registration_block_container').children('.gifted_pass').animate({ top: '0px' });
		}
		
		return false;

	});
	
	$('.change_workshop').click(function() {
	
		if ($(this).hasClass('active')) {
			$(this).removeClass('active');
			$(this).siblings().removeClass('active');
			$(this).parent().siblings('.registration_block_container').children('.changed_workshop').animate({ top: '-200px' });
			$(this).parent().siblings('.registration_block_container').children('.registrant_info').animate({ top: '0px' });
		} else {
			$(this).siblings().removeClass('active');
			$(this).addClass('active');
			$(this).parent().siblings('.registration_block_container').children('.gifted_pass').animate({ top: '-200px' });
			$(this).parent().siblings('.registration_block_container').children('.registrant_info').animate({ top: '-200px' });
			$(this).parent().siblings('.registration_block_container').children('.changed_workshop').animate({ top: '0px' });
		}
		
		return false;

	});
	
	$('.button_choose').click(function() {
	
		// submit form here
	
		$('.badge_header a').removeClass('active');
		$(this).parents('.changed_workshop').animate({ top: '-200px' });
		$(this).parents('.changed_workshop').siblings('.registrant_info').animate({ top: '0px' });
		
		// update workshop name
		
		return false;

	});
	
	$('#attendees_form input').focus(function() {
	   $(this).val('');
	});
	
/*
	var i = 0;
	$.getJSON("http://api.flickr.com/services/feeds/groups_pool.gne?id=1116060@N21&lang=en-us&format=json&jsoncallback=?", function(data){
  		$.each(data.items, function(i,item){
  			if ( i < 12 ) {
	    		$("<img/>").attr("src", item.media.m).appendTo(".flickr_images").wrap("<a target='_blank' href='" + item.link + "'></a>");
    			i++;
    		} else {
    			return;
    		}
  		});
	});
*/
	
});

function submitform() {
  $('#subForm').submit();
}
