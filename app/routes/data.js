'use strict';

var express = require('express');
var apiRouter = express.Router();
var pageRouter = express.Router();
var user = require('../controllers/users');
var data = require('../controllers/data');

module.exports = function(app) {
	pageRouter.get('/', user.requireLoginPage, data.indexPage);

	apiRouter.post('/', user.requireLoginApi, data.doPost);
	apiRouter.post('/simulate/:deviceId/:days', user.requireLoginApi, data.simulateData);
	apiRouter.post('/qualified', user.requireLoginApi, data.doPostQualifed);

	app.use('/api/data', apiRouter);
	app.use('/data', pageRouter);
};