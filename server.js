// Babel ES6/JSX Compiler
require('babel-register');

var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');
var cheerio    = require('cheerio');
var request    = require('request');
var swig       = require('swig');
var config     = require('./config/config');
var mongoose   = require('mongoose');
var parser     = require('./parser/Parser');
var path       = require('path');

mongoose.connect(config.database); // connect to our database
var Article = require('./models/article');

// configure app

// configure body parser
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('json spaces', 2);
app.use(morgan('dev'));

var port = process.env.PORT || 3000; // set our port

var api = express.Router();
var router = express.Router();

router.get('/', function(req, res) {
	Article.find(function(err, articles) {
		if(err)
			res.send(err);
		var page = swig.renderFile('views/list.html', { articles: articles });
		res.status(200).send(page);
	});
});

router.get('/article/:id', function(req, res) {
	Article.findById(req.params.id, function(err, article) {
		if(err)
			res.status(404).send("<h1>We're having trouble finding this title right now. Sorry!</h1>");


		var page = swig.renderFile('views/article.html', { article: article });
		res.status(200).send(page);
	});
});

// middleware to use for all requests
api.use(function(req, res, next) {
	// do logging
	console.log('Request is coming in.');
	next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
api.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });	
});

api.route('/article')

	.post(function(req, res) {
	  //All the web scraping magic will happen here
	 	//var data = {};
	  	//data.url = req.body.url;

		var options = {
		  //uri: 'http://localhost:5000/parse',
		  method: 'POST',
		  json: {
		    "url": req.body.url
		  }
		};

		// Check if url contains .pdf
		if(req.body.url.indexOf('.pdf') !== -1) {
			options.uri = 'http://localhost:5001/parse';
		  	request.post(options, function(error, response, body) {
		        if (!error && response.statusCode == 200) {
		            console.log(body);
		        }
		  	});			
		} else {
			options.uri = 'http://localhost:5000/parse';
		  	request.post(options, function(error, response, body) {
		        if (!error && response.statusCode == 200) {
		            console.log(body);
		        }
		  	});
		}
	})

	.get(function(req, res) {
		Article.find(function(err, articles) {
			if(err)
				res.send(err);

			res.json(articles);
		});
	});

api.route('/article/:id')

	.get(function(req, res) {
		Article.findById(req.params.id, function(err, article) {
			if(err)
				res.json({error: err});
			
			res.json(article);
		});
	});



// REGISTER OUR ROUTES -------------------------------
app.use('/api', api);
app.use('/', router);

app.listen('3000')
console.log('Magic happens on port 3000');
exports = module.exports = app;