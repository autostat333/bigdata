/*///////////////////////////////////////*/
/*--------------OTHER---------------------*/
/*///////////////////////////////////////*/

//get elements also by IE8





Element.prototype.get_elements_by_class_name = function(class_name)
	{
	var obj = this;

	try
		{
		var obtained_obj = obj.getElementsByClassName(class_name);
		}
	catch(err)
		{
		
		var obtained_obj = obj.querySelectorAll('.'+class_name);
		
		}
	return obtained_obj;	

	}


Element.prototype.get_elements_by_tag_name = function(tag_name)
	{
	var obj = this;
	try
		{
		var obtained_obj = obj.getElementsByTagName(tag_name);
		}
	catch(err)
		{
		
		var obtained_obj = obj.querySelectorAll(tag_name);
		
		}
	return obtained_obj;	

	}


Element.prototype.get_element_by_id = function(id_name)
	{
	var obj = this;
	try
		{
		var obtained_obj = obj.getElementById(id_name);
		}
	catch(err)
		{
		
		var obtained_obj = obj.querySelector('#'+id_name);
		
		}
	return obtained_obj;	

	}


document.get_elements_by_class_name = function(class_name)
	{
	var obj = this;
	try
		{
		var obtained_obj = obj.getElementsByClassName(class_name);
		}
	catch(err)
		{
		
		var obtained_obj = obj.querySelectorAll('.'+class_name);
		
		}
	return obtained_obj;	

	}


document.get_elements_by_tag_name = function(tag_name)
	{
	var obj = this;

	try
		{
		var obtained_obj = obj.getElementsByTagName(tag_name);
		}
	catch(err)
		{
		
		var obtained_obj = obj.querySelectorAll(tag_name);
		
		}
	return obtained_obj;	

	}


document.get_element_by_id = function(id_name)
	{
	var obj = this;
	try
		{
		var obtained_obj = obj.getElementById(id_name);
		}
	catch(err)
		{
		var obtained_obj = obj.querySelector('#'+id_name);
		
		}
	return obtained_obj;	

	}


// Attach event for ie8 and other browsers

Element.prototype.add_event_listener = function(action,funct,f)
	{
	
	try
		{
		this.addEventListener(action,funct,f);
		}	
	catch(err)
		{
		this.attachEvent('on'+action,funct);
		}


	}

document.add_event_listener = function(action,funct,f)
	{
	
	try
		{
		document.addEventListener(action,funct,f);
		}	
	catch(err)
		{
		this.attachEvent('on'+action,funct);
		}
	}


window.add_event_listener = function(action,funct,f)
	{
	
	try
		{
		window.addEventListener(action,funct,f);
		}	
	catch(err)
		{
		this.attachEvent('on'+action,funct);
		}
	}


/*///////////////////////////////////////*/
/*--------------MENU---------------------*/
/*///////////////////////////////////////*/

/*
main_menu(id_elem,act,e) - calling determined directly in html page
id_elem - wroten in html page as para
act - 'list_open', 'list_close' - determined directly in html as para (depens on event: mouseover or mouseout)

*/
function is_child(container_obj,spices)
	{
	var all_elem = container_obj.get_elements_by_tag_name('*');
	var len = all_elem.length;
	result = 'no';
	for (i=0;i<len;i=i+1)
		{
		if (spices==all_elem[i])
			{
			result = 'yes';
			break;
			}
		}
	return result;
	}


function main_menu(id_elem, act, e) 
	{


	//initialize event

	if (!e) e = window.event;
	
	var main_container = document.get_element_by_id(id_elem);
	var direction = '';
	var slow='no'; //additional parameter for slow opening (if another process underway)


	// determine which element retains as target and related target depend on mouseover and mouseout
	if (act=='list_open') 
		{
		var to_ = e.target||e.toElement;
		var from_ = e.relatedTarget||e.fromElement;
		}

	if (act=='list_close')
		{
		var from_ = e.target||e.fromElement;
		var to_ = e.relatedTarget||e.toElement;
		}


	if (act=='click')
		{
		ul_list = main_container.get_elements_by_tag_name('ul')[0];
		ul_list.style.display = 'none';
		return false;
		}

	//check if the mouse flows to browser window (to_ equal to null in this case)
	if (to_==null) {direction = 'int-ext'}  //out from edge of window (quick mouse move)
	if (from_==null) {direction='ext-int'}
	

	//determine direction of mouse moving, if above is not determined as over viewport moving
	if (direction=='')
		{
		if (is_child(main_container,from_)=='no'&&main_container.id!=from_.id)
			{
			if (is_child(main_container,to_)=='yes'||main_container.id==to_.id)
				{
				direction='ext-int';
				}
			}
		
		

		if (is_child(main_container,from_)=='yes'||main_container.id==from_.id)
			{
			if (is_child(main_container,to_)=='no'&&main_container.id!=to_.id)
				{
				direction='int-ext';
				}
			}
		}
	
	//dicrection have determined. Possible int-ext, ext-int. Start execition
	if (act=='list_open'&&direction=='ext-int')
		{
		//change color of text

		var headers = main_container.get_elements_by_class_name('uplist_horizontal_elem_span');
	
		headers[0].style.color = '#00317A';

		//for triangle appearing
		triangle = main_container.get_elements_by_class_name('triangle_container')[0]
	
		triangle.style.display = 'inline-block';

				
		var t = main_container.get_elements_by_tag_name('ul');

		t[0].style.opacity = '0';   //set visibility 'none' before execution of script
		t[0].style.display = 'block';
		var i=0;
		function opac()
			{
			t[0].style.opacity = i;
			i = i+0.1;
			if (i>0.9)
				{
				clearInterval(t_id);
				window.id_menu = 0;	
				}		
			}
		if (slow=='no')
			{
			var t_id = setInterval(opac,20);
			window.id_menu = t_id;
			}
		else
			{
			t[0].style.opacity = '1';	
			}
		}
	
	if (act=='list_close'&&direction=='int-ext')
		{
		clearInterval(window.id_menu); //interupt uf any process
		window.id_menu = 0;
		//hover back
		var headers = main_container.get_elements_by_class_name('uplist_horizontal_elem_span');

		headers[0].style.color = '#3385FF';		

		//for triangle appearing
		triangle = main_container.get_elements_by_class_name('triangle_container')[0]
		
		triangle.style.display = 'none';
		//hover back

		var t = main_container.get_elements_by_tag_name('ul');

		t[0].style.display = 'none';//set visibility 'none'
		t[0].style.opacity = '0';
		}	

	}

/*  |||||||||||||||||||||||||||||||||||||||||||||||||||||
		MAIN IMG Slider block
||||||||||||||||||||||||||||||||||||||||||||||||||||||*/

/*

REMEMBER!!!!!!!!!!!!
for two events (mouseup and touchend) it must me determined hablers to stop moving scrol


*/



