'use strict';

var path = require('path'),
	express = require('express');

module.exports = function(app) {
	// uncomment after placing your favicon in /public
	//app.use(favicon(__dirname + '/public/favicon.ico'));

	// Setting the app router and static folder
	app.use('/static', express.static(path.resolve('./public')));
};