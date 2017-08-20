# -*- UTF-8 -*-

import urllib
import base64
import cgi
#import all page libriaries

from main_page import main_page
from content_page import content_page
from watchboard_page import watchboard_page


from mod_python import apache
from user_agents import parse  #needs for user-agent browser detection

import time

#config




#pars_param(first line http headers)  - returns dictionary with all para and it is values. Para must be para=*&
#paga=main  -  main page
#page=article;43  - articles and another text content html page, number means number of file with article


#----------------------------------------------------------
#---------------------ADDITIONAL FUNCTIONS-----------------
#----------------------------------------------------------


#page=['main','content','video']&menu_item=['about','articles','watchboard','video']&['art_numb=*', 'video_numb=*',]



def pars_param(req):
	str_1 = req.split(' ')[1]
	dict_para = {}
	str_1 = str_1.split('?')
	if len(str_1)>1:
		para = str_1[1].split('&')
		for each in para:
			p = each.split('=')
			dict_para[p[0]] = p[1]

	return dict_para
		




#create environmet, it is passed to all pages script as container of global parametrs and functions
def environment():


	#config fullfill
	environment = {}
	environment['path_source'] = 'var/www/html/bigdata/sources/' #folder for sources (static, video, article...)
	environment['path_main_dir'] = 'var/www/html/bigdata/'  # folder for main folder where is index.py located. Beginnig from this directory script seeking all py page libraries
	environment['debug_file'] = open('/var/www/html/bigdata/debug/debug_file.txt','w')  #to wrtie out during debagging
	environment['feedback_path'] = 'var/www/html/bigdata/feedback/'
	
	#to create .txt file with b64 of img, if it is not
	def b64_create_file(file_name):
		img_file = open(file_name,'r')
		r = img_file.read()
		img_file.close()
		img_txt = base64.b64encode(r)
		res = open(file_name.split('.')[0]+'.txt','w')
		res.write(img_txt)
		res.close()
	
	
	environment['b64_create_file'] = b64_create_file
	return environment



#----------------------------------------------------------
#---------------------INDEX--------------------------------
#----------------------------------------------------------

def handler(req):

	#obtain parametrs from url
	para = pars_param(req.the_request)
	#getenvironment paramatrs
	e = environment()  # obtain environment dictionary	
	
	e['debug_file'].write(' '.join(para.keys()))
	#initialize clases
	main_p = main_page(e)	
	content_p = content_page(e)
	wb_page = watchboard_page(e)


#--------------MAIN IF CONDITION BLOCK FOR HTML REFERALS
	if para.get('page')==None or para.get('page')=='main':
		final_page = main_p.start(para)
	elif para.get('page')=='content':
		final_page = content_p.start(para)	

	elif para.get('page')=='watchboard':
		final_page = wb_page.start(para)
	else:
		final_page = main_p.start(para)  #it is plug if page=not standard parametr


#----------------------END IF BLOCK-----------------------
	


	#block for detecting IE and swap css syles
	browser = parse(req.headers_in['User-Agent'])
#	e['debug_file'].write('\n'+' '.join(req.headers_in.keys()))
	if browser.browser.family=='IE' and browser.browser.version[0]==8:
		final_page = final_page.replace('_style_all.css">','_style_ie8.css">')
		if para.get('ajax')!='da':
			final_page = final_page+'<div id="ie8_marker"></div>'
	else:
		pass

#	time.sleep(0.5)	
	e['debug_file'].close()  #close debug file after page is completed

#	return final_page
	req.content_type = 'text/html;charset=UTF-8'
	req.write(final_page)
	return apache.OK





