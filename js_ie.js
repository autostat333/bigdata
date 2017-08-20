

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
	all_elem = container_obj.getElementsByTagName('*');
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

/*
	//initialize event

	if (!e) e = window.event;

	var main_container = document.getElementById(id_elem);
	var direction = '';
	var slow='no'; //additional parameter for slow opening (if another process underway)
	slow = 'no';  //open list_menu without gradual opacity changing


	// determine which element retains as target and related target depend on mouseover and mouseout
	if (act=='list_open') 
		{
		var to_ = e.target;
		var from_ = e.relatedTarget;
		}

	if (act=='list_close')
		{
		var from_ = e.target;
		var to_ = e.relatedTarget;
		}


	if (act=='click')
		{
		ul_list = main_container.getElementsByTagName('ul')[0];
		ul_list.style.display = 'none';
		return false;
		}

	//check if the mouse flows to browser window (to_ equal to null in this case)
	if (to_==null) {direction = 'int-ext'}
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

		headers = main_container.getElementsByClassName('uplist_horizontal_elem_span');
		headers[0].style.color = '#00317A';

		//for triangle appearing	
		triangle = main_container.getElementsByClassName('triangle_container')[0]
		triangle.style.display = 'inline-block';

				
		var t = main_container.getElementsByTagName('ul');
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
		headers = main_container.getElementsByClassName('uplist_horizontal_elem_span');
		headers[0].style.color = '#3385FF';		

		//for triangle appearing
		triangle = main_container.getElementsByClassName('triangle_container')[0]
		triangle.style.display = 'none'			
		//hover back

		var t = main_container.getElementsByTagName('ul');
		t[0].style.display = 'none';//set visibility 'none'
		t[0].style.opacity = '0';
		}	
*/
	}

/*  |||||||||||||||||||||||||||||||||||||||||||||||||||||
		MAIN IMG Slider block
||||||||||||||||||||||||||||||||||||||||||||||||||||||*/

/*

REMEMBER!!!!!!!!!!!!
for two events (mouseup and touchend) it must me determined hablers to stop moving scrol


*/



