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

var  adult_screen_id = "adult-screen";
var  bambino_screen_id =  "bambino-screen";
var  junior_screen_id =  "junior-screen";

var final_screen_id = 'final-screen';

var suffix_banquet = '-banquet';
var suffix_vin = '-vin';

var selected_suffix;

var last_prefix = "last-";

var main_course_1 = "Agneau";
var main_course_2 = "Cabillaud";

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
var cannot_attend_id = input_pattern + 'cannot_attend';
var stay_night_id = input_pattern + 'stay_night';

/* adult screen */
var name_adult_id = "name-adult";
var main_checkbox_1_id = "main-adult-banquet-1";
var main_checkbox_2_id = "main-adult-banquet-2";
var main_adult_banquet = "main-adult-banquet";

/* bambino screen */
var name_bambino_id = "name-bambino";

/* junir screen */
var name_junior_id = "name-junior";

/*
    Values to gather and send to the gForm
*/
var cannot_attend = false;
var vin_honneur = false;
var banquet = false;
var stay_night = false;
var nb_adult = 0;
var nb_bambino = 0;
var nb_junior = 0;

var current_nb_adult = 0;
var current_nb_bambino = 0;
var current_nb_junior = 0;

var current_screen;

function is_last_adult() {
    return current_nb_adult == nb_adult - 1;
}

function no_children() {
    return no_bambino() && no_junior();
}

function no_bambino() {
    return nb_bambino == 0;
}

function is_last_bambino() {
    return current_nb_bambino == nb_bambino -1;
}

function no_junior() {
    return nb_junior == 0;
}

function is_last_junior() {
    return current_nb_junior == nb_junior -1;
}

/*
    arrays that will store the needed values
*/
var adults = [];
var juniors = [];
var bambinos = [];

function Adult(name, attend_to_vin_honneur, attend_to_diner, stay_for_the_night, main_1, main_2) {
    this.name = name;
    this.attend_to_vin_honneur = attend_to_vin_honneur;
    this.attend_to_diner = attend_to_diner;
    this.stay_for_the_night = stay_for_the_night;
    this.main_1 = main_1;
    this.main_2 = main_2;
}

function Bambino(name, attend_to_vin_honneur, attend_to_diner, stay_for_the_night) {
    this.name = name;
    this.attend_to_vin_honneur = attend_to_vin_honneur;
    this.attend_to_diner = attend_to_diner;
    this.stay_for_the_night = stay_for_the_night;
 }

function Junior(name, attend_to_vin_honneur, attend_to_diner, stay_for_the_night) {
    this.name = name;
    this.attend_to_vin_honneur = attend_to_vin_honneur;
    this.attend_to_diner = attend_to_diner;
    this.stay_for_the_night = stay_for_the_night;
}

function addAdult(parent_fieldset) {
    var current_name = parent_fieldset.find(input_pattern + name_adult_id)[0].value;
    if (banquet) {
        var main_1 = parent_fieldset.find(input_pattern + main_checkbox_1_id)[0].checked;
        var main_2 = parent_fieldset.find(input_pattern + main_checkbox_2_id)[0].checked;
    } else {
        var main_1 = banquet;
        var main_2 = banquet;
    }
    var adult = new Adult(current_name, vin_honneur, banquet, stay_night, main_1, main_2)
    adults.push(adult);
    console.log(adult.name + ", " + adult.attend_to_vin_honneur + ", " + adult.attend_to_diner + ", " + adult.stay_for_the_night  + ", " + adult.starter_1 + ", " + adult.starter_2 + ", " + adult.main_1+ ", " + adult.main_2);
    current_nb_adult++;
}

function addBambino(parent_fieldset) {
    var current_name = parent_fieldset.find(input_pattern + name_bambino_id)[0].value;
    var bambino = new Bambino(current_name, vin_honneur, banquet, stay_night)
    bambinos.push(bambino);
    console.log(bambino.name + ", " + bambino.attend_to_vin_honneur + ", " + bambino.attend_to_diner);
    current_nb_bambino++;
}

function addJunior(parent_fieldset) {
    var current_name = parent_fieldset.find(input_pattern + name_junior_id)[0].value;
    var junior = new Junior(current_name, vin_honneur, banquet, stay_night)
    juniors.push(junior);
    console.log(junior.name + ", " + junior.attend_to_vin_honneur + ", " + junior.attend_to_diner);
    current_nb_junior++;
}