function MainSlider(prefix)
	{
	var obj = this;
	//get all blocks
	this.scroll_left = document.get_elements_by_class_name(prefix+'_slider_button_left')[0];
	this.scroll_right = document.get_elements_by_class_name(prefix+'_slider_button_right')[0];	
	this.container = document.get_elements_by_class_name(prefix+'_slider_img_container')[0];
	this.progress_bar = document.get_elements_by_class_name(prefix+'_slider_progress_bar_container')[0];

	this.img_array = this.container.get_elements_by_tag_name('img');
	this.img_index = []  //index for control current img
	this.text_array = document.get_elements_by_class_name(prefix+'_slider_text_container_span'); //array for text


	this.id_scroll = 0  //flag for execution (moving img slide)
	this.len = this.img_array.length; //kolvo img items
	

	//special ordering because of z-index (last element over firts elements)
	this.next_img = this.img_array[1];
	this.prev_img = this.img_array[this.len-1];
	this.cur_img = this.img_array[0];  

	this.img_len = this.img_array[0].offsetWidth; //length of img for moving left


	//set handlers for clicks
	this.scroll_left.add_event_listener('click',function(event){obj.left();event.stopPropagation()},false);
	this.scroll_right.add_event_listener('click',function(event){obj.right();event.stopPropagation()},false);

	this.container.add_event_listener('mousedown',function(event){obj.touch_on(event);event.stopPropagation()},false);
	this.container.add_event_listener('mousemove',function(event){obj.touch_move(event)},false);
	this.container.add_event_listener('mouseup',function(event){obj.touch_off(event);event.stopPropagation()},false);


	this.container.add_event_listener('touchstart',function(event){obj.touch_on(event)},false);
	this.container.add_event_listener('touchend',function(event){obj.touch_off(event)},false);
	this.container.add_event_listener('touchmove',function(event){obj.touch_move(event);try{event.preventDefault()}catch(err){event.returnValue=false;}},false);
	


	this.flag = 'stop'; //floag for mouse_up and mouse_down status (during mouse moving)
	this.start_click = 0; //coordinates of mouse_click;

	window.id_tmp_2 = 0;


	//cancel default event for img (disable moving during mouse touch)
	for (i=0;i<this.len;i=i+1)
		{
		elem = this.img_array[i];
		elem.add_event_listener('mousedown',function(event){try{event.preventDefault()}catch(err){event.returnValue=false;}},false);
		
		}



	this.preload = function()
		{
		
		//comaplete index array
		for (i=0;i<this.len;i=i+1)
			{
			this.img_index.push(i);	
			}



		//set images on edges

		this.prev_img.style['zIndex'] = '2';
		this.cur_img.style['zIndex'] = '3';
		this.next_img.style['zIndex'] = '2';

	
		this.prev_img.style['left'] = '-100%';
		this.next_img.style['left'] = '100%';
		this.cur_img.style['left'] = '0px';

		//insert white progress bar items
		for_write = ''
		for (i=0;i<this.len;i=i+1)
			{
			for_write = for_write+'<div></div>'			
			}
		this.progress_bar.innerHTML = for_write;
		
		this.bar_array = this.progress_bar.get_elements_by_tag_name('div');


		//set text visible (at the beginnig all elem have 0 opacity)
		this.text_array[this.img_index[0]].style['display'] = 'block';
		this.text_array[this.img_index[0]].style['opacity'] = '1';
		//set bar visible (at the beginnig all elem have 0 opacity)
		this.bar_array[this.img_index[0]].style['opacity'] = '1';
	

		}


	//preload start
	this.preload();



	//nessesary to translate width to %%, when screen size is changing - it adapts. transition normally works if set left style dimensions in pixels. If in % - one of two images immediatly without ant transition will be placed to new position (white plase), at the same yime second img will be moving with transition
	this.trans_to_percent = function()
		{
		obj = this;		
		
		function p(obj)
			{
			obj.cur_img.style['left'] = '0px';
			obj.next_img.style['left'] = '100%';
			obj.prev_img.style['left'] = '-100%';
			
			}
		p(obj)
		
		}




	this.transition_on_off = function(para,speed)
		{



		speed = speed||'0.6';
		
		if (para=='on')
			{
			for (i=0;i<this.len;i=i+1)
				{
				this.img_array[i].offsetWidth;
				this.img_array[i].style['transition'] = 'left '+speed+'s ease';
				this.img_array[i].style['-moz-transition'] = 'left '+speed+'s ease';
				this.img_array[i].style['-o-transition'] = 'left '+speed+'s ease';
				this.img_array[i].style['-webkit-transition'] = 'left '+speed+'s ease';
				this.img_array[i].style['-ms-transition'] = 'left '+speed+'s ease';
				this.img_array[i].style['-khtml-transition'] = 'left '+speed+'s ease';
	
				}
				
			}
		else
			{
			for (i=0;i<this.len;i=i+1)
				{
				this.img_array[i].offsetWidth;
				this.img_array[i].style['transition'] = 'left 0s ease';
				this.img_array[i].style['-moz-transition'] = 'left 0s ease';
				this.img_array[i].style['-o-transition'] = 'left 0s ease';
				this.img_array[i].style['-webkit-transition'] = 'left 0s ease';
				this.img_array[i].style['-khtml-transition'] = 'left 0s ease';
				this.img_array[i].style['-ms-transition'] = 'left 0s ease';
}
			
			}
		}	



	this.left = function()
		{
		if (this.id_scroll==1)
			{
			return;
			}
		this.id_scroll = 1;
		this.img_len = this.cur_img.offsetWidth;  //determine actual img size (if window size has changed)
	
		function pause(obj)  //this is nessesary for to finish all moving and than change this.id_scroll
			{
			clearInterval(window.id_tmp);
			obj.id_scroll = 0;
			obj.trans_to_percent();
			}

		window.id_tmp = setInterval(function(){pause(obj)},1000);
	


		this.cur_img.style['zIndex'] = '3';
		this.prev_img.style['zIndex'] = '2';
		this.next_img.style['zIndex'] = '1';



		//moving
		this.transition_on_off('on');
		this.prev_img.style['left'] = '0px';
		this.cur_img.style['left'] = this.img_len+'px';

		
	
		//progress bar set
		this.bar_array[this.img_index[0]].style['opacity'] = '0.3';
		this.bar_array[this.img_index[this.len-1]].style['opacity'] = '1';	

		//text set
		this.text_array[this.img_index[0]].style['opacity'] = '0';
		this.text_array[this.img_index[0]].style['display'] = 'none';
	
		this.text_array[this.img_index[this.len-1]].style['display'] = 'block';
		this.text_array[this.img_index[this.len-1]].style['opacity'] = '1';


		this.transition_on_off('off');
	
		//prepare for next moving (index pushing)
		k = this.img_index[this.len-1];
		n = this.img_index.unshift(k);
		n = this.img_index.splice(this.len);	



		//set new images
		this.next_img = this.img_array[this.img_index[1]];
		this.prev_img = this.img_array[this.img_index[this.len-1]];
		this.cur_img = this.img_array[this.img_index[0]];  

		this.cur_img.style['zIndex'] = '3';
		this.prev_img.style['zIndex'] = '1';
		this.next_img.style['zIndex'] = '2';

	
		obj.prev_img.style['left'] = -this.img_len+'px';
	

		}		


	this.right = function()
		{
		if (this.id_scroll==1)
			{
			return;
			}


		this.id_scroll = 1;
		this.img_len = this.cur_img.offsetWidth;  //determine actual img size (if window size has changed)
	
		function pause(obj)  //this is nessesary for to finish all moving and than change this.id_scroll
			{
			clearInterval(window.id_tmp);
			obj.id_scroll = 0;			
			obj.trans_to_percent();}

		window.id_tmp = setInterval(function(){pause(obj)},1000);

	
		//prepare z-index (visibility)


		this.cur_img.style['zIndex'] = '3';
		this.prev_img.style['zIndex'] = '2';
		this.next_img.style['zIndex'] = '2';



		//moving
		this.transition_on_off('on');
		this.cur_img.style['left'] = -this.img_len+'px';
		this.next_img.style['left'] = '0px';

	
		//progress bar set
		this.bar_array[this.img_index[0]].style['opacity'] = '0.3';
		this.bar_array[this.img_index[1]].style['opacity'] = '1';	


		//text set
		this.text_array[this.img_index[0]].style['opacity'] = '0';
		this.text_array[this.img_index[0]].style['display'] = 'none';
		this.text_array[this.img_index[1]].style['display'] = 'block';
		this.text_array[this.img_index[1]].style['opacity'] = '1';


		this.transition_on_off('off');	
		//prepare for next moving (index pushing)
		k = this.img_index[0];
		this.img_index.push(k);
		n = this.img_index.splice(0,1);
		


		//set new images
		this.cur_img.style['zIndex'] = '3';
		this.prev_img.style['zIndex'] = '1';
		this.next_img.style['zIndex'] = '2';
		

		
		this.next_img = this.img_array[this.img_index[1]];
		this.prev_img = this.img_array[this.img_index[this.len-1]];
		this.cur_img = this.img_array[this.img_index[0]];  
		
		this.next_img.style['left'] = this.img_len+'px';
		
	
		}		

	this.touch_on = function(e)
		{
		if (this.id_scroll!=0)
			{
			return
			}
		this.img_len = this.cur_img.offsetWidth;
		try
			{
			y = e.changedTouches[0].clientX;
			this.flag = 'start';
			this.start_click = y;
			}
		catch(err)
			{
			if (!e) {e = window.event}
			this.flag = 'start';
			this.start_click = e.clientX;
			}
		this.transition_on_off('off');
		}


	this.touch_off = function(e)
		{
		if (!e){e = window.event}
		if (this.flag=='stop')
			{
			return false;
			}
		
		try
			{
			y = e.changedTouches[0].clientX;
			var dif = y - this.start_click;
			}
		
		catch(err)
			{
			var dif = e.clientX - this.start_click;
			}

		var margin_dif = this.cur_img.offsetWidth*0.15;  //this is for adaptive spring (when window size is small)
		
		//left-right moving
		if (dif<-margin_dif)
			{
			this.right('yes');
			}
		if (dif>margin_dif)
			{
			this.left('yes');
			}

		
		//spring
		if (dif<margin_dif&dif>0)
			{
			
			this.transition_on_off('on',0.2);
			
			
			this.prev_img.style['left'] = -this.img_len+'px';	
			this.cur_img.style['left'] = '0px';
			this.next_img.style['left'] = this.img_len+'px';	


			this.transition_on_off('off');
			var obj = this;
			window.id_tmp_ = setTimeout(function(){obj.trans_to_percent()},1500);
			}

		if (dif>-margin_dif&dif<0)
			{
			
			this.transition_on_off('on',0.2);
					
			this.cur_img.style['left'] = '0px';	
			this.next_img.style['left'] = this.img_len+'px';	
			this.prev_img.style['left'] = -this.img_len+'px';	
		
			var obj = this;
			this.transition_on_off('off');
			window.id_tmp_ = setTimeout(function(){obj.trans_to_percent()},1500)
			}
	

		this.flag = 'stop';
		}

	this.touch_move = function(e)
		{

		if (!e){e = window.event}

		if (this.flag=='start')
			{
		
			try
				{
				y = e.changedTouches[0].clientX;
				var dif = y - this.start_click;
				}

			catch(err)
				{
				var dif = e.clientX - this.start_click;
				}
	
			//for all images determine left positions
			this.cur_img.style['left'] = dif+'px';
			this.next_img.style['left'] = this.img_len+dif+'px';	
			this.prev_img.style['left'] = -this.img_len+dif+'px';

			}

		}


	}






