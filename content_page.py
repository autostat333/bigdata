# -*- coding: UTF-8 -*-
import os


class content_page():
	def __init__(self,environment):
		self.path_main_dir = environment['path_main_dir']
		self.path_sources = environment['path_source']
		self.debug_file = environment['debug_file']
		self.b64_create_file = environment['b64_create_file']


	def start(self,para):
		
		t = open(self.path_main_dir+'content/content_p.html','r')
		self.page_read = t.read()  #for frame loads, then ajax req will obtain heart of paper block
		t.close()
		


		#handler for ajax queries
		if para.get('ajax')=='da':
			#get scroll_block for article section
			if para.get('scroll_block')=='da':
				scroll_block = self.create_scroll_block(para['2_menu'])
				scroll_block = "<div class='article_block_container'>"+scroll_block+"</div>"
			else:
				scroll_block = ''
			
			#for only article (it is for only text article). than insertin to paper_block (main block)	
			if para.get('only_article')=='da':
				paper_article_block = self.create_paper_article_block(para['1_menu'],para['2_menu'],para['txt'])
				self.page_read = paper_article_block
			
			#for news. than inserting into news frame	
			elif para.get('only_news')=='da':
				news_frame_block = self.get_news_text(para['txt'])
				self.page_read = news_frame_block


			elif para.get('1_menu')=='video':
				if para.get('only_video_content')=='da':
					content_block = self.create_video_content_block(para['1_menu'],para['2_menu'],para['txt'])
					
					self.page_read = content_block
				else:
					content_block = self.create_video_content_block(para['1_menu'],para['2_menu'],para['txt'])
					paper_block = self.create_paper_article_block(para['1_menu'],para['2_menu'],para['txt']).replace('<!--((VIDEO_CONTENT_BLOCK))-->',content_block)
					self.page_read = paper_block	

			#for entire inserting (into paper_block)
			else:  
				paper_article_block = self.create_paper_article_block(para['1_menu'],para['2_menu'],para['txt'])
				min_height = "<td class='paper_min_height'></td>"

			#compile final page (min_height needs mozila for min-height of block)
				self.page_read =scroll_block+"<table class='paper_block_table'>"+min_height+"<td class=paper_article_block>"+paper_article_block+"</td></table>"
		

		#inserting href
		self.insert_href()

		#insert images (for article scroll)
		self.insert_b64('article_scroll_triangle_left.png','static/content')
		self.insert_b64('article_scroll_triangle_right.png','static/content')

		#insert images for news scroll navigation
		self.insert_b64('news_scroll_up.jpg','static/content')
		self.insert_b64('news_scroll_down.jpg','static/content')

		self.insert_b64('up_page.png','static/content')


		self.insert_b64('video_scroll_up.png','static/video')
		self.insert_b64('video_scroll_down.png','static/video')

		return self.page_read

#------------------------------------------------------


	def create_paper_article_block(self, menu_1, menu_2, txt):
		#get txt for article (lst article and simple)
		if menu_1=='articles' and menu_2!='news':
			#create empty article for machine learning section
			if menu_2=='machine_learning':
				t = open(self.path_sources+'machine_learning_empty.txt','r')
				final_art = t.read()
				t.close()	
			
			elif 'last' in txt:  #handler for last article
				#get array with number of articles of appropriate section
				articles = os.listdir(self.path_sources+'article/')
				list_tmp = []
				for each in articles:
					if '_desc.txt' in each:
						t = open(self.path_sources+'article/'+each,'r')
						#read only 4 rows
						i=0
						while i<4:
							w = t.readline().strip()
							i=i+1
						t.close()
						if w==menu_2:
							list_tmp.append(int(each.split('_')[1]))
				
				#determine last article in appropriate section
				list_t = sorted(list_tmp,reverse=True)
				last_art_number = list_t[0]
				#get last article
				t = open(self.path_sources+'article/article_'+str(last_art_number)+'_desc.txt','r')
				final_art = t.read()
				final_art = final_art.split('\n')
				final_art = '\n'.join(final_art[4:len(final_art)-1])
				t.close()
			else:
				t = open(self.path_sources+'article/'+txt+'.txt','r')
				final_art = t.read()
				final_art = final_art.split('\n')
				final_art = '\n'.join(final_art[4:len(final_art)-1])
				t.close()

		#get article for !!!NEWS!!! section (scroll + news_text)
		elif menu_2=='news':
			#open news sample file
			t = open(self.path_main_dir+'content/news_smp.html','r')
			news_smp = t.read()
			t.close()
			#insert scroll items
			news_scroll_items = self.create_news_scroll_block()
			news_smp = news_smp.replace('<!--((NEWS_ITEMS))-->',news_scroll_items)	
			
			#insert news text
			news_txt = self.get_news_text(txt)
			news_smp = news_smp.replace('<!--((NEWS_TEXT))-->',news_txt)
			final_art = news_smp
			

		#get html smaple content for video block
		elif menu_1=='video':
			html_smp_f = open(self.path_main_dir+'/content/video_smp.html','r')
			html_smp = html_smp_f.read()
			html_smp_f.close()

			final_art = html_smp
					
		


		#get article for other articles (about and watchboard)
		else:
			t = open(self.path_sources+'menu_txt/'+txt+'.txt','r')
			final_art = t.read()
			t.close()

				
		return final_art


