/*/////////////////////////////////////*/
/*     Load  */
/*/////////////////////////////////////*/



function start_function()
	{
	///////////////////////////////////
	/* initialize article_slider function */
	///////////////////////////////////


	window.ajax_wait = new ajax_preloder();

	///////////////////////////////////
	/* Listeners for document */
	///////////////////////////////////
	document.add_event_listener('mouseup',function(event){body_mouseup(event)},false);
	
	
	//switch off scrolling if up click was not over the item container  (for desktops)
	document.add_event_listener('touchend',function(event){body_touchend(event)},false);


	//switch off scrolling if up click was not over the item container  (for touches)
	window.add_event_listener('resize',function(){resizing()},true);


	//prepare dictionary with menu "a" objects for red underline (in switch menu section)
	var menu_a_items = document.get_elements_by_class_name('uplist_horizontal_elem_span');
	window.menu_a_dict = {}
	for (var i=0;i<menu_a_items.length;i=i+1)
		{
		var tmp = menu_a_items[i].innerHTML.toLowerCase();
		window.menu_a_dict[tmp] = menu_a_items[i];
		}


	//switch menu
	hash = document.location.hash;
	var para_dict = href_split(hash);
	switch_menu(para_dict);

	window.scrollTo(0,0);
	resizing(); //it is nessesary to fit div for actual screen size at beginnig, resizing also is responsible for settin height of body up to 100% if it is less then screen size


	//it is nessessary to prevent default browser action on mousedown event on tag 'a' (moving text, dotted selection) and set for every menu items listener (menu_click)
	set_listenner_a('menu_up');

	//start cycle of checking hash (for back button)
	window.id_back_button = setInterval(function(){check_hash()},100);


	//when ajax is working - switch off check_hash
	window.ajax_busy = 'no';

	//add event for scrolling (to fix article block panel on the top)
	window.add_event_listener('scroll',function(){fix_panel()},false);



	///////////////////////////////////
	/* FLV VIDEO */
	///////////////////////////////////


	
//	jwplayer("video_canvas").setup(
//		{
//		width:600,
//		file:'http://192.168.10.103/video/08_converted.flv'
//		})

//	jwp = new jwplayer("test_video");
//	jwp.setup = ({file:"./video/bmw.flv"})


	}




//i do not use this function, i use to get position getBoundingClientRect()
get_top_distance = function(elem)
	{
	var total_distance = elem.offsetTop;	
	var parent_elem = elem;
	
	while (parent_elem.parentNode.offsetTop)
			{
			parent_elem = parent_elem.parentNode;
			total_distance = total_distance + parent_elem.offsetTop;
			}
	return total_distance;
	
	}





fix_panel = function()
	{

	//because not all sections contains article_block	
	try{var panel = document.get_elements_by_class_name('article_block')[0];}
	catch(err){}


	var cur_pos = window.pageYOffset;
	var dif = cur_pos - window.panel_pos;

	if (dif>0&&window.panel_flag!='yes'&&panel)
		{

		var panel = document.get_elements_by_class_name('article_block')[0];
		panel.style.boxShadow = '0px 0px 6px gray';
		panel.style['-o-boxShadow'] = '0px 0px 6px gray';
		panel.style['-moz-boxShadow'] = '0px 0px 6px gray';
		panel.style['-ms-boxShadow'] = '0px 0px 6px gray';
		panel.style['-webkit-boxShadow'] = '0px 0px 6px gray';
		panel.style['-khtml-boxShadow'] = '0px 0px 6px gray';
		panel.style['width'] = window.panel_width+'px';
		panel.style['top'] = '0px';
		panel.style['position'] = 'fixed';
		window.panel_flag = 'yes'
		}
	if (dif<0&&window.panel_flag=='yes'&&panel)
		{
		var panel = document.get_elements_by_class_name('article_block')[0];
		panel.style['width'] = '100%';
		panel.style['position'] = 'relative';
		panel.style['boxShadow'] = '0px 0px 0px gray';
		panel.style['-o-boxShadow'] = '0px 0px 0px gray';
		panel.style['-moz-boxShadow'] = '0px 0px 0px gray';
		panel.style['-ms-boxShadow'] = '0px 0px 0px gray';
		panel.style['-webkit-boxShadow'] = '0px 0px 0px gray';
		panel.style['-khtml-boxShadow'] = '0px 0px 0px gray';
		window.panel_flag='no';
		}

	var up_page_border = window.pageYOffset/window.innerHeight;
	var up_page_block = document.get_elements_by_class_name('up_page')[0];
	if (up_page_border>0.3)
		{
//		up_page_block.style['display'] = 'block';
		up_page_block.style['opacity'] = '1';
		up_page_block.style['bottom'] = '10px';
		}
	else
		{
		up_page_block.style['opacity'] = '0';
		up_page_block.style['bottom'] = '-100px';
//		up_page_block.style['display'] = 'none';
		}

	}