//////////////////////////////////////////////////
//             SLIDER                   /////////
//////////////////////////////////////////////////


/*
for two events (mouseup and touchend) it must me determined hablers to stop moving scrol

prefix - is the css styles (name of class) part, that is adding up to "_item_container"..."_scroll_left" etc


*/

function Slider(prefix,dir,dim,progress,add_px)
	{
	//get block and asign it with events

	this.scroll_left_button = document.get_elements_by_class_name(prefix+'_scroll_button_left')[0];
	this.scroll_right_button = document.get_elements_by_class_name(prefix+'_scroll_button_right')[0];
	this.container = document.get_elements_by_class_name(prefix+'_item_container')[0];
	this.container_visible = document.get_elements_by_class_name(prefix+'_block')[0]; //to calculate margin distance for moving


	if (progress=='on')
		{
		this.progress_bar = document.get_elements_by_class_name(prefix+'_progress_bar')[0]; //for progress bar
		this.progress_bar_feel = this.progress_bar.get_elements_by_class_name(prefix+'_feel')[0]; 
		}

		
	var obj = this; //nessesary for passing OBJECT for next functions
	

	this.scroll_left_button.add_event_listener('click',function() {obj.move_left()},false);
	this.scroll_right_button.add_event_listener('click',function() {obj.move_right()},'false');
	this.container.add_event_listener('mousedown',function(event) {obj.touch_click_on(event);try{event.preventDefault()}catch(err){event.returnValue=false};},false);
	this.container.add_event_listener('mouseup',function(event) {obj.touch_click_off(event)},false);
	this.container.add_event_listener('mousemove',function(event) {obj.mouse_move(event);event.returnValue=false;},false);

	//for touch events add new listener

	this.container.add_event_listener('touchstart',function(event) {obj.touch_click_on(event);try{event.preventDefault()}catch(err){event.returnValue=false;}},false);
	this.container.add_event_listener('touchend',function(event) {obj.touch_click_off(event);try{event.preventDefault()}catch(err){event.returnValue=false;}},false);
	this.container.add_event_listener('touchmove',function(event) {obj.mouse_move(event);try{event.preventDefault()}catch(err){event.returnValue=false;}; return false;},false);




	this.prefix = prefix;
	
	this.dir = dir;  //direction X - horizontal, Y - vertical
	this.dim = dim;  // dimensions px - pixels, % - interests
	this.add_px = add_px;  //add pixels to distanse between items

	this.cur_transX = 0;  //current translate X value
	this.cur_transY = 0;   //current translate Y value;
	this.cur_transY_tmp = 0;  //using for previous value of transX.Y during mousemoving
	this.cur_transX_tmp = 0;

	this.cur_mouse_flag = 'stop'; //flag for touch scroll activation
	this.cur_mouseX = 0;    //current mouse coordinates (retrives from listener when flag !=stop)
	this.cur_mouseY = 0;   
	this.onclick_mouseX = 0; //coordinates of mouse cursor when mouse buttons had pressed
	this.onclick_mouseY = 0;	
	
	this.container_height = 0;  //is determinig during set_container_size execution
	this.container_width = 0;  //nessesary to know margin top and left distance
	this.container_X_width = 0;  //width of block, using for screen size changing (width of visible container on load page moment)


	//for ie8 python determine browser and write additional block at the end of html with display=none, if we will find block - innertion must me 'off', because ie8 do not perfect work with innertion
	this.innertion_da = document.get_element_by_id('ie8_marker');
	if (this.innertion_da)
		{
		this.innertion_da = 'no'; //we have found ie8 marker
		}

	else
		{
		this.innertion_da = 'yes';
		}
	this.max_left = 0;  //max left - max dis for move to the end on X (set cont size)
	this.max_top = 0;   //max top - max distance for moving to the down on Y line 
	this.innertion_array = [];  //array for innertion
	this.innertion_array_time = []  //array with time
	this.innertion_prev_time = 0;  //previous timestamp
	this.innertion_prev_trans = 0; //previous cur_transX
	this.innertion_items=5;  //kolvo items in array for avg speed calculations


/// train with speed
	this.prev_time = 0;
	this.progress_bar_par = progress;  //"on" - parametr to switch on progress bar animate
	this.feel_width = 0; // width of feeling div from progress bar (X line) in %%
	this.feel_height = 0; // height of feeling div from progress bar (Y line in %%)
	this.pb_length = 0; //length of progress bar (by X or by Y) 

	/////////////////////////

	this.move_left = function()
		{
		//check if slider is working
		if (this.id_timer!='none'&&this.id_timer!=undefined)
			{
			return;
			}


		this.check_container_size(); // it to keep actual block size when screen size changing
		//for click efect
		this.scroll_left_button.className += ' '+this.prefix+'_scroll_button_left_click';
		this.id_timer = setInterval(
			function()
			{
			obj.scroll_left_button.className = obj.prefix+'_scroll_button_left';clearInterval(obj.id_timer);
			obj.id_timer = 'none';
			},200)


		//forsmoth moving
		if (this.dir=='X')
			{
			if (this.cur_transX==0)  //for spring
				{
				back_ = function()
					{
					obj.transition_on_off(0.2);
					obj.container.style['left'] = '0px';
					clearInterval(obj.id_ttt);
					}
				this.transition_on_off(0.2);
				this.container.style['left'] = '50px';
				this.id_ttt = setInterval(back_,200);
				}
			else  //simple moving by X
				{
				this.transition_on_off(1);
				this.move_by(200);
				this.transition_on_off(0);
				}
			}
		else
			{
			if (this.cur_transY==0)  //for spring
				{
				back_ = function()
					{
					obj.transition_on_off(0.2);
					obj.container.style['top'] = '0px';
					clearInterval(obj.id_ttt);
					}
				this.transition_on_off(0.2);
				this.container.style['top'] = '50px';
				this.id_ttt = setInterval(back_,200);
				}
			else  //simple moving by Y
				{
				this.transition_on_off(1);
				this.move_by(200);
				this.transition_on_off(0);
				}	
			}
		}


	this.move_right = function()
		{
		this.check_container_size(); // it to keep actual block size when screen size changing

		//check if slider is working
		if (this.id_timer!='none'&&this.id_timer!=undefined)
			{
			return;
			}

		//for click effect
		this.scroll_right_button.className += ' '+this.prefix+'_scroll_button_right_click';
		this.id_timer = setInterval(
			function()
			{
			obj.scroll_right_button.className = obj.prefix+'_scroll_button_right';clearInterval(obj.id_timer);
			obj.id_timer = 'none';
			},200)
		

		//for smoth
		if (this.dir=='X')
			{
			if (this.cur_transX==-this.max_left)  //for spring
				{
				back_ = function()
					{
					obj.transition_on_off(0.2);
					obj.container.style['left'] = -obj.max_left+'px';
					clearInterval(obj.id_ttt);
					}
					
				d = -this.max_left-50;
				this.transition_on_off(0.2);
				this.container.style['left'] = d+'px';
				this.id_ttt = setInterval(back_,200);
				}
			else  //simple moving by X
				{
				this.transition_on_off(1);
				this.move_by(-200);
				this.transition_on_off(0);
				}
			}
		else
			{
			if (this.cur_transY==-this.max_top)  //for spring
				{
				back_ = function()
					{
					obj.transition_on_off(0.2);
					obj.container.style['top'] = -obj.max_top+'px';
					clearInterval(obj.id_ttt);
					}
						
				d = -obj.max_top-50;
				this.transition_on_off(0.2);
				this.container.style['top'] = d+'px';
				this.id_ttt = setInterval(back_,200);
				}
			else  //simple moving by Y
				{
				this.transition_on_off(1);
				this.move_by(-200);
				this.transition_on_off(0);
				}
			}
		}

	
	this.touch_click_on = function(e)
		{
		this.check_container_size(); // it to keep actual block size when screen size changing
		if (!e) {e = window.event}
		try   //for touches
			{
			if (this.innertion_da=='yes')
				{
				this.innertion('start'); //for innertion (initial prev variables)
				}
	
			t = e.changedTouches[0];
			this.onclick_mouseY = t.clientY;
			this.onclick_mouseX = t.clientX;
			this.cur_mouse_flag = 'start';
			this.cur_transX_tmp = this.cur_transX;
			this.cur_transY_tmp = this.cur_transY;

			}
		catch(err)
			{
			if (this.innertion_da=='yes')
				{
				this.innertion('start'); //for innertion (initial prev variables)
				}

			this.onclick_mouseX = e.clientX;
			this.onclick_mouseY = e.clientY;
			this.cur_mouse_flag = 'start';
			this.cur_transX_tmp = this.cur_transX;
			this.cur_transY_tmp = this.cur_transY;
			}

		}

	this.touch_click_off = function(e)
		{

		if (!e) {e = window.event}
		this.cur_mouse_flag = 'stop';

		if (this.dir=='X')
			{
			if (this.cur_transX>0)   //spring
				{
				this.transition_on_off(0.2);
				this.container.style['left'] = '0px'; 
				this.transition_on_off(0);
				this.cur_transX = 0;
				}
			if (this.cur_transX>=-this.max_left-50&this.cur_transX<-this.max_left)
				{
				this.transition_on_off(0.2);
				this.container.style['left'] = -this.max_left+'px';
				this.transition_on_off(0);
				this.cur_transX = -this.max_left;
				}

			if (this.cur_transX>-this.max_left&this.cur_transX<0&this.innertion_da=='yes')
				{
				speed = this.innertion('stop');   //for innertion
				dis = speed*300*0.7;
				if (dis!=0)
					{					
					this.transition_on_off(1);
					this.move_by(dis);
					this.transition_on_off(0);
					}
				}


			}

		else
			{
			if (this.cur_transY>0)  //spring
				{
				this.transition_on_off(0.2);
				this.container.style['top'] = '0px';
				this.transition_on_off(0);
				this.cur_transY = 0;
	
				}
			if (this.cur_transY>=-this.max_top-50&this.cur_transY<-this.max_top)
				{
				this.transition_on_off(0.2);
				this.container.style['top'] = -this.max_top+'px';
				this.transition_on_off(0);
				this.cur_transY = -this.max_top;
	
				}
			if (this.cur_transY>-this.max_top&this.cur_transY<0&this.innertion_da=='yes')
				{
				speed = this.innertion('stop');   //for innertion
				dis = speed*300*0.7;
				if (dis!=0)
					{					
					this.transition_on_off(1);
					this.move_by(dis);
					this.transition_on_off(0);
					}
				}
	
			}

		}


	


//////////////////////////////

	this.set_container_size = function() //fit size of container, by X or Y, add_px - add_px to each item
		{
		//get item container size
		array_items = document.get_elements_by_class_name(prefix+'_item');
		
		len_arr = array_items.length;
		len_itemX = array_items[0].offsetWidth;
		len_itemY = array_items[0].offsetHeight;

		if (this.dir=='X')
			{

			if (this.container_visible.offsetWidth!=this.container_X_width)
				{
				this.container_X_width = this.container_visible.offsetWidth;
				}
			
			this.container_width = len_arr*(len_itemX+this.add_px);
			this.container.style.width = this.container_width+'px';
			this.max_left = this.container_width - this.container_visible.offsetWidth;
			}

		else
			{

			//width of items may be different because text may lay verticaly caused screen declining and different items can havedifferent desciption

			var total_width	=0;
			for (i=0;i<len_arr;i=i+1)
				{total_width = total_width+array_items[i].offsetHeight}

			
			this.container_height = len_arr*(this.add_px)+total_width+30;  //30px is height of free item above all other items (under top line), also you need to correct check_size() function
			this.container.style.height = this.container_height+'px';
			this.max_top = this.container_height - this.container_visible.offsetHeight;
			
			}


		//set progress bar height or width
		if (this.dir=='X'&this.progres_bar_par=='on')
			{
			dif_koef = this.max_left/this.container_width;
			this.feel_width = 1 - dif_koef;			
			this.progress_bar_feel.style['width'] = this.feel_width*100+'%';
			this.pb_length = this.progress_bar.offsetWidth;	
			}
	
		if (this.dir=='Y'&this.progress_bar_par=='on')
			{
			dif_koef = this.max_top/this.container_height;
			this.feel_height = 1 - dif_koef;			
			this.progress_bar_feel.style['height'] = this.feel_height*100+'%';
			this.pb_length = this.progress_bar.offsetHeight;	
			}

		//set no-selection for all images in container  (switched off, because it is working throught bumbling to container with its event handler and preventDefault. Also mousemove for ie8 must be alse preventDefault)
//		for (i=0;i<len_arr;i=i+1)
//			{
//			images = array_items[i].get_elements_by_tag_name('img');
//			kolvo_img = images.length;
//			for (k=0;k<kolvo_img;k=k+1)
//				{
//				img_ = images[k];
//				img_.add_event_listener('mousedown',function(event){try{event.preventDefault()}catch(err){event.returnValue=false;}},false);
				
//				}
//			}



		}

	this.set_container_size()  //put it to the end of file to provide firtsly initializing of function and next execution;



	this.check_container_size = function()  //it is nessesary when window size is changing to keep scrolling (calculation of new block size and free width, it is only for X direction)
		{

		if (this.dir=='X')
			{
			if (this.container_visible.offsetWidth!=this.container_X_width)
				{
				this.max_left = this.container_width - this.container_visible.offsetWidth;
				this.container_X_width = this.container_visible.offsetWidth;
				}
			}
		else
			{

			//for y we need to calculate new height in a case of changing screen width, because text push block height
			if (this.container_visible.offsetWidth!=this.container_X_width)
				{
				array_items = document.get_elements_by_class_name(prefix+'_item');
			
				len_arr = array_items.length;
				len_itemY = array_items[0].offsetHeight;
				
				var total_width	=0;
				for (i=0;i<len_arr;i=i+1)
					{total_width = total_width+array_items[i].offsetHeight}

			
				this.container_height = len_arr*(this.add_px)+total_width+30;
				this.container.style.height = this.container_height+'px';
				this.max_top = this.container_height - this.container_visible.offsetHeight;
				}
			}
			
		
		}




	this.innertion = function(status_)
		{
	
		if (status_=='start')
			{
			this.innertion_array = []; //new inner masiv for distansecollection
			this.innertion_array_time = []  //new array for time collection
			this.innertion_prev_time = new Date().getTime();
			if (this.dir=='X')
				{
				this.innertion_prev_trans = this.cur_transX;
				}
			else
				{
				this.innertion_prev_trans = this.cur_transY;
				}
			}

	
		if (status_=='moving')
			{
			if (this.dir=='X')
				{
				dif = this.cur_transX-this.innertion_prev_trans;
				this.innertion_prev_trans = this.cur_transX;
				cur_time = new Date().getTime();
				time_dif = cur_time - this.innertion_prev_time;
				this.innertion_prev_time = cur_time;
				}
			else
				{
				dif = this.cur_transY-this.innertion_prev_trans;
				this.innertion_prev_trans = this.cur_transY;
				cur_time = new Date().getTime();
				time_dif = this.innertion_prev_time - cur_time;
				this.innertion_prev_time = cur_time;
				}

			this.innertion_array.push(dif);
			this.innertion_array_time.push(time_dif);
			}
		else   //stop
			{
			len = this.innertion_array.length;
			total_time = 0;
			total_dis = 0;
			for (i=0;i<this.innertion_items;i=i+1)
				{
				total_dis = total_dis+Math.abs(this.innertion_array[len-1-i]);
				total_time = total_time+Math.abs(this.innertion_array_time[len-1-i]);
				
				}
			last_dis = this.innertion_array[len-1]; 
			speed = total_dis/total_time;
			if (last_dis>0)
				{
				speed = speed;
				}
			else
				{
				speed = -speed;
				}
			if (this.innertion_array.length<this.innertion_items)
				{speed=0}
			this.innertion_array = [];
			this.innertion_array_time = [];
			return speed;
			}
		}




	this.move_by = function(dis)  //obj = this,dis = distance for moving, dim = dimensions:px or %%, dir = direction:'X' or 'Y'
		{
		if (this.dir=='X')
			{
			dis_move = dis+this.cur_transX;
			if (dis_move<=-this.max_left)
				{dis_move = -this.max_left}
			if (dis_move>=0)
				{dis_move = 0}
			this.container.style['left'] = dis_move+this.dim;
			this.cur_transX = dis_move;
			
			if(this.progress_bar_par=='on')
				{
				pb_mv = -this.cur_transX/this.container_width;
				pb_mv = pb_mv*this.pb_length;
				this.progress_bar_feel.style['margin'] = '0px 0px 0px '+pb_mv+'px';
				}
			}
		else
			{
			dis_move = dis+this.cur_transY;
			if (dis_move<=-this.max_top)
				{dis_move = -this.max_top}
			if (dis_move>=0)
				{dis_move = 0}

			this.container.style['top'] = dis_move+this.dim;
			this.cur_transY = dis_move;
			if(this.progress_bar_par=='on')   //for progress bar moving
				{
				pb_mv = -this.cur_transY/this.container_height;
				pb_mv = pb_mv*this.pb_length;  //calculate in pixels length
				this.progress_bar_feel.style['margin'] = pb_mv+'px 0px 0px -1px';
				}
			}

	
		}

	this.move_by(0);  //this is nessesary to provide smoth moving from the first click

	this.transition_on_off = function(speed)
		{
		this.container.offsetHeight;
		if (this.dir=='X')
			{
			this.container.style['transition'] = 'left '+speed+'s ease';
			this.container.style['-moz-transition'] = 'left '+speed+'s ease';
			this.container.style['-o-transition'] = 'left '+speed+'s ease';
			this.container.style['-ms-transition'] = 'left '+speed+'s ease';
			this.container.style['-webkit-transition'] = 'left '+speed+'s ease';
			this.container.style['-khtmltransition'] = 'left '+speed+'s ease';
	}
		else
			{
			this.container.style['transition'] = 'top '+speed+'s ease';
			this.container.style['-moz-transition'] = 'top '+speed+'s ease';
			this.container.style['-o-transition'] = 'top '+speed+'s ease';
			this.container.style['-webkit-transition'] = 'top '+speed+'s ease';
			this.container.style['-ms-transition'] = 'top '+speed+'s ease';
			this.container.style['-khtml-transition'] = 'top '+speed+'s ease';
			}
		}



	//mouse move listener, translate in specific direction by move px
	this.mouse_move = function(e)
		{
		
		if (obj.cur_mouse_flag!='stop')
			{
			if (!e) e = window.event;
			try
				{
				t = e.changedTouches[0]
				obj.cur_mouseX = t.clientX;
				obj.cur_mouseY = t.clientY;
				}
			catch(err)
				{
								
				obj.cur_mouseX = e.clientX; 
				obj.cur_mouseY = e.clientY;		
				}
		
	
			if (this.dir=='X')
				{
				dif = obj.cur_mouseX - obj.onclick_mouseX;

				dif = dif/1;
				dif = dif.toFixed(0);
				dif = dif*1;

				move_dif = obj.cur_transX_tmp+dif;
				if (move_dif<=-this.max_left-50)
					{
					move_dif = -this.max_left-50;
					this.container.style['left'] = move_dif+this.dim;
					this.cur_transX = move_dif;
					return false;	
					}
			
				if (move_dif>=50)  //check if if edge has riched
					{
					move_dif = 50;
					this.container.style['left'] = move_dif+this.dim;
					this.cur_transX = move_dif;
					return false;
					}
				else
					{
					this.container.style['left'] = move_dif+this.dim;
					this.cur_transX = move_dif;
					this.innertion('moving'); //for innertion pass distance (loging)
					if (this.progress_bar_par=='on'&move_dif<=0&move_dif>=-this.max_left)
						{
						pb_mv = -this.cur_transX/this.container_width;
						pb_mv = pb_mv*this.pb_length;
						this.progress_bar_feel.style['margin'] = '0px 0px 0px '+pb_mv+'px';
						}
					
					if (this.progress_bar_par=='on'&move_dif>=0)
						{
						this.progress_bar_feel.style['margin'] = '0px 0px 0px -1px';
						}
					if (this.progress_bar_par=='on'&move_dif<=-this.max_left)
						{
						pb_mv = (1-this.feel_width)*this.pb_length;
						this.progress_bar_feel.style['margin'] = '0px 0px 0px '+pb_mv+'px';
						}	


					}
				}
			else
				{
				dif = obj.cur_mouseY - obj.onclick_mouseY;
				dif = dif/1;
				dif = dif.toFixed(0);
				dif = dif*1;
				
				move_dif = obj.cur_transY_tmp+dif;
				if (move_dif<=-this.max_top-50)
					{
					move_dif = -this.max_top-50;
					this.container.style['top'] = move_dif+this.dim;
					this.cur_transY = move_dif;
					return false;
					}
				if (move_dif>=50)  //checkinf if edge has riched 
					{
					move_dif = 50;
					this.container.style['top'] = move_dif+this.dim;
					this.cur_transY = move_dif;
					return false;
					}
				else
					{
					this.container.style['top'] = move_dif+this.dim;
					this.cur_transY = move_dif;
					this.innertion('moving'); //for innertion pass distance	(loging)
					if (this.progress_bar_par=='on'&move_dif<=0&move_dif>=-this.max_top)
						{
						pb_mv = -this.cur_transY/this.container_height;
						pb_mv = pb_mv*this.pb_length;
						this.progress_bar_feel.style['margin'] = pb_mv+'px 0px 0px -1px';
						}
					if (this.progress_bar_par=='on'&move_dif>=0)
						{
						this.progress_bar_feel.style['margin'] = '0px 0px 0px -1px';
						}
					if (this.progress_bar_par=='on'&move_dif<=-this.max_top)
						{
						pb_mv = (1-this.feel_height)*this.pb_length;
						this.progress_bar_feel.style['margin'] = pb_mv+'px 0px 0px -1px';
						}	
					}
				
				}


			

			}


		}

	}



