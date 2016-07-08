var path = require('path');
var fs = require("fs");
var htmlmin = require('html-minifier');

var Injector = (function () {
	Injector.prototype.views = [];
	Injector.prototype.rReplase = /(\{\{\s*?load\s+?(path\s*?=\s*?[']+([\w\W]+?)[']+)\s*?\}\})|(\{\{\s*?load\s*?\}\})/g;

	function Injector(views) {
		this.views = views;
	}

	Injector.prototype.getFile = function (viewPath) {
		var stat = fs.statSync(viewPath);
		if (stat.isFile()) {
			var text = fs.readFileSync(viewPath, 'utf8');
			var result = htmlmin.minify(text, { collapseWhitespace: true, preventAttributesEscaping: true });
			return result;
		} else {
			return "";
		}
	}

	Injector.prototype.unixStylePath = function (filePath) {
		return filePath.replace(/\\/g, '/');
	}

	Injector.prototype.parse = function (contents) {
		var match = this.rReplase.exec(contents);
		var result = [];
		while (match != null) {
			if (match[4]) {
				gutil.log(pluginName, 'not support', gutil.colors.magenta('123'));
			} else {
				var lines = contents.substr(0, match.index + match[1].length).split('\n');
				var lineIndex = lines.length > 0 ? lines.length - 1 : 0;
				var line = lines[lineIndex];
				var column = lines[lineIndex];
				result.push(
					{
						path: this.unixStylePath(match[3]),
						start: match.index,
						length: match[1].length,
						startLine: lineIndex,
						startColumn: line.indexOf(match[0]),
					}
				);
			}
			match = this.rReplase.exec(contents);
		}
		return result;
	}

	Injector.prototype.inject = function (file, options) {
		var contents = String(file.contents);
		var result = contents;
		var lines = this.parse(contents);
		var map = null;
		var indexOffset = 0;
		for (var index = 0; index < lines.length; index++) {
			var value = lines[index];
			var parsedPath = path.parse(value.path);
			var viewPath = this.views ? this.views.find((element) => {
				return parsedPath.name == element.name && parsedPath.dir == element.dir
			}) : parsedPath;
			var html = this.getFile(value.path);
			html = html.replace(/["]/g, "\\\"");
			result = result.substr(0, value.start + indexOffset) + html + result.substr(value.start+ indexOffset + value.length);
			indexOffset += html.length - value.length ;
		}

		return {
			map: map ? map.toString() : null,
			code: result
		}
	};

	return Injector;
} ());
module.exports = Injector;