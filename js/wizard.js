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

var  adult_banquet_screen_id = "adult-screen-banquet";
var  adult_vin_screen_id = "adult-screen-vin";
var  last_adult_banquet_screen_id = "last-adult-screen-banquet";
var  last_adult_vin_screen_id = "last-adult-screen-vin";

var  bambino_banquet_screen_id = "bambino-screen-banquet";
var  bambino_vin_screen_id = "bambino-screen-vin";
var  last_bambino_banquet_screen_id = "last-bambino-screen-banquet";
var  last_bambino_vin_screen_id = "last-bambino-screen-vin";

var  junior_banquet_screen_id = "adult-banquet-screen";
var  junior_vin_screen_id = "adult-vin-screen";
var  last_junior_banquet_screen_id = "last-adult-banquet-screen";
var  last_junior_vin_screen_id = "last-adult-vin-screen";

var suffix_banquet = '-banquet';
var suffix_vin = '-vin';

/*
    ids of forms input
*/
/* first screen */
var input_pattern = 'input#';
var vin_honneur_id = input_pattern + 'vin_honneur';
var banquet_id = input_pattern + 'banquet';
var number_adult_id = input_pattern + 'number_adult';
var number_bambino_id = input_pattern + 'number_bambino';
var number_junior_id = input_pattern + 'number_junior';

/* adult screen */
var name_adult_id = "name-adult";
var start_checkbox_1_id = "starter-adult-banquet-1";
var start_checkbox_2_id = "starter-adult-banquet-2";
var main_checkbox_1_id = "main-adult-banquet-1";
var main_checkbox_2_id = "main-adult-banquet-2";
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
    return current_nb_adult == nb_adult - 1;
}

function no_children() {
    return no_bambino() && no_junior();
}

function no_bambino() {
    return nb_bambinos == 0;
}

function is_last_bambino() {
    return current_nb_bambinos == nb_bambinos -1;
}

function no_junior() {
    return nb_junior == 0;
}

/*
    arrays that will store the needed values
*/
var adults = [];
var juniors = [];
var bambinos = [];

function Adult(name, attend_to_vin_honneur, attend_to_diner, starter_1, starter_2, main_1, main_2) {
    this.name = name;
    this.attend_to_vin_honneur = attend_to_vin_honneur;
    this.attend_to_diner = attend_to_diner;
    this.starter_1 = starter_1;
    this.starter_2 = starter_2;
    this.main_1 = main_1;
    this.main_2 = main_2;
}

function printAdult(adult) {
    console.log(adult.name + ", " + adult.attend_to_vin_honneur + ", " + adult.attend_to_diner + ", " + adult.starter_1 + ", " + adult.starter_2 + ", " + adult.main_1+ ", " + adult.main_2)
}

function addAdult(parent_fieldset) {
    var current_name = parent_fieldset.find(input_pattern + name_adult_id)[0].value;
    if (banquet) {
        var starter_1 = parent_fieldset.find(input_pattern + start_checkbox_1_id)[0].checked;
        var starter_2 = parent_fieldset.find(input_pattern + start_checkbox_2_id)[0].checked;
        var main_1 = parent_fieldset.find(input_pattern + main_checkbox_1_id)[0].checked;
        var main_2 = parent_fieldset.find(input_pattern + main_checkbox_2_id)[0].checked;
    } else {
        var starter_1 = banquet;
        var starter_2 = banquet;
        var main_1 = banquet;
        var main_2 = banquet;
    }
    var adult = new Adult(current_name, vin_honneur, banquet, starter_1, starter_2, main_1, main_2)
    adults.push(adult);
    console.log(adult.name + ", " + adult.attend_to_vin_honneur + ", " + adult.attend_to_diner + ", " + adult.starter_1 + ", " + adult.starter_2 + ", " + adult.main_1+ ", " + adult.main_2);
    current_nb_adult++;
}

function fields_validation(parent_fieldset){
    var next_step = true;
    parent_fieldset.find('input').each(function() {
        $(this).removeClass('input-error');
    	if($(this)[0].required && $(this)[0].value == "") {
    		$(this).addClass('input-error');
    	    next_step = false;
        }
    });
    return next_step;
}