MainSlider = function(prefix)
	{
	var obj = this;
	//get all blocks
	
	try	
		{		
		this.scroll_left = document.querySelector('.'+prefix+'_slider_button_left');
		this.scroll_right = document.querySelector('.'+prefix+'_slider_button_right');	
		this.container = document.querySelector('.'+prefix+'_slider_img_container');
		this.progress_bar = document.querySelector('.'+prefix+'_slider_progress_bar_container');

		this.img_array = this.container.querySelectorAll('img');
		this.img_index = []  //index for control current img
		this.text_array = document.querySelectorAll('.'+prefix+'_slider_text_container_span'); //array for text	

		}
	catch(err)
		{

		this.scroll_left = document.getElementsByClassName(prefix+'_slider_button_left')[0];
		this.scroll_right = document.getElementsByClassName(prefix+'_slider_button_right')[0];	
		this.container = document.getElementsByClassName(prefix+'_slider_img_container')[0];
		this.progress_bar = document.getElementsByClassName(prefix+'_slider_progress_bar_container')[0];

		this.img_array = this.container.getElementsByTagName('img');
		this.img_index = []  //index for control current img
		this.text_array = document.getElementsByClassName(prefix+'_slider_text_container_span'); //array for text

		}

	this.id_scroll = 0  //flag for execution (moving img slide)
	this.len = this.img_array.length; //kolvo img items
	

	//special ordering because of z-index (last element over firts elements)
	this.next_img = this.img_array[1];
	this.prev_img = this.img_array[this.len-1];
	this.cur_img = this.img_array[0];  

	this.img_len = this.img_array[0].offsetWidth; //length of img for moving left


	//set handlers for clicks

	try
	{
	this.scroll_left.addEventListener('click',function(){obj.left();event.stopPropagation()},false);
	this.scroll_right.addEventListener('click',function(){obj.right();event.stopPropagation()},false);

	this.container.addEventListener('mousedown',function(event){obj.touch_on(event);event.stopPropagation()},false);
	this.container.addEventListener('mousemove',function(event){obj.touch_move(event)},false);
	this.container.addEventListener('mouseup',function(event){obj.touch_off(event);event.stopPropagation()},false);


	this.container.addEventListener('touchstart',function(event){obj.touch_on(event)},false);
	this.container.addEventListener('touchend',function(event){obj.touch_off(event)},false);
	this.container.addEventListener('touchmove',function(event){obj.touch_move(event);event.preventDefault()},false);
	}
	catch(err)
	{

	}
	finally
	{
	
	this.scroll_left.attachEvent('click',function(){obj.left();event.stopPropagation()});
	this.scroll_right.attachEvent('click',function(){obj.right();event.stopPropagation()});

	this.container.attachEvent('mousedown',function(event){obj.touch_on(event);event.stopPropagation()});
	this.container.attachEvent('mousemove',function(event){obj.touch_move(event)});
	this.container.attachEvent('mouseup',function(event){obj.touch_off(event);event.stopPropagation()});


	this.container.attachEvent('touchstart',function(event){obj.touch_on(event)});
	this.container.attachEvent('touchend',function(event){obj.touch_off(event)});
	this.container.attachEvent('touchmove',function(event){obj.touch_move(event);event.preventDefault()});

	}




	this.flag = 'stop'; //floag for mouse_up and mouse_down status (during mouse moving)
	this.start_click = 0; //coordinates of mouse_click;

	window.id_tmp_2 = 0;

	//cancel default event for img (disable moving during mouse touch)
	for (i=0;i<this.len;i=i+1)
		{
		elem = this.img_array[i];
		try
			{
			elem.addEventListener('mousedown',function(event){event.preventDefault()},false);
			}
		catch(err)
			{
			}
		finally
			{
			elem.attachEvent('mousedown',function(event){event.preventDefault()});
	
			}

		}	



	this.preload = function()
		{
		
		//comaplete index array
		for (i=0;i<this.len;i=i+1)
			{
			this.img_index.push(i);	
			}



		//set images on edges

		this.prev_img.style['z-index'] = '2';
		this.cur_img.style['z-index'] = '3';
		this.next_img.style['z-index'] = '2';

	
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
		try
			{
			this.bar_array = this.progress_bar.getElementsByTagName('div');
			}
		finally
			{
			this.bar_array = this.progress_bar.querySelectorAll('div');
	
			}


		//set text visible (at the beginnig all elem have 0 opacity)
		this.text_array[this.img_index[0]].style['opacity'] = '1';
		//set bar visible (at the beginnig all elem have 0 opacity)
		this.bar_array[this.img_index[0]].style['opacity'] = '1';
	

		}


	//preload start
	this.preload();

	//translate to pixel, android normally works with px (transition)
	this.trans_to_px = function()
		{
		this.cur_img.style['left'] = '0px';
		this.prev_img.style['left'] = -this.img_len;
		this.next_img.style['left'] =  this.img_len;	
		}



	//nessesary to translate width to %%, when screen size is changing - it adapts
	this.trans_to_percent = function()
		{
		obj = this;		

		
		function p(obj)
			{
			obj.cur_img.style['left'] = '0px';
			obj.next_img.style['left'] = '100%';
			obj.prev_img.style['left'] = '-100%';	
			clearInterval(window.id_tmp_2);
	//		console.log('ddd');
	//		window.id_tmp_2 = 0;
			}
		p(obj)
	//	if (window.id_tmp_2==0)	
	//		{
	//		window.id_tmp_2 = setInterval(function(){p(obj)},500);
	//		}
		
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
				
				}
				
			}
		else
			{
			for (i=0;i<this.len;i=i+1)
				{
				this.img_array[i].offsetWidth;
				this.img_array[i].style['transition'] = 'left 0s ease';
				}
			
			}
		}	



	this.left = function(touch_src)
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
	
		//prepare z-index (visibility)


		this.cur_img.style['z-index'] = '3';
		this.prev_img.style['z-index'] = '2';
		this.next_img.style['z-index'] = '1';


		//touch_src = touch_src||'none';
		//if (touch_src=='none')
		//	{
		//	this.trans_to_px(); //set width in px
		//	}


		//moving
		this.transition_on_off('on');
		this.prev_img.style['left'] = '0px';
		this.cur_img.style['left'] = this.img_len+'px';

		
	
		//progress bar set
		this.bar_array[this.img_index[0]].style['opacity'] = '0.3';
		this.bar_array[this.img_index[this.len-1]].style['opacity'] = '1';	

		//text set
		this.text_array[this.img_index[0]].style['opacity'] = '0';
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

		this.cur_img.style['z-index'] = '3';
		this.prev_img.style['z-index'] = '1';
		this.next_img.style['z-index'] = '2';
	
		obj.next_img.style['left'] = this.img_len;
		obj.prev_img.style['left'] = -this.img_len;
	
//		this.trans_to_percent()  //set width in %%

		}		


	this.right = function(touch_src)
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


		this.cur_img.style['z-index'] = '3';
		this.prev_img.style['z-index'] = '2';
		this.next_img.style['z-index'] = '2';

		//touch_src = touch_src||'none';
		//if (touch_src=='none')
		//	{
		//	this.trans_to_px(); //set width in px
		//	}



		//moving
		this.transition_on_off('on');
		this.cur_img.style['left'] = -this.img_len+'px';
		this.next_img.style['left'] = '0px';

	
		//progress bar set
		this.bar_array[this.img_index[0]].style['opacity'] = '0.3';
		this.bar_array[this.img_index[1]].style['opacity'] = '1';	


		//text set
		this.text_array[this.img_index[0]].style['opacity'] = '0';
		this.text_array[this.img_index[1]].style['opacity'] = '1';


		this.transition_on_off('off');	
		//prepare for next moving (index pushing)
		k = this.img_index[0];
		this.img_index.push(k);
		n = this.img_index.splice(0,1);
		


		//set new images
		this.cur_img.style['z-index'] = '3';
		this.prev_img.style['z-index'] = '1';
		this.next_img.style['z-index'] = '2';
		

		
		this.next_img = this.img_array[this.img_index[1]];
		this.prev_img = this.img_array[this.img_index[this.len-1]];
		this.cur_img = this.img_array[this.img_index[0]];  
		
		this.prev_img.style['left'] = -this.img_len;
		this.next_img.style['left'] = this.img_len;
		
