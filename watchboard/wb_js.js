function start_function()
	{
	

//////////////////////////////////////	
//////MENU CLASS INITIALIZE///////////		
//////////////////////////////////////


	//determine start para as default or from current hash	
	window.cur_hash = document.location.hash;
	if (window.cur_hash=='')
		{
		first_menu = '1_menu=balance';
		second_menu = '2_menu=balance';
		third_menu = '3_menu=all';
		var hs = first_menu+'&'+second_menu+'&'+third_menu //all other para will be added during draw_page script
		document.location.hash ='#'+hs;
		
		}

	//initialize global hash dictionary (it is always concatenates and once updates, for back button. because each updates - this is each back event must be)
	window.hs = parse_hash(document.location.hash);	


	//initialize flag to block back button in a case when chenging cash occuring
	window.stop_back_button = 'yes';

	window.cur_hash = document.location.hash;

	//initialize preloader
	window.preloader = new ajax_preloder();

	window.menu = new menu_class;
	window.menu.create_main_menu();
	//for back button
	window.back_button_timer = setInterval(window.menu.back_button,600);

	//ADD LISTENER FOR BOY ONCLICKING (close calndar etc)
	document.add_event_listener('click',function(event){body_click(event)},false);
	}


function body_click(e)
	{
	try  //try because new pages may not have this instances, all click event on body must be collected here and all adding events must with stopPropagation()
		{	
		window.c.close_event();
		}
	catch(err){};
	}


function parse_hash(hs_txt)
	{
	var para = {};
	var tmp = hs_txt.replace('#','');
	tmp = tmp.split('&');
	for (var i=0;i<tmp.length;i=i+1)
		{
		var t = tmp[i].split('=');
		para[t[0]] = t[1];	
		}
	return para;
	}


function concatenate_hash(para)
	{	
	var k = Object.keys(para);
	var final_str = '';
	for (var i=0;i<k.length;i=i+1)
		{
		var t = '&'+k[i]+'='+para[k[i]];
		final_str = final_str+t;
		}
	final_str = final_str.substr(1,final_str.length-1);
	return final_str;

	}



