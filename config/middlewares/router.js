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
		res.locals._ = require('lodash');
		res.locals.moment = require('moment');
		res.locals.roles = config.roles;
		res.locals.session = req.session;

		next();
	});

	config.getGlobbedFiles('./app/models/**/*.js').forEach(function(modelPath) {
		require(path.resolve(modelPath));
	});

	config.getGlobbedFiles('./app/routes/**/*.js').forEach(function(routePath) {
		require(path.resolve(routePath))(app);
	});
};