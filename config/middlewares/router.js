'use strict';

var path = require('path'),
	routes = require(path.resolve('./app/routes/index')),
	users = require(path.resolve('./app/routes/users'));

module.exports = function(app) {
	app.use(function(req, res, next) {
		res.locals.url = {
			original: req.originalUrl,
			base: req.baseUrl,
			path: req.path
		};
		next();
	});
	app.use('/', routes);
	app.use('/users', users);
};