body_mouseup = function(event)
	{
	//mouseup for article slider
	try
		{
		window.article_slider.touch_click_off(event);
		}
	catch(err)
		{}


	//mouseup for news_slider
	try
		{
		window.news_slider.touch_click_off(event);
		}
	catch(err)
		{}

	//for video slider
	try
		{
		window.video_slider.touch_click_off(event);
		}
	catch(err)
		{}

	}

body_touchend = function()
	{
	//touchend for article slider
	try
		{
		window.article_slider.touch_click_off(event);
		}
	catch(err)
		{}

	//touchend for article slider
	try
		{
		window.news_slider.touch_click_off(event);
		}
	catch(err)
		{}

	// for video slider
	try
		{
		window.video_slider.touch_click_off(event);
		}
	catch(err)
		{}

	}


//handler for hover for slider. function adds during 'switch_menu' if scroll is inserted
slider_hover = function(e,action)
	{
	if (!e) {e = window.event}

	direction = ''
	
	var target = e.target;
	var rel_target = e.relatedTarget;

	if (target==window.article_slider.container_visible||is_child(window.article_slider.container_visible,target)=='yes')
		{
		direct_to = 'block';
		}	
	else
		{
		direct_to = 'non_block';
		}

	if (rel_target==window.article_slider.container_visible||is_child(window.article_slider.container_visible,rel_target)=='yes')
		{
		direct_from = 'block';
		}	
	else
		{
		direct_from = 'non_block';
		}


	if (direct_to!='block'||direct_from!='block')
		{
		if (direct_to=='block')  //handler for mouseover
			{
			if (action=='over')
				{
//				window.article_slider.container_visible.style['boxShadow'] = '0px 0px 0px black';
				window.article_slider.scroll_left_button.style['opacity'] = '0.6';
				window.article_slider.scroll_right_button.style['opacity'] = '0.6';
				}	

			else
				{
//				window.article_slider.container_visible.style['boxShadow'] = '0px 0px 0px gray';

				window.article_slider.scroll_left_button.style['opacity'] = '0.2';
				window.article_slider.scroll_right_button.style['opacity'] = '0.2';
			
				}
			}
	
		}

	}





body_min_height = function()
	{
	var back_wrap = document.get_elements_by_class_name('background_wrap')[0];

	var screen_height = window.innerHeight||document.documentElement.clientHeight;
	if (back_wrap.offsetHeight>screen_height)
		{
		document.body.style['height'] = 'auto';
		}
	else
		{
		document.body.style['height'] = '100%';
		}
		
	}





//for smoth scroll
window.smooth_scroll = function (target,duration) 
	{
	//check if panel is "on"
	var timer, start, factor;
   	var offset = window.pageYOffset;
        var delta  = target - window.pageYOffset; // Y-offset difference
	duration = duration || 500;              // default 1 sec animation
    	start_ = Date.now();                       // get start time
	factor = 0;
    
	if(timer) 
		{
		clearInterval(timer); // stop any running animations
		}
    	function step() 
		{
		var y;
		factor = (Date.now()-start_)/duration; // get interpolation factor
		if( factor>= 1) 
			{
			clearInterval(timer); // stop animation
        		factor = 1;           // clip to max 1.0
      			}
	      	y = factor*delta+offset;
		window.scrollTo(0, y);
    		}
    
	timer = setInterval(step, 10);
	return true;

	}




