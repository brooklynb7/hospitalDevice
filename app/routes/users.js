'use strict';

var express = require('express');
var router = express.Router();

module.exports = function(app) {
	/* GET home page. */
	router.get('/', function(req, res, next) {
		res.send('Users');
	});

	app.use('/users', router);
};