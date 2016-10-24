var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var LikeSchema = new Schema({
	article_id: String,
});

module.exports = mongoose.model('Like', LikeSchema);