//set listeners for each tag a. it is nessesary to start function every time when menu is inserted, because it is new tag a;
set_listenner_a = function(where)
	{
	//set listeners for menu items
	if (where=='menu_left'||where=='menu_up'||where=='video_menu')
		{
		if (where=='menu_left')	{var class_name = 'menu_left'}
		if (where=='menu_up')	{var class_name = 'main_content_1-uplist'}
		if (where=='video_menu'){var class_name = 'video_menu_container';}
		var div_block = document.get_elements_by_class_name(class_name)[0];
		var a_ar = div_block.get_elements_by_tag_name('a');
		for (i=0;i<a_ar.length;i=i+1)
			{
			a_ar[i].add_event_listener('mousedown',function(event){try{event.preventDefault()}catch(err){event.returnValue=false;}},false);	
			a_ar[i].add_event_listener('click',function(event){menu_click(event)},false);

			}
	}


	//set listeners for article_block (scroll),
	if (where=='article_scroll')
		{
		//hover listener for slider
		window.article_slider.container_visible.add_event_listener('mouseover',function(event){slider_hover(event,'over')},false);
		window.article_slider.container_visible.add_event_listener('mouseout',function(event){slider_hover(event,'out')},false);
		//add listeners for click event on article scroll item
		var a = window.article_slider.container.get_elements_by_tag_name('a');
		for (var i=0;i<a.length;i=i+1)
			{
			var r = a[i];

			r.add_event_listener('click',function(event){scroll_click(event);try{event.preventDefault()}catch(err){event.returnValue=false;}},false);
			}

		}

	//set listenners for news scroll
	if (where=='news_scroll')
		{
		var news_array = d.get_elements_by_class_name('article_news_block')[0].get_elements_by_class_name('news_item');
		for (var i=0;i<news_array.length;i=i+1)
			{
			var a = news_array[i].get_elements_by_tag_name('a')[0];
			var a_url = a.href;
			a.add_event_listener('click',function(event){news_click(event);try{event.preventDefault()}catch(err){event.returnValue=false;}},false);
			}

		}

	//set listenners for video items
	if (where=='video_scroll')
		{
		var video_scroll = document.get_elements_by_class_name('video_item_container')[0];
		var items = video_scroll.get_elements_by_class_name('video_item');
		for (i=0;i<items.length;i=i+1)
			{
			var span = items[i].get_elements_by_tag_name('span')[0];
			span.add_event_listener('click',function(event){video_click(event)},'false');	
			}
		}


	}




//when browser screen size is changing - nessessary to determin new sizes and style for elements
resizing = function()
	{
	

	try //when resizing - we need swithc off panel, than recalculate it is width and pos	
		{
		var panel = document.get_elements_by_class_name('article_block')[0];
		panel.style['width'] = '100%';
		panel.style['position'] = 'relative';
		panel.style['boxShadow'] = '0px 0px 0px gray';
		panel.style['-o-boxShadow'] = '0px 0px 0px gray';
		panel.style['-moz-boxShadow'] = '0px 0px 0px gray';
		panel.style['-ms-boxShadow'] = '0px 0px 0px gray';
		panel.style['-webkit-boxShadow'] = '0px 0px 0px gray';
		panel.style['-khtml-boxShadow'] = '0px 0px 0px gray';
		window.panel_flag='no';
		}
	catch(err)
		{
		
		}

	//get elements for title img
	body = document.get_elements_by_class_name('background_wrap')[0];


	title_foto_img = document.get_elements_by_class_name('title_foto_img')[0];	
	//get img
	title_img_container = document.get_elements_by_class_name('title_foto')[0];
	img = title_img_container.get_elements_by_tag_name('img')[0];

	//get menu section title
	title = title_img_container.get_elements_by_class_name('menu_section_title')[0];

	//get element for menu_left
	menu_left = document.get_elements_by_class_name('menu_left')[0];
	menu_div = document.get_elements_by_class_name('menu_div')[0];
	menu_div_ul = menu_div.get_elements_by_tag_name('ul')[0];

	//get elements for papre_block
	paper_block = document.get_elements_by_class_name('paper_block')[0];
	
	//get for video (because video block has width 125%)
	video_block = document.get_elements_by_class_name('paper_video_block')[0];


	if (body.offsetWidth<710)
		{

		//for title image
		img.style['margin'] = '0px 0px 0px 155px';
		img.style['height'] = '150px';
		img.style['width'] = 'auto';


		//for menu section title
		title.style['display'] = 'none';


		//for menu left
		menu_left.style['height'] = '150px';
		menu_left.style['width'] = '155px';



		menu_div.style['height'] = '150px';
		menu_div.style['width'] = '155px';
		menu_div.style['margin'] = '0px 0px 0px 0px';
		

		menu_div_ul.style['margin'] = '0px 0px 0px 0px';
		
		//for paper block
		paper_block.style['margin'] = '50px auto 0px auto';
		paper_block.style['width'] = '95%';
		try  //if video block is displayd
		{video_block.style['width'] = '100%';
		video_block.style['margin'] = '0% 0% 0% 0%';}
		catch (err){}

		//nessesary for fix_panel (recount panel widht and its position)
		try{window.panel_pos = panel.getBoundingClientRect().top+window.pageYOffset;
		window.panel_width = panel.offsetWidth;}
		catch(err){}
	
		
		}
	else
		{

		//for title image standard action
		img.style['height'] = 'auto';
		img.style['width'] = '80%';	
		img.style['margin'] = '0% 0% 0% 20%';
		
		//for menu-left
		menu_left.style['height'] = '100%';
		menu_left.style['width'] = '20%';
		menu_div.style['height'] = '100%';
		menu_div.style['width'] = '100%';
		menu_div_ul.style['margin'] = '60px 0px 0px 0px';
	
		paper_block.style['margin'] = '50px auto 0px auto';		
		paper_block.style['width'] = '80%';
		try //if video block is displayed
		{video_block.style['width'] = '125%';
		video_block.style['margin'] = '0% 0% 0% -12.5%';}
		catch(err){}

		//for menu section title
		title.style['display'] = 'block';

		//nessesary for fix_panel (recount panel widht and its position)
		try{window.panel_pos = panel.getBoundingClientRect().top+window.pageYOffset;
		window.panel_width = panel.offsetWidth;}
		catch(err){}
		}

	body_min_height();

	}



