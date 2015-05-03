'use strict';

var path = require('path'),
	compress = require('compression'),
	express = require('express');

module.exports = function(app) {
	// Should be placed before express.static
	app.use(compress({
		filter: function(req, res) {
			return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
		},
		level: 9
	}));
	// uncomment after placing your favicon in /public
	//app.use(favicon(__dirname + '/public/favicon.ico'));

	// Setting the app router and static folder
	app.use('/static', express.static(path.resolve('./public')));
};