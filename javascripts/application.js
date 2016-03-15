var buildconf = {

  //load_typekit: function(){
  //  WebFont.load({
  //    typekit: {
  //      id: 'zrf6wxa'
  //    },
  //    active: function() {
  //     // document.getElementById('buildconf').style.visibility = "visible";
  //    },
  //    inactive: function(){
  //    //  document.getElementById('buildconf').style.visibility = "visible";
  //    }
  //  });
  //},
  
  embed_twitter: function(){
    if($(".tweet").length) {
      $(".tweet").empty();
      $(".tweet").tweet({
          username: "buildconf",
          join_text: "",
          avatar_size: 0,
          count: 1,
          show_time: false,
          loading_text: "loading tweets..."
      });
    }
  },

  order_subtototal: function(){
    subtotal = 0;
    $.each($(".ticket-type"), function(){
      id=$(this).attr("id");
      price = $(this).find(".unit-price").val()
      quantity = $(this).find(".unit-quantity").val()
      if(quantity){
        row_subtotal = price*quantity;
        subtotal = subtotal + row_subtotal;
      }
    })
    return subtotal;
  },

  order_update_subtotal: function(){
    if($("#live-subtotal-field").length){
      $("#live-subtotal-field").html("&pound;"+this.order_subtototal());
    
      setTimeout(function() {
        buildconf.order_update_subtotal();
      }, 500);
    }
  },

  add_quantity_buttons: function(){
    down = "<p class='decrementer'>- </p>";
    up = "<p class='incrementer'> +</p>";

    $('.on-sale td:last-child').prepend(down);
    $('.on-sale td:last-child').append(up);

    if($(".qty input").val()==""){
      $(".qty input").val("0");
    }

    $('.incrementer').click(function(){
      that=$(this).parent().children("input")[0];
      value=$(that).val();
      if(value==""){
        value="0";
      }
      $(that).val(parseInt(value)+1);
    });

    $('.decrementer').click(function(){
      that=$(this).parent().children("input")[0];
      value=$(that).val();
      if(value>0) { $(that).val(parseInt(value)-1); }
    });
  },

  attendees: [],
  
  get_attendees: function(){
    buildconf.attendees = [];
    $('.ticket').each(function(){
      var id = $(this).attr('id');
      var email = $(this).find('.email').val()
      var name = $(this).find('.name').val()
      var company = $(this).find('.company').val()
      var attendee = {id: id, email: email, name: name, company: company}
      if(name != "" && email != ""){
        buildconf.attendees.push(attendee)
      }
    })
    return buildconf.attendees;
  },
  attendees_options: function(){
    var options = []
    var option = new Option("Select an Attendee", "");
    options.push(option)
    
    $(buildconf.attendees).each(function(){
      var option = new Option(this.name, this.id);
      options.push(option)
    })
    return options;
  },
  set_attendee_options: function(){
    $('.workshop').each(function(){
      var select = $(this).find('.for:first')
      var value = select.val()
      select.html(buildconf.attendees_options())
      select.val(value)
    })
    
    //  select.change(function(){
    //    var id = $(this).val();
    //    var ticket = $(id)
    //    var email = $(ticket).find('.email').val()
    //    var name = $(ticket).find('.name').val()
    //    var company = $(ticket).find('.company').val()
    //    
    //    var workshop = $(this).parent().parent()
    //    $(workshop).find('.name:first').val(name)
    //    $(workshop).find('.email:first').val(email)
    //    $(workshop).find('.company:first').val(company)
    //  })
    //})
  },
  set_attendees: function(){
    $('.workshop').each(function(){
      var select = $(this).find('.for:first')
      var id = select.val()
      
      var associated = $(this).find('.associated:first')
      if(associated.val() != ""){
        select.val('ticket_'+associated.val())
      }
      
      if( id != null || id != undefined){
        var ticket = $('#'+id)
        var email = $(ticket).find('.email:first').val()
        var name = $(ticket).find('.name:first').val()
        var company = $(ticket).find('.company:first').val()
        
        var ticket_id = id.substring(7,id.length)
        
        $(this).find('.associated:first').val(ticket_id)
        $(this).find('.name:first').val(name)
        $(this).find('.email:first').val(email)
        $(this).find('.company:first').val(company)
      }
    })
  },
  monitor_attendees: function(){
    $('#tickets').change(function(){
      buildconf.get_attendees();
      buildconf.set_attendee_options();
      buildconf.set_attendees();
    })
  }
}

$(function(){
  buildconf.add_quantity_buttons();
  buildconf.order_update_subtotal();
  
  //buildconf.load_typekit();
  //buildconf.embed_ga();
  buildconf.embed_twitter();
  //
  buildconf.get_attendees();
  buildconf.set_attendee_options();
  buildconf.set_attendees();
  buildconf.monitor_attendees();
});

