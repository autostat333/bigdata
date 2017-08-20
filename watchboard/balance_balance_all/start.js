
function start_internal_page()
	{
	
	console.log('start_internal');
	var d = document.get_elements_by_class_name('table_container')[0];
	console.log(d);

	//!!!change WINDOW
	//char_type=1 (or=2 means chart based on #1 or #1)
	//dates=1_201401124;2_20150301; (how many data to deliver, and 1_ or 2_ means #1 or #2)
	//for=table (or chart) means data for table or chart
	//ajax=da (means ajax query)
	//do not forget target=core (python understand this as hit to core server)
	//do not forget report=balance (c++ understand it as balance.h)
	window.res = ajax_send('./index.py?page=watchboard&ajax=da&dates=1_20150225;1_20141114;1_20150123;1_20150124;2_20141231;2_20150131;2_20150228&report=balance&for=table&target=core');
	console.log(res.length);
	window.json_table = JSON.parse(window.res);	
	window.table= new table_obj("free_columns=5,6","drill_down=1,2,3","dif=5:4-3");
	window.table.draw_table();
	window.table.dif_refresh();
	
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
		var dd = tmp[1].split('-');
		console.log(dif_str[i]);
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





