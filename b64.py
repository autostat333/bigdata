import sys
import base64


arg = sys.argv


def encode(file_name):
	img_file = open(file_name,'r')
	r = img_file.read()
	img_file.close()
	img_txt = base64.b64encode(r)
	res = open(file_name.split('.')[0]+'.txt','w')
	res.write(img_txt)
	res.close()
	



if len(arg)==1:	
	print 'File is nessesary'
else:
	encode(arg[1])