menu_class = function()
	{
	//initialize variables
	this.main_menu_str = main_menu_function_str.toString().split('*`')[1];
	this.second_menu_str = second_menu_function_str.toString().split('*`')[1];
	this.third_menu_str = third_menu_function_str.toString().split('*`')[1];

	//get containers
	this.mm_container = document.get_element_by_id('main_menu_container');
	this.sm_container = document.get_element_by_id('second_menu_container');
	this.tm_container = document.get_element_by_id('third_menu_container');


	
	//menu dictionary
	this.menu_dict = {};
	this.menu_dict['balance:Balance'] = [
	'balance:Balance',
	'pl:Profit&Losses',
	'charts:Charts'];
	this.menu_dict['deposits:Deposits'] = [
	'statistic:Statistic',
	'liquidity:Liquidity'];
	this.menu_dict['credit_loans:Credit Loans'] = [];
	this.menu_dict['cash_flow:Cash Flow'] = [];


	//third menu dictinary
	this.menu_dict_third = {};
	this.menu_dict_third['balance:balance'] = ['all:All','nerez:NonResidents'];



	
	this.current_main_menu_block = '';
	this.current_second_menu_block = '';

	var obj = this;

	//creates MAIN menu items when star load (only once during page load)
	this.create_main_menu = function()
		{
		window.hs = parse_hash(document.location.hash);
		//set flag for back button
		window.stop_back_button = 'yes';
		//1 - concatenate block manu items
		var final_menu = '';
		for (each in this.menu_dict)
			{
			var new_item = this.main_menu_str;
			var span_name = each.split(':')[1]
			var menu_id = each.split(':')[0];
	
			//replacement
			new_item = new_item.replace('`menu_id`',menu_id);		
			new_item = new_item.replace('`span_name`',span_name);		

			final_menu = final_menu+new_item

			}
	
		//2 - insert blocks in html
		var tmp = this.mm_container.innerHTML;
		tmp = tmp.replace('<!--((FOR MENU BLOCK))-->',final_menu);
		this.mm_container.innerHTML = tmp;
		
		
		//set conventional color
		try
			{
			this.current_main_menu_block.className = 'menu_items';
			}
		catch(err){}


		//this is temporary (then here must be obtainig real parametrs from hash)
		this.current_main_menu_block = document.get_element_by_id(window.hs['1_menu']);
		//set clicked color
		this.current_main_menu_block.className+=' main_clicked';
		//3 - set listenners for main menu elements
		this.set_listenner(obj,'main_menu');

		//4 - create appropriate second menu item block
		//start second menu block;
		this.create_second_menu();

		}


	//create SECOND menu items when click on main menu items (for every click on main menu)
	this.create_second_menu = function()
		{
		var final_menu = '';
		//obtaine array from menu dict all of menu items
		var span_main_menu = this.get_span(this.current_main_menu_block);
		var main_id = this.current_main_menu_block.id; //if of main block
		var mas = this.menu_dict[main_id+':'+span_main_menu];
		//1 - concatenate items in one string
		for (var i=0;i<mas.length;i=i+1)
			{
			try
				{
				var new_sm_item = this.second_menu_str;
				var id_name = main_id+':'+mas[i].split(':')[0];
				var span_name = mas[i].split(':')[1];
				//replacement
				new_sm_item = new_sm_item.replace('`id_name`',id_name);
				new_sm_item = new_sm_item.replace('`span_name`',span_name);
				final_menu = final_menu+new_sm_item;
				}
			catch(err){}
			}

		//2 - insert items in final block
		final_menu = "<div class='left_line'></div>"+final_menu;
		this.sm_container.innerHTML = final_menu;
		

		//3 - set listenner
		try {this.set_listenner(obj,'second_menu');}
		catch(err){}
		

		//set conventional color
		try
			{
			this.current_second_menu_block.className = 'menu_items';
			}
		catch(err){}

		//4 - set color for clicked chosed item
		try
			{
			//check if 2_menu is in hash for appropriate 1_menu (for back button)
			var sec_menu_in_hash = 'no';
			for (var i=0;i<mas.length;i=i+1)
				{
				if (window.hs['2_menu']==mas[i].split(':')[0])
					{
					sec_menu_in_hash = 'yes';
					}
				}

			if (sec_menu_in_hash!='yes')
				{
				window.hs['2_menu'] = mas[0].split(':')[0];
				}
			
			this.current_second_menu_block = document.get_element_by_id(window.hs['1_menu']+':'+window.hs['2_menu']);
			this.current_second_menu_block.className+=' second_clicked';
			this.create_third_menu();
			}
		catch(err) //if there is no 2_menu
			{
			//there is not menu for this main menu
			window.hs['2_menu'] = 'no';
			window.hs['3_menu'] = 'no';
			this.tm_container.style['display'] = 'none';
			//drawing content page and next update hash and stop_back_button
			draw_page();
			}

		}


	//create third menu 
	this.create_third_menu = function()
		{
		var sc_menu_id = this.current_second_menu_block.id;
		var menu_mas = this.menu_dict_third[sc_menu_id];
		//if it is no any third menu array
		if (menu_mas==undefined)
			{
			this.tm_container.style['display'] = 'none';
			window.hs['3_menu'] = 'no';
		
			//drawing content page and next update hash and stop_back_button
		
			draw_page();
			return;
			}
		final_menu = '';
		for (var i=0;i<menu_mas.length;i=i+1)
			{
			var new_item = this.third_menu_str;
			var tmp = menu_mas[i].split(':');
			new_item = new_item.replace('`menu_id`',sc_menu_id+':'+tmp[0]);
			new_item = new_item.replace('`menu_class`','menu_item');
			new_item = new_item.replace('`menu_name`',tmp[1]);
			final_menu = final_menu+new_item;
			
			}
		this.tm_container.innerHTML = final_menu;
		this.tm_container.style['display'] = 'block';

	
		this.current_third_menu_block = document.get_element_by_id(sc_menu_id+':'+menu_mas[0].split(':')[0]);
		//update hash
		window.hs['3_menu'] = this.current_third_menu_block.id.split(':')[2];
		//set color
		this.current_third_menu_block.className+= ' menu_clicked';		

		//3 - set listenner
		this.set_listenner(obj,'third_menu');

		//drawing content page and next update hash and stop_back_button
		draw_page();

		}

	this.set_listenner = function(obj,where)
		{
		
		//set listenners for main menu items

		if(where=='main_menu')
			{
			var mas = this.mm_container.get_elements_by_class_name('menu_items');
			for (var i=0;i<mas.length;i=i+1)
				{
				mas[i].add_event_listener('click',function(event){obj.click_mm(event)},false);
			
				}
			}

		//set listenners for second menu
		if (where=='second_menu')
				{	
				var second_mas = this.sm_container.get_elements_by_class_name('menu_items');
				for (var i=0;i<second_mas.length;i=i+1)
					{
			
					second_mas[i].add_event_listener('click',function(event){obj.click_sm(event)},false)	
					}
				}

		//set listenners for third menu
		if (where=='third_menu')
				{	
				var third_mas = this.tm_container.get_elements_by_class_name('menu_item');
				for (var i=0;i<third_mas.length;i=i+1)
					{
			
					third_mas[i].add_event_listener('click',function(event){obj.click_tm(event)},false)	
					}
				}

		
		
		}	

	//for click on MAIN MENU
	this.click_mm = function(e)
		{
		//set stop flag for back button
		window.stop_back_button = 'yes';


		if (!e){e = window.event}
		var parent_menu = e.target;
		var i = 0;
		while (parent_menu.tagName!='DIV'&&i<5)
			{
			parent_menu = parent_menu.parentNode;
			i=i+1;  //to prevent interminable cycle, limit 100 checking
			}
		try
			{
			this.current_main_menu_block.className = 'menu_items';
			}	
		catch(err){}
		parent_menu.className+=' main_clicked';

		this.current_main_menu_block = parent_menu;
		//update hash
		window.hs['1_menu'] = this.current_main_menu_block.id;
		//inseert second_menu
		this.create_second_menu();
		}


	//for click on SECOND MENU
	this.click_sm = function(e)
		{
		if(!e){e = window.event}		

		//set stop flag for back button
		window.stop_back_button = 'yes';

		var parent_menu = e.target;
		var i = 0;
		
		//find parent element for changing button style
		while (parent_menu.tagName!='DIV'&&i<5)
			{
			parent_menu = parent_menu.parentNode;
			i=i+1;  //to prevent interminable cycle, limit 100 checking
			}

		try
			{
			this.current_second_menu_block.className = 'menu_items';
			}	
		catch(err){}
		parent_menu.className+=' second_clicked';

		

		//update hash
		this.current_second_menu_block = parent_menu;
		window.hs['2_menu'] = parent_menu.id.split(':')[1];
		

		//check if third mennu is for appropriate second menu
		if (this.menu_dict_third[parent_menu.id]!=undefined)
			{
			this.tm_container.style['display'] = 'block';
			}
		else
			{
			this.tm_container.style['display'] = 'none';
			}
		this.create_third_menu();

		}


	//handler for click on third menu
	this.click_tm = function(e)
		{
		//set stop flag for back button
		window.stop_back_button = 'yes';
		
		if (!e){e = window.event}

		var parent_menu = e.target;
		var i = 0;
		while (parent_menu.tagName!='DIV'&&i<5)
			{
			parent_menu = parent_menu.parentNode;
			i=i+1;  //to prevent interminable cycle, limit 100 checking
			}
		try
			{
			this.current_third_menu_block.className = 'menu_item';
			}	
		catch(err){}
		parent_menu.className+=' menu_clicked';
		this.current_third_menu_block = parent_menu;
		window.hs['3_menu'] = parent_menu.id.split(':')[2];
		
		//end of menu script, next drawing page and update hash
		window.stop_back_button = 'no';

		//start draw_page(). Also it starts from catch in create_... and click_mm,sm
		draw_page();
		
		}
	

	//this is nessesary to obtain full id for map throught the menu_dict (id of main menu+: span name)
	this.get_span = function(item)
		{
		var span_block = item.get_elements_by_tag_name('span')[0];
		var span_name = span_block.innerHTML;
		return span_name;
		
		}

	this.back_button = function()
		{
		var new_hash = document.location.hash;
		if (new_hash!=window.cur_hash)		
			{
			if (window.stop_back_button!='yes')
				{
				window.cur_hash = new_hash;
				console.log('reload');
				document.location.reload();
				}
			else
				{
				window.cur_hash = new_hash;
				}
			}
	
		}


	}

