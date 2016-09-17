from __future__ import print_function # In python 2.7
from werkzeug.exceptions import NotFound, ServiceUnavailable
from services import root_dir, nice_json
from flask import Flask, request, jsonify
from pymongo import MongoClient
from bs4 import BeautifulSoup
from datetime import datetime
from urlparse import urlparse
import sys
import requests
import urllib2
import json
import re

app = Flask(__name__)

client = MongoClient()
db = client.researchify

@app.route("/parse", methods=['POST'])
def parse():
	url = request.get_json(force=True)["url"]
	parsed_uri = urlparse( 'http://stackoverflow.com/questions/1234567/blah-blah-blah-blah' )
	domain = '{uri.scheme}://{uri.netloc}/'.format(uri=parsed_uri)

	html = urllib2.urlopen(url)
	soup = BeautifulSoup(html)

	# Get title from h1 
	h1 = soup.find("h1").get_text()
	title = re.sub(r'\W+', ' ', h1)

	# Get page content
	content = soup.find("body")

	if content.find("article"):
		content = content.find("article")


	# Remove tags
	blacklist_tags = ["script", "style", "noscript", "form", "aside", "nav", "footer", "h1", "svg", "header", "input", "textarea"]
	for tag in content.findAll(blacklist_tags):
		tag.extract()

	blacklist_classes = ['topbar', 'nav', 'footer', 'hidden', 'hidden', 'share']
	blacklist_classes_tags = ['div', 'section']
	for tag in content.findAll(blacklist_classes_tags, blacklist_classes):
		tag.extract()

	blacklist_ids = ['footer', 'sidebar', 'navbar']
	for tag in content.findAll(blacklist_classes_tags, id=blacklist_ids):
		tag.extract()

	# Remove Class
	#removeClass(content, ['section', 'div'], 'topbar')
	#removeClass(content, ['section', 'div'], 'nav')
	#removeClass(content, ['section', 'div'], ['footer', 'hidden'])
	#removeClass(content, ['section', 'div'], 'social')
	#removeClass(content, ['section', 'div'], 'share')
	#removeId(content, ['section', 'div'], 'footer')
	#removeId(content, ['section', 'div'], 'sidebar')

	for tag in content.findAll('a'):
		for className in tag['class']:
			if 'btn' in className:
				tag.extract()

	for tag in content.findAll('span'):
		for className in tag['class']:
			if 'btn' in className:
				tag.extract()


	get_img_src(content)

	remove_attrs(content, ['section', 'div'])

	# remove_attrs(content, 'div')
	# Add data to database
	result = db.articles.insert_one({
		"url": url,
		"title": title,
		"content": str(content)
	})
	
	return "Got it."


def removeTag(soup, tagname):
	for tag in soup.findAll(tagname):
		tag.extract()

def removeClass(soup, tagname, className):
	for tag in soup.findAll(tagname, className):
		tag.extract()

def removeId(soup, tagname, idName):
	for tag in soup.findAll(tagname, id=idName):
		tag.extract()

def remove_attrs(soup, tag):
    for tag in soup.findAll(tag):
        tag.attrs = {}
    return soup

def get_img_src(soup):
	for img in soup.findAll('img'):
		src = img['src']
		img.attrs = {}
		img.attrs['src'] = src
	return soup

if __name__ == "__main__":
    app.run(port=5000, debug=True)