function fields_validation(parent_fieldset){
    var next_step = true;
    var radio_is_ok = false;
    var has_radio = false;
    parent_fieldset.find('input').each(function() {
        $(this).removeClass('input-error');
    	if($(this)[0].required && $(this)[0].value == "") {
    		$(this).addClass('input-error');
    	    next_step = false;
        }
        if ($(this)[0].type == "radio") {
            has_radio = true;
            radio_is_ok |= $(this)[0].checked;
        }
    });
    if (has_radio && !radio_is_ok) {
        parent_fieldset.find('input').each(function() {
            if ($(this)[0].type == "radio") {
                $(this).addClass('checkbox-error');
            }
        });
        return false;
    }
    return next_step;
}

function restore_previous_answer_bambinos(fieldset) {
    var current_name = bambinos[current_nb_bambino].name;
    fieldset.find(input_pattern + name_bambino_id)[0].value = current_name;
}

function restore_previous_answer_junior(fieldset) {
    var current_name = juniors[current_nb_junior].name;
    fieldset.find(input_pattern + name_junior_id)[0].value = current_name;
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

function get_next_screen_id(base_id, is_last) {
    var next_screen_id = form_prefix_id + (is_last ? last_prefix : "") + base_id + selected_suffix;
    console.log('next screen id: ' + next_screen_id);
    return next_screen_id;
}

function set_errors_on_checkboxes(parent_fieldset){
    parent_fieldset.find('input').each(function() {
        if ($(this)[0].type == 'checkbox') {
            $(this).addClass('checkbox-error');
        }
    });
}

$("#form").change(function() {
   $(this).find('.checkbox-error').each(function() {
       $(this).removeClass('checkbox-error');
   });
});

function get_next_screen(parent_fieldset) {
    var next_screen;
    if (current_screen[0].id.includes("adult")) {
        addAdult(parent_fieldset);
        // current_nb_adult == nb_adult, we registered every adults, go to the children
        if (current_nb_adult == nb_adult) {
            if (no_bambino()) { // there is no bambino, jump to junior
                next_screen = $(get_next_screen_id(junior_screen_id, is_last_junior()));
            } else {
                next_screen = $(get_next_screen_id(bambino_screen_id, is_last_bambino() && no_junior()));
            }
        } else {
            next_screen = $(get_next_screen_id(adult_screen_id, is_last_adult() && no_children()));
            next_screen.find('h3')[0].innerHTML = 'Adult ' + (current_nb_adult + 1);
        }
    /* bambino screen validation */
    } else if (current_screen[0].id.includes("bambino")) {
        addBambino(parent_fieldset);
        if (current_nb_bambino == nb_bambino) {
            next_screen = $(get_next_screen_id(junior_screen_id, is_last_junior()));
        } else {
            next_screen = $(get_next_screen_id(bambino_screen_id, is_last_bambino() && no_junior()));
            next_screen.find('h3')[0].innerHTML = 'Bambino ' + (current_nb_bambino + 1);
        }
    /* junior screen validation */
    } else if (current_screen[0].id.includes("junior")) {
        addJunior(parent_fieldset);
        next_screen = $(get_next_screen_id(junior_screen_id, is_last_junior()));
        next_screen.find('h3')[0].innerHTML = 'Junior ' + (current_nb_junior + 1);
    }
    return next_screen;
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
            //$("form").trigger("reset");
            return;
        }
        var next_screen;
        /* first screen validation */
        if (current_screen[0].id == first_screen_id) {
            vin_honneur = parent_fieldset.find(vin_honneur_id)[0].checked;
            banquet = parent_fieldset.find(banquet_id)[0].checked;
            cannot_attend = parent_fieldset.find(cannot_attend_id)[0].checked;
            stay_night = parent_fieldset.find(stay_night_id)[0].checked;
            nb_adult = parent_fieldset.find(number_adult_id)[0].value;
            nb_bambino = parent_fieldset.find(number_bambino_id)[0].value;
            nb_junior = parent_fieldset.find(number_junior_id)[0].value;
            console.log(cannot_attend+ ', ' + vin_honneur + ", " + banquet + ", " + stay_night + ", " + nb_adult + ", " + nb_bambino + ", " + nb_junior);
            current_nb_adult = 0;
            current_nb_bambino = 0;
            current_nb_junior = 0;
            if (cannot_attend && (banquet || vin_honneur || stay_night)) {
                set_errors_on_checkboxes(parent_fieldset);
                return;
            }
            if (!cannot_attend && !banquet && !vin_honneur) {
                set_errors_on_checkboxes(parent_fieldset);
                return;
            }
            if (!banquet && stay_night) {
                set_errors_on_checkboxes(parent_fieldset);
                return;
            }
            selected_suffix = banquet ? suffix_banquet : suffix_vin;
            console.log(is_last_adult() && no_children());
            var next_screen_id = form_prefix_id + (is_last_adult() && no_children() ? last_prefix : "") +  adult_screen_id + selected_suffix;
            console.log("next_screen_id " + next_screen_id);
            next_screen = $(next_screen_id);
            next_screen.find('h3')[0].innerHTML = 'Adult ' + (current_nb_adult + 1);
        /* adult screen validation */
        } else {
            next_screen = get_next_screen(parent_fieldset);
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
        console.log(current_screen[0].id);
        if (current_screen[0].id.includes("adult")) {
            if (current_nb_adult == 0) {
                prev_screen = $(form_prefix_id + first_screen_id);
            } else {
                prev_screen = $(form_prefix_id + adult_screen_id + selected_suffix);
                prev_screen.find('h3')[0].innerHTML = 'Adult ' + (current_nb_adult);
                current_nb_adult--;
                restore_previous_answer_adult(prev_screen);
                adults.splice(current_nb_adult, 1);
            }
        } else if (current_screen[0].id.includes("bambino")) { // TODO end BAMBINOS
            if (current_nb_bambino == 0) { // it was the first bambino. We go back to adult
                prev_screen = $(form_prefix_id + adult_screen_id + selected_suffix);
                prev_screen.find('h3')[0].innerHTML = 'Adult ' + (current_nb_adult);
                current_nb_adult--;
                restore_previous_answer_adult(prev_screen);
                adults.splice(current_nb_adult, 1);
            } else {
                prev_screen = prev_screen = $(form_prefix_id + bambino_screen_id + selected_suffix);
                prev_screen.find('h3')[0].innerHTML = 'Bambino ' + (current_nb_bambino);
                current_nb_bambino--;
                restore_previous_answer_bambinos(prev_screen);
                bambinos.splice(current_nb_bambino, 1);
            }
        } // TODO implements same logique for junior
    	$(this).parents('fieldset').fadeOut(400, function() {
    		// change icons
    		// show previous step
    		console.log(prev_screen);
    		prev_screen.fadeIn();
    		// scroll window to beginning of the form
			scroll_to_class( $('.form-wizard'), 20 );
    	});
    	current_screen = prev_screen;
    });

    // submit
    $('.form-wizard .btn-submit').on('click', function(e) {
        var parent_fieldset = $(this).parents('fieldset');
        var next_step = fields_validation(parent_fieldset);
        if (!next_step) {
            //$("form").trigger("reset");
            return;
        }
        get_next_screen(parent_fieldset); // this will get info for the last screen
        var next_screen = $(form_prefix_id + final_screen_id);
        parent_fieldset.fadeOut(400, function() {
            next_screen.fadeIn();
            scroll_to_class( $('.form-wizard'), 20 );
        });
        current_screen = next_screen;
        $(this).parents('form').find('h3')[0].innerHTML = "Summary";
        display_summary(current_screen[0]);
        launch_requests();
    });
});


