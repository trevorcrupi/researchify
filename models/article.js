var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ArticleSchema = new Schema({
	url: String,
	title: String,
	content: String
});

module.exports = mongoose.model('Article', ArticleSchema);