//function for loading new page content depend on menu click events
function draw_page()
	{
	window.preloader.st();
	console.log('draw_page()');
	var page_div = document.get_elements_by_class_name('page_container')[0];
	page_div.innerHTML = '';
	window.page_html = '';
	

	//start ajax qr and obtain new html document
	var str_hs = concatenate_hash(window.hs);
	var url = '/?page=watchboard&ajax=da&target=html&'+str_hs;
	window.page_html = ajax_send(url);
	page_div.innerHTML = window.page_html;
	
	var script_is = window.page_html.search('<script');
	
	//include script
	if (script_is>-1)
		{
		var folder_for_script = window.hs['1_menu']+'_'+window.hs['2_menu']+'_'+window.hs['3_menu'];
		var script = document.createElement('script');
		script.setAttribute('src','./watchboard/'+folder_for_script+'/'+window.hs['2_menu']+'.js');
		script.setAttribute('type','text/javascript');
		script.onload = function(){draw_after_ajax('yes')};
		document.body.appendChild(script);
		}
	else
		{
		draw_after_ajax();
		}
	}

	//function below nessesary because must be executed after block is added, script loaded and finiched with work, and then chenge document.hash 
function draw_after_ajax(script)
	{
	if (script) //if script variable 'yes' when script is
		{
		start_internal_page();
		}

	window.preloader.sp();
	//update finally hash and stop_back_button flag set 'no'
	document.location.hash = '#'+concatenate_hash(window.hs);
	window.cur_hash = document.location.hash;
	window.stop_back_button='no';
	}



