'use strict';

var express = require('express');
var apiRouter = express.Router();
var pageRouter = express.Router();
var user = require('../controllers/users');
var device = require('../controllers/devices');

module.exports = function(app) {
	pageRouter.get('/', user.requireLoginPage, device.listPage);
	app.use('/devices', pageRouter);

	apiRouter.get('/', user.requireLoginApi, device.getDeviceList);
	apiRouter.post('/', user.requireLoginApi, device.addDevice);
	apiRouter.put('/:deviceIdApi', user.requireLoginApi, device.updateDevice);
	apiRouter.delete('/:deviceIdApi', user.requireLoginApi, device.removeDevice);
	app.use('/api/devices', apiRouter);

	apiRouter.param('deviceIdApi', device.deviceByIdApi);
};