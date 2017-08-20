function start_function()
	{
	

//////////////////////////////////////	
//////MENU CLASS INITIALIZE///////////		
//////////////////////////////////////

	window.menu = new menu_class;
	window.menu.create_main_menu();


	
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
	'deposits:Statistic',
	'deposits:Liquidity'];
	this.menu_dict['credit_loans:Credit Loans'] = [];
	this.menu_dict['cash_flow:Cash Flow'] = [];


	//third menu dictinary
	this.menu_dict_third = {};
	this.menu_dict_third['balance:Balance'] = ['all:All','nerez:Neresidental'];



	
	this.current_main_menu_block = '';
	this.current_second_menu_block = '';

	var obj = this;

	//creates MAIN menu items when star load (only once during page load)
	this.create_main_menu = function()
		{
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
		
		//this is temporary (then here must be obtainig real parametrs from hash)
		this.current_main_menu_block = document.get_element_by_id('balance');
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
		var mas = this.menu_dict[this.current_main_menu_block.id+':'+span_main_menu];
				
		//1 - concatenate items in one string
		for (var i=0;i<mas.length;i=i+1)
			{
			var new_sm_item = this.second_menu_str;
			var id_name = mas[i];
			var span_name = id_name.split(':')[1];
			//replacement
			new_sm_item = new_sm_item.replace('`id_name`',id_name);
			new_sm_item = new_sm_item.replace('`span_name`',span_name);
			final_menu = final_menu+new_sm_item;
			}

		//2 - insert items in final block
		final_menu = "<div class='left_line'></div>"+final_menu;
		this.sm_container.innerHTML = final_menu;
		

		//3 - set listenner
		this.set_listenner(obj,'second_menu');
	

		}


	//create third menu 
	this.create_third_menu = function()
		{
		var sc_menu_id = this.current_second_menu_block.id;
		var menu_mas = this.menu_dict_third[sc_menu_id];
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

		this.current_third_menu_block = document.get_element_by_id(sc_menu_id+':'+menu_mas[0].split(':')[0]);

		//3 - set listenner
		this.set_listenner(obj,'third_menu');


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
		//inseert second_menu
		this.create_second_menu();
		}


	//for click on SECOND MENU
	this.click_sm = function(e)
		{
		if(!e){e = window.event}		

		var parent_menu = e.target;
		var i = 0;
		
		//find parent element for changing button style
		while (parent_menu.tagName!='DIV'&&i<5)
			{
			parent_menu = parent_menu.parentNode;
			i=i+1;  //to prevent interminable cycle, limit 100 checking
			}

		parent_menu.className+=' second_clicked';
		try
			{
			this.current_second_menu_block.className = 'menu_items';		
			}	
		catch(err){}


		//check if third mennu is for appropriate second menu
		this.current_second_menu_block = parent_menu;
		
		if (this.menu_dict_third[parent_menu.id]!=undefined)
			{
			this.tm_container.style['display'] = 'block';
			this.create_third_menu();
			}
		else
			{
			this.tm_container.style['display'] = 'none';
			this.draw_page();
			}

		}


	//handler for click on third menu
	this.click_tm = function(e)
		{
		if (!e){e = window.event}
		alert(e.target);

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

		this.draw_page();
		}
	

	//this is nessesary to obtain full id for map throught the menu_dict (id of main menu+: span name)
	this.get_span = function(item)
		{
		var span_block = item.get_elements_by_tag_name('span')[0];
		var span_name = span_block.innerHTML;
		return span_name;
		
		}

	this.draw_page = function()
		{
		//!!!change WINDOW
		//bal_type=1 (or=2 means #1 or #1)
		//dates=___;___; (how many data to deliver)
		//for=table (or chart) means data for table or chart
		//ajax=da (means ajax query)
		window.res = ajax_send('./index.py?page=watchboard&ajax=da&dates=20150225;20141114;20150123;20150124;20150127;20150129;20150130&report=balance&for=table&bal_type=1');
		window.json_table = JSON.parse(window.res);	
		window.table= new table_obj("free_columns=5,6","drill_down=1,2,3","dif=5:4-3");
		window.table.draw_table();
		window.table.dif_refresh();
	
	
		}



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


//table_container - div. that is receive table html
//looping through the rows. Keys in json is string number (acc to shema "1":"row", "2":"row")
//free_col - list with free columns (free_columns=1,2). Before 1, and Before 2 columns must be free columns. Class of free columns "free"
//drill_d - drill_down=1,2,3  (means that listenners will be designated for those rows, elements with className 'row_1', 'row_2')
//dif - dif column, in what place nessesary placed dif column; example dif=5:2-3;6:3-4;
//	5 - befor column
//	2-3 means 3 column - 2 column
//	";" means two columns	
//To display DIF nessesary refresh execute
//css styles (grid):
//	each "tr" have class row_1 (2,3,4) depend on level from json
//	each "td" have next class left column "title_name", next columns "figures"
//	each "td" depend on column has additional class "add_cl_0" depend on column number
//	if passed "free_column=...", befor this columns there will be free columns with class="separation_td"

