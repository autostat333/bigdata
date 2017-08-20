function start_internal_page()
	{
	
	console.log('start_internal');
	var d = document.get_elements_by_class_name('table_container')[0];
	

	//initialize dictionary for order of columns
	if (window.hs['dates']!=undefined)
		{
		var d = window.hs['dates'].split(';');
		window.dict_order = {};
		for (var i=0;i<d.length;i=i+1)
			{
			window.dict_order[i+1] = d[i]; //because numeration in dict_order begins with 1 (first column)
			}
		}
	else
		{
		window.hs['dates'] = '';
		window.dict_order = {};
		}




	//AJAX parametrs
	//char_type=1 (or=2 means chart based on #1 or #1)
	//dates=1_201401124;2_20150301; (how many data to deliver, and 1_ or 2_ means #1 or #2)
	//for=table (or chart) means data for table or chart
	//ajax=da (means ajax query)
	//do not forget target=core (python understand this as hit to core server)
	//do not forget report=balance (c++ understand it as balance.h)
	//if "dates=", means obtaining last dates
	//order of dates determining ordr of columns
	window.res = ajax_send('./index.py?page=watchboard&ajax=da&report=balance&for=table&target=core&dates='+window.hs['dates']);
	window.json_table = JSON.parse(window.res); //get data
	window.table= new table_obj("free_columns=5","drill_down=1,2,3","dif=4:4-3;7:6-7"); //table
	window.table.draw_table(); //draw table (insert into HTML )
	window.table.dif_refresh(); //set dif if it is

	//initialize add dif obkects
	window.dif_obj_1 = new add_dif_object('bal_type_1'); //initialize dif object, pass type
	window.dif_obj_1.initialize(); //set listeners, bruched with color all picked columns
	window.dif_obj_2 = new add_dif_object('bal_type_2'); //initialize dif object, pass type
	window.dif_obj_2.initialize(); //set listeners, bruched with color all picked columns

	window.set_titles(); //set titles acc to window.dict_order
	window.update_hash_dict(); //update hash
	
	window.c = new calendar(); //initialize calendar for all charts and tables date divs
	
	set_listeners_dates(); //set listeners for all cells with dates
	set_listeners_filters(); //set listeners for all span in filters div block
	set_listeners_chart_date(); //set listenner for data on chart



	//set actual WIDTH of SHADOW DIV
	var tab_cont = document.get_elements_by_class_name('table_container')[0];
	var tab_cont_len = tab_cont.offsetWidth;

	var mas_div_shadow = document.get_elements_by_class_name('shadow_div');
	for (var i=0;i<mas_div_shadow.length;i=i+1)
		{
		mas_div_shadow[i].style['width'] = tab_cont_len+10+'px';
		}



	//determine date for chart (last date from previous ajax query)
	var d = Object.keys(window.json_table);
	d = d[3];
	//get data for chart
	var new_data = ajax_send('./index.py?page=watchboard&ajax=da&target=core&for=chart&dates='+d+'&lines=402;117');
	var new_data_json = JSON.parse(new_data);
	var data = {}
	var titl = new_data_json['402']['date']; //names must be without spacesm, because splitting ocuring
	titl = clear_replace(titl);
	var row_1 = new_data_json['402']['all']['all;nominal:no'];
	row_1 = clear_replace(row_1).split(';');
	row_1 = decline_chart_data(row_1);
	var row_2 = new_data_json['117']['all']['all;nominal:no'];
	row_2 = clear_replace(row_2).split(';');
	row_2 = decline_chart_data(row_2);


	data['titles'] = titl.split(';');
	data['CreditPortfolio'] = row_2;
	data['Assets'] = row_1;

	window.chart_1 = new chart('bal',data,'800X250');
	window.chart_1.main_container.style['display'] = 'block'; //firstly chart not displ.
	window.chart_1.reset();

	//set listeners for page_container (nessesary for zoom_start, end, move and to hide hover_plashka)

	var p_container = document.get_elements_by_class_name('page_container')[0];
	p_container.add_event_listener('mouseup',function(event){page_container_mouseup(event)},false);
	p_container.add_event_listener('mousemove',function(event){page_container_move(event);},false);


	}

//listeners to stop soom out, hide plashka
function page_container_move(e)
	{
	if (!e){e = window.event}
	window.chart_1.zoom_move(e);
	window.chart_1.h_block.style['display'] = 'none'; //hide hove plashka

	}


function page_container_mouseup(e)
	{
	if (!e){e = window.event}
	window.chart_1.zoom_end(e);


	}




//set listeners for all cells with dates and handler for updating and refreshing data
function set_listeners_dates()
	{
	var titles = window.table.container.get_elements_by_class_name('row_0');
	for (var i=0;i<titles.length;i=i+1)
		{
		var td_ar = titles[i].get_elements_by_tag_name('td');
		for (var j=0;j<td_ar.length;j=j+1)
			{
			if (td_ar[j].className.search('figures')>-1)
				{
				td_ar[j].add_event_listener('click',function(event)
					{
					var obj = this;
					window.c.click_event = data_click;
					window.c.open_event(obj);
					event.stopPropagation();
					},false);
				}
			}

		}
	}


//handler for data click (updating json, hash, dict_order, window.hs)
function data_click()
	{
	window.preloader.st();
	window.stop_back_button='yes';
	var d = this.choosen_date; //get new choosen data from calendar object
	d = from_readable(d);  //remake date performing
	//determine date for #1 or #2
	var col = parseInt(this.div_data_block.className.split(' ')[1].replace('add_cl_',''));
	if (col<5)
		{
		bal_type='1';
		}
	else
		{
		bal_type='2';
		}
	//check id data it is (no Dibplicate)
	var new_d = bal_type+'_'+d;
	if (window.json_table[new_d]!=undefined)
		{
		window.stop_back_button='no';
		window.preloader.sp();
		return false;
		}
	this.div_data_block.innerHTML = this.choosen_date;
	var old_date = window.dict_order[col];
	delete window.json_table[old_date];
		
	d = bal_type+'_'+d;
	new_data = ajax_send('./index.py?page=watchboard&ajax=da&dates='+d+'&report=balance&for=table&target=core');
	new_json = JSON.parse(new_data);
	//insert new data set
	window.json_table[d] = new_json[d];
	window.dict_order[col] = d;
	window.table.refresh_column(col);  //insert new data
	window.update_hash_dict(); //update window.hs
	document.location.hash = '#'+concatenate_hash(window.hs);
	window.cur_hash = document.location.hash; //for back button
	window.table.dif_refresh();
//	set_dif_style();  //for columns that are taking part in difference determine colors
	window.stop_back_button='no';
	window.preloader.sp();
	
	}


function set_listeners_chart_date()
	{
	var date_div = document.get_elements_by_class_name('bal_chart_data')[0];
	date_div.add_event_listener('click',function(event){
				var obj = this;	
				console.log(obj);
				window.c.click_event = date_chart_click;
				window.c.open_event(obj);  //open calendar		
				event.stopPropagation();

				},false);
	
	}

function date_chart_click()
	{
	//get date and close calendar
	var d = this.choosen_date;
	this.div_data_block.innerHTML = d;
	d = from_readable(d);

	//send ajax req and create new dictionary
	var new_data = ajax_send('./index.py?page=watchboard&ajax=da&target=core&for=chart&dates=1_'+d+'&lines=402;117');

	var new_data_json = JSON.parse(new_data);
	var data = {}
	var titl = new_data_json['402']['date']; //names must be without spacesm, because splitting ocuring
	titl = clear_replace(titl);
	var row_1 = new_data_json['402']['all']['all;nominal:no'];
	row_1 = clear_replace(row_1).split(';');
	row_1 = decline_chart_data(row_1);
	var row_2 = new_data_json['117']['all']['all;nominal:no'];
	row_2 = clear_replace(row_2).split(';');
	row_2 = decline_chart_data(row_2);


	data['titles'] = titl.split(';');
	data['CreditPortfolio'] = row_2;
	data['Assets'] = row_1;

	window.chart_1.data = data;
	window.chart_1.reset();

	}



function set_listeners_filters()
	{
	var container = document.get_elements_by_class_name('filters')[0]; //get container
	var mas_span = container.get_elements_by_tag_name('span');
	for (var i=0;i<mas_span.length;i=i+1)
		{
		mas_span[i].add_event_listener('click',function(event){filter_click(event)},false);
		}

	}

function filter_click(e)
	{
	if (!e){e = window.event}
	
	var dict_cur = {};
	dict_cur['USD'] = '840';
	dict_cur['EUR'] = '978';
	dict_cur['RUB'] = '643';
	dict_cur['All'] = 'all';

	var cur = dict_cur[e.target.innerHTML];
	if (e.target.innerHTML=='All')
		{var nominal = 'no'}
	else
		{var nominal = 'yes'}

	window.table.second_dict = cur+';nominal:'+nominal;
	for (var i=1;i<8;i=i+1)
		{
		window.table.refresh_column(i);
		window.table.dif_refresh();
		}
	//set off class name for all elements
	var container = document.get_elements_by_class_name('filters')[0];
	var mas_el = container.get_elements_by_tag_name('span');
	for (var i=0;i<mas_el.length;i=i+1)
		{
		mas_el[i].className = '';
		}
	//set "picked" class name for clicked element
	var cl_name = e.target.className;
	if (cl_name.search('picked')==-1)
		{
		e.target.className = 'picked';
		}
		
	}	