//		this.trans_to_percent() //set width in percent
	
		}		

	this.touch_on = function(e)
		{
//		this.trans_to_px();
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
	//	this.transition_on_off('off');
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
		
			this.cur_img.style['left'] = '0px';
			this.next_img.style['left'] = this.img_len;	
			this.prev_img.style['left'] = -this.img_len;	


			this.transition_on_off('off');
			//this.trans_to_percent();
			}

		if (dif>-margin_dif&dif<0)
			{
			
			this.transition_on_off('on',0.2);
			
			this.cur_img.style['left'] = '0px';	
			this.next_img.style['left'] = this.img_len;	
			this.prev_img.style['left'] = -this.img_len;	
		
			this.transition_on_off('off');
			//this.trans_to_percent();
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
	this.scroll_left_button = document.getElementsByClassName(prefix+'_scroll_button_left')[0];
	this.scroll_right_button = document.getElementsByClassName(prefix+'_scroll_button_right')[0];
	this.container = document.getElementsByClassName(prefix+'_item_container')[0];
	this.container_visible = document.getElementsByClassName(prefix+'_block')[0]; //to calculate margin distance for moving
	try
		{
		this.progress_bar = document.getElementsByClassName(prefix+'_progress_bar')[0]; //for progress bar 
		this.progress_bar_feel = this.progress_bar.getElementsByClassName(prefix+'_feel')[0];			
		}
	catch(err){};

		
	var obj = this; //nessesary for passing OBJECT for next functions
	

	this.scroll_left_button.addEventListener('click',function() {obj.move_left()},false);
	this.scroll_right_button.addEventListener('click',function() {obj.move_right()},'false');
	this.container.addEventListener('mousedown',function(event) {obj.touch_click_on(event);event.preventDefault();},false);
	this.container.addEventListener('mouseup',function(event) {obj.touch_click_off(event)},false);
	this.container.addEventListener('mousemove',function(event) {obj.mouse_move(event)},false);

	//for touch events add new listener

	this.container.addEventListener('touchstart',function(event) {obj.touch_click_on(event);event.preventDefault()},false);
	this.container.addEventListener('touchend',function(event) {obj.touch_click_off(event);event.preventDefault()},false);
	this.container.addEventListener('touchmove',function(event) {obj.mouse_move(event);event.preventDefault(); return false;},false);



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

		this.check_container_size(); // it to keep actual block size when screen size changing
		//for click efect
		this.scroll_left_button.className += ' '+this.prefix+'_scroll_button_left_click';

		this.id_timer = setInterval(
			function()
			{
			obj.scroll_left_button.className = obj.prefix+'_scroll_button_left';clearInterval(obj.id_timer);
			},100)


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
				this.id_ttt = setInterval(back_,100);
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
				this.id_ttt = setInterval(back_,100);
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

		//for click effect
		this.scroll_right_button.className += ' '+this.prefix+'_scroll_button_right_click';
		this.id_timer = setInterval(
			function()
			{
			obj.scroll_right_button.className = obj.prefix+'_scroll_button_right';clearInterval(obj.id_timer);
			},100)
		

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
				this.id_ttt = setInterval(back_,100);
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
				this.id_ttt = setInterval(back_,100);
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
		
			this.innertion('start'); //for innertion (initial prev variables)
	
			t = e.changedTouches[0];
			this.onclick_mouseY = t.clientY;
			this.onclick_mouseX = t.clientX;
			this.cur_mouse_flag = 'start';
			this.cur_transX_tmp = this.cur_transX;
			this.cur_transY_tmp = this.cur_transY;

			}
		catch(err)
			{
			this.innertion('start'); //for innertion (initial prev variables)

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
				this.container.style['left'] = -this.max_left;
				this.transition_on_off(0);
				this.cur_transX = -this.max_left;
				}

			if (this.cur_transX>-this.max_left&this.cur_transX<0)
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
				this.container.style['top'] = -this.max_top;
				this.transition_on_off(0);
				this.cur_transY = -this.max_top;
	
				}
			if (this.cur_transY>-this.max_top&this.cur_transY<0)
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
		array_items = document.getElementsByClassName(prefix+'_item')
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

		//set no-selection for all images in container
		for (i=0;i<len_arr;i=i+1)
			{
			images = array_items[i].getElementsByTagName('img');
			kolvo_img = images.length;
			for (k=0;k<kolvo_img;k=k+1)
				{
				img_ = images[k];
				img_.addEventListener('mousedown',function(event){event.preventDefault()},false)		
	
	
				}
			}



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
				array_items = document.getElementsByClassName(prefix+'_item')
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
			}
		else
			{
			this.container.style['transition'] = 'top '+speed+'s ease';
			this.container.style['-moz-transition'] = 'top '+speed+'s ease';
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







