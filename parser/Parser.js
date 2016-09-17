
var Parser = function() {
	this.content = '';
}

Parser.prototype.parse = function($) {
	if($("article").length) {
		var el = $("article"); 
		this.removeChild($, "article", ".hidden");
		this.removeChild($, "article", "h1");
		return el.html();
	}

	if($(".content").length) {
		var el = $(".content");
		this.removeChild($, ".content", ".hidden");
		this.removeChild($, ".content", "h1");
		this.removeChild($, ".content", ".top-block");
		return el.html();
	}
}

Parser.prototype.removeChild = function($, parent, child) {
	$(parent + " " + child).remove();
}

module.exports = new Parser();