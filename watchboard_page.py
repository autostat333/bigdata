# -*- coding: UTF-8 -*-
import os
import urllib


class watchboard_page():

	def __init__(self,env):
		self.path_main_dir = env['path_main_dir']
		self.path_sources = env['path_source']
		self.debug_file = env['debug_file']
		self.b64_create_file = env['b64_create_file']


	def start(self,para):
		

		page_f = open(self.path_main_dir+'watchboard/wb_p.html','r')
		self.page_read = page_f.read()
		page_f.close()


		#for ajax qieries
		if para.get('ajax')=='da':
		
			#concatenate all para to transmit it to core
			if para.get('target')=='core':	
				para_str = '';
				for each in para:
					para_str = para_str+'&'+each+'='+para[each]
				self.debug_file.write('\n'+para_str[1:len(para_str)])	
				page = urllib.urlopen('http://localhost:5400/?'+para_str[1:len(para_str)])
				p = page.read()
				p = p.split('\n')[1]  #because [0] - it is header
				page.close()
				self.page_read = p

			elif para.get('target')=='html':
				
				menu_concatenate = ''
				menu_1 = para.get('1_menu','balance')
				menu_2 = para.get('2_menu','balance')
				menu_3 = para.get('3_menu','')
				menu_concatenate = menu_1+'_'+menu_2+'_'+menu_3
				try:
					page_smp = open(self.path_main_dir+'watchboard/'+menu_concatenate+'/load.html','r')
				except:
					page_smp = open(self.path_main_dir+'watchboard/empty/load.html','r')
		
				p_read = page_smp.read()
				page_smp.close()		
				self.page_read = p_read

	

		return self.page_read