var base_request = 'https://docs.google.com/forms/d/e/1FAIpQLSemhVmKC20k3ozwZ8GdnbPHt7jsg-CQGp1XcWuHWVRJPWykNg/formResponse?usp=pp_url&'

var adult_key_word = 'entry.15813303=';
var bambino_key_word = 'entry.361261552=';
var junior_key_word = 'entry.1940980314=';

var person_name_var = 'entry.838394143=';

var cannot_attend_key_word = 'entry.1753887996=';
var vin_honneur_key_word = 'entry.368455988=';
var banquet_key_word = 'entry.1238711954=';
var stay_for_the_night_key_word = 'entry.1400953758=';

var main_course_1_key_word = 'entry.2024417387=';
var main_course_2_key_word = 'entry.252423998=';

var submit = '&submit=Submit';

var ok_key_word = '1';
var ko_key_word = '0';

function launch_requests() {
    launch_requests_for_given_array(adults, adult_key_word);
    launch_requests_for_given_array(bambinos, bambino_key_word);
    launch_requests_for_given_array(juniors, junior_key_word);
}

function launch_requests_for_given_array(array, type_person) {
    for (var i = 0 ; i < array.length ; i++) {
            var element = array[i];
            var current_request = []
            current_request.push(base_request);
            current_request.push(adult_key_word + (type_person.localeCompare(adult_key_word) == 0 ? ok_key_word : ko_key_word));
            current_request.push(bambino_key_word + (type_person.localeCompare(bambino_key_word) == 0 ? ok_key_word : ko_key_word));
            current_request.push(junior_key_word + (type_person.localeCompare(junior_key_word) == 0 ? ok_key_word : ko_key_word));
            current_request.push(person_name_var + element.name);
            current_request.push(get_attendance_request());
            if (banquet && type_person.localeCompare(adult_key_word) == 0) {
                current_request.push(main_course_1_key_word + (element.main_1 ? ok_key_word : ko_key_word));
                current_request.push(main_course_2_key_word + (element.main_2 ? ok_key_word : ko_key_word));
            } else {
                current_request.push(main_course_1_key_word + ko_key_word);
                current_request.push(main_course_2_key_word + ko_key_word);
            }
            current_request.push(submit);
            var joined_request = current_request.join('&');
            console.log(joined_request);
            var request = new XMLHttpRequest();
            request.open('GET', joined_request, true);
            request.send();
    }
}

