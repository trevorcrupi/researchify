from __future__ import print_function # In python 2.7
from werkzeug.exceptions import NotFound, ServiceUnavailable
from flask import Flask, request, jsonify
#from services import root_dir, nice_json

import nltk
from nltk.tag.stanford import StanfordNERTagger
from nameparser import HumanName

from pymongo import MongoClient
from datetime import datetime
from urllib2 import Request
import sys

#import requests
import urllib2

# lxml Tree Parser
from readability import Document


app = Flask(__name__)

client = MongoClient()
db = client.researchify

@app.route("/parse", methods=['POST'])
def parse():
    url = request.get_json(force=True)["url"]

    req = urllib2.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    htmlData = urllib2.urlopen(req).read()

    doc = Document(htmlData)

    result = db.articles.insert_one({
		"url": url,
		"title": doc.title(),
		"content": doc.summary(True),
		"author": "Trevor Crupi"
	})

    return "Got it."

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
if __name__ == "__main__":
    app.run(port=5000, debug=True)
