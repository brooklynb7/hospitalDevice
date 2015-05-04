'use strict';

var express = require('express');
var apiRouter = express.Router();
var pageRouter = express.Router();
var user = require('../controllers/users');
var data = require('../controllers/data');

module.exports = function(app) {
	pageRouter.get('/', data.indexPage);
	
	app.use('/api/data', apiRouter);
	app.use('/data', pageRouter);
};