function test_d()
	{
	console.log('ddd');
	}

///////////////AUXELIARIES FUNCTIONS////////////////////////



//update only window.hs, take part in handlers and start_internal_page
function update_hash_dict()
	{
	var dates = '';
	var keys = Object.keys(window.dict_order);
	for (var i=0;i<keys.length;i=i+1)
		{
		var d = window.dict_order[i+1]; //+1 because numeration begininig with 1 column
		dates = dates+';'+d;
		}
	dates = dates.substr(1,dates.length-1); //minus 1 becaus second - is the number of symbols nessesary to take
	window.hs['dates'] = dates;
	console.log('dict has updates');
	}


//remake dates format (acceptible for calendar)
function to_readable(str_1)
	{
	var y = str_1.substr(0,4);
	var m = str_1.substr(4,2);
	var d = str_1.substr(6,2);
	
	return d+'.'+m+'.'+y;
	}

function from_readable(str_1)
	{
	var tmp = str_1.split('.');
	return tmp[2]+tmp[1]+tmp[0];

	}

//separate figures by 3 digits, return string
function decline(figure,devide)
	{
	w = parseFloat(figure);
	if (devide)
		{
		w = w/100000;
		}
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
			interval = 1;
			}
		i=i-1;
		}
	f = final_str+'.'+str_1[1];

	return f;
	
	}


//clear last ; or first ;
function clear_replace(str)
	{
	var new_str = str;
	if (str[str.length-1]==';')
		{
		new_str = str.substr(0,str.length-1);
		}
	if (new_str[0]==';')
		{
		new_str = new_str.substr(1,new_substr.length-1);
		}
	return new_str;
	}



function decline_chart_data(ar)
	{
	new_ar = []
	for (var i=0;i<ar.length;i=i+1)
		{
		new_ar[i] = ar[i]/100000000;
		}
	return new_ar;
	}


//set titles (dates in first_row)
function set_titles()
	{
	var tr_ar = document.get_elements_by_tag_name('tr');
	for (var i=0;i<tr_ar.length;i=i+1)
		{
		if (tr_ar[i].className=='row_0')  //find row with titles
			{
			var td_ar = tr_ar[i].get_elements_by_tag_name('td');
			var k = 0;
			for (var j=2;j<td_ar.length;j=j+1)
				{
				if (td_ar[j].innerHTML!='Dif'&&td_ar[j].className!='separation_td')
					{
					var d = window.dict_order[j-1-k];
					d = d.split('_')[1];
					td_ar[j].innerHTML = to_readable(d);  //-2 nessesary for shifting to "0" position in dict_order dictionary
					}
				else  //if dif - we need to decrease j
					{
					k=k+1;
					}
				}

			}

		}
	}

//using during executing difference to remake figure from string (separated by 3 figures) performance to float 
function remake_fig_to_int(str)
	{
	var str_1 = str.split(' ');
	var new_str = '';
	for (var i=0;i<str_1.length;i=i+1)
		{
		new_str = new_str+str_1[i];
		}

	var new_float = parseFloat(new_str);
	return new_float;

	}




///////////////END AUXELIARIES FUNCTIONS////////////////////////



///////////////ADD DIF OBJECT////////////////////////
//prefix - means bal_type_1 or 2 (fjr dif plaha for #1 or #2)
function add_dif_object(prefix)
	{
	this.container = document.get_elements_by_class_name('difference_choose')[0];
	this.elem_ar = this.container.get_elements_by_class_name(prefix); //array with td cells wih span ADD DIF
	this.col_ar = []; //number of columns for which ADD DIF is needing to be displayed (acc block in HTML)
	this.current_col = []; //current columns, list with columns for brushing
	this.prefix = prefix;  //using to determine which #1 or #2 and also as part of class

	this.removed_col = []; //using to retain columns which has been removed, and then it must be replaced in window.table.dif_min and max
	this.added_col = []; //using ti replace appropriate alue in window.table.dif_min,max its this.removed_col value

	//get col array
	for (var i=0;i<this.elem_ar.length;i=i+1)
		{
		var v = this.elem_ar[i].className.replace('col_','');
		v = parseInt(v);
		this.col_ar.push(v);

		}

	for (var i=0;i<window.table.dif_min.length;i=i+1)
		{
		var n1 = window.table.dif_min[i];
		var n2 = window.table.dif_max[i];
		if (this.col_ar.indexOf(n1)>-1)
			{
			this.current_col.push(n1);
			}
		if (this.col_ar.indexOf(n2)>-1)
			{
			this.current_col.push(n2);
			}
		}


	this.initialize = function()
		{
		this.set_listeners();
		this.display_added();
		for (var i=0;i<this.current_col.length;i=i+1)
			{
			this.set_dif_style(this.current_col[i]);
			}	
		}


	//set listener click on elements without bombling
	this.set_listeners = function()
		{
		var obj = this;
		for (var i=0;i<this.elem_ar.length;i=i+1)
			{
			this.elem_ar[i].get_elements_by_tag_name('span')[0].add_event_listener('click',function(event){obj.click(event);event.stopPropagation()},false);	
			}
		}

	
	//click handler
	this.click = function(e)
		{
		if (!e){e = window.event}
		
		var elem = e.target;
		var cl_name = elem.parentElement.className;
		var col = cl_name.split(' ')[0].replace('col_','');
		col = parseInt(col);
		

		//create remove from array appropriate value (l - list with variables, elem - number (int) of column taken part in dif)
		function rem(l,elem)
			{
			var new_l = [];
			for(var i=0;i<l.length;i=i+1)
				{
				if (l[i]!=elem)
					{
					new_l.push(l[i]);
					}
				}
			return new_l;
			}


		//replacing in window.table.dif_min or max elem, because it is the part of table object and then table.dif_refresh is mading
		function replace_in_dif(obj_1)
			{
			for (var i=0;i<obj_1.removed_col.length;i=i+1)
				{
				var rem_el = obj_1.removed_col[i];
				var add_el = obj_1.added_col[i];
				for (var j=0;j<window.table.dif_min.length;j=j+1) //go throught all elements
					{
					if (window.table.dif_min[j]==rem_el)
						{
						window.table.dif_min[j] = add_el;
						}

					if (window.table.dif_max[j]==rem_el)
						{
						window.table.dif_max[j] = add_el;
						}

					}
				}
			//check that all elements in dif_min and dif_max is that (min and max)
			for (var i=0;i<window.table.dif_min.length;i=i+1)
				{
				if (window.table.dif_min[i]>window.table.dif_max[i])
					{
					var min = window.table.dif_min[i];
					var max = window.table.dif_max[i];
					window.table.dif_min[i] = max;
					window.table.dif_max[i] = min;
					}	
				}
			}



		//determine what operation nessesary to execute
		//take off picked
		if (elem.className.search('gray')>-1||elem.className.search('blue')>-1)
			{
			this.remove_dif_style(col); //take off color from cells
			elem.className = '';
			this.current_col = rem(this.current_col,col);  //creating new list without current clicked column
			this.removed_col.push(col); //add removed column to list, to delete it then from window.table.dif_min
			this.display_all()
			}
		else  //set picked
			{
			this.set_dif_style(col);
			if (this.prefix=='bal_type_1') 
				{
				elem.className = 'gray';
				}
			else
				{
				elem.className = 'blue';
				}
			//switch off the rest number of ADD DIF
			this.current_col.push(col);
			this.added_col.push(col); //added column for further replacing (remo_c)
			if (this.current_col.length==2) //full set (2 elements)
				{
				col = parseInt(col);
				this.display_added(); //set color stle
				var obj_1 = this;
				replace_in_dif(obj_1); //inserting in window.dif_min and max new values
				window.table.dif_refresh();
				this.removed_col = [];
				this.added_col = [];
				}
			else
				{
				this.display_all();
				
				}

			}
		}

	//add classes for columns, taken part in differcence, add_dif_cl_* (* - number of column)
	//in CSS there is determinig for all row_* styles for all add_dif_cl_*
	this.set_dif_style = function(col)
		{
		var td_ar = window.table.container.get_elements_by_class_name('figures add_cl_'+col.toString());
		for (var j=1;j<td_ar.length;j=j+1)
			{
			td_ar[j].className = td_ar[j].className +' add_dif_cl_'+col.toString();
			}
		}	


	this.remove_dif_style = function(col)
		{
		var cl_name = 'figures add_cl_'+col.toString();
		var new_cl_name = 'figures add_cl_'+col.toString();
		var td_mas = window.table.container.get_elements_by_class_name(cl_name);
		for (var i=0;i<td_mas.length;i=i+1)
			{
			td_mas[i].className = new_cl_name;
			}
		}
	
	this.display_all = function()
		{
		for (var i=0;i<this.col_ar.length;i=i+1)
			{
			var cl_n = 'col_'+this.col_ar[i].toString()+' '+prefix;
			var item = this.container.get_elements_by_class_name(cl_n)[0];
			//get span from item (because item is td (cell))
			item = item.get_elements_by_tag_name('span')[0];
			item.style['display'] = 'block';
			}
	
		}

	this.display_added = function()
		{
	
		for (var i=0;i<this.elem_ar.length;i=i+1)
			{
			var el = this.elem_ar[i];
			cl_name = el.className.split(' ')[0].replace('col_','');
			col = parseInt(cl_name);
			if (this.current_col.indexOf(col)!=-1)
				{
				var span_el = el.get_elements_by_tag_name('span')[0];
				span_el.style['display'] = 'block';
				if (el.className.search('bal_type_1')>-1)
					{
					span_el.className = span_el.className+' gray';
					}
				else
					{
					span_el.className = span_el.className+' blue';	
					}
				}
			else
				{
				var span_el = el.get_elements_by_tag_name('span')[0];
				span_el.style['display'] = 'none';
				}
			}

		}


	}





