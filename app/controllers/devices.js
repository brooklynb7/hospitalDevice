'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	mongoose = require('mongoose'),
	Device = mongoose.model('Device'),
	errorHandler = require('./errors');

/*
 * Page controllers
 */

exports.listPage = function(req, res) {
	res.render('devices/list');
};

/*
 * API controllers
 */
exports.getDeviceList = function(req, res) {
	Device.find().sort('deviceId').select('_id deviceId name type description')
		.exec(function(err, users) {
			if (err) return res.status(400).send(errorHandler.getErrorMessage(err));
			res.json(users);
		});
};

exports.addDevice = function(req, res) {
	var device = new Device(req.body);

	device.save(function(err) {
		if (err) {
			return res.status(400).send(errorHandler.getErrorMessage(err));
		} else {
			res.json(device);
		}
	});
};


exports.updateDevice = function(req, res) {
	var device = req.deviceInfo;
	device.name = req.body.name;
	device.type = req.body.type;
	device.description = req.body.description;
	device.updated = Date.now();
	device.updatedBy = req.user;

	device.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(device);
		}
	});
};

exports.removeDevice = function(req, res){
	var device = req.deviceInfo;
	device.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(device);
		}
	});
};

/* Device id api middleware */
exports.deviceByIdApi = function(req, res, next, id) {
	Device.findById(id).exec(function(err, device) {
		if (err) return res.json(err);
		if (!device) return res.status(400).json({
			message: '未找到该设备'
		});
		req.deviceInfo = device;
		next();
	});
};