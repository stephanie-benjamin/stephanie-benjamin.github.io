"use strict";
function scroll_to_class(element_class, removed_height) {
	var scroll_to = $(element_class).offset().top - removed_height;
	if($(window).scrollTop() != scroll_to) {
		$('.form-wizard').stop().animate({scrollTop: scroll_to}, 0);
	}
}
/*
    ids of screen to display
*/
var form_prefix_id = '.form-wizard fieldset#';

var first_screen_id = "first-screen";

var  adult_banquet_screen_id = "adult-banquet-screen";
var  adult_vin_screen_id = "adult-vin-screen";
var  last_adult_banquet_screen_id = "last-adult-banquet-screen";
var  last_adult_vin_screen_id = "last-adult-vin-screen";

var  bambino_banquet_screen_id = "adult-banquet-screen";
var  bambino_vin_screen_id = "adult-vin-screen";
var  last_bambino_banquet_screen_id = "last-adult-banquet-screen";
var  last_bambino_vin_screen_id = "last-adult-vin-screen";

var  junior_banquet_screen_id = "adult-banquet-screen";
var  junior_vin_screen_id = "adult-vin-screen";
var  last_junior_banquet_screen_id = "last-adult-banquet-screen";
var  last_junior_vin_screen_id = "last-adult-vin-screen";

/*
    ids of forms input
*/
var name_adult = "name-adult";
var starter_adult_banquet = "starter-adult-banquet";
var main_adult_banquet = "main-adult-banquet";
var last_prefix = "last-";

/*
    Values to gather and send to the gForm
*/
var vin_honneur;
var banquet;
var nb_adult;
var nb_bambinos;
var nb_junior;

var current_nb_adult = 0;
var current_nb_bambinos = 0;
var current_nb_junior = 0;

var current_screen;

function is_last_adult() {
    return current_nb_adult == 1;
}

function no_children() {
    return no_bambino && no_junior;
}

function no_bambino() {
    return current_nb_bambinos == 0;
}

function no_junior() {
    return current_nb_junior == 0;
}

var adults = new List();
var bambinos = new List();
var junior = new List();