//spliting href
function href_split(txt)
	{
	var str_ = txt.split('#');
	var str_1 = str_[0];
	str_1 = str_1.split('?');
	var para_dict = {};
	//get para before # (hash)
	if (str_1.length>1)
		{
		para_str = str_1[1].split('&');
		for (i=0;i<para_str.length;i=i+1)
			{
			p = para_str[i].split('=');
			para_dict[p[0]] = p[1];
			}

		}
	
	//get para after # (hash)
	if (str_.length>1)
		{
		hash_ = str_[1];
		hash_str = hash_.replace('#').split(';');
		for (i=0;i<hash_str.length;i=i+1)
			{
			each = hash_str[i];
			each = each.split('=');
			para_dict[each[0]] = each[1];
			}
		
		}
	return para_dict;
	}


//ajax lib


ajax_get_obj = function()
	{
	var xml_obj
	if (window.XMLHttpRequest)
		{
		xml_obj = new XMLHttpRequest();
		}
	else
		{
		xml_obj = new ActiveXObject('Microsoft.XMLHTTP');
		}
	return xml_obj;

	}



ajax_send_req = function(req)
	{
	var xml_obj = ajax_get_obj();
	var response = '';
	xml_obj.onreadystatechange = function()
		{
		try
		{
		if (xml_obj.readyState==4)
			{
				if (xml_obj.status==200)
				{
				response = xml_obj.responseText;
				window.ajax_wait.sp();
				}
			}
		}
		catch(err)
		{
		alert(err.message);
		}
		
		}
	window.ajax_wait.st();
	xml_obj.open('GET',req,false);
	xml_obj.send();
	return response;
	
	}





//mark picked element in scroll block with additional block
set_picked_scroll_item = function()
	{
	para = href_split(window.location.hash);
	if (para['1_menu']=='articles')
		{
		var d = window.article_slider.container;
		var items = d.get_elements_by_class_name('article_item');

		try //try because scroll_item_picked may not be on the page or defined
			{
			var item = window.scroll_item_picked;
			var picked_block_old = item.get_elements_by_class_name('article_item_picked')[0];
			picked_block_old.innerHTML = '';	
			}
		catch(err)
			{
			}

		//find item	
		for (i=0;i<items.length;i=i+1)
			{
			var a = items[i].get_elements_by_tag_name('a')[0];
			if (a.href.search(para['txt'])>-1)  //find nessesary item with art in href
				{
				var picked_block = items[i].get_elements_by_class_name('article_item_picked')[0];
				picked_block.innerHTML = '<div></div><span>Picked</span>';	
				window.scroll_item_picked = items[i];
				}
			}
		//for last article
		if (para['txt'].search('last')>-1)
			{
				var picked_block = items[0].get_elements_by_class_name('article_item_picked')[0];
				picked_block.innerHTML = '<div></div><span>Picked</span>';
				window.scroll_item_picked = items[0];
			}
		}
		
		
	}