function ajax_preloder()
	{
	this.d = document.get_elements_by_class_name('ajax_preloder_block')[0];
	
	
	this.st = function()
		{
		var t = new Date();
		window.ajax_preloder_time = t.getTime();
		this.d.style['display'] = 'block';
		this.d.style['z-index'] = '1000';
		}
	
	this.sp = function()
		{
		var t = new Date();
		var obj = this;
		t_dif = t.getTime() - window.ajax_preloder_time;
		if (t_dif>500)
			{
			obj.d.style['display'] = 'none';
			}
		else
			{
			setTimeout(function(){obj.d.style['display'] = 'none'},300);
			}
		}
	
	}





//window.c = new calendar();  - initializing calendar. It can be one object for all charts and tables. You need only pass object to parametr in this way
//	var but = document.getElementsByClassName('test_button')[0];
//	but.addEventListener('click',function(){var obj = this;window.c.open_event(obj);event.stopPropagation()},false);
//Do not forget add window.c.close_event() on body click event 
//Handler for click setting as window.c.click_event() = function(console.log('Test'));
//	in Handler this.choosen_date - choosen date
//	this.div_data_block - block with date

function calendar()
	{
	
	this.dict_days = {};
	this.block = '';   //DVI block in the document with calendar
	this.block_insight = ''; //content of calendar block (innerHTML forDIV class=calendar)
	this.days_container = '' //table with days, creating during create_inst, and then filling during this.insert_days()
	this.days_array = []  //array, filled during this.create_days, contains days for table

	this.div_data_block = ''; //block with data, from where to read and where to write
	
	this.flag = 'none';  //flag shown or not
	this.cur_date = new Date();  //it is initializing class, further it is only will be changhing, but always must be equal to Date in box
	this.month_board = new Date() //it is using for navigation only throught the monthes and years, bu ALWAYS HAS DAY 1. that is why nessesary to set clicked day into span final block

	this.cur_year = '';  //completing during read_from_box, actual displaied data in div
	this.cur_month = ''; //it is always must be actual year and month
	this.cur_day = '';
	
	window.flag_slider = 'none'; //flag 'yes' maens working slider on month and year

	//open event - general event for all clicks but not for body clicking (in this case every click will raise event). For body click - close_calendar.
	this.open_event = function(target_block)
		{
		
		var coordinates = target_block.getBoundingClientRect();
		var x = coordinates['left'];
		var y = coordinates['top']+window.scrollY;
		var h = coordinates['height'];


		//read from box date
		this.read_from_box(target_block);
		



		if (this.flag=='none')  //open calendar
			{
			this.complete_dict();
			this.create_inst();
			//create element-calendar in DIV
			var block = document.createElement('DIV');
			block.className = 'calendar';
			block.innerHTML = this.block_insight;
			document.body.appendChild(block);			

			this.block = document.getElementsByClassName('calendar')[0];
			this.days_container = this.block.getElementsByClassName('days_container')[0];
			//insert data days (inserting into this.days_container insught the functions)
			this.create_days();
			this.insert_days()
			this.set_style();
			

			//if in block closer to right border of document
			var sw = document.body.offsetWidth;
			var cw = this.block.offsetWidth; //width of calendar
			//determine coordinates and set them
			if ((cw+x)>sw)
				{
				this.block.style['right'] = '12px';
				}	
			else
				{
				this.block.style['left'] = x+'px';
				}	

			
			this.block.style['top'] = y+5+h+'px';
			//nessesary to add listeners for all calendar place (square), to prevent count such click as click on body
			this.set_listener();
			this.flag = 'yes';
			this.div_data_block = target_block;
			}
		else
			{
			this.close_event();
			}		

		}


	//it is nessesary for body click event to close calendar
	this.close_event = function()
		{
		document.body.removeChild(this.block);
		this.flag = 'none';
		this.button_block = '';
		}




	//set listeners on every showing of calendar
	this.set_listener = function()
		{
		var obj = this;
		var left_y = this.block.getElementsByClassName('year_container')[0].getElementsByClassName('left')[0];
		var right_y = this.block.getElementsByClassName('year_container')[0].getElementsByClassName('right')[0];
		var left_m = this.block.getElementsByClassName('month_container')[0].getElementsByClassName('left')[0];
		var right_m = this.block.getElementsByClassName('month_container')[0].getElementsByClassName('right')[0];
		
		var l = [left_y,right_y,left_m,right_m];
		for (every in l)
			{
			var it = l[every];
			it.addEventListener('click',function(event){obj.navig_click(event,this.id);event.stopPropagation()},false);
			}
		var td_mas = this.days_container.getElementsByTagName('td');
		var td_len = td_mas.length;
		for (var i=0;i<td_len;i=i+1)
			{
			var it = td_mas[i];
			it.addEventListener('click',function(event){obj.days_click(event);event.stopPropagation()},false);
			}
	
		//to prevent closing calendar because of listener on closing on body (stopPropagation() nessesary)
		this.block.addEventListener('click',function(event){obj.click_event(event);event.stopPropagation()},false);
		}

	//click event - event for all calendar square, to prevent closing of it because of onclick event on body
	this.click_event = function()
		{
		console.log('test default click calendar event');
		}

	this.navig_click = function(e,id_n)
		{
		//format of id is c_year_l  (last means left or right)
		var id_ = id_n.split('_');

		//if slider is working - prevent click event
		if (window.flag_slider!='none')
			{
			return false;
			}

		window.flag_slider = 'yes'; //set flag yes up to moth or year slide will be finiched. Swithcing off during update
		//year shifting
		if (id_[1]=='year')
			{
			if (id_[2]=='l')
				{
				this.cur_year = this.cur_year-1;
				}
			else
				{
				this.cur_year = this.cur_year+1;
				}
			}
		var year_border = 'no';
		//month shifting
		if (id_[1]=='month')
			{
			if (id_[2]=='l')
				{
				if (this.cur_month==0)   //it is nessesary if previous year needful
					{
					this.cur_month = 11;
					this.cur_year = this.cur_year-1;
					year_border='yes';	
					var id_y = id_.slice();
					id_y[1] = 'year';
					}
				else
					{
					this.cur_month = this.cur_month-1;
					}
				
				}
			else
				{
				if (this.cur_month==11)
					{
					this.cur_month = 0;
					this.cur_year = this.cur_year+1;
					year_border='yes';
					var id_y = id_.slice();
					id_y[1] = 'year';
					}
				else
					{
					this.cur_month = this.cur_month+1;
					}

				}
			}
	
		//update table with days
		this.month_board.setMonth(this.cur_month);
		this.month_board.setFullYear(this.cur_year);
		//create and insert days
		this.create_days();
		this.insert_days();
		this.set_style();
		
		if (year_border=='yes')
			{
			this.update_cur_date(id_y);
			}
		this.update_cur_date(id_); //insert actual month and year	
		}


	this.days_click = function(e)
		{
		if (!e){e = window.event}


		var opacit = e.target.style['opacity'];
		if (e.target.tagName!='TD')  //e.target will show element was clicked, but not td with determined early opacity (during set_style())
			{
			opacit = e.target.parentElement.style['opacity'];
			}
		var day = e.target.innerHTML;
		//it is nessesary shift month depending on last month or next month area click
		if (parseInt(day)<10&&opacit!='1')
			{
			var mm = this.cur_month+2;
			if (mm>12){mm=mm-12}
			}

		else if (parseInt(day)>20&&opacit!='1')
			{
			var mm = this.cur_month;
			if (mm==0){mm=12};
			}
		else
			{
			var mm = this.cur_month+1;
			}



//		var tmp = this.div_data_block.getElementsByTagName('span')[0];
//		var tmp = this.div_data_block;		
		null_d = '';  //adding null for one figure day
		null_m = '';


		if (day.toString().length==1){null_d = '0'}
		if (mm.toString().length==1){null_m = '0'}
		this.choosen_date = null_d+day.toString()+'.'+null_m+mm.toString()+'.'+this.cur_year;
		//close calendar
		this.close_event();
		this.click_event();	
		}



	//reading from box where Date is placed and set month_board data
	this.read_from_box = function(target_block)
		{
		//if span in target block;
//		var d_span = target_block.getElementsByTagName('span')[0];	
		var tmp = target_block.innerHTML;
		tmp = tmp.split('.');
		
		
		this.cur_date.setDate(parseInt(tmp[0]));
		this.cur_date.setMonth(parseInt(tmp[1])-1);
		this.cur_date.setFullYear(parseInt(tmp[2]));

		//set variables. nessesary for shifting data
		this.cur_day = parseInt(tmp[0]);
		this.cur_month = parseInt(tmp[1]-1);
		this.cur_year = parseInt(tmp[2]);

		
		this.month_board.setTime(this.cur_date.getTime());
		this.month_board.setDate(1);
		}




	this.complete_dict = function()
		{
		for (var i=0;i<6;i=i+1)
			{
			var tmp_days = [1,2,3,4,5,6,7];
			this.dict_days[i] = tmp_days.slice();
			}
	
		}

	this.create_inst = function()
		{
		var new_smp = this.smp.toString().split('*')[1];
		var d_tmp = this.cur_date.toDateString().split(' ');
		new_smp = new_smp.replace('`year`',d_tmp[3]);
		new_smp = new_smp.replace('`month`',d_tmp[1]);
	
		this.block_insight = new_smp;
		}


	///////////////////CREATING TABLE//////////////////////////////////////////
	//creating array with days
	this.create_days = function()
		{
		//week days numerated beginnig from 0 - Monday
		//Sunday equal to 0, that is why nessesary determine through the if exception
		var week_day = this.month_board.getDay()-1;
		if (week_day==-1){week_day = 6};
		this.days_array = [];
		//create empty array for days, lenght 42
		for (var i=0;i<42;i=i+1)
			{
			this.days_array.push(0);
			}
		var d_tmp = new Date();
		d_tmp.setTime(this.month_board.getTime());

		//if week is quite starting from the beginnig, much comfortable shift by one week down (to display last days of month)
		if (week_day<2)
			{
			week_day = week_day+7;
			}
		this.days_array[week_day] = d_tmp.getDate();
		//complete array to left
		while (week_day>0)
			{
			week_day = week_day - 1;
			var d = d_tmp.getTime() - 1000*60*60*24;
			d_tmp.setTime(d);
			this.days_array[week_day] = d_tmp.getDate();
			}
		//complete array to the end
		for (var i=0;i<this.days_array.length;i=i+1)
			{
			this.days_array[i] = d_tmp.getDate();
			d_tmp.setTime(d_tmp.getTime()+1000*60*60*24);
			
			}
	
		}

	//inserting days into table
	this.insert_days = function()
		{
		var td_mas = this.days_container.getElementsByTagName('td');
		for (every in this.days_array)
			{
			var it = td_mas[every];
			//get div, because in td there is div for border-radius
			it = it.getElementsByTagName('div')[0];
			it.innerHTML = this.days_array[every];
			}


		}

	this.set_style = function()
		{
		var td_mas = this.days_container.getElementsByTagName('td');
		var td_len = td_mas.length;
		for (var every=0;every<td_len;every = every+1)
			{
			//set red for holidays
			if ((parseInt(every)+1)%7==0||(parseInt(every)+1)%7==6)
				{
				td_mas[every].style['color'] = 'red';
				}

			//set style for another month
			var ctx = parseInt(td_mas[every].getElementsByTagName('div')[0].innerHTML);
			if (every<10&&ctx>10)
				{
				td_mas[every].style['opacity'] = '0.3';
				td_mas[every].getElementsByTagName('div')[0].style['background'] = 'none'; //reset background during listing throught the days, to prevent selection of current day from previous month
				}
			else if (every>24&&ctx<10)
				{
				td_mas[every].style['opacity'] = '0.3';
				td_mas[every].getElementsByTagName('div')[0].style['background'] = 'none';
				}
			else
				{
				td_mas[every].style['opacity'] = '1';
				//set for current day appropriate selection style
				var y = this.month_board.getFullYear();	
				var m = this.month_board.getMonth();
				var y_c = this.cur_date.getFullYear();
				var m_c = this.cur_date.getMonth();
				var d_c = this.cur_date.getDate();


				if (ctx==d_c&&m==m_c&&y==y_c)
					{
					td_mas[every].getElementsByTagName('div')[0].style['background'] = 'rgb(255, 184, 0)';
					}
				else
					{
					td_mas[every].getElementsByTagName('div')[0].style['background'] = 'none';
					}	
				}
			}

		//check for the last week (if it is new month yet
		var tr_last = this.days_container.getElementsByTagName('tr');
		var td_mas_inner = parseInt(td_mas[35].getElementsByTagName('div')[0].innerHTML);
		if (td_mas_inner<9&&td_mas_inner>3)
			{
			tr_last[5].style['display'] = 'none';
			}
		else
			{
			tr_last[5].style['display'] = 'table-row';
			}
		
		}


	this.update_cur_date = function(id_)
		{
			
		//determine block which to pass, 
		var m_cur = parseInt(this.cur_date.getMonth());  //additionally get current date and month to deremine color of text
		var y_cur = parseInt(this.cur_date.getFullYear());
		if (id_[1]=='year') //get block with month or year
			{
			var key_div = this.block.getElementsByClassName('year_container')[0].getElementsByClassName('year')[0];
			var key_text = this.month_board.toString().split(' ')[3];
			if (this.cur_year!=y_cur)
				{
				key_color = 'white';
				}
			else
				{
				key_color = 'rgb(233, 233, 233)';
				}
			}
		else
			{
			var key_div = this.block.getElementsByClassName('month_container')[0].getElementsByClassName('month')[0];
			var key_text = this.month_board.toString().split(' ')[1];
			if (this.cur_month!=m_cur)
				{
				key_color = 'white';
				}
			else
				{
				key_color = 'rgb(233, 233, 233)';
				}
			}


		if (id_[2]=='l')
			{
			move_from_left(key_div,key_text,key_color);
			}
		else
			{
			move_from_right(key_div,key_text,key_color);
			}
		

		function move_from_right(key_div,key_text,key_color)
			{
			var new_table = document.createElement('TABLE');
			new_table.style['left'] = '100%';
			
			//insert new text
			new_table.innerHTML = '<td>'+key_text+'</td>';
			new_table.getElementsByTagName('td')[0].style['background'] = key_color;
			key_div.appendChild(new_table);	
		
			//moving
			var t1 = key_div.getElementsByTagName('table')[0];
			var t2 = key_div.getElementsByTagName('table')[1];
			t1.offsetWidth;
			t2.offsetWidth;
			t1.style['left'] = '-100%';
			t2.style['left'] = '0px';
			
			setTimeout(function(){rem_child(key_div,t1)},500);
			}


		function move_from_left(key_div,key_text,key_color)
			{
			var new_table = document.createElement('table');
			new_table.style['left'] = '-100%';
			new_table.innerHTML = '<td>'+key_text+'</td>';
			new_table.style['background'] = key_color;
			var f_child = key_div.firstChild;
			key_div.insertBefore(new_table,f_child);
			
			var t1 = key_div.getElementsByTagName('table')[0];
			var t2 = key_div.getElementsByTagName('table')[1];
			t1.offsetWidth;
			t2.offsetWidth;
			t1.style['left'] = '0px';
			t2.style['left'] = '100%';

			setTimeout(function(){rem_child(key_div,t2)},500);
			
			}



		function rem_child(key_div,t1)
			{
			key_div.removeChild(t1);
			window.flag_slider = 'none';
			}

/*

		//get td because text in td
		y = y.getElementsByTagName('td')[0];
		m = m.getElementsByTagName('td')[0];	


		//to set another font color if current year or month differ from month_board	

*/
		
		}


	//sample of div block with calendar
	this.smp = function()
		{
	/*	
		<div class='year_container'>
			<div id = 'c_year_l' class='left'>
				<svg width="24" height="27">
					<path d="M3 13.5 L17 5 L17 22 L3 13.5 Z" fill="white">
				</svg>
			</div>
			<div class='year'><table><td>`year`</td></table></div>
			<div id = 'c_year_r' class='right'>
				<svg width="24" height="27">
					<path d="M7 5 L21 13.5 L7 22 L7 5 Z" fill="white">
				</svg>
			</div>
		</div>
		<div class='month_container'>
			<div id = 'c_month_l' class='left'>
				<svg width="24" height="27">
					<path d="M3 13.5 L17 5 L17 22 L3 13.5 Z" fill="white">
				</svg>
			</div>
			<div class='month'><table><td>`month`</td></table></div>
			<div id = 'c_month_r' class='right'>
				<svg width="24" height="27">
					<path d="M7 5 L21 13.5 L7 22 L7 5 Z" fill="white">
				</svg>
			</div>
		</div>		


		<!--WEEK DAYS-->
		<div class="week_days">
			<div><span>Mo</span></div>
			<div><span>Tu</span></div>
			<div><span>We</span></div>
			<div><span>Th</span></div>
			<div><span>Fr</span></div>
			<div><span>Sa</span></div>
			<div><span>Su</span></div>

		</div>

		<div class='days_container'>
			<table>
			<tr> <td><div></div></td> <td><div></div></td> <td><div></div></td> <td><div></div></td> <td><div></div></td> <td><div></div></td> <td><div></div></td> </tr>
			<tr> <td><div></div></td> <td><div></div></td> <td><div></div></td> <td><div></div></td> <td><div></div></td> <td><div></div></td> <td><div></div></td> </tr>
			<tr> <td><div></div></td> <td><div></div></td> <td><div></div></td> <td><div></div></td> <td><div></div></td> <td><div></div></td> <td><div></div></td> </tr>
			<tr> <td><div></div></td> <td><div></div></td> <td><div></div></td> <td><div></div></td> <td><div></div></td> <td><div></div></td> <td><div></div></td> </tr>
			<tr> <td><div></div></td> <td><div></div></td> <td><div></div></td> <td><div></div></td> <td><div></div></td> <td><div></div></td> <td><div></div></td> </tr>
			<tr> <td><div></div></td> <td><div></div></td> <td><div></div></td> <td><div></div></td> <td><div></div></td> <td><div></div></td> <td><div></div></td> </tr>
			</table>
		</div>


	*/
		}

	}



