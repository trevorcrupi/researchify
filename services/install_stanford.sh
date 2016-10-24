#!/bin/bash

echo " . . . Downloading file stanford-ner-2014-08-27.zip"
# NOTE: need to update link for further versions
wget http://nlp.stanford.edu/software/stanford-ner-2014-08-27.zip

echo " . . . Unpacking stanford-ner-2014-08-27.zip"
unzip stanford-ner-2014-08-27.zip

mkdir stanford-ner
cp stanford-ner-2014-08-27/stanford-ner.jar stanford-ner/stanford-ner.jar
cp stanford-ner-2014-08-27/classifiers/english.all.3class.distsim.crf.ser.gz stanford-ner/english.all.3class.distsim.crf.ser.gz
cp stanford-ner-2014-08-27/classifiers/english.all.3class.distsim.prop stanford-ner/english.all.3class.distsim.prop

echo " . . . Clearing all"
rm -rf stanford-ner-2014-08-27 stanford-ner-2014-08-27.zip

echo " . . . Preparing Python test file simple.py"
touch simple.py
# import Stanford NER for NLTK (avaaible from 2.0 ver)
echo "from nltk.tag.stanford import StanfordNERTagger" >> simple.py
# initialize SNER using copied files
echo "st = StanfordNERTagger('stanford-ner/english.all.3class.distsim.crf.ser.gz', 'stanford-ner/stanford-ner.jar')" >> simple.py
# add test to see weather it works
echo "print st.tag('You can call me Billiy Bubu and I live in Amsterdam.'.split())" >> simple.py

chmod +x simple.py

echo " . . . Executing Python test file simple.py"
python simple.py

echo " . . . Isn't it cool? :)"
