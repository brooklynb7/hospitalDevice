'use strict';

var config = require('../config'),
	path = require('path');

module.exports = function(app) {
	app.use(function(req, res, next) {
		res.locals.url = {
			original: req.originalUrl,
			base: req.baseUrl,
			path: req.path
		};

		next();
	});

	config.getGlobbedFiles('./app/models/**/*.js').forEach(function(modelPath) {
		require(path.resolve(modelPath));
	});

	config.getGlobbedFiles('./app/routes/**/*.js').forEach(function(routePath) {
		require(path.resolve(routePath))(app);
	});
};