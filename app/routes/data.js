'use strict';

var express = require('express');
var apiRouter = express.Router();
var pageRouter = express.Router();
var user = require('../controllers/users');
var data = require('../controllers/data');

module.exports = function(app) {
	pageRouter.get('/', user.requireLoginPage, data.indexPage);

	apiRouter.post('/', data.doPost);
	
	app.use('/api/data', apiRouter);
	app.use('/data', pageRouter);
};