//set red color for chosen news
set_picked_news_item = function(para)
	{
	var list_news = document.get_elements_by_class_name('news_item');
	for (var i=0;i<list_news.length;i=i+1)
		{
		var a_tag = list_news[i].get_elements_by_tag_name('a')[0];
			
		var a_href = a_tag.href;
		var news_para = href_split(a_href);
			
		if (news_para['txt']==para['txt'])
			{
			window.news_a_old = a_tag;
			a_tag.style['color'] = 'red';
			}

		}
	if (para['txt'].search('last')>-1)
		{
		var a_tag = list_news[0].get_elements_by_tag_name('a')[0];
		window.news_a_old = a_tag;
		a_tag.style['color'] = 'red';
			
		}



	}


//function for click on video slider items and when page loaded (after menu switched)
video_click = function(e,first)
	{
	window.ajax_busy = 'yes'; //to prevent changing by check_hash() function
	window.ajax_wait.st();
	//load video
//	var format_list = ['mp4:x-matroska','ogg:ogg','webm:ogg'];
	var format_list = ['ogg:ogg'];
	var video_str = '<source src="v_file" type="video/v_type"></source>';
	alert(video_str);
	this.video_load = function(video_file_name)
		{
		var v_block = document.get_elements_by_tag_name('video')[0]
		var i = 0;
		var final_str = '';
		while (format_list[i])
			{
			var str_1 = format_list[i].split(':');
			new_item = video_str.replace('v_file',video_file_name+'.'+str_1[0]);
			final_str = final_str+new_item.replace('v_type',str_1[1]);
			i = i+1;
			}
		
		v_block.innerHTML = final_str;
		v_block.load();
		}
	
	
	if (!e) {e = window.event};

	//if function calling from switch menu, not by event - get first element
	if (first=='first')
		{
		//get picked element
		var video_container = document.get_elements_by_class_name('video_item_container')[0];
		var item = video_container.get_elements_by_class_name('video_item')[0];
		var current_item = item.get_elements_by_class_name('picked')[0];
		//get span element
		var span_item = item.get_elements_by_tag_name('span')[0];
		video_file_name = span_item.id;

		//get desription
		tmp_f = video_file_name.split('/');
		tmp_f = tmp_f[tmp_f.length-1]; //retrive video file name without path
		var video_block_cont = document.get_elements_by_class_name('video_block_container')[0];
		video_description = video_block_cont.get_element_by_id(tmp_f);
		//load video
		this.video_load(video_file_name);
		tmp_f = 'video_last';
		
		}

	else if (first!=undefined)
		{
		//get picked element
		var video_container = document.get_elements_by_class_name('video_item_container')[0];
		var items = video_container.get_elements_by_class_name('video_item');
		end = 'start';
		i=0;
		while (end!='stop'&&i<items.length)
			{
			var span_item = items[i].get_elements_by_tag_name('span')[0];
			var video_file_name = span_item.id;
			tmp_f = video_file_name.split('/');
			tmp_f = tmp_f[tmp_f.length-1];
			if (tmp_f==first)
				{
				end = 'stop';
				}
			else {i=i+1}
			
			}
		console.log('ffff');
		var current_item = items[i].get_elements_by_class_name('picked')[0];

		//get desription
		var video_block_cont = document.get_elements_by_class_name('video_block_container')[0];
		video_description = video_block_cont.get_element_by_id(first);
		//load video
		this.video_load(video_file_name);
		var tmp_f = first;
		}

	else  //get video name from event
		{
		//get span elements
		var span_item = e.target;
		//get video file name
		var video_file_name = span_item.id;
		var video_item = e.target.parentNode;
		var current_item = video_item.get_elements_by_class_name('picked')[0];
	
		//get description
		tmp_f = video_file_name.split('/'); 
		tmp_f = tmp_f[tmp_f.length-1]; //retrive video file name without path
		var video_block_cont = document.get_elements_by_class_name('video_block_container')[0];
		video_description = video_block_cont.get_element_by_id(tmp_f);
		//load video
		this.video_load(video_file_name);

		};

	try
		{
		//hide 'picked' block
		window.old_video_picked_item[0].style['display'] = 'none';
		//set color to base
		window.old_video_picked_item[1].className = '';
		window.old_video_picked_item[2].style['display'] = 'none';
		window.old_video_picked_item[2].style['opacity'] = '0';
		}
	catch(err){}

	//it is nessesary for the click on the same element, firstly we switch off old styles and next we 'on' new styles.If swap - next click on the same element will rid picked styles 
	//set display for current item
	current_item.style['display'] = 'block';
	//set color for span title
	span_item.className = 'picked_span';
	//add description
	video_description.style['display'] = 'block';
	video_description.offsetWidth;
	video_description.style['opacity'] = '1';

	window.old_video_picked_item = [current_item,span_item,video_description];	
	window.ajax_wait.sp();
	//change hash for back button
	var para = href_split(document.location.hash);
	var manu_1 = para['1_menu'];
	var menu_2 = para['2_menu'];
	var txt = tmp_f;
	document.location.hash = '1_menu='+menu_1+';2_menu='+menu_2+';txt='+txt;
	window.old_hash = '#'+'1_menu='+menu_1+';2_menu='+menu_2+';txt='+txt;
	

	window.ajax_busy = 'no';
	}