//////////////TABLE OBJECT////////////////////////


//table_container - div. that is receive table html
//looping through the rows. Keys in json is string number (acc to shema "1":"row", "2":"row")
//free_col - list with free columns (free_columns=1,2). After 1, and After 2 columns must be free columns, but after dif. Class of free columns "free"
//drill_d - drill_down=1,2,3  (means that listenners will be designated for those rows, elements with className 'row_1', 'row_2')
//dif - dif column, where to place dif column; example dif=5:2-3;6:3-4;
//	5 - after column 5 (column 5 with data, exclude titles)
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

		//determine columns and rows (it is safly for other table instances)
		if (window.dict_order[0]==undefined)
			{
			var columns = Object.keys(window.json_table);
			for (var i=0;i<columns.length;i=i+1)
				{
				window.dict_order[i+1] = columns[i];	
				}
			}
		else  //creating dict_order for sorting and perform columns in some order
			{
			var len = Object.keys(window.dict_order).length; 
			var columns = [];
			for (var i=1;i<len;i=i+1) //start from 1 because 0 it is row_names
				{
				columns.push(window.dict_order[i]);
				}

			}	

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
			for (var k=0;k<(columns.length+1);k=k+1) //+1 because len is equal to number of columns width data (json keys), but for lett name column nesses add 1
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
					//to prevent NaN.Undefined in table
					if (v==undefined)
						{v = 0;}
					else {v = decline(v,'devide by 100000');}
			
	
					var add_cl = 'add_cl_'+k.toString();
					var new_cell = create_cell('figures '+add_cl,v);
					
					//add free columns acc to list//////////
					if (this.free_columns.indexOf(k.toString())!=-1)
						{
						new_cell = "<td class='separation_td'></td>"+new_cell
						};
					}

				//add dif column////////////////////////
				for (var j=0;j<this.dif_array.length;j=j+1)
					{
					if (this.dif_array[j]==k)
						{
						if (dict_row['level']!='0')  //for non title row
							{
							new_cell = new_cell+"<td class='dif_"+this.dif_array[j].toString()+"'></td>";
							}
						else
							{
							new_cell = new_cell+"<td class='dif_"+this.dif_array[j].toString()+"'>Dif</td>";
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
		

		//set listenners for drill down
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
				if (mas[j].parentElement.className!='row_0')
					{
					var base_fig = remake_fig_to_int(base_mas[j].innerHTML);
					var minus_fig = remake_fig_to_int(minus_mas[j].innerHTML);
					var res = parseFloat(base_fig - minus_fig);
					res = decline(res);
					mas[j].innerHTML = res;
					}
				}
				
			
			}
	
		}
	//insert new data from window.json_table in appropriate column
	this.refresh_column = function(col)
		{	
		var cl_name = 'figures add_cl_'+col.toString();
		var td_ar = this.container.get_elements_by_class_name(cl_name);
		var new_data = window.json_table[window.dict_order[col]];
		var new_data_len = Object.keys(new_data).length;
		//inserting new data
		for (var i=0;i<new_data_len;i=i+1)
			{
			if (td_ar[i].parentElement.className!='row_0') //except titles
				{
				var value = new_data[i][this.first_dict][this.second_dict];
				//to prevent Nan.Undefined figures in tables
				if (value==undefined){value = 0}
				else {value = decline(value,'devide by 100000');}
				td_ar[i].innerHTML = value;
				}
			
			}
	
		}
		
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

/////////////////////////////////////////////////////
//var chart1 = new chart(prefix,widthXheight);
//
//prefix nessesary to retrive from page:
//	- key container (container_prefix_chart), it is wrap for the div and additional blocks. It is including (title, barnavig, chart,legend). You can customize width and height and use CSS style for such container as you wish (in chart.show() method). Generally such container must have widht and height reserved for titles and legend.REQIREMENT for style: position must be relative, because some blocks may have absolute position.
 //	- container for the chart (prefix_chart), it is nessesary to wrap svg object. It must contains additional place for figures on x and y lines.