jQuery(document).ready(function() {
    /*
        Form
    */
    $('.form-wizard fieldset:first').fadeIn('slow');

    current_screen = $('.form-wizard fieldset:first');

    $('.form-wizard .required').on('focus', function() {
    	$(this).removeClass('input-error');
    });

    // next step
    $('.form-wizard .btn-next').on('click', function() {
    	var parent_fieldset = $(this).parents('fieldset');
    	var next_step = true;

    	var isAdult = false;
    	var isBambino = false;
    	var isJunior = false;

        var name;
        var starter;
        var main;

    	// fields validation
    	parent_fieldset.find('input').each(function() {
    		if($(this)[0].required && $(this).val() == "" ) {
    			$(this).addClass('input-error');
    			next_step = false;
    		} else {
    			$(this).removeClass('input-error');
    		}
    		// checking out first screen answer
    	    if (parent_fieldset[0].id == first_screen_id) {
    	        switch($(this)[0].id) {
    	            case 'vin_honneur':
    	                vin_honneur = $(this)[0].checked;
    	                break;
    	            case 'banquet':
                        banquet = $(this)[0].checked;
                        break;
                    case "number_adult":
                        nb_adult = $(this)[0].value;
                        current_nb_adult = nb_adult;
                        break;
    	        }
    	    }
    	});
    	// fields validation

        //console.log(vin_honneur)
        //console.log(banquet);
        //console.log(nb_adult);
        //console.log(current_nb_adult);

        //console.log($('.form-wizard fieldset#first_screen'));

        var next_screen;
    	if (current_screen[0].id == first_screen_id) {
            if (!banquet) {
                next_screen = $(form_prefix_id + (is_last_adult() && no_children() ? last_prefix : "") + adult_vin_screen_id);
            } else {
                next_screen = $(form_prefix_id + (is_last_adult() && no_children() ? last_prefix : "") + adult_banquet_screen_id);
            }
            current_nb_adult--;
        } else if (current_screen[0].id.startsWith("adult")) {

            // retrieve info of adult

            if (!banquet) {
                next_screen = $(form_prefix_id + ( is_last_adult ?
                    (no_bambino ? junior_vin_screen_id : bambino_vin_screen_id) : adult_vin_screen_id)
                );
            } else {
                next_screen = $(form_prefix_id + ( is_last_adult ?
                    (no_bambino ? junior_banquet_screen_id : bambino_banquet_screen_id) : adult_banquet_screen_id)
                );
            }
            current_nb_adult--;
        }
    	if(next_step) {
    		parent_fieldset.fadeOut(400, function() {
    			// show next step
	    		//$(this).next().fadeIn();
	    		next_screen.fadeIn();
	    		// scroll window to beginning of the form
    			scroll_to_class( $('.form-wizard'), 20 );
	    	});
    	}
    	current_screen = next_screen;
        $("form").trigger("reset");
    });

    // previous step
    $('.form-wizard .btn-previous').on('click', function() {
        $("form").trigger("reset");
        var prev_screen;
        current_nb_adult++;
        if (current_screen[0].id.startsWith("adult")) {
            if (current_nb_adult == nb_adult) {
                prev_screen = $(form_prefix_id + first_screen_id);
            } else if (!banquet) {
                prev_screen = $(form_prefix_id + adult_vin_screen_id);
            } else {
                prev_screen = $(form_prefix_id + adult_banquet_screen_id);
            }
        }
    	$(this).parents('fieldset').fadeOut(400, function() {
    		// change icons
    		// show previous step
    		prev_screen.fadeIn();
    		// scroll window to beginning of the form
			scroll_to_class( $('.form-wizard'), 20 );
    	});
    	current_screen = prev_screen;
    });

    // submit
    $('.form-wizard .btn-submit').on('click', function(e) {
        console.log("TODO SUBMIT TODO")
    	// fields validation
        $(this).find('.required').each(function() {
            if( $(this).val() == "" ) {
        	    e.preventDefault();
        	    $(this).addClass('input-error');
        	} else {
        	    $(this).removeClass('input-error');
        	}
        });
        // fields validation
    });
});

// image uploader scripts

var $dropzone = $('.image_picker'),
    $droptarget = $('.drop_target'),
    $dropinput = $('#inputFile'),
    $dropimg = $('.image_preview'),
    $remover = $('[data-action="remove_current_image"]');

$dropzone.on('dragover', function() {
  $droptarget.addClass('dropping');
  return false;
});

$dropzone.on('dragend dragleave', function() {
  $droptarget.removeClass('dropping');
  return false;
});

$dropzone.on('drop', function(e) {
  $droptarget.removeClass('dropping');
  $droptarget.addClass('dropped');
  $remover.removeClass('disabled');
  e.preventDefault();

  var file = e.originalEvent.dataTransfer.files[0],
      reader = new FileReader();

  reader.onload = function(event) {
    $dropimg.css('background-image', 'url(' + event.target.result + ')');
  };

  console.log(file);
  reader.readAsDataURL(file);

  return false;
});

$dropinput.change(function(e) {
  $droptarget.addClass('dropped');
  $remover.removeClass('disabled');
  $('.image_title input').val('');

  var file = $dropinput.get(0).files[0],
      reader = new FileReader();

  reader.onload = function(event) {
    $dropimg.css('background-image', 'url(' + event.target.result + ')');
  }

  reader.readAsDataURL(file);
});

$remover.on('click', function() {
  $dropimg.css('background-image', '');
  $droptarget.removeClass('dropped');
  $remover.addClass('disabled');
  $('.image_title input').val('');
});

$('.image_title input').blur(function() {
  if ($(this).val() != '') {
    $droptarget.removeClass('dropped');
  }
});

// image uploader scripts