#--------------------for news_-----------------------------------

	def create_news_scroll_block(self):
		news = os.listdir(self.path_sources+'news/')
		kolvo = len(news)
		all_news = ''
		smp = "<div class='news_item no_select'><span>`date`</span><a href='`href`'>`news_title`</a></div>"
		for each in xrange(kolvo,0,-1):
			t = open(self.path_sources+'news/news_'+str(each)+'.txt','r')
			date = t.readline().strip()
			news_title = t.readline().strip()
			t.close()
			news_item = smp.replace('`date`',date)
			news_item = news_item.replace('`news_title`',news_title)
			href = './index.py?page=content#1_menu=about;2_menu=news;txt=news_'+str(each)
			news_item = news_item.replace('`href`',href)
			all_news = all_news+'\n'+news_item

		return all_news
			


	def get_news_text(self,txt):
		
		if 'last' in txt:
			news_number = 'news_'+str(len(os.listdir(self.path_sources+'news/')))
		else:
			news_number = txt

		t = open(self.path_sources+'news/'+news_number+'.txt','r')
		r = t.read()
		r = r.split('\n')
		final_news = '\n'.join(r[2:len(r)-1])
		t.close()
	
		return final_news
			

	def create_video_content_block(self,menu_1,menu_2,txt):
		t = open(self.path_main_dir+'content/video_content_smp.html','r')
		vc = t.read()
		t.close()	

		#load scroll smp
		scroll_smp_f = open(self.path_main_dir+'content/video_scroll_smp.html','r')
		scroll_smp = scroll_smp_f.read()
		scroll_smp_f.close()
		scroll_smp = scroll_smp.split('split_smp')
		scroll_item = scroll_smp[0]
		scroll_desc = scroll_smp[1]
	
		#read video_files and create list with videos file names
		videos = os.listdir(self.path_sources+'video')
		
		video_dict = {}
		#complete dictionary with video number and its properties
		for file_name in videos:
			if '_desc.txt' in file_name:
				t = open(self.path_sources+'video/'+file_name)
				video_name = t.readline().strip()
				video_desc = t.readline().strip()
				video_section = t.readline().strip()
				video_youtube_name = t.readline().strip()
				t.close()
				if video_section==menu_2:
					video_number = file_name.split('_')[1]
					video_dict[int(video_number)] = [video_name,video_desc,video_youtube_name]
		#complete scroll_items and desc_items
		scroll_items = ''
		desc_items = ''
		video_sort = sorted(video_dict.keys(),reverse=True)
		for number in video_sort:
			mas = video_dict.get(number)
			new_scroll_item = scroll_item
			#insert name, id to scrol litem
			new_scroll_item = new_scroll_item.replace('`img_href`','`video_'+str(number)+'`')
			
			new_scroll_item = self.insert_b64('video_'+str(number)+'.jpg','video',new_scroll_item)
			new_scroll_item = new_scroll_item.replace('`video_name`',mas[0])
			new_scroll_item = new_scroll_item.replace('`video_path`','video_'+str(number)+';'+mas[2])
			#insert to descrition
			new_desc_item = scroll_desc
			new_desc_item = new_desc_item.replace('`file_name`','video_'+str(number))
			new_desc_item = new_desc_item.replace('`video_name`',mas[0])	
			new_desc_item = new_desc_item.replace('`video_desc`',mas[1])
	
			#add scroll items and description items to total text
			scroll_items = scroll_items = scroll_items+new_scroll_item
			desc_items = desc_items + new_desc_item
		
		vc = vc.replace('<!--((VIDEO_SCROLL_ITEMS))-->',scroll_items)	
		vc = vc.replace('<!--((VIDEO_DESC_ITEMS))-->',desc_items)	
	
	

		return vc
#------------------end for news----------------------------------------


	def create_scroll_block(self,section):
		articles = os.listdir(self.path_sources+'article')

		#read all samples
		art_item_f = open(self.path_main_dir+'content/scroll_elem_smp.html','r')
		art_item = art_item_f.read()
		art_item_f.close()
		art_scroll_f = open(self.path_main_dir+'content/scroll_smp.html','r')
		art_scroll = art_scroll_f.read()
		art_scroll_f.close()
		


		#calc txt file with articles
		kolvo = 0
		for each in articles:
			if '_desc.txt' in each:
				kolvo = kolvo+1



		all_items = ''
		for each in xrange(kolvo,0,-1):
			t = open(self.path_sources+'article/article_'+str(each)+'_desc.txt','r')
			#read section (rows#4) 
			art_title = t.readline().strip()
			art_desc = t.readline().strip()
			art_data = t.readline().strip()
			art_section = t.readline().strip()
			t.close()	
			if art_section==section:
				#replace all para
				new_item = art_item
				#insert img
				item_img_f = open(self.path_sources+'article/article_'+str(each)+'.txt','r')
				item_img = item_img_f.read()
				item_img_f.close()
			
				new_item = new_item.replace('`item_img`','data:image/jpg;base64,'+item_img)
				new_item = new_item.replace('`art_title`',art_title)
				new_item = new_item.replace('`art_desc`',art_desc)

				#insert href
				href = './index.py?page=content#1_menu=articles;2_menu='+section+';txt=article_'+str(each)+'_desc'
				new_item = new_item.replace('`href`',href) 
				all_items = all_items+new_item
		

		fin = art_scroll.replace('<!--((ARTICLE_ITEM))-->',all_items)
		return fin





#insert file_name into html. If in dir there is not img_txt in b64 - it will create whit b64_create_file	
	def insert_b64(self,file_name,src_folder,where_insert=None):
	
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
		if where_insert==None:
			self.page_read = self.page_read.replace(para_name,'data:image/'+f_ext+';base64,'+b64_txt)
		else:
			return where_insert.replace(para_name,'data:image/'+f_ext+';base64,'+b64_txt)
			


	def insert_href(self):
		#read file
		href_f = open(self.path_main_dir+'content/href.txt','r')
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
	