//	- (prefix_legenda) - container for legenda, it must be inline block, you can specialize place and style.
//	- (prefix_x_figure, prefix_x_figure) styles can be sets for x,y in CSS (for each figure). REQUIREMENTS you must determined style for x and y as position:absolute. Also you need to add width:auto for y style. For x style you can regulate width depend on signs string. Each x sign is a div block with span aligned to center. Also you can set appropriate style for color and other CSS atributes. (prexix_x_figure, prefix_x_figure)
//      - (prefix_navigbar) - div block for reset button
//	- (prefix_hover_block) - div block for figures when hover activted (hover plashka). It must be created with position absolute
//	- some styles you can determine in chart.show() method.
//     
//////////////////////////////////////////////////////
//	- before nessesary create all containers blocks
//		-chart DIV (container, here will be svg, created by script)
//		-title DIV (as you wish)
//		-navigbar (for reset and probably other)
//		-legenda DIV (container, script itself creates items for legenga and inserting it)
//		-also nessesary to set styles for hover_blok and determine accurate style name (prefix_hover_block);
//	- after all containers have created, chart.show sets all lines and properties to display
//	- new chart('balance','600X800')
//	- chart.reset()  - initializing chart.reset(); During this method executing set_min_max(). scale(), show(). - depens on hidden_lines array, that contains hidded lines. Also styles are determinig in this section. At the end of this method show() is executing, where determind add_lines and other instructions for the chart
//	- chart.add_line('line_name') - drawing line based on style in reset section
//	- chart.add_fill('line_name') - drawind fill (it is path filled)
//	- chart.add_bars('line_name') - drawing bars
//	- chart.add_hover('line_name') - adding hover, line_name may be randow. It is creating additional grid with rect, which ligt or not depends on mouse moving. Also div block for description added in prefix_chart div block with displaying none, bu then it is absolute and placing appropriatly to hovering section
//	- chart.add_grid() - adding grid line only
//	- chart.add_x_y()  - adding figures on lines (figures adding in prefix_chart div block)
//      - chart_1.add_legenda(para)  - adding legenda to chart. para means with additional block near legend, you can create your own handler for it (chart_1.handler = function(){console.log()})
//
//	- chart.remove_from_svg(marker_class_name)  - removing from code, and reset listeners. Very careful, not used
//	- chart.add_to_svg(ctx,marker_class_name)  - adding stirng into svg and set new listeners (except legend)
//	- chart.remove_all_from_svg()
//	- chart.hide_line(line_name) - hie line (set none for displaying) and pushes this.hidden_lines. next one executing of function displaying line
//	- chart.hide_show_elem(class_name,whati to do)  - what to do: show ot hide, it is auxiliries function for the same above
//
//	
//
//	- chart.set_listener_hover() - setting listeners for hover elements if rewrawing or for example zom has been (zoom redrawing lines)
//	- chart.set_listener_zoom()  - seting listeners for sooming when redrawing. Events also filtring depends on real disance, it must be sufficent to ocurring handler (>10px move)
//
//	-additional methods. but not all .prune, prun_x, zoom_start(), zoom_move(), zoom_end(), compute_controlfigures()
//
//	for each added line, bar, fill, hover, x_y, zoom_rect_entire, zoom_rect_window we added at the begginig part in html and in the end of part marks (<!--START_+-->, <!--END_+-->), to make possible remove it directly from html if needs.
//
// Each candle (part of chart or one bar) has it is own class name and number, for example 'assets_line 14', 'assets_fill 14', 'assets_circle 14' it is all 
// data - dictionary, where key - name of array, Also it always must contains key='title' with name of all horizontal columns.
//data_reserved - replica, when zoomin, to backward all zooms
// every candle (bar on chart) has it is own class and number in format class="assets_line 13", means that it is part number 13 of line buit from assets in dictionary
//set_listener_hover and zoom_listener adding during every add_to_svg, because it is redwrawing. Nesses to be careful when using remove and HOVER must be always last
function chart(prefix,data, widthXheight)
	{
	//container where insert svg object
	this.main_container = document.getElementsByClassName('container_'+prefix+'_chart')[0];
	this.container = document.getElementsByClassName(prefix+'_chart')[0]; //conrainer, fully fitted to the chart
	this.legenda = this.main_container.getElementsByClassName(prefix+'_legenda')[0];
	this.navigbar = this.main_container.getElementsByClassName(prefix+'_navigbar')[0];
	this.height = parseInt(widthXheight.split('X')[1]);
	this.width = parseInt(widthXheight.split('X')[0]);
	this.svg_wrap = '<svg height="'+this.height+'" width="'+this.width+'" stroke="green">((CONTENT))</svg>';

	//////////STYLE TO BE DETERMINED/////////////////
	this.class_hover_block = prefix+'_hover_block';
	this.y_figure = prefix+'_y_figure';
	this.x_figure = prefix+'_x_figure';


	this.data = data;
	this.data_reserved = 'none'; //for zoom it creates reserved original data, then swap back
	//dictionary with arrays with top x and y coordinates
	this.data_coordinates_x = {};
	this.data_coordinates_y = {};
	//dictionary with control points x and y
	this.data_control_points_x = {};
	this.data_control_points_y = {};


	//min and max values of all lines
	this.min_v = 0; //in fact dimansions value
	this.max_v = 0; //in fact dimansions value
	this.rescaling_koef = 0; //rescaling koef for y coordinates
	this.height_recalc = 1; //rescaling height during several zooms (first must be 1 to be equal to real height) 
	this.shift_recalc = 1; //recalcing of shifting to top, because it may differ (shift_top_bottom) from height_recacl;
	this.zero_line = 0; //devided line between positive and negative parts
	this.kolvo_y_points = 6; //kolvo of points on the y scale
	this.kolvo_x_points = 6; //kolvo of x points;

	this.shift_left = 50; //shofting chart to left from right
	this.shift_top_bottom = 20; //prune top and bottom chart
	this.shift_for_title = 0; //shifting top and bottom for titles
	this.zoom_shifting = 0; //shifting relative to bottom line (height). Add pixels during lines drawing. It is always adds when twice zooming and =0 during "reset"
	this.zoom_flag = 'none';  //flag for activated zoom selection
	this.zoom_flag = 'first';  //flag sign for first zooming;
	this.legenda_flag = 'none'; //flag if none - means not draw, after it will be drawing - flag will be 'yes' and during reset or show it will not redrawing
	this.reset_flag = 'none';  //flag nessesary to once add appropriate block;
	
	this.y_figures = ''; //left scale fact figures (string, using when add or remove content from div block)
	this.x_figures = ''; //bottom x figures

	this.bar_dist = 1;  //distance between bars
	this.hidden_lines = []; //array with hidden lines, when you click display or not it is showing or not based on checking in thes array

	//////////////STYLE SAMPLES/////////////////////////////
	
	////////////////////////////////////////////////////////



	//show chart (MAIN SITTINGS of lines and instructions), here you can set different parametrs this.* (show method fires when removed or add method executing)
	this.show = function()
		{
		//complete dictionary with style for legenda (for each line in dicionary it will be legenda line)
		///////////MAIN PROPERTIES//////////////////////////////////////////
		this.dict_legenda = {};
		this.dict_legenda['Assets'] =' stroke="#527ACC" stroke-width="3" ';
		this.dict_legenda['CreditPortfolio'] = ' stroke="green" stroke-width="3" ';

		var line_style = 'fill="none" stroke="#527ACC" stroke-width="3" ';
		var line_fill = 'fill="blue" stroke="blue"';
		var circles_style = 'r="6" fill="#527ACC" stroke="none"';
		var bar_style = 'fill="rgb(101, 226, 77)" stroke="none" opacity="0.8"';
	
		var hover_fill='"gray" fill-opacity="0" stroke="none"';
		var line_middle_style = 'stroke="red" opacity="0"'; //for hover middle line style, if none - no middle line
		this.hover_opacity = '0.0'; //opacity for hover general blocks, using in event handler p_hover_over and p_hover_out;
		this.hover_bar_opacity = '0.3'; //using in handlers p_hover_over and out, for bars. If it is 'none' - no any opacity for bar;


//		this.add_smooth_fill('assets',line_fill);
//		this.add_smooth_line('assets',line_style);
		this.add_grid();
		this.add_line('Assets',line_style,line_middle_style);
		this.add_bars('CreditPortfolio',bar_style);
		this.add_x_y();
		this.add_circles('Assets',circles_style);
		this.add_hover('Assets',hover_fill,line_middle_style);   //HOVER MUST BE ALWAYS LAST, to prevent doubling of listeners (every add_to_svg adds listeners)
		///////////MAIN PROPERTIES//////////////////////////////////////////
		//add legenda
		if (this.legenda_flag=='none')
			{
			this.add_legenda('none');    //it is onlye once executing, there is legenda_flag='yes', to prevent useless redrawing
			}


		if (this.reset_flag=='none')
			{
			this.add_reset_navigbar(); //adding to navigbar button reset - it is nessesary to add but firstly make not visible (also ness to ass listener)
			this.reset_flag = 'yes';
			}	
		//set visible ot not reset button
		if (this.zoom_first=='yes')
			{
			var d = this.navigbar.getElementsByClassName('reset_button')[0];
			d.style['display'] = 'none';
			}

		else
			{
			var d = this.navigbar.getElementsByClassName('reset_button')[0];
			d.style['display'] = 'inline-block';	
			}

		//grant showing only visible lines
		for (every in this.hidden_lines)	
			{
			var item = this.hidden_lines[every]; //using to collect all hidden lines
			var len = this.data_coordinates_x[item].length;
			
			for (var i=0;i<len;i=i+1)
				{
				this.hide_show_elem(item+'_line '+i.toString(),'hide');
				this.hide_show_elem(item+'_circle '+i.toString(),'hide');
				this.hide_show_elem(item+'_fill '+i.toString(),'hide');
				this.hide_show_elem(item+'_bar '+i.toString(),'hide');
				}
			}
	

		}



	//reseting chart to first view (determined in show function)
	//STARTING must be with this finction (like constructor)
	this.reset = function()
		{
		var tmp_array = [];
		if (this.data_reserved!='none')  //
			{
			for (each in this.data_reserved)
				{
				tmp = this.data_reserved[each];
				this.data[each] = tmp.slice();
				}
			}
		
		this.data_reserved = 'none';
		try
			{
			this.remove_all_svg();
			}
		catch(err){}

		this.height_cur = 0;
		this.zoom_shifting = 0;
		
		this.zoom_first = 'yes'; //it is nessesary for next zooming after reseting (this.shift_left in dependence)
		this.set_min_max();
		this.scale();
		this.show();

	
		}
	



	//determine min and max and rescaling_koef
	this.set_min_max = function()
		{
		
		var max_v = 0;  //max value based on real array
		var min_v = 0;
		
		var len = this.data['titles'].length;
		//determina max and min values
		for (var each in this.data)  //go throught the all lines
			{
			var ar = this.data[each]; 
			var len = ar.length;
			if (each!='titles')
				{
				for (i=0;i<len;i=i+1)
					{							
					if (ar[i]>max_v){max_v = ar[i]};
					if (ar[i]<min_v){min_v = ar[i]};	
					}
				}
			}
		
		this.min_v = min_v;
		this.max_v = max_v;

		this.zero_line = 'none'
		//determine distance and obtain coordinates
		if (this.min_v<0||this.max_value<0)
			{
			if (this.min_v>0||this.max_v>0)
				{
				this.max_y_distance = Math.abs(this.max_v) + Math.abs(this.min_v);
				var shift_distance = -Math.min(this.max_v,this.min_v);  //will be using to shif all coordinates ahed to it is positive values
				this.zero_line = shift_distance;
				}
			}
		if (this.zero_line=='none')
			{
			this.max_y_distance = Math.max(Math.abs(this.max_v),Math.abs(this.min_v));
			if (this.min_v<0||this.min_v==0)
				{
				var shift_distance = -this.min_v;
				this.zero_line = -this.min_v;
				}
			else
				{
				this.zero_line = 0;	
				}

			}


		
		var height_clear = this.height-2*this.shift_top_bottom;	
		this.rescaling_koef = height_clear/this.max_y_distance;  //transmitting index for data to chart
		this.zero_line = this.height - this.zero_line*this.rescaling_koef-this.shift_top_bottom; //to translate zero_line value to coordinates
		
		}	


	//calculate all tops coordinates
	//loop throught the all lines (exept titles) and determine min and max value relativly to zero_line
	this.scale = function()
		{

		var len = this.data['titles'].length;

		this.data_coordinates_x = {}; //it is nessesary to provide consistent with this.data (if new lines was added of some removed)
		this.data_coordinates_y = {};	

		for (var each in this.data)
			{
			var x_distance = (this.width-this.shift_left)/(len-1);  //determine general distance between tops
			var x_st = this.shift_left;
			if (each!='titles')
				{
				var ar = this.data[each];
				var tmp_x = [];
				var tmp_y = [];
				for (i=0;i<len;i=i+1)
					{
					tmp_x[i] = x_st;
					tmp_y[i] = this.zero_line-ar[i]*this.rescaling_koef; //sero_line here is the same as bottom line
					x_st = x_st+x_distance;
					}
				this.data_coordinates_x[each] = tmp_x;
				this.data_coordinates_y[each] = tmp_y;
				}
			}		
		}		


	this.add_smooth_line = function(line_name,stl)
		{	
		var class_name = line_name+'_line'; //it is class name for each path to posibility next hided it (remove)
		var path_smp = '<path class="((CLASS_NAME))" d="((CONTENT))" '+stl+' ></path>';


		//get array with control points for each curves
		var tmp_x = this.computeControlPoints(this.data_coordinates_x[line_name]);
		var tmp_y = this.computeControlPoints(this.data_coordinates_y[line_name]);
		
		var cp_1_x = tmp_x['p1'];
		var cp_2_x = tmp_x['p2'];
		var cp_1_y = tmp_y['p1'];
		var cp_2_y = tmp_y['p2'];

		var ar_x = this.data_coordinates_x[line_name];
		var ar_y = this.data_coordinates_y[line_name];
		var final_curves = '';
		var final_fill = '';
		for (i=0;i<ar_x.length-1;i=i+1)
			{
			var curve = 'M'+ar_x[i]+' '+ar_y[i]+' '+'C'+cp_1_x[i]+' '+cp_1_y[i]+' '+cp_2_x[i]+' '+cp_2_y[i]+' '+ar_x[i+1]+' '+ar_y[i+1];
			var new_path_smp = path_smp;
			new_path_smp = new_path_smp.replace('((CLASS_NAME))',class_name+' '+i.toString());
			new_path_smp = new_path_smp.replace('((CONTENT))',curve);
			final_curves = final_curves+'\n'+new_path_smp;

			}
		//insert content
		
		this.add_to_svg(final_curves,class_name);

		}

	this.add_smooth_fill = function(line_name,stl)
		{
		var class_name = line_name+'_fill';	
		var path_fill = '<path class="((CLASS_NAME))" d="((CONTENT))" '+stl+' ></path>';

		//get array with control points for each curves
		var tmp_x = this.computeControlPoints(this.data_coordinates_x[line_name]);
		var tmp_y = this.computeControlPoints(this.data_coordinates_y[line_name]);
		
		var cp_1_x = tmp_x['p1'];
		var cp_2_x = tmp_x['p2'];
		var cp_1_y = tmp_y['p1'];
		var cp_2_y = tmp_y['p2'];

		var ar_x = this.data_coordinates_x[line_name];
		var ar_y = this.data_coordinates_y[line_name];

		var final_curves = '';
		var final_fill = '';
		for (i=0;i<ar_x.length-1;i=i+1)
			{
			var new_path_fill = path_fill;
			new_path_fill = new_path_fill.replace('((CLASS_NAME))',class_name+' '+i.toString());
			var fill_str = 'M'+ar_x[i]+' '+this.zero_line+' L'+ar_x[i]+' '+ar_y[i]+' '+'C'+cp_1_x[i]+' '+cp_1_y[i]+' '+cp_2_x[i]+' '+cp_2_y[i]+' '+ar_x[i+1]+' '+ar_y[i+1]+' L'+ar_x[i+1]+' '+this.zero_line+' L'+ar_x[i]+' '+this.zero_line+' Z';
			new_path_fill = new_path_fill.replace('((CONTENT))',fill_str);
			final_fill = final_fill+'\n'+new_path_fill;

			}
		//add to current svg
		this.add_to_svg(final_fill,line_name+'_fill'); //line name + fill nessesary for replacing filling

		}

	this.add_line = function(line_name,stl)
		{	
		var class_name = line_name+'_line 0'; //it is class name for each path to posibility next hided it (remove)
		var path_smp = '<path class="((CLASS_NAME))" d="((CONTENT))" '+stl+' ></path>';
		var ar_x = this.data_coordinates_x[line_name];
		var ar_y = this.data_coordinates_y[line_name];
		var curve = 'M'+ar_x[0]+' '+this.zero_line;
		for (i=0;i<ar_x.length;i=i+1)
			{
			var curve = curve +' L'+ar_x[i]+' '+ar_y[i];
			}
		curve = curve+' L'+ar_x[ar_x.length-1]+' '+this.zero_line+' L'+ar_x[0]+' '+this.zero_line+' Z';
		var new_path_smp = path_smp;
		new_path_smp = new_path_smp.replace('((CLASS_NAME))',class_name);
		new_path_smp = new_path_smp.replace('((CONTENT))',curve);
		//insert content
		this.add_to_svg(new_path_smp,class_name);

		}


	this.add_circles = function(line_name,stl)
		{
		var class_name = line_name+'_circle';
		var ar_x = this.data_coordinates_x[line_name];
		var ar_y = this.data_coordinates_y[line_name];
		var final_circle = '';
		for (var i=0;i<ar_x.length;i=i+1)
			{
			
			var circle_smp = '<circle class="'+class_name+' '+i.toString()+'" '+stl+' cx="'+ar_x[i]+'" cy="'+ar_y[i]+'"></circle>';
			final_circle = final_circle+'\n'+circle_smp;
			}

		this.add_to_svg(final_circle, line_name+'_circles');	


		}

	this.add_bars = function(line_name,stl)
		{
		var class_name = line_name+'_bar';
		var ar_x = this.data_coordinates_x[line_name];
		var bar_smp = '<path class="((CLASS_NAME))" d="((CONTENT))" '+stl+' ></path>';	

		//calculate distance. circles must be in the middle of figure
		var dis = (this.width-this.shift_left)/(ar_x.length-1);
		var x_st = this.shift_left;
		var x_en = dis/2+x_st;
		
		var str_bars = '';

		//set fact hover bar height according to shifting for titles


		//create final hover context
		for (var i=0;i<ar_x.length;i=i+1)
			{
			var new_bar = bar_smp;
			var tmp_bottom = this.zero_line;
			var tmp_top = this.data_coordinates_y[line_name][i];
			
			//add space between bars
			x_st_fact = x_st+this.bar_dist;
			x_en_fact = x_en -this.bar_dist; 	

			var bar = 'M'+x_st_fact+' '+tmp_bottom+' L'+x_st_fact+' '+tmp_top+' L'+x_en_fact+' '+tmp_top+' L'+x_en_fact+' '+tmp_bottom+" Z";
			new_bar = new_bar.replace('((CONTENT))',bar);
			//insert id (to obtaine circles during hover)
			new_bar = new_bar.replace('((CLASS_NAME))',class_name+' '+i.toString());
			str_bars = str_bars+'\n'+new_bar;
			if (i==(ar_x.length-2))
				{
				x_st = x_en;
				x_en = x_en+dis/2;
				}
			else
				{	
				x_st = x_en;
				x_en = x_en+dis;
				}
			}
		
		//also we need add block for possible hover
//		this.class_hover_block = class_hover_block;
//		var hover_block = '<div class="'+class_hover_block+'"></div>';
		
	
		this.add_to_svg(str_bars, class_name);

		//set listenners

	
		}




	this.add_hover = function(line_name,bar_stl,line_stl)
		{
		var ar_x = this.data_coordinates_x[line_name];
		//create middle line if nessesary for hover add middle line
		if (line_stl==undefined)
			{
			var hover_smp = '<path class="((CLASS_NAME))" id="((ID_NAME))" d="((CONTENT))" '+bar_stl+'></path>';
			}
		else
			{
			var hover_smp = '</path><path id="((ID_NAME2))" d="((CURVES2))" '+line_stl+'></path><path class="((CLASS_NAME))" id="((ID_NAME))" d="((CONTENT))" '+bar_stl+' >';
			}

		//calculate distance. circles must be in the middle of figure
		var dis = (this.width-this.shift_left)/(ar_x.length-1);
		var x_st = this.shift_left;
		var x_en = dis/2+x_st;
		var middle_line = x_en-dis/2;
		final_hover = '';

		//set fact hover bar height according to shifting for titles
		var tmp_top = this.shift_for_title;
		var tmp_bottom = this.height - this.shift_for_title;


		//create final hover context
		for (var i=0;i<ar_x.length;i=i+1)
			{
			var new_hover_smp = hover_smp;
			var hover = 'M'+x_st+' '+tmp_bottom+' L'+x_st+' '+tmp_top+' L'+x_en+' '+tmp_top+' L'+x_en+' '+tmp_bottom+" Z";
			var curves2 = 'M'+middle_line+' '+this.height+' L'+middle_line+' 0 Z';
			new_hover_smp = new_hover_smp.replace('((CONTENT))',hover);
			new_hover_smp = new_hover_smp.replace('((CURVES2))',curves2);
			//insert id (to obtaine circles during hover)
			var class_name = 'hover '+i.toString();
			var id_name = 'hover_'+i.toString();  //id name nessesary because e.target.className does not work during mouseover/out
			new_hover_smp = new_hover_smp.replace('((CLASS_NAME))',class_name);
			new_hover_smp = new_hover_smp.replace('((ID_NAME))',id_name);
			new_hover_smp = new_hover_smp.replace('((ID_NAME2))',id_name+'_middle_line');
			final_hover = final_hover+'\n'+new_hover_smp;
			if (i==(ar_x.length-2))
				{
				x_st = x_en;
				x_en = x_en+dis/2;
				middle_line = x_en;
				}
			else
				{	
				x_st = x_en;
				x_en = x_en+dis;
				middle_line = x_en-dis/2;
				}
			}
		//also we need add block for possible hover (description of points)
		this.add_to_svg(final_hover, 'hover'); //it is static markers for removing
		this.h_block = this.main_container.getElementsByClassName(this.class_hover_block)[0];

		//set listenners

		var obj = this;
	//	this.set_listener_hover();
	
		}
		

	this.set_listener_hover = function()  //set listenners for hover, it is nessesary after removing, when new innerHTML
		{
		var obj = this;
		var hover_mas = this.container.getElementsByClassName('hover');
		for(i=0;i<hover_mas.length;i=i+1)
			{
			hover_mas[i].addEventListener('mouseover',function(event){obj.p_hover_over(event);event.stopPropagation()},false);	
			hover_mas[i].addEventListener('mouseout',function(event){obj.p_hover_out(event);event.stopPropagation()},false);	
			}
		}

	//listeners for mouse over event
	this.p_hover_over = function(e)
		{

		if (this.zoom_flag!='none')
			{
			console.log('return');
			return;
			}


		if (!e){e = window.event};
		//set visible appropriate hover bar
		var elem_to = e.target;
		elem_to.setAttribute("fill-opacity",this.hover_opacity); //get hover opacity from show method
					
	
		//get id
		var id_name = elem_to.id;  //class name does not work, that is why  i desided to use class_name
		
		//obtain "i" from class_name
		var i = parseInt(id_name.split('_')[1]);
		//get values and create block for hover block
	
		//set middle line displayed
		var middle_line = this.container.get_element_by_id('hover_'+i.toString()+'_middle_line');
		middle_line.setAttribute('opacity','1');


		//get CYRCLES and set style for it
		var hover_block_with_elem = this.container.get_elements_by_class_name(i.toString());
		for (var k=0;k<hover_block_with_elem.length;k=k+1)
			{
			if (hover_block_with_elem[k].className['animVal'].search('circle')>-1)
				{
				hover_block_with_elem[k].setAttribute('fill','rgb(82, 122, 204)');
				hover_block_with_elem[k].setAttribute('r','9');
				}
			}

		//get BARS and set opacitu style
		var bars = [];
		for (var k=0;k<hover_block_with_elem.length;k=k+1)
			{
			if (hover_block_with_elem[k].className['animVal'].search('bar')>-1)
				{
				hover_block_with_elem[k].setAttribute('fill-opacity','0.4');
				}
			}

		//signs for hover block
		var x_sign = this.data['titles'][i];
		final_span = '<span>'+x_sign+'</span><table>';
		for (each in this.data)
			if (each!='titles')
				{
				var tmp = decline(this.data[each][i]);	
				final_span = final_span+'<tr><td>'+each+'</td><td>'+tmp+'</td></tr>';
				}
		//create and display hover block
		this.h_block.innerHTML = final_span;

		//calculate shifting relatively to left fridge of container
		var m_cont = this.main_container.getBoundingClientRect();
		var hov_position = elem_to.getBoundingClientRect();

		//set new position of hover block
		this.h_block.style['display'] = 'block';
		this.h_block.style['left'] = hov_position['left']-m_cont['left']+hov_position['width']+10+'px';
		this.h_block.style['top'] = e.clientY-m_cont['top']+'px';
		var q = this.h_block.getBoundingClientRect()['left'];

		}

		

		
	//event listeners for mouse out event
	this.p_hover_out = function(e)
		{
		if (!e){e = window.event};
		var elem_from = e.target;
		elem_from.setAttribute("fill-opacity",'0');

		//get id
		var id_name = elem_from.id;  //class name does not work, that is why  i desided to use class_name
		
		//obtain "i" from class_name
		var i = parseInt(id_name.split('_')[1]);

		//set middle line not displayed (opacity = 0)
		var middle_line = this.container.get_element_by_id('hover_'+i.toString()+'_middle_line');
		middle_line.setAttribute('opacity','0');
		

		//get CYRCLES and set style for it
		var hover_block_with_elem = this.container.get_elements_by_class_name(i.toString());
		for (var k=0;k<hover_block_with_elem.length;k=k+1)
			{
			if (hover_block_with_elem[k].className['animVal'].search('circle')>-1)
				{
				hover_block_with_elem[k].setAttribute('fill','rgb(82, 122, 204)');
				hover_block_with_elem[k].setAttribute('r','6');
			
				}
			}

		//get BARS and set opacitu style
		var bars = [];
		for (var k=0;k<hover_block_with_elem.length;k=k+1)
			{
			if (hover_block_with_elem[k].className['animVal'].search('bar')>-1)
				{
				hover_block_with_elem[k].setAttribute('fill-opacity','1');
				}
			}



		//hide hover_block (block for description)
		if(e.relatedTarget.tagName!='path'&&e.relatedTarget.className!=this.class_hover_block)
			{
			this.h_block.style['display'] = 'none';	
			}	

		}


	//add reset button
	this.add_reset_navigbar = function()
		{
		var reset_button = '<span class="reset_button">Reset</span>'
		var ctx = this.navigbar.innerHTML;
		this.navigbar.innerHTML = reset_button+ctx;
		this.set_listener_reset();
		}

	this.set_listener_reset = function()
		{
		obj = this;
		var d = this.navigbar.getElementsByClassName('reset_button')[0];
		d.addEventListener('click',function(event){obj.reset()},false);

		}



	//legenda, para means with additional X or change data as you wish in this.handler
	this.add_legenda = function(para)
		{
		//read para
		if (!para){para = 'none'};
		if (para!='none')
			{var x_para = '<svg width="20" height="25" class="remove_line"><path stroke="black" d="M5 5 L15 20 Z"></path><path stroke="black" d="M15 5 L5 20 Z"></svg>'} 
		else
			{x_para = ''};

		var item_smp = '<div class="((LINE_NAME))_legenda item">'+x_para+'<svg width="40" height="25">((PATH))</svg><span>((LINE_NAME))</span></div>';
		
		var final_legenda = ''; 	
	
		for (var each in this.dict_legenda)
			{
			var new_item = item_smp;
			var d = 'd="M0 12.5 L40 12.5 Z"';
			d = '<path ((STYLE)) '+d+'></path>';	
			new_item = new_item.replace('((PATH))',d);
			new_item = new_item.replace('((LINE_NAME))',each);
			new_item = new_item.replace('((LINE_NAME))',each);
			new_item = new_item.replace('((STYLE))',this.dict_legenda[each]);
			final_legenda = final_legenda + new_item;
			}
		
		this.legenda.innerHTML = final_legenda;

		//add listeners for items_legenda
		this.set_listener_legenda();
		try
			{this.set_listener_legenda_remove();}  //try because it may be not inserted legenda, cause of para='none'
		catch(err){};	
		this.legenda_flag = 'yes'; //it is nessesary to prevent redrawing and reseting opacity;
	
		}


	this.set_listener_legenda = function()
		{
	
		var obj = this;
		it_mas = this.legenda.getElementsByClassName('item');
		var len = it_mas.length;
		
		for (var i=0;i<len;i=i+1)
			{
			
			var it = it_mas[i];
			it.addEventListener('click',function(event) //to retrive class and pass to this.hide_line
				{
				var div_block = event.target.parentElement;
				var k = 0;
				while (div_block.tagName!='DIV'&&k<4)
					{				
					div_block = div_block.parentElement;
					k=k+1
					}
				var line_name = div_block.className;
				line_name = line_name.split(' ')[0].split('_')[0];

				//determine whether svg for remove or svg for hidden
				obj.hide_line(line_name);
				//set opacity
				if (obj.hidden_lines.indexOf(line_name)>-1)
					{
					div_block.style['opacity'] = '0.3';
					}
				else
					{
					div_block.style['opacity'] = '1';
					}
				},false);
			}
		
		}

	//listener for X (removing)
	this.set_listener_legenda_remove = function()
		{
		var obj = this;
		it_mas = this.legenda.getElementsByClassName('item');
		var len = it_mas.length;
		
		for (var i=0;i<len;i=i+1)
			{
			var it = it_mas[i];
			var it_svg = it.getElementsByClassName('remove_line')[0];
			it_svg.addEventListener('click',function(event)
				{
				
				var div_block = event.target.parentElement;
				var k = 0;
				while (div_block.tagName!='DIV'&&k<4)
					{				
					div_block = div_block.parentElement;
					k=k+1
					}
				var line_name = div_block.className;
				line_name = line_name.split(' ')[0].split('_')[0];
				//firstly we need to remove data from data and then reset
			
				obj.handler();				
	
				//removing line
			//	obj.remove_from_svg(line_name+'_line');	
				
				event.stopPropagation();
				},false);
			}		
		}

	this.handler = function()
		{
			
		console.log('handler start');

		}

	//add lines for x and y only
	this.add_x_y = function()
		{

		var path_smp = '<path stroke="black" stroke-width="1" d="((CONTENT))"></path>';
 
		var tmp_v_bottom = this.height-this.shift_for_title;
		var tmp_v_top = this.shift_for_title;

		var z_line = 'M'+this.shift_left+' '+this.zero_line+' L'+this.width+' '+this.zero_line+' Z';
		var h_line = 'M'+this.shift_left+' '+tmp_v_bottom+' L'+this.width+' '+tmp_v_bottom+' Z';
		var v_line = 'M'+this.shift_left+' '+tmp_v_bottom+' L'+this.shift_left+' '+tmp_v_top+' Z';


		z_line = path_smp.replace('((CONTENT))',z_line);
		h_line = path_smp.replace('((CONTENT))',h_line);
		v_line = path_smp.replace('((CONTENT))',v_line);
		
		var final_str = z_line+h_line+v_line;
		this.add_to_svg(final_str, 'x_y');  //static marker for removing
		
	
		}

	
	this.add_to_svg = function(ctx,mark)
		{
		
		if (mark==undefined) //mark - it is container for inserted content
			{
			var mark = '';
			}

		//get inner current content  !!!!FOR IE THAN CHANGE
		var svg_mas = this.container.getElementsByTagName('svg');
		if (svg_mas.length!=0)
			{
			var svg_ctx = svg_mas[0].innerHTML;
			}
		else
			{
			var svg_ctx = '';
			}
		

		var mark_wrap_st = '<!--((START_'+mark+'))-->';
		var mark_wrap_en = '<!--((END_'+mark+'))-->';
		ctx = mark_wrap_st+ctx+mark_wrap_en;
	
		//inserting add string content to current
		this.container.innerHTML = this.svg_wrap.replace('((CONTENT))',svg_ctx+ctx)+this.y_figures; //add y_figures

		//add listeners for touch and mouse click (zoom)
		this.set_listener_hover();
		this.set_listener_zoom();

		}

	//unsing when nessessary to remove all svg content
	this.remove_all_svg = function()
		{
		var svg = this.container.getElementsByTagName('svg')[0];
		svg.innerHTML = '';
				
		}

	//removeing fully from svg some code (line, hover or smth has added)
	this.remove_from_svg = function(mark)
		{
		var div_ctx = this.container.innerHTML;
		var st_pos = div_ctx.indexOf('<!--\(\(START_'+mark+'\)\)-->');
		var end_pos = div_ctx.indexOf('<!--\(\(END_'+mark+'\)\)-->',st_pos+1);

		if (st_pos>-1&&end_pos>-1)  //to prevent doubling of innerHTML if it is no search results
			{
			var len = '<!--((END_))-->'.length+mark.length;
			var div_ctx = div_ctx.slice(0,st_pos)+div_ctx.slice(end_pos+len,div_ctx.length-1)

			this.container.innerHTML = div_ctx;
			this.set_listener_hover(); //set listenners once more because innerHTML (new elements)
			this.set_listener_zoom();
			this.add_legenda();  //update legenda because one line was removed
			}	
		}


	//it is nessesary to have this function outside this.hide_line, because it is using during show() (do not show disabling)
	this.hide_show_elem = function(c_name,what)
		{
		try
			{
			var d = this.container.getElementsByClassName(c_name)[0];
			if (what=='hide')
				{
				d.style['display'] = 'none';
				}
			else
				{
				d.style['display'] = 'block';
				}
			}
		catch(err){}
			
		}



	this.hide_line = function(line_name)
		{
		var line = line_name+'_line';
		var circle = line_name+'_circle';
		var fill = line_name+'_fill';
		var bar = line_name+'_bar';

		var len = this.data_coordinates_x[line_name].length;

		var idx = this.hidden_lines.indexOf(line_name);
		
		

		if (idx>-1)
			{
			for (var i=0;i<len;i=i+1)
				{
				this.hide_show_elem(line+' '+i.toString(),'show');
				this.hide_show_elem(circle+' '+i.toString(),'show');
				this.hide_show_elem(fill+' '+i.toString(),'show');
				this.hide_show_elem(bar+' '+i.toString(),'show');
				}

			var tmp = this.hidden_lines.splice(idx,1);
			}

		else  //needs to hide line
			{
			for (var i=0;i<len;i=i+1)
				{
				this.hide_show_elem(line+' '+i.toString(),'hide');
				this.hide_show_elem(circle+' '+i.toString(),'hide');
				this.hide_show_elem(fill+' '+i.toString(),'hide');
				this.hide_show_elem(bar+' '+i.toString(),'hide');
				}
			this.hidden_lines.push(line_name); //insert new hidden line
			}
		}


	
	this.set_listener_zoom = function()
		{
		var obj = this;
		var s = this.container.getElementsByTagName('svg');
		//start zoom selection
		s[0].addEventListener('mousedown',function(event){obj.zoom_start(event);event.stopPropagation();},false);
		s[0].addEventListener('touchstart',function(event){obj.zoom_start(event);event.stopPropagation()},false);
		//zoom selection
		s[0].addEventListener('mousemove',function(event){obj.zoom_move(event);event.stopPropagation()},false);
		//end zoom selextion
		s[0].addEventListener('mouseup',function(event){obj.zoom_end(event);event.stopPropagation()},false);
		s[0].addEventListener('touchend',function(event){obj.zoom_end(event);event.stopPropagation()},false);
		}


	this.zoom_start = function(e)
		{
		if (!e){e = window.event}
		var svg_block = this.container.getElementsByTagName('svg')[0];
		var svg_block_coordinates = svg_block.getBoundingClientRect();
		
		this.svg_coordinates_X = svg_block_coordinates['left'];	
		this.svg_coordinates_Y = svg_block_coordinates['top'];

		this.zoom_window_ratio = (this.width-this.shift_left)/this.height


		this.start_zoom_selection_Y = e.clientY;
		this.start_zoom_selection_X = e.clientX;

		//create element

		var new_Y = this.start_zoom_selection_Y - this.svg_coordinates_Y;
		var new_X = this.start_zoom_selection_X - this.svg_coordinates_X;

		var zoom_rect_entire = '<rect class="zoom_entire" fill-opacity="0.5" x="'+this.shift_left+'" y="'+new_Y+'" width="'+this.width+'" height="0" fill="red"></rect>';
		var zoom_rect_window = '<rect class="zoom_window" fill-opacity="0.5" x="'+new_X+'" y="'+new_Y+'" width="'+new_Y+'" height="0"  fill="green"></rect>';
		//add to svg
		this.add_to_svg(zoom_rect_entire, 'zoom_rect_entire'); //marker for removing
		this.add_to_svg(zoom_rect_window, 'zoom_rect_window'); //marker for removing
		this.zoom_entire = this.container.getElementsByClassName('zoom_entire')[0];
		this.zoom_window = this.container.getElementsByClassName('zoom_window')[0];
		this.zoom_flag = 'yes';
		
		}	

	this.zoom_move = function(e)
		{
		if (!e){e = window.event}


		if (this.zoom_flag!='none')
			{	
			var new_y = e.clientY - this.start_zoom_selection_Y;  //determine distance Y (block width);
			var new_x_pos = e.clientX - this.svg_coordinates_X;
			if (new_x_pos<this.shift_left){new_x_pos = this.shift_left}; //if left border mouse pointer crossing
			var margin_right = this.width - Math.abs(new_y*this.zoom_window_ratio);
			if (new_x_pos>margin_right){new_x_pos = margin_right}; //if left border mouse pointer crossing
			var new_y_pos = new_y + this.start_zoom_selection_Y-this.svg_coordinates_Y;
		
	
			if (new_y<0)
				{
				//set height
				this.zoom_entire.setAttribute('height',Math.abs(new_y));
				this.zoom_window.setAttribute('height',Math.abs(new_y));

				//shift coordinates ahead

				this.zoom_entire.setAttribute('y',new_y_pos);
				this.zoom_window.setAttribute('y',new_y_pos);

				//set new position of window				
				this.zoom_window.setAttribute('x',new_x_pos);
				//set new width
				this.zoom_window.setAttribute('width',-new_y*this.zoom_window_ratio);
						
				}
			else
				{
				//set y coordinates to prevent Bags if previously new_y<0 was
				var cy = this.start_zoom_selection_Y - this.svg_coordinates_Y;
				this.zoom_entire.setAttribute('y',cy);
				this.zoom_window.setAttribute('y',cy);

				this.zoom_entire.setAttribute('height',new_y);
				this.zoom_window.setAttribute('width',new_y*this.zoom_window_ratio);
				this.zoom_window.setAttribute('height',new_y);
				this.zoom_window.setAttribute('x',new_x_pos);
				}

			this.zoom_flag = 'move'; //this is nessesary to fix moving event, prevent click
			}

		}


	this.zoom_end = function(e)
		{
		if (!e){e = window.event}
//		var ts_end = new Date();  //prevent clicks events by it is fact duration (between zoom start and end)
		if (this.zoom_flag!='move')  //cancel selection
			{
			this.zoom_flag = 'none';
			return;
			}

		//determine new scaling koef
		var dif = this.start_zoom_selection_Y - e.clientY;
		var difX = this.start_zoom_selection_X - e.clientX;  //it is nessesary for determinig if it small selection (prevent thic short click) or complete
		if (Math.abs(dif)<10&&Math.abs(difX)<10)
			{
			this.zoom_flag = 'none';
			this.remove_from_svg('zoom_rect_entire');
			this.remove_from_svg('zoom_rect_window');
			return;
			};
		//additional condition for twice and more zooming	
		if (this.zoom_first=='yes'||this.zoom_first==undefined)
			{
			var shift_t_b = this.shift_top_bottom;
			this.height_cur = this.height;
			
			}
		else
			{
			var shift_t_b = 0;
			}




		//nessesary to add current this.zoom_shifting. When it is twice zooming - we need to add current shifting to obtain total shifting
		//zoom-shifting - close to top line, and we need on distance between top and closer to top line from selection make shifting (decrease height)
		this.zoom_shifting = (Math.min(Math.abs(this.start_zoom_selection_Y),Math.abs(e.clientY))-shift_t_b-this.svg_coordinates_Y)+this.zoom_shifting;
		this.shift_recalc = this.height/(this.height-2*shift_t_b);	
			
	
		//we need recalculate zoom_shifting, return it to start dimension system the same is height 
//		this.zoom_shifting = this.zoom_shifting/(this.height_recalc*this.shift_recalc);	


		//we need to multiply total height on total_recalc. Firs zoom it is equal to 1, but second not.
		this.height_recalc = (this.height-2*shift_t_b)/Math.abs(dif);
		this.rescaling_koef = (this.height_cur*this.height_recalc)/this.max_y_distance;


		//nessessary to scale zero line
		if (this.min_v<0)
			{
			this.zero_line = this.height_cur*this.height_recalc - (-this.min_v)*this.rescaling_koef-this.zoom_shifting*this.shift_recalc*this.height_recalc; //we need to multiply on new_rescale_koef because it it yet rescaled once
			}
		else
			{
			
			this.zero_line = this.height_cur*this.height_recalc - this.zoom_shifting*this.shift_recalc*this.height_recalc;
			}
		//IT MUST BE SET IS NULL during RESET
		this.height_cur = this.height_cur*this.height_recalc; //to fix current dimansions, than it will be multiplied on this.height_recalc;
		this.zoom_shifting = this.zoom_shifting*this.shift_recalc*this.height_recalc; 
		this.remove_all_svg();


		//generally, below I am preparing new this.data, and rhen this.scale (recalculating coordinates) and then show() to display all lines
		//copy data array to reserved (for next chart reseting)
		if (this.data_reserved=='none')
			{
			this.data_reserved = {};
			for (var each in this.data)
				{
				var tmp = this.data[each].slice();
				this.data_reserved[each] = tmp;
				}
			}

		//create tmp dictionary fo complete it with coordinates related to zoom_window, then data from tmp will be passing to this.data
		this.tmp_data = {};
		this.tmp_data['titles'] = [];  //to prepare array for titles, prevents bag if it is not array (can not retrive arra[k])
		
		
		var x_width = Math.abs(dif)*this.zoom_window_ratio;
		var st_x = e.clientX - this.svg_coordinates_X;
		if ((x_width+st_x)>this.width)
			{
			st_x = this.width - x_width;
			var en_x = this.width;
			}
		else
			{
			var en_x = st_x+Math.abs(dif)*this.zoom_window_ratio;
			
			}

		
		//complete this.data dictionary from data_tmp
		for (var each in this.data)	
			{
			if (each!='titles')
				{
				var len = this.data[each].length;
				var new_array = [];
				var k = 0;  //for ordering in new array, because it maybe "12" but it is not in zoom_window
				for (var i=0;i<len;i=i+1)
					{
					var x_coordinate = this.data_coordinates_x[each][i];
					if (x_coordinate>=st_x&&x_coordinate<=en_x)
						{
						new_array[k] = this.data[each][i];
						this.tmp_data['titles'][k] = this.data['titles'][i];
						k=k+1;
						}
					}	
				this.tmp_data[each] = new_array;
				}
			}

		//and now we can drop this.data and filled it with this.tmp_data
		this.data = {};
		for (var each in this.tmp_data)
			{
			var tmp = this.tmp_data[each];
			this.data[each] = tmp.slice();
			}
		this.tmp_data = {};

		this.zoom_first = 'no';
		this.zoom_flag='none'; //it is nessesary to switch off mouse moving handler execiting, because script is over;

		this.scale(); //this.scale is nessesary to recalculate new coordinates of 
		this.show();
		//at the end - next zoom is not first
		}


	this.add_grid = function()
		{
	
		//determine real max and min in zoom_window
		var mx = (this.zero_line)/this.rescaling_koef;	
		var mn = -(this.height - this.zero_line)/this.rescaling_koef;
		

		
		//determin general length between fact figures
		var distance = 'none';


		
		distance = mx - mn;
		distance = Math.abs(distance);

		//calculate step on fact figures
		var step = distance/this.kolvo_y_points;
		step = this.prune(step);	
		
		//step to coordinates
		var step_rescale = step*this.rescaling_koef;
		
		//set figures
		var grid_path_line_Y = '<path d="((CONTENT))" stroke="rgb(230, 224, 224)" stroke-width="1"></path>';
		var grid_lines = '';
		var i = this.zero_line-step_rescale; //to begin with certain point

		//dictionary for y_figures (lines coordinates)
		dict_y_figures = {};
		var fact_y = 0;
		
		//complete lines for y_figures above zero_line
		while (i>0)
			{
			fact_y = fact_y+step;
			if (i<this.height)
				{
				dict_y_figures[i-10] = fact_y;
				var n = 'M'+this.shift_left+' '+i+' L'+this.width+' '+i+' Z';
				var new_path = grid_path_line_Y.replace('((CONTENT))',n);
				grid_lines = grid_lines+new_path;
				}
			i = i - step_rescale;
			}
		


		i = this.zero_line+step_rescale;
		fact_y = 0;
		
		//complete lines for y_figures below zero_line
		while (i<this.height)
			{
			fact_y = fact_y - step;
			dict_y_figures[i-10] = fact_y;//-10 means align to middle of y line
			var n = 'M'+this.shift_left+' '+i+' L'+this.width+' '+i+' Z';
			var new_path = grid_path_line_Y.replace('((CONTENT))',n);
			grid_lines = grid_lines+new_path;
			i = i+step_rescale;

			}



		var str_y_figures = '';

		//complete y_figures
		for (var each in dict_y_figures)
			{
			y_fig_div = '<div class="'+this.y_figure+'" style="top:'+each+'px;">'+dict_y_figures[each]+'</div>';
			str_y_figures = str_y_figures+y_fig_div;
			}

		//complete x figures
		var grid_path_line_X = '<path d="((CONTENT))" stroke="rgb(230, 224, 224)" stroke-width="1"></path>';  //for vertical lines
		var interval = 0;
		var len = this.data['titles'].length;
		step = this.prune_x(len/this.kolvo_x_points);
		i = 0;
		//determine any one line with data
		for (var each in this.data_coordinates_x)
			{
			if (each!='titles')
				{
				var line = each;
				}
			}		
		var ar_x = this.data_coordinates_x[line];
		for (var each in ar_x)
			{
			if (interval==step)
				{
				var x_left = this.data_coordinates_x[line][i] - 50; //this figure shift block to the left on 50px, width of block is 100px (to provide centring)
				x_fig_div = '<div class="'+this.x_figure+'" style="bottom:0px;left:'+x_left+'px;">'+this.data['titles'][i]+'</div>';
				str_y_figures = str_y_figures+x_fig_div;
				interval = 0;
				//complete lines for x figures
				var new_x_line = grid_path_line_X;
				x_left = x_left+50; //returns shofting to right coordinate
				var path_dX = 'M'+x_left+' '+this.height+' L'+x_left+' 0 Z';
				new_path_dX = new_x_line.replace('((CONTENT))',path_dX);
				grid_lines = grid_lines+new_path_dX;
				}
			interval = interval+1;
			i=i+1;
			}
		
		this.zoom_flag = 'none'; //reset zooming flag (start during zoom_start())	
		//insert grid line
		this.y_figures = str_y_figures; //it will be inserted during executing add_to_svg
		this.add_to_svg(grid_lines);


		


		}
	
	//determining rounded step, input int and returns is string (using for y figures)
	this.prune = function(figure)
		{
		var final_figure = '';
		var i_str = figure.toString();
		//check float or entire figure
		i_str = i_str.split('.');
		
		if (i_str[0]!='0')  //if step >1
			{
			var base_10_fig = 1;
			for (var i=1;i<i_str[0].length;i=i+1)
				{
				base_10_fig = base_10_fig*10;
				}	
			final_figure = Math.round(i_str[0]/base_10_fig)*base_10_fig;
			final_figure = final_figure.toString();
			}
		else   //if step from 0 to 1
			{
			if (i_str.length==1)
				{
				final_figure = 'none';  //it will be no any grid (0)
				}
			else
				{
				var t = '0';
				i=0;
				while (t=='0'&&i<i_str[1].length)  //find any figure except "0"
					{
					
					t = i_str[1][i];
					i=i+1;
					final_figure = final_figure+t;
					}
				final_figure = '0.'+final_figure;
				}
			}
		//return string
		if (final_figure.search('.')<0)
			{
			final_figure = parseInt(final_figure);
			}
		else
			{
			final_figure = parseFloat(final_figure);
			}
	
		return final_figure;	
		}




	//using for x figures, determinig rounded step accross the x line
	this.prune_x = function(figure)
		{

		if (figure<1)
			{
			var step = 1;
			}
		else
			{
			var step = figure.toString();
			step = step.split('.');
			step = step[0];	
			step = parseInt(step);
			}
				
		return step;
		}


	this.computeControlPoints = function(K)
		{
		p1=new Array();
		p2=new Array();
		n = K.length-1;
	
		/*rhs vector*/
		a=new Array();
		b=new Array();
		c=new Array();
		r=new Array();
	
		/*left most segment*/
		a[0]=0;
		b[0]=2;
		c[0]=1;
		r[0] = K[0]+2*K[1];
	
		/*internal segments*/
		for (i = 1; i < n - 1; i++)
			{
			a[i]=1;
			b[i]=4;
			c[i]=1;
			r[i] = 4 * K[i] + 2 * K[i+1];
			}
			
		/*right segment*/
		a[n-1]=2;
		b[n-1]=7;
		c[n-1]=0;
		r[n-1] = 8*K[n-1]+K[n];
	
		/*solves Ax=b with the Thomas algorithm (from Wikipedia)*/
		for (i = 1; i < n; i++)
			{
			m = a[i]/b[i-1];
			b[i] = b[i] - m * c[i - 1];
			r[i] = r[i] - m*r[i-1];
			}
 
		p1[n-1] = r[n-1]/b[n-1];
		for (i = n - 2; i >= 0; --i)
			p1[i] = (r[i] - c[i] * p1[i+1]) / b[i];
		
		/*we have p1, now compute p2*/
		for (i=0;i<n-1;i++)
			p2[i]=2*K[i+1]-p1[i+1];
	
		p2[n-1]=0.5*(K[n]+p1[n-1]);
	
		return {p1:p1, p2:p2};
		}


	}





