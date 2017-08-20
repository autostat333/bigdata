# -*- coding: UTF-8 -*-
import os


class video_page():
	def __init__(self,environment):
		self.path_main_dir = environment['path_main_dir']
		self.path_sources = environment['path_source']
		self.debug_file = environment['debug_file']
		self.b64_create_file = environment['b64_create_file']


	def start(self,para):
		t = open(self.path_main_dir+'video/video_p.html','r')
		self.page_read = t.read()
		t.close()
		
		#inserting href
		self.insert_href()
	
		
		#insert img as b64
		self.insert_b64('cinema_img.png','static/video')

		return self.page_read


#insert file_name with b_64 into html. If in dir there is not img_txt in b64 - it will create whit b64_create_file	
	def insert_b64(self,file_name,src_folder):
	
		if src_folder!='None':
			full_path = self.path_sources+src_folder+'/'
		else:
			full_path = self.path_sources

		txt_name = file_name.split('.')[0]+'.txt'
		try:
			b64_txt_ = open(full_path+txt_name,'r')
		except:
			self.b64_create_file(full_path+file_name)
			b64_txt_ = open(full_path+txt_name,'r')
		

		b64_txt = b64_txt_.read()
		b64_txt_.close()
		para_name = '`'+file_name.split('.')[0]+'`'
		f_ext = file_name.split('.')[1]
		self.page_read = self.page_read.replace(para_name,'data:image/'+f_ext+';base64,'+b64_txt)
			


	def insert_href(self):
		#read file
		href_f = open(self.path_main_dir+'video/href.txt','r')
		href = href_f.read()
		href_f.close()
		href = href.split('\n')
		dict_href = {}
		for each in href:
			try:
				if each[0]!='#':   
					str_1 = each.split('\t')
					dict_href[str_1[0]]=str_1[1]
				else:
					pass
			except:
				pass

		for each in dict_href:
			self.page_read = self.page_read.replace('`'+each+'`',dict_href[each])	
	