$(function(){
  
  $.fn.toggler = function() {
    return this.focus(function() {
      if( this.value == "me@example.com" ) {
        this.value = "";
      }
    }).blur(function() {
      if( !this.value.length ) {
        this.value = "me@example.com"; //this.defaultValue;
      }
    });
  };
  
  $(function() {
    $(".js-buttons").show();

    $("#user-type input[type='radio']").click(function(){
      if($(this).val()=="existing") {
        $(".new-user").slideUp();
      }else if($(this).val()=="new") {
        $(".new-user").slideDown();
      }
    });
    
    if($("#user-email input").val()=="") {
      $("#user-email input").val("me@example.com").toggler();
    }
  });
  

//Validation for the order form on orders#new
    $('form#new_order').submit(function(){
      if($("#order_user_id").val()){
        return true; //this is an admin user
      }
      
      flag=false; error="";
      $(".qty input").each(function(){
        if($(this).val()!=0 && $(this).val()!="") {
          flag=true;
        }
      });
      
      if(!flag) {error="\n- You must specify some tickets to purchase"; }
      
      if(($("input#order_user_attributes_email").length>0) && ($("input#order_user_attributes_email").val()=="") || ($("input#order_user_attributes_email").val()=="me@example.com")) {
        error = error + "\n- You must specify an email address";
      }
      
      if(($("input#order_user_attributes_password").length>0) && ($("input#order_user_attributes_password").val()=="")) {
        error = error + "\n- You must specify a password";
      }
      
      if(error!="") {
        alert("There were errors in this form: " + error); return false
      } else {
        if($(".qty input").val()=="0"){
          // $(".qty input").val(""); no longer necessary?
        }
        comboq = $(".combo-pass .unit-quantity").val();
        if(comboq!="" && comboq>0) {
          $(".ticket-allocation-3 .unit-quantity").val(comboq);
          $(".ticket-allocation-4 .unit-quantity").val(comboq);
          //$("#order_discount_code").val("applied!");
          $(".combo-pass .unit-quantity").val(0);
        }
        return true
      }
    });
    
//Validation for the payment form on orders#show    
    $('form#new_payment').submit(function(){
      error="";
      
      $("#new_payment .required-field").each(function(){
        if($(this).val()=="") {
          error="\n - Please fill in all the required (*) fields";
        }
      });
      
      if($("#new_payment input#payment_company").val()==""){
        error+="\n - for your company name, 'Freelance' or 'N/A' is fine";
      }
      
      if(error!=""){
        alert("There were errors in this form: " + error); return false
      }
    });
    


    if($("#blog-list").length) {
      $.jGFeed('http://feeds.feedburner.com/buildconf', function(feeds){
        if(!feeds){ return false; }
        $("#blog-list").empty();

        for(var i=0; i<4; i++){ //feeds.entries.length
          var entry = feeds.entries[i];
          $("#blog-list").append("<li><a href='"+entry.link+"'>"+entry.title+"</a></li>");
        }
      }, 10);   
    }

});



$(function(){
  //$('.ticket:first').find('.name').val()
  
})

$(document).ready(function() {  
    $('.user-additional div').addClass("idleField");  
    $('.user-additional input').focus(function() {  
        $(this).parent(".idleField").removeClass("idleField");
		$(this).parent().addClass("focusField");  
       //if (this.value == this.defaultValue){  
       //    this.value = '';  
       //}  
       //if(this.value != this.defaultValue){  
       //    this.addClass("focusField");
       //}  
    });  
    $('.user-additional div input').blur(function() {  
        $('.user-additional div').removeClass("focusField");
		$('.user-additional div').addClass("idleField");  
        if ($.trim(this.value == '')){  
            this.value = (this.defaultValue ? this.defaultValue : '');  
        }  
    });  
});

$(document).ready(function(){
	if( $('.select-workshop').length != 0){
	  $('.select-workshop').sSelect();
	}
});

function unselectedCount(){
  var unselected = 0
  $(".selectedTxt").each(function(){
    if( $(this).html() == "No Workshop"){
      unselected++
    }
  })
  return unselected
}

function selectedCount(){
  var total = $(".selectedTxt").length
  var count = unselectedCount()
  return total-count
}

function hideWorkshopSelectors(){
  $('.newListSelected').each(function(){
    if( $(this).find('.selectedTxt').html() == "No Workshop" ){
      $(this).hide()
    }
  })
}

function showWorkshopSelectors(){
  $('.newListSelected').each(function(){
    if( $(this).find('.selectedTxt').html() == "No Workshop" ){
      $(this).show()
    }
  })
}

function hideWorkshpPasses(){
  var selected_count = selectedCount()
  var remaining = total_workshps-selected_count;
  var count = 1
  $('.workshop-pass').each(function(i,n){
    
    var selected = !($(n).find('.selectedTxt').html() == "No Workshop")
    if((count>remaining) && !(selected)){
      $(n).hide()
    }
    count++
  })
}
function showWorkshpPasses(){
  var selected_count = selectedCount()
  var remaining = total_workshps-selected_count;
  var count = 1
  
  $('.workshop-pass').each(function(i,n){
    if(i+1<=remaining){
      $(n).show()
    }
  })
}

function updateWorkshopCount(){

  var selected_count = selectedCount()
  var remaining = total_workshps-selected_count;
  var text = " workshops"
  
  if(remaining == 1){
    text = " workshop"
  }

  $('.workshop-credits').each(function(){
    $(this).html(remaining+text)
  })
  if(remaining == 0){
    $('#assign_pass').attr('disabled', true)
    showWorkshopSelectors()
    hideWorkshopSelectors()
  } else {
    $('#assign_pass').attr('disabled', false)
    showWorkshopSelectors()
  }
  showWorkshpPasses()
  hideWorkshpPasses()
}

$(document).ready(function(){
	$("#assign-pass-form").hide(); 	

	$("#assign_pass").click(function(){
	  $("#assign-pass-form").slideToggle("slow");
	  $(this).toggleClass("button-grey");
	  return false;
	});

  $(".select-workshop").change(function(){
    setTimeout(updateWorkshopCount, 100);
  })
});


$(document).ready(function(){
	$("#forgot-password-form").hide(); 	

	$(".forgot-password-button").click(function(){
	  $("#forgot-password-form").slideToggle("slow");
	  $("#user_submit").toggleClass("button-grey");
	});

});