function get_attendance_request() {
    var attendance = [];
    attendance.push(cannot_attend_key_word + (cannot_attend ? ok_key_word : ko_key_word));
    attendance.push(vin_honneur_key_word + (vin_honneur ? ok_key_word : ko_key_word));
    attendance.push(banquet_key_word + (banquet ? ok_key_word : ko_key_word));
    attendance.push(stay_for_the_night_key_word + (stay_night ? ok_key_word : ko_key_word));
    return attendance.join('&');
}

function display_summary(screen) {
    var newDiv = document.createElement('div');
    var list_of_names = get_all_names();
    if (cannot_attend) {
            newDiv.appendChild(build_cannot_attend_summary(list_of_names));
    } else {
        var newP = document.createElement('p');
        newP.innerHTML = build_sentence_to_attend(list_of_names);
        newDiv.appendChild(newP);
        if (banquet) {
            newDiv.appendChild(build_chosen_main_course());
        }
        if (stay_night) {
            newDiv.appendChild(build_will_stay_nigh(list_of_names ));
        }
    }
    screen.appendChild(newDiv);
}

function build_cannot_attend_summary(list_of_names) {
    var newP = document.createElement('p');
    newP.innerHTML = build_sentence_from_given_array_with_given_suffix(list_of_names, ' cannot attend.');
    return newP;
}

function build_will_stay_nigh(list_of_names) {
    var newP = document.createElement('p');
    newP.innerHTML = build_sentence_from_given_array_with_given_suffix(list_of_names , ' will stay for the night.');
    return newP;
}

function build_chosen_main_course() {
    var adult_main_1 = [];
    var adult_main_2 = [];
    for (var i = 0 ; i < adults.length ; i++) {
        var adult = adults[i];
        if (adult.main_1) {
            adult_main_1.push(adult.name);
        } else {
            adult_main_2.push(adult.name);
        }
    }
    var newDiv = document.createElement('div');
    var newP = document.createElement('p');
    newP.innerHTML = build_sentence_from_given_array_with_given_suffix(adult_main_1, ' will have ' + main_course_1);
    newDiv.appendChild(newP);
    newP = document.createElement('p');
    newP.innerHTML = build_sentence_from_given_array_with_given_suffix(adult_main_2, ' will have ' + main_course_2);
    newDiv.appendChild(newP);
    return newDiv;
}

function build_sentence_from_given_array_with_given_suffix(array, suffix) {
    var sentence = "";
    if (array.length > 2) {
        for (var i = 0 ; i < array.length - 2 ; i++) {
            sentence += array[i] + ', ';
        }
    }
    if (array.length > 1) {
        sentence += array[array.length - 2] + ' and ' + array[array.length - 1] + suffix;
    } else {
        sentence += array[array.length - 1] + suffix;
    }
    return sentence;
}

function build_sentence_to_attend(list_of_names) {
    var sentence = build_sentence_from_given_array_with_given_suffix(list_of_names, ' will attend to ');
    if (vin_honneur) {
        sentence += ' the vin d\'honneur';
        if (banquet) {
            sentence += ' and to the banquet.';
        } else {
            sentence += '.';
        }
    } else {
        sentence += ' the banquet.';
    }
    return sentence;
}

function get_all_names() {
    var list_of_names = iterate_and_append(adults);
    list_of_names = list_of_names.concat(iterate_and_append(bambinos));
    list_of_names = list_of_names.concat(iterate_and_append(juniors));
    return list_of_names;
}

function iterate_and_append(array) {
    var acc = []
    for(var i = 0 ; i < array.length ; i++) {
        var element = array[i];
        acc.push(element.name);
    }
    console.log(acc);
    return acc;
}

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