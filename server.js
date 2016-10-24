// Babel ES6/JSX Compiler
require('babel-register');

var swig  = require('swig');
var React = require('react');
var ReactDOM = require('react-dom/server');
var Router = require('react-router');
var routes = require('./app/routes');

var express    = require('express');
var path       = require('path');
var logger     = require('morgan');
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var request    = require('request');

var config  = require("./config/config.js");
var Article = require("./models/articles.js");
var Like = require("./models/Likes.js");

var app = express();

mongoose.connect(config.database);
mongoose.connection.on('error', function() {
  console.info("Could not run mongodb, did you forget to run mongod?");
});


app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

/**
  * POST
  * /register
**/
//app.post('/register', );*

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
app.get('/api/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });
});

app.route('/api/article')

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
	});

app.route('/api/likes')
    .get(function(req, res) {
      Like.find(function(e, likes) {
        if(e) {
          res.status(400).send({ message: 'Could not retrieve likes.' });
        } else {
          var likesIds = likes.map(function(el) {
            return el.article_id;
          });
          console.log(likesIds);
          Article.find({
              '_id': { $in: likesIds}
          },function(err, docs){

              if(e)
                res.status(400).send({ message: 'Could not retrieve liked articles.' });
              else
               res.send(docs);
          });
        }
      });
    });


app.route('/api/like')
    .put(function(req, res) {
      var ArticleLike = new Like({ article_id: req.body.article_id });
      ArticleLike.save(function(err, data) {
        if(err)
          return res.status(400).send({ message: 'XML Parse Error' });

        else
          res.send({ message: "Successfully Added to 'Likes'" });
      });
    });


app.route('/api/unlike')
    .put(function(req, res) {
      Like.find({article_id: req.body.article_id}).remove().exec(function(err) {
        if(err)
          res.status(400).send({ message: "Could not unlike :(" });
        else
          res.send({ message: "Successfully Removed from 'Likes'" });
      });
    });

app.route('/api/articles')

  .get(function(req, res) {
    Article.find().sort([['_id', -1]]).limit(5).exec(function(e, data) {
        //handle result
        if(e) res.send(e)

        res.send(data);
    });
  });


app.route('/api/article/:id')

	.get(function(req, res) {
		Article.findById(req.params.id, function(err, article) {
			if(err)
				res.json({error: err});

			res.json(article);
		});
	});


app.use(function(req, res) {
  Router.match({ routes: routes.default, location: req.url }, function(err, redirectLocation, renderProps) {
    if (err) {
      res.status(500).send(err.message)
    } else if (redirectLocation) {
      res.status(302).redirect(redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
        var html = ReactDOM.renderToString(React.createElement(Router.RoutingContext, renderProps));
        var page = swig.renderFile('views/index.html', { html: html });
        res.status(200).send(page);
    } else {
      res.status(404).send('Page Not Found')
    }
  });
});

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