function ajax_get_obj()
	{
	
	if (window.XMLHttpRequest)
		{
		var a_obj = new XMLHttpRequest();
		}
	else
		{
		a_obj = new ActiveXObject("Microsoft.XMLHTTP");
		}	

	return a_obj;

	}



function ajax_send(req)
	{
	var xml_obj = ajax_get_obj();
	response = '';
	xml_obj.onreadystatechange = function()
		{
		if (xml_obj.readyState==4)
			{
			if (xml_obj.status==200)
				{
				response = xml_obj.responseText;		
				}
			}		
		}
	
	xml_obj.open('GET',req,false);
	xml_obj.send();
	return response;
	}


function second_menu_function_str()
	{
	/*`

		<div id='`id_name`' class='menu_items'>
			<span>`span_name`</span>
		</div>	

	*`*/
	}	


function main_menu_function_str()
	{
	/*`
		<div id='`menu_id`' class='menu_items'>
			<table class='table_center'>
			<td class='table_center'>

				<span>`span_name`</span>

			</td>
			</table>
		</div>
	*`*/
	}

function third_menu_function_str()
	{
	/*`
	
		<div id=`menu_id` class='`menu_class`'>
			<table class='table_center'>
				<td class='table_center'>
				`menu_name`	
				</td>
			</table>
		
		</div>	


	*`*/
	}






