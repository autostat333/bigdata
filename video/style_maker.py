import sys




def comments(txt):
	start_number = txt.find('/*',0)
	comments = 'none'
	if start_number>-1:
		end_number = txt.find('*/',2)
		comments = txt[start_number+2:end_number]
	
	return comments
	


def get_browsers(comments):
	start_number = comments.find('[',0)
	end_number = comments.find(']',start_number+1)
	
	browsers = []
	if start_number>-1 and end_number>-1:
		browsers = comments[start_number+1:end_number]
		browsers = browsers.split(',')
	
	return browsers



def check_exeption(comments,browser):
	res = ''
	if comments.find('+!'+browser,0)>-1:
		res = 'yes'
	elif comments.find('-!'+browser,0)>-1:
		res = 'no'
	return res
		
			
			
arg = sys.argv


#read general style file
prefix = arg[1]
style_file = open(prefix+'_style.css','r')


#get list with browsers from first line in general css file
first_line = style_file.readline()
first_line_comments = comments(first_line)
browsers = get_browsers(first_line_comments)
#open files for each browser and create dictionary
dict_files = {}
all_browsers = open(prefix+'_style_all.css','w')
for browser in browsers:
	dict_files[browser] = open(prefix+'_style_'+browser+'.css','w')
	

#create files
for each in style_file:
	com = comments(each)
	list_br = []
	for browser in dict_files:
		check = check_exeption(com,browser)
		if check=='yes':
			f = dict_files.get(browser)
			f.write(each)
			list_br.append(browser)
		elif check=='':
			f = dict_files.get(browser)
			f.write(each)

	if len(list_br)==0:
		all_browsers.write(each)



#close all style files
for each in dict_files:
	f = dict_files[each]
	f.close()


style_file.close()

