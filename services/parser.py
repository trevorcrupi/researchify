from __future__ import print_function # In python 2.7
from werkzeug.exceptions import NotFound, ServiceUnavailable
#from services import root_dir, nice_json
from flask import Flask, request, jsonify

from pymongo import MongoClient
from bs4 import BeautifulSoup
from datetime import datetime
from urlparse import urlparse
from urllib2 import Request
import nltk
import sys
#import requests
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

	req = urllib2.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
	html = urllib2.urlopen(req).read()
	soup = BeautifulSoup(html)

	# Get title from h1
	title = soup.find("title").get_text()
	title = re.sub(r'\W+', ' ', title)

	# Get page content
	content = soup.find("body")

	if content.find("main"):
		content = content.find("main")

	if content.find("article"):
		content = content.find("article")

	# Find author BEFORE it's blacklisted.
	author = find_author(content, ['div', 'p', 'span', 'a', 'ul', 'li'])

	# Remove tags
	blacklist_tags = ["script", "style", "noscript", "form", "aside", "nav", "footer", "h1", "svg", "header", "input", "textarea", "button", "canvas", "iframe"]
	for tag in content.findAll(blacklist_tags):
		tag.extract()

	blacklist_names_substrings = ['share', 'more', 'btn', 'sidebar', 'social', 'connect', 'widget', 'next', 'comment', 'topbar', 'nav', 'footer', 'hidden', 'share', 'author']
	for tag in content.findAll(['a', 'section', 'div', 'ul', 'li', 'span']):
		if tag.get("class"):
			for className in tag.get("class"):
				for name in blacklist_names_substrings:
					if name in className:
						tag.extract()
		if tag.get("id"):
			for idName in blacklist_names_substrings:
				if idName in tag.get("id"):
					tag.extract()
		if tag.get("style"):
			if 'display:none' in tag.get("style") or 'display: none' in tag.get('style'):
				tag.extract()

		#if "author" in tag.get("class"):
		#	author = find_author(tag.text())

	change_img_ratio(content)

	#remove_attrs(content, ['section', 'div'])

	# remove_attrs(content, 'div')
	# Add data to database
	if not author:
		author = "Unknown Author"

	print(author, file=sys.stderr)
	result = db.articles.insert_one({
		"url": url,
		"title": title,
		"content": str(content),
		"author": author
	})

	return "Got it."


def find_author(soup, tags):
	for tag in soup.findAll(tags):
		if tag.get("class"):
			for className in tag.get("class"):
				if 'author' in className:
					# Add random text in front of name for parser to work correctly. I think it could be an inherent issue with nameparser, not with the scraping.
					author = mine_author("By " + tag.getText())
					if author:
						return author

def mine_author(text):
	if not text:
		return

	st = StanfordNERTagger('stanford-ner/english.all.3class.distsim.crf.ser.gz', 'stanford-ner/stanford-ner.jar')
	tokens = nltk.tokenize.word_tokenize(text)
	pos = nltk.pos_tag(tokens)
	sentt = nltk.ne_chunk(pos, binary = False)
	person_list = []
	person = []
	name = ""
	for subtree in sentt.subtrees(filter=lambda t: t.label() == 'PERSON'):
		for leaf in subtree.leaves():
			person.append(leaf[0])
		if len(person) > 0: #avoid grabbing lone surnames
			for part in person:
				name += part + ' '
			if name[:-1] not in person_list:
				person_list.append(name[:-1])
			name = ''
		person = []

	#print(person_list, file=sys.stderr)
	if not person_list:
		return False

	return ", ".join(person_list)

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

def removeClassTypes(tag):
	for tag in content.findAll('a'):
		for className in tag['class']:
			if 'btn' in className:
				tag.extract()

	for tag in content.findAll('span'):
		for className in tag['class']:
			if 'btn' in className:
				tag.extract()

def change_img_ratio(soup):
	for img in soup.findAll('img'):
		#src = img['src']
		#img.attrs = {}
		#img.attrs['src'] = src
		img.attrs['height'] = 'auto'
		img.attrs['width'] = '100%'
	return soup

if __name__ == "__main__":
    app.run(port=5000, debug=True)