//function designated for clicks on scroll items
scroll_click = function(e)
	{
	if (!e){e = window.event}
	
	var url = e.currentTarget.href;
	var para = href_split(url);	

	var xml_obj = ajax_get_obj();
	var response = ajax_send_req('./index.py?page=content&1_menu='+para['1_menu']+'&2_menu='+para['2_menu']+'&txt='+para['txt']+'&ajax=da&only_article=da');
	var d = document.get_elements_by_class_name('paper_article_block')[0];
	d.innerHTML = response;

	//update hash for back button
	window.current_hash = '#'+url.split('#')[1];
	window.old_hash = window.current_hash;
	document.location.hash = window.current_hash;

	//mark selected item with additional block 'picked'
	set_picked_scroll_item();
	//provide springing to the top if to the beginnig of article	
	if (window.panel_flag=='yes')
		{
		window.smooth_scroll(window.panel_pos);
		}

	body_min_height();	
		
	}



//handler for news click

news_click = function(e)
	{
	window.ajax_busy = 'yes';

	try
		{
		var url_new = e.currentTarget.href;
		}
	catch(err)
		{
		var url_new = e.srcElement.href;
		}
	//find element with old and new href
	var news_cont = document.get_elements_by_class_name('news_item_container')[0];
	var a_ar = news_cont.get_elements_by_tag_name('a');
	//set black color
	for (i=0;i<a_ar.length;i=i+1)
		{
		var each = a_ar[i];
		if (each.href==window.news_a_old.href)
			{
			window.news_a_old.style['color'] = '#003366';	
			}
		}
	for (i=0;i<a_ar.length;i=i+1)
		{
		var each = a_ar[i];
		if (each.href==url_new)
			{
			each.style['color'] = 'red';
			window.news_a_old = each
			}
		}

	//get ajax qr
	var para = href_split(url_new);
	var url = './index.py?page=content&1_menu='+para['1_menu']+'&2_menu='+para['2_menu']+'&txt='+para['txt']+'&ajax=da&only_news=da'; 
	var response = ajax_send_req(url);
	var d = document.get_elements_by_class_name('news_frame')[0];
	d.innerHTML = response;
	
	//hash update for back button in browser
	hs = '#1_menu='+para['1_menu']+';2_menu='+para['2_menu']+';txt='+para['txt']
	document.location.hash = hs;
	window.old_hash = hs;
	window.ajax_busy = 'no';
	
	//check the size of window and document and set the body width (fotter must be at the end and in mozila min-height dose not working)
	body_min_height();
	}







/*function tailored to make list with menu items and provide switching of different items depend on clicks*/
menu_click = function(e)
	{
	if(!e) {e = window.event;}
	//obtain cgi parametrs
	try
		{
		var href = e.currentTarget.href;
		}
	catch(err)  //for ie8, does not work currentTarget, and i obtain element that was clicked and by parentElement try to get A block and then href
		{
		
		var href = e.srcElement;
		var flag = '';
		for (i=0;i<7;i=i+1)
			{
			if (href.tagName!='A')
				{
				if (flag=='')
					{
					href = href.parentElement;
					}
				}
			else
				{
				flag='yes';
				href = href.href;
				}
			}
		
		}
	para = href_split(href);
	if (para['page']=='content'&&para['txt']!='goto')  //designated for page=content (ajax working) and prevent def
		{
		try
			{
			e.preventDefault();
			}
		catch(err)
			{
			e.returnValue=false;
			}
		switch_menu(para);
		
		}
	else  //if another page - not preventing
		{
//		document.open('./index.py?page=main');
		}
	}

