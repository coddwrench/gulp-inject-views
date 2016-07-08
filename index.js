var through = require('through2');
var globule = require('globule');
var gutil = require('gulp-util');
var path = require('path');

var pluginName = "gulp-inject-views";
var Injector = require('./Injector.js');

module.exports = function (options) {

	var views = globule.find((typeof options == "string" ? options : options.viewsSrc) || "*.html").map(function (file) {
		return path.parse(file);
	});

	var controllers = options.controllersSrc ? globule.find(options.controllersSrc).map(function (file) {
		return path.parse(file);
	}) : undefined;

	var injector = new Injector(views, controllers);

	function transform(file, encoding, callback) {
		if (file.isNull()) {
			return callback(null, file);
		}
		if (file.isStream()) {
			throw new gutil.PluginError(pluginName, 'stream not supported');
		}

		if (controllers) {
			var parsedPath = path.parse(file.path.substr(file.cwd.length + 1, file.path.length));
			parsedPath.dir = parsedPath.dir.replace(/\\/g, '/');
			if (!controllers.find(function (element) { return parsedPath.name == element.name && parsedPath.dir == element.dir })) {
				return callback(null, file);
			}
		}

		var result = injector.inject(file);
		file.contents = new Buffer(result.code);

		this.push(file);
		callback();
	}
	return through.obj(transform);
};