function table_obj(free_col,drill_d,dif_str)
	{

	this.container = document.get_elements_by_class_name('table_container')[0];
	this.free_columns = free_col.replace('free_columns=','').split(',');
	this.drill_down = drill_d.replace('drill_down=','').split(',');

	var obj = this;
	// IT MUST be checked for every table
	this.first_dict = 'all';  //all or nerez can be applied
	this.second_dict = 'all;nominal:no';  //currencies (640;nominal:yes ...)
	//IT must be checked for every table


	//handle for dif
	this.dif_array = []; //array with column number,before this column dif will be placed
	this.dif_min = []; //dif - left column, max_column - min_column
	this.dif_max = []; //dif right column

	dif_str = dif_str.replace('dif=','');
	dif_str = dif_str.split(';');
	for (var i=0;i<dif_str.length;i=i+1)
		{
		var tmp = dif_str[i].split(':');
		this.dif_array[i] = tmp[0];
		console.log(dif_str[0]);
		var dd = tmp[1].split('-');
		this.dif_min[i] = Math.min(parseInt(dd[0]),parseInt(dd[1]));
		this.dif_max[i] = Math.max(parseInt(dd[0]),parseInt(dd[1]));
		}




	//draw table
	this.draw_table = function()
		{
		final_html = '';
		row_smp = '<tr class="`class_name`"><td class="shadow_td"><div class="shadow_div"></div></td>`content`</tr>'
		cell_smp = '<td class="`class_name`">`content`</td>'
		//draw json table container
		var columns = Object.keys(window.json_table)
		var rows = Object.keys(window.json_table[columns[0]]).length;
			

		//function for replasing
		function create_cell(class_name,value)
			{
			if (!class_name){class_name = 'none'};
			var new_cell = cell_smp.replace('`content`',value);
			new_cell = new_cell.replace('`class_name`',class_name);
			return new_cell;
			}
		function create_row(class_name,value)
			{
			if (!class_name){class_name = 'none'};
			var new_row = row_smp.replace('`content`',value);
			new_row = new_row.replace('`class_name`',class_name);
			return new_row;
			}

		final_html = '';
		//loop through the rows
		for (var i=0;i<rows;i=i+1)
			{
			final_row = '';  //open empty row
			//loop through the columns	
			for (var k=0;k<(columns.length+1);k=k+1)
				{
				if (k==0) //create title cell
					{
					var dict_column = window.json_table[columns[k]];
					var dict_row = dict_column[i.toString()];
					var new_cell = create_cell('title_name',dict_row['row_name']);
					}
				else //for other cells
					{
					var dict_column = window.json_table[columns[k-1]];
					var dict_row = dict_column[i.toString()];
					var v = dict_row[this.first_dict][this.second_dict];
					v = decline(v);
			
					if (dict_row[this.first_dict][this.second_dict]==undefined)
						{
						v = 0;
						}
	
	
					var add_cl = 'add_cl_'+k.toString();
					var new_cell = create_cell('figures '+add_cl,v);
					
					//add free columns acc to list//////////
					if (this.free_columns.indexOf(k.toString())!=-1)
						{
						new_cell = "<td class='separation_td'></td>"+new_cell
						};

					//add dif column////////////////////////
					for (var j=0;j<this.dif_array.length;j=j+1)
						{
						if (this.dif_array[j]==k)
							{
							new_cell = "<td class='dif_"+this.dif_array[j].toString()+"'></td>"+new_cell;
							}
						
						}
					}

				//concatenate cells
				final_row = final_row+new_cell;
				}
			final_row = create_row('row_'+dict_row['level'],final_row);
			final_html = final_html+final_row;
			}	
		

		//insert empty div with position absolute to shame box-shadow
		final_html = "<table>"+final_html+"</table>";
		this.container.innerHTML = final_html;

		//initialize rows arrays
		this.set_listenner();

		}

	this.set_listenner = function()
		{
	
		//function to set listenners for each row type
		function set_event(array)
			{
			for (var i=0;i<array.length;i=i+1)
				{
				var row = array[i];
				row.add_event_listener('click',function(event){obj.click_row(event)},false);
				
				
				}
			}
		//set listenners for all arrays (firstly get them acc to param when table_obj initialized)
		for (i=0;i<this.drill_down.length;i=i+1)
			{
			var row_elems = this.container.getElementsByClassName('row_'+this.drill_down[i]);
			set_event(row_elems);
			}
		}


	this.click_row = function(e)
		{

		function open_()
			{
			n_int = parseInt(n_class.replace('row_','')); //for < condition
			end_int = parseInt(end_class.replace('row_',''));
			while (n_int>end_int&&n_class!='none')
				{
				if (n_class==control_class)
					{
					next_elem.style['display'] = 'table-row';
					}
				next_elem = next_elem.nextSibling;
				if (next_elem==null)  //check if the end of table
					{
					n_class = 'none';
					n_int = 0;
					}
				else
					{
					n_class = next_elem.className;
					n_int = parseInt(n_class.replace('row_',''));
					}
				}
			var dd = window.getComputedStyle(next_elem.get_elements_by_tag_name('div')[0]);i
			//next - if n_class is undefined (end of table) - no any box-shadowing
			if (n_class=='none')
				{
				return;
				}
			dif = n_int - end_int;
			if (dif==0)
				{
				if (dd['box-shadow']!='none') //if element has two shadows
					{
					next_elem.get_elements_by_tag_name('div')[0].style['box-shadow'] = '0px -5px 5px -5px black, '+dd['box-shadow'];
					}
				else
					{
					next_elem.get_elements_by_tag_name('div')[0].style['box-shadow'] = '0px -5px 5px -5px black';
						
					}
				}
			}


		function close_()
			{
			n_int = parseInt(n_class.replace('row_','')); //for < condition
			end_int = parseInt(end_class.replace('row_',''));
			while (n_int>end_int)
				{
				next_elem.style['display'] = 'none';
				next_elem.get_elements_by_tag_name('div')[0].style['box-shadow'] = 'none';
				next_elem = next_elem.nextSibling;
				if (next_elem==null)
					{
					n_class='none';
					n_int = 0;
					}
				else
					{
					n_class = next_elem.className;			
					n_int = parseInt(n_class.replace('row_',''));
					}
				}

			if (n_class=='none')
				{
				return;
				}
			dif = end_int - n_int;
			if (dif==0)
				{
				var dd = window.getComputedStyle(next_elem.get_elements_by_tag_name('div')[0]);
				if (dd['box-shadow'].split(',').length>4)  //if element has two shadows
					{
					next_elem.get_elements_by_tag_name('div')[0].style['box-shadow'] ='0px 6px 5px -5px black';
					}
				else
					{
					next_elem.get_elements_by_tag_name('div')[0].style['box-shadow'] = 'none';				
					}
				}
			}


		//get current row clicked element and next element
		if (!e){e = window.event}
			
		var cur_elem = e.target;
		var i = 0
		while (cur_elem.tagName!='TR'&&i<5)
			{
			cur_elem = cur_elem.parentNode;
			i=i+1;
			if (cur_elem.tagName=='TR'){i=10}
			}

		//check if open or close based on display
		var next_elem = cur_elem.nextSibling;
		//if the end of table, terminate execution function
		if (next_elem==null)
			{
			return;
			}
		var control_class = next_elem.className; //to check if display or not
		var end_class = cur_elem.className; //to stop cycle while
		var n_class = next_elem.className;
		display_prop = window.getComputedStyle(next_elem)['display'];
		cur_elem_style = window.getComputedStyle(cur_elem.get_elements_by_tag_name('div')[0]);


		if (display_prop=='none')  //open
			{
			//if previous element is open (provide top and bottom shad)
			if (cur_elem_style['box-shadow']!='none')
				{
				cur_elem.get_elements_by_tag_name('div')[0].style['box-shadow'] = cur_elem_style['box-shadow']+', 0px 6px 5px -5px black';
				}
			else
				{
				cur_elem.get_elements_by_tag_name('div')[0].style['box-shadow'] = '0px 6px 5px -5px black'
				}
			open_();
			//set shadow for the first element
			}

		else    //close
			{
			//check if two shadows for top and bottom
			if (cur_elem_style['box-shadow'].split(',').length>4)
				{	
				cur_elem.get_elements_by_tag_name('div')[0].style['box-shadow'] ='0px -5px 5px -5px black';
				}
			else
				{
				cur_elem.get_elements_by_tag_name('div')[0].style['box-shadow'] = 'none';
				}

			close_();
			}
		
		}


	//insert difference (using for refreshing)
	this.dif_refresh = function()
		{
		var len = this.dif_array.length;
		for (var i=0;i<len;i=i+1)
			{
			var number = this.dif_array[i];
			var base = this.dif_max[i];
			var minus = this.dif_min[i];

			var mas = this.container.getElementsByClassName('dif_'+number.toString());
			var base_mas = this.container.getElementsByClassName('add_cl_'+base.toString());
			var minus_mas = this.container.getElementsByClassName('add_cl_'+minus.toString());
			for (var j=0;j<mas.length;j=j+1)
				{
	
				var res = parseFloat(base_mas[j].innerHTML) - parseFloat(minus_mas[j].innerHTML);
				mas[j].innerHTML = res.toString();
				}
				
			
			}
	
		}
		
	}



function decline(figure)
	{
	w = parseFloat(figure);
	w = w/100000;
	w = w.toFixed(2);  //round

	
	str_1 = w.split('.');
	//separate bu null
	final_str = '';

	interval = 0;
	
	fig = str_1[0];
	var i = fig.length-1;
	while (i>-1)
		{
		interval = interval+1;
		if (interval!=4)
			{
			final_str = fig[i]+final_str;
			}
		else
			{
			final_str = fig[i]+' '+final_str;
			interval = 0;
			}
		i=i-1;
		}
	f = final_str+'.'+str_1[1];

	return f;
	
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





