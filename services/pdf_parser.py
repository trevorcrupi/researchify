from werkzeug.exceptions import NotFound, ServiceUnavailable
from services import root_dir, nice_json
from flask import Flask, request, jsonify
from pymongo import MongoClient
from cStringIO import StringIO
from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.converter import TextConverter
from pdfminer.layout import LAParams
from pdfminer.pdfpage import PDFPage
from urllib2 import Request
import urllib2
import datetime
import re

app = Flask(__name__)

client = MongoClient()
db = client.researchify

@app.route('/parse', methods=['POST'])
def parse():
	url = request.get_json(force=True)['url']

	# Open the url provided as an argument to the function and read the content
	open = urllib2.urlopen(Request(url)).read()

	output = StringIO(open)
	manager = PDFResourceManager()
	converter = TextConverter(manager, output, laparams=LAParams())
	interpreter = PDFPageInterpreter(manager, converter)

	infile = file(fname, 'rb')
	for page in PDFPage.get_pages(infile, pagenums):
	    interpreter.process_page(page)
	infile.close()
	converter.close()
	text = output.getvalue()
	output.close
	return "It works!"

if __name__ == "__main__":
    app.run(port=5001, debug=True)