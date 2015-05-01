'use strict';

/**
 * Module dependencies.
 */
var http = require('http'),
	express = require('express'),
	flash = require('connect-flash'),
	config = require('./config'),
	middleware = require('./middlewares');

module.exports = function(db) {
	// Initialize express app
	var app = express();
	app.use(flash());

	middleware.locals(app);
	middleware.template(app);
	middleware.parser(app);
	middleware.session(app, db);
	middleware.helmet(app);
	middleware.staticFile(app);
	middleware.logger(app);
	middleware.router(app);
	middleware.errorHandler(app);
	middleware.https(app);

	// Return Express server instance
	return app;
};