'use strict';

var express = require('express');
var apiRouter = express.Router();
var pageRouter = express.Router();
var user = require('../controllers/users');
var device = require('../controllers/devices');

module.exports = function(app) {
	pageRouter.get('/', device.listPage);

	
	app.use('/api/devices', apiRouter);
	app.use('/devices', pageRouter);
};