//function tailored to switch menu depend on diferent values of menu items clicked (from hash or from clicked url)
switch_menu = function(para)
	{
	var menu_1 = para['1_menu'];
	var menu_2 = para['2_menu'];
	var menu_full_adr = menu_1+'_'+menu_2;
	var txt = para['txt'];	
	//obtain if additional para nessessry (for scroll div block as an instanse)
	if (para['1_menu']=='articles')  //add para scroll_block to insert 
		{
		sb = '&scroll_block=da'
		//delete old scroll instanse
		window.article_slider = '';
		}
	else
		{sb=''}
	if (window.menu_1!=menu_1)
		{
		create_menu(para);
		//set red underline for uplist menu
		try
			{
			var a_tmp_new = window.menu_a_dict[menu_1];
			a_tmp_new.style['borderBottomColor'] = 'red';
			a_tmp_new.style['borderBottomStyle'] = 'solid';
			a_tmp_new.style['borderBottomWidth'] = '3px';

			var a_tmp_old = window.menu_a_dict[window.menu_1];
			a_tmp_old.style['borderBottomColor'] = '';
			a_tmp_old.style['borderBottomStyle'] = '';
			a_tmp_old.style['borderBottomWidth'] = '';
			}
		catch(err)
			{
			var a_tmp_new = window.menu_a_dict[menu_1];
			a_tmp_new.style['borderBottomColor'] = 'red';
			a_tmp_new.style['borderBottomStyle'] = 'solid';
			a_tmp_new.style['borderBottomWidth'] = '3px';
			}

		//main request
		

		req = './index.py?page=content&1_menu='+menu_1+'&2_menu='+menu_2+'&txt='+txt+'&ajax=da'+sb;
		resp = ajax_send_req(req);
		d = document.get_elements_by_class_name('paper_block')[0];
		d.innerHTML = resp;

		//set listeners on new menu items (for video menu_items in paper_block)
		if (menu_1=='video')
			{
			set_listenner_a('video_menu');
			}
		else
			{
			set_listenner_a('menu_left');
			}
	
		}
	else
		{
		//main request
		//for video section nessessary pick another block
		if (menu_1=='video')
			{
			req = './index.py?page=content&1_menu='+menu_1+'&2_menu='+menu_2+'&txt='+txt+'&ajax=da'+sb+'&only_video_content=da';
			resp = ajax_send_req(req);
			var class_name = 'video_content';
			}
		else 
			{
			console.log('conventional ajax request');
			req = './index.py?page=content&1_menu='+menu_1+'&2_menu='+menu_2+'&txt='+txt+'&ajax=da'+sb;
			resp = ajax_send_req(req);
			var class_name = 'paper_block';
			}
		d = document.get_elements_by_class_name(class_name)[0];
		d.innerHTML = resp;
		console.log(window.old_menu_full_adr);
		d_old = document.get_elements_by_class_name(window.old_menu_full_adr)[0];
		d_old.className = window.old_menu_full_adr;
		}

	//for back button (chack_hash function)
	location.hash = '1_menu='+menu_1+';2_menu='+menu_2+';txt='+txt;
	window.old_hash = '#'+'1_menu='+menu_1+';2_menu='+menu_2+';txt='+txt;

	window.menu_1 = menu_1;
	//d_new using for marking clicked 2_menu section
	var d_new = document.get_elements_by_class_name(menu_full_adr)[0];
	if (menu_1=='video')
		{
		var clicked_class = ' video_menu_a_clicked';
		}
	else
		{
		var clicked_class = ' menu_div_second_shadow_li_clicked';
		}	
	d_new.className += clicked_class;
	window.old_menu_full_adr = menu_full_adr;


	//##################----ARTICLE-----#############################
	//create instanse for article scroll and set listenners
	if (para['1_menu']=='articles')
		{
		window.article_slider = new Slider('article','X','px','off',5);
		//set picked scroll item (additional block if has been chosen any element)
		set_listenner_a('article_scroll');
		set_picked_scroll_item();
		}

	//################-------NEWS----############################33
	//create instance for news scroll and set listenners
	if (para['1_menu']=='about'&&para['2_menu']=='news')
		{
		//create slider
		window.news_slider = new Slider('news','Y','px','off',6);
		//set listenners for news scroll
		set_listenner_a('news_scroll');
		//set picked news item
		set_picked_news_item(para);	
		}


	//################-------VIDEO----############################33
	//create instance for news scroll and set listenners
	if (para['1_menu']=='video')
		{
		window.video_slider = new Slider('video','Y','px','off',6);
		set_listenner_a('video_scroll');	
		
		//pass to video_click what video to load
		if (para['txt']=='video_last')
			{
			video_click('none','first');
			}
		else
			{
			video_click('none',para['txt'])
			}
		}




	//resizing, because when new menu creating - old css styles are binding
	resizing();
	}



//check_hash - function to provide back button activity, it is checking every 100 ms if hash has been changed and send request

function check_hash()
	{
	window.current_hash = document.location.hash;
	if(window.old_hash==undefined)
		{
		window.old_hash = window.current_hash;
		}
	if (window.old_hash!=window.current_hash&&window.ajax_busy!='yes')
		{
		window.old_hash = window.current_hash;
		str_1 = window.current_hash;
		var para = href_split(str_1);
		switch_menu(para);
		//set page to top after page reload
		window.scrollTo(0,0);
		}
	
	}



//insert menu block  (it is responsible only for menu_left block and innerHTML of it)
function create_menu(para)
	{
	dict_menu = {};
	dict_menu['about'] = 
	[
	'about_author:About author:about_author',
	'about_project:About project:about_project',
	'products:About products:products',
	'principles:Principles:principles',
	'for_investors:For investors:for_investors',
	'news:News:news_last'
	];
	dict_menu['articles'] = 
	[
	'it_area:IT area:it_area_last',
	'banking:Banking:banking_last',
	'machine_learning:Machine Learning:machine_learning_last'
	];
	dict_menu['watchboard'] = 
	[
	'about:About:about_watchboard',
	'how_to_buy:How to buy:how_to_buy',
	'goto:GoTo Watchboard:goto'
	];
	dict_menu['video'] = [];

	menu_str_b = menu_str_begin.toString().split('``')[1];
	menu_str_e = menu_str_end.toString().split('``')[1];
	menu_elem = menu_str_li.toString().split('``')[1];

	//get main section
	menu_item = para['1_menu'];


	list_li = dict_menu[menu_item];
	li_final = '';
	for(i=0;i<list_li.length;i=i+1)  //for video we skip this block
		{
		var item = list_li[i];
		var name1 = item.split(':')[0];
		var name2 = item.split(':')[1];
		var txt = item.split(':')[2];
	
		//for watchboard create a specific href beacuse it is link to another page
		if (menu_item=='watchboard'&&name1=='goto')
			{
			var old_href_watchboard = "<a href='./index.py?page=content#1_menu=`menu_1`;2_menu=`menu_2`;txt=`txt`'>	"
			var new_href_watchboard = "<a href='./index.py?page=watchboard'>	" 
			menu_elem = menu_elem.replace(old_href_watchboard,new_href_watchboard);
			}

		//replace for class name
		new_item = menu_elem.replace('li_name',menu_item+'_'+name1);
		new_item = new_item.replace('li_name',name2);
		//href compile
		new_item = new_item.replace('`menu_1`',menu_item);
		new_item = new_item.replace('`menu_2`',name1);
		new_item = new_item.replace('`txt`',txt);

		li_final = li_final+new_item;
		}

	//replace title of section
	menu_str_b = menu_str_b.replace('`section_title`',menu_item);
	menu_div = document.get_elements_by_class_name('menu_left')[0];
	menu_div.innerHTML = menu_str_b+li_final+menu_str_e;
	
	}


//li_name - para for replace
function menu_str_li()
	{
	/*``

<li class='li_name'>
	<a href='./index.py?page=content#1_menu=`menu_1`;2_menu=`menu_2`;txt=`txt`'>		
	<table class='center'>				
	<td class='center'>				
		<span>li_name</span>
	</td>					
	</table>
	</a>				
</li>					

	``*/	
	}



function menu_str_begin()
	{
	/*``

		<div id='menu_section_title' class='menu_section_title'>
			<table class='center'>
			<td class=center>
				<span class='menu_section_title_span'>`section_title`</span>
			</table>
			</td>
		</div>


		<div class='menu_div'>

	
			<ul>
			
	``*/
	}


function menu_str_end()
	{
	/*``		
			</ul>


		</div>




	``*/
	}