function restore_previous_answer_adult(fieldset) {
    var current_name = adults[current_nb_adult].name;
    fieldset.find(input_pattern + name_adult_id)[0].value = current_name;
    if (banquet) {
        fieldset.find(input_pattern + start_checkbox_1_id)[0].checked = adults[current_nb_adult].starter_1;
        fieldset.find(input_pattern + start_checkbox_2_id)[0].checked = adults[current_nb_adult].starter_2;
        fieldset.find(input_pattern + main_checkbox_1_id)[0].checked = adults[current_nb_adult].main_1;
        fieldset.find(input_pattern + main_checkbox_2_id)[0].checked = adults[current_nb_adult].main_2;
    }
}

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
        var next_step = fields_validation(parent_fieldset);
        if (!next_step) {
            $("form").trigger("reset");
            return;
        }
        var next_screen;
        /* first screen validation */
        if (current_screen[0].id == first_screen_id) {
            vin_honneur = parent_fieldset.find(vin_honneur_id)[0].checked;
            banquet = parent_fieldset.find(banquet_id)[0].checked;
            nb_adult = parent_fieldset.find(number_adult_id)[0].value;
            nb_bambinos = parent_fieldset.find(number_bambino_id)[0].value;
            current_nb_adult = 0;
            current_nb_bambinos = 0;
            if (!banquet && !vin_honneur) {
                alert("You don't need to fill the form if you don't come! Please check at least one event to attend (vin d'honneur or Diner)");
                $("form").trigger("reset");
                next_step = false;
            } else {
                var next_screen_id = form_prefix_id + (is_last_adult() && no_children() ? last_prefix : "") + 'adult-screen' + (banquet ? suffix_banquet : suffix_vin);
                console.log("next_screen_id " + next_screen_id);
                next_screen = $(next_screen_id);
            }
        /* adult screen validation */
        } else if (current_screen[0].id.startsWith("adult")) {
            addAdult(parent_fieldset);
            // current_nb_adult == nb_adult, we registered every adults, go to the children
            if (current_nb_adult == nb_adult) {
                console.log("GO TO CHILDREN!!!");
                next_screen = $(form_prefix_id + ( is_last_bambino() ? last_prefix : "") + adult_vin_screen_id);
            } else {
                var next_screen_id = form_prefix_id + (is_last_adult() && no_children() ? last_prefix : "") + 'adult-screen' + (banquet ? suffix_banquet : suffix_vin);
                console.log("next_screen_id " + next_screen_id);
                next_screen = $(next_screen_id);
                next_screen.find('h3')[0].innerHTML = 'Adult ' + (current_nb_adult + 1);
            }
        /* bambino screen validation */
    	} else if (current_screen[0].id.startsWith("bambino")) {

    	}
    	if (next_step) {
            parent_fieldset.fadeOut(400, function() {
                next_screen.fadeIn();
                $("form").trigger("reset");
                scroll_to_class( $('.form-wizard'), 20 );
            });
            current_screen = next_screen;
        } else {
            $("form").trigger("reset");
        }
    });

    // previous step
    $('.form-wizard .btn-previous').on('click', function() {
        $("form").trigger("reset");
        var prev_screen;
        if (current_screen[0].id.includes("adult")) {
            if (current_nb_adult == 0) {
                prev_screen = $(form_prefix_id + first_screen_id);
            } else {
                if (!banquet) {
                    prev_screen = $(form_prefix_id + adult_vin_screen_id);
                } else {
                    prev_screen = $(form_prefix_id + adult_banquet_screen_id);
                }
                current_nb_adult--;
                restore_previous_answer_adult(prev_screen);
                adults.splice(current_nb_adult, 1);
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
        var parent_fieldset = $(this).parents('fieldset');
        if(fields_validation(parent_fieldset)) {
            $(this).find('.required').each(function() {
                if( $(this).val() == "" ) {
                    e.preventDefault();
                    $(this).addClass('input-error');
                } else {
                    $(this).removeClass('input-error');
                }
            });
            if (current_screen[0].id.startsWith("last-adult")) {
                addAdult(parent_fieldset);
            }
            for(var i = 0 ; i < nb_adult ; i++) {
                var adult = adults[i];
                console.log(adult.name + ", " + adult.attend_to_vin_honneur + ", " + adult.attend_to_diner + ", " + adult.starter_1 + ", " + adult.starter_2 + ", " + adult.main_1+ ", " + adult.main_2);
            }
        }
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