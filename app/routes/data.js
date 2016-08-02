'use strict';

var express = require('express');
var apiRouter = express.Router();
var pageRouter = express.Router();
var user = require('../controllers/users');
var data = require('../controllers/data');

module.exports = function(app) {
	pageRouter.get('/', user.requireLoginPage, data.indexPage);
	pageRouter.get('/details', user.requireLoginPage, data.detailPage);
	pageRouter.get('/qualified/details', user.requireLoginPage, data.qualifiedDetailPage);
	app.use('/data', pageRouter);

	apiRouter.get('/', user.requireLoginApi, data.getDataList);
	apiRouter.post('/', data.doPost);
	apiRouter.post('/simulate/:deviceId/:days', user.requireLoginApi, data.simulateData);
	apiRouter.get('/qualified', user.requireLoginApi, data.getQualifiedDataList);
	apiRouter.post('/qualified', user.requireLoginApi, data.doPostQualifed);
	apiRouter.post('/qualified/simulate/:deviceId/:days', user.requireLoginApi, data.simulateQualifiedData);
	app.use('/api/data', apiRouter);
};
