/*/////////////////////////////////////*/
/*     Load  */
/*/////////////////////////////////////*/

function start_function()
	{
	///////////////////////////////////
	/* initialize img_slider function */
	///////////////////////////////////


	main_slider = new MainSlider('main');	

	
	//////////////////////////////////////////
	//////////////////////////////////////////


	///////////////////////////////////
	/* initialize video_slider function */
	///////////////////////////////////

	window.video_slider = new Slider('video','X','px','off',25);

	
	///////////////////////////////////
	/* initialize article_slider function */
	///////////////////////////////////

	window.article_slider = new Slider('article','Y','px','on',25);

	

	///////////////////////////////////
	/* Listeners for document */
	///////////////////////////////////

	document.add_event_listener('mouseup',function(event){body_mouseup(event)},false);

	 //switch off scrolling if up click was not over the item container  (for desktops)
	document.add_event_listener('touchend',function(event){body_touchend(event)},false);
	
	//switch off scrolling if up click was not over the item container  (for touches)


	//it is nessessary to prevent default browser action on mousedown event on tag 'a' (moving text, dotted selection)

	a_ar = document.get_elements_by_tag_name('a');
	for (i=0;i<a_ar.length;i=i+1)
		{
		a_ar[i].add_event_listener('mousedown',function(event){event.preventDefault();false});
		}


	//FOR IE8 (if tag 'a' contains block (span, table or smth else)) - it is not clickable in browser
	var ie_marker = document.querySelector('#ie8_marker');
	if (ie_marker)
		{
		var watchboard_button = document.querySelector('.watchboard_button');
		watchboard_button.attachEvent('onclick',function(){window.open('http://bigdata.in.ua/index.py?page=main')});
		
		}


	//ajax handler for feedbacck form

	feedback_submit_button = document.get_element_by_id('id_feedback_submit');
	feedback_submit_button.add_event_listener('click',function(event){feedback_submit();event.preventDefault();},false);
	feedback_submit_button.add_event_listener('mousedown',function(event){event.preventDefault();},false);
	feedback_clear_button = document.get_element_by_id('id_feedback_clear');
	feedback_clear_button.add_event_listener('mousedown',function(event)
		{
		d = document.get_elements_by_class_name('feedback_textarea')[0]
		d.blur();  //remove blur
		event.preventDefault();
		},false);
	


	//start MAIN SLIDER INTERVAl
	window.main_slider_interval = setInterval(function(){main_slider.right()},5000);
	
	}



body_mouseup = function(event)
	{
	try
		{
		window.video_slider.touch_click_off(event);
		window.article_slider.touch_click_off(event);
	
		window.main_slider.touch_off(event);
		}

	catch(err) //for IE8
		{
		window.video_slider.touch_click_off(event);
		window.article_slider.touch_click_off(event);
	
		window.main_slider.touch_off(event);
		}
	}

body_touchend = function()
	{
	window.video_slider.touch_click_off(event);
	window.article_slider.touch_click_off(event);
	}




span_mousedown_handler = function(e)
	{
	if (!e){e = window.event}

	e.preventDefault();

	}



feedback_submit =function()
	{
	//get msg from textarea
	d = document.get_elements_by_class_name('feedback_textarea');
	msg = d[0].value;

	xml_obj = ajax_get_obj();
	xml_obj.open('GET', '/index.py?page=main&ajax=feedback'+'&msg='+msg,false);
	xml_obj.onreadystatechange = function()
		{
		if(xml_obj.readyState==4&&xml_obj.status==200)
			{
			alert(xml_obj.responseText)
			}
		}
	xml_obj.send();
	d[0].value = 'Вы можете написать пожелания или жалобы';
	d[0].blur();  //remove focus
	}


/*/////////////////////////////////////*/
/*     Ajax lib  */
/*/////////////////////////////////////*/

ajax_get_obj = function()
	{
	var xml_obj;

	if (window.XMLHttpRequest)
		{
		xml_obj = new XMLHttpRequest();
		}
	else
		{
		xml_obj = new ActiveXObject("Microsoft.XMLHTTP");
		}
	return xml_obj
	
	}





/*/////////////////////////////////////*/
/*     Global variables  */
/*/////////////////////////////////////*/


/*  

window.id_slider - equal to 1 if slider is working
window.id_slider_tmp - id of interval (for further clearing) 
window.id_menu -  (id of intervals for menu opacity))
window.img_slider_mas = array with img for main slider
window.img_slider_idx = array with indexes


*/



