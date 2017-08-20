# -*- coding: UTF-8 -*-

#main page HTML
#main_page - class for main page
#main_page.start()  - returns final page
#main_page.insert_b64('main_slider_scroll','static')  - insert thumb in base64 into html, 'main_slider_scroll' - the name of paramtr for replacemen in html, 'static' - additional postfix (folder) for path_source
#if there is not file txt with thumb - function 


import os  #for listing directory (obtaining files)
import time
import urllib


class main_page():
	
	def __init__(self,environment):
		self.path_sources = environment['path_source']
		self.path_main_dir = environment['path_main_dir']	
		self.b64_create_file = environment['b64_create_file']  #function to convert img to b64 (b64_create_file(file name with all path))
		self.debug_file = environment['debug_file']
		self.feedback_path = environment['feedback_path']
		#samples for article and video items
		self.video_item_smp = open(self.path_main_dir+'main/video_item_smp.html','r').read()
		self.article_item_smp = open(self.path_main_dir+'main/article_item_smp.html','r').read()


	def start(self,para):

		if para.get('ajax')=='feedback':  #for feebdack sending msg
			
			self.page_read = 'Сообщение отправлено'
			#msg will be retained into file in folder feedback with name = timestamp
			kolvo_msg = os.listdir(self.feedback_path)
			f_name = str(len(kolvo_msg)+1)	#f. name of msg will be number of file
			f_ts = str(time.time()).split('.')[0]
			feed_f = open(self.feedback_path+f_name+'.txt','w')
			feed_f.write(f_ts+'\n')
			feed_f.write(urllib.unquote(para['msg']))
			feed_f.close()
		else:	

			t = open(self.path_main_dir+'main/main_p.html','r')
			r = t.read()
			self.page_read = r
		
			#insert images encoded to b64 into page
			self.insert_b64('main_slider_left_scroll.jpg','static')
			self.insert_b64('main_slider_right_scroll.jpg','static')
		
			self.insert_b64('Left_2.png','static')
			self.insert_b64('Right_2.png','static')
			self.insert_b64('news_title.png','static')
			self.insert_b64('feedback.png','static')
			self.insert_b64('cinema.png','static')
		
			self.insert_b64('article_left_up.png','static')
			self.insert_b64('article_right_down.png','static')

	

			self.create_video_items()  #insert all video blocks with description
			self.create_article_items()  #insert all article blocks with description
		
			self.insert_href()  #insert hrefs from href.txt file
			self.create_news() # create news_line
			self.insert_main_slider()  #insert big images into slider
			
			

		return self.page_read

#-------------------------------------------------------------------

	def insert_main_slider(self):
		list_img =os.listdir(self.path_main_dir+'main')

		#calc img files number
		kolvo_img = 0
		for each in list_img:
			if '.jpg' in each:
				kolvo_img = kolvo_img+1
		
		first_elem = 0  #it is ness to determine if first elem (for z-index)
		style = ''
		for each in xrange(1,kolvo_img+1):
			if first_elem==0:
				style="""style='z-index:4'"""
			else:
				style = ''
			first_elem = 1
	
			img_line = """		
			<img class="main_slider_img" src='./main/test"""+str(each)+""".jpg' """+style+"""></img>

			<!--MAIN_SLIDER_IMG-->
			"""
			self.page_read = self.page_read.replace('<!--MAIN_SLIDER_IMG-->',img_line)


	
	def create_video_items(self):
		files = os.listdir(self.path_sources+'video')
		length = 0

		for each in files:
			if '.jpg' in each:
				length = length+1	
		self.debug_file.write('\n'+str(length))
		for each in xrange(length,0,-1):
			new_smp = self.video_item_smp.replace('`file_name`','`video_'+str(each)+'`')
			#take description for video
			t = open(self.path_sources+'video/video_'+str(each)+'_desc.txt')
			r = t.read()
			t.close()
			insight = r.split('\n')
			r = insight[0]
			
			new_smp = new_smp.replace('`video_description`',r)
			new_smp = new_smp.replace('`href`','./index.py?page=content#1_menu=video;2_menu='+insight[2]+';txt=video_'+str(each))


			#finally insert video block
			self.page_read = self.page_read.replace('<!--((VIDEO_ITEM_BLOCK))-->',new_smp)
			self.insert_b64('video_'+str(each)+'.jpg','video')

			

	def create_article_items(self):

		files = os.listdir(self.path_sources+'article')
		length = 0

		for each in files:
			if '.jpg' in each:
				length = length+1	

		for each in xrange(length,0,-1):
			new_smp = self.article_item_smp.replace('`file_name`','`article_'+str(each)+'`')
			#take description for article
			t = open(self.path_sources+'article/article_'+str(each)+'_desc.txt')
			art_title = t.readline().strip()
			art_descr = t.readline().strip()
			art_date = t.readline().strip()
			art_section = t.readline().strip()
			
			t.close()
	

			new_smp = new_smp.replace('`article_title`',art_title)
			new_smp = new_smp.replace('`article_description`',art_descr)
			new_smp = new_smp.replace('`article_date`',art_date)
			new_smp = new_smp.replace('`href`','./index.py?page=content#1_menu=articles;2_menu='+art_section+';txt=article_'+str(each)+'_desc')



			#finally insert article block into hmlt
			self.page_read = self.page_read.replace('<!--((ARTICLE_ITEM_BLOCK))-->',new_smp)
			self.insert_b64('article_'+str(each)+'.jpg','article')

	

	def create_news(self):
		list_news = os.listdir(self.path_sources+'news')
		kolvo = 0
		for each in list_news:
			if '.txt':
				kolvo = kolvo+1
		max_kolvo = 5
		interval = 0
		for each in xrange(kolvo,0,-1):
			
			n_f = open(self.path_sources+'news/news_'+str(each)+'.txt','r')
		
			#insert news line
			n_date = n_f.readline().strip()
			n_title = n_f.readline().strip()
		
	
			n_line = """
			<tr onclick="document.location = './index.py?page=content#1_menu=about;2_menu=news;txt=news_"""+str(each)+"""'"><td class='news_td_date'><span>"""+n_date+"""</span></td><td class='news_td_descr'><span>"""+n_title+"""</span></td></tr>
			<!--NEWS_LINE-->

			"""
			self.page_read = self.page_read.replace('<!--NEWS_LINE-->',n_line)

	
			n_f.close()	
			interval = interval+1
			if interval==max_kolvo:
				break

	
	


	def insert_href(self):
		#read file
		href_f = open(self.path_main_dir+'main/href.txt','r')
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
				


#-------------------------------------------------------------------------------------------
	
	#insert file_name into html. If in dir there is not img_txt in b64 - it will create whit b64_create_file	
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

		ext = file_name.split('.')[1]
		self.page_read = self.page_read.replace(para_name,'data:image/'+ext+';base64,'+b64_txt)
			


	



	


