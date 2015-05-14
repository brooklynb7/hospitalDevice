'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	async = require('async'),
	moment = require('moment'),
	mongoose = require('mongoose'),
	Data = mongoose.model('Data'),
	QualifiedData = mongoose.model('QualifiedData'),
	errorHandler = require('./errors');

/*
 *	Page controller
 */

exports.indexPage = function(req, res) {
	res.render('data/index');
};

/*
 *	API controller
 */

exports.doPost = function(req, res) {
	var paramters = req.body;
	var data = new Data({});
	data.data1 = paramters.data1 || null;
	data.data2 = paramters.data2 || null;
	data.data3 = paramters.data3 || null;
	data.data4 = paramters.data4 || null;
	data.data5 = paramters.data5 || null;
	data.deviceId = paramters.deviceId;
	data.msgTime = paramters.msgTime || Date.now();

	data.save(function(err) {
		if (err) {
			return res.status(400).send(errorHandler.getErrorMessage(err));
		} else {
			res.json({
				code: 200,
				msg: 'ok'
			});
		}
	});
};

exports.simulateData = function(req, res) {
	var deviceId = req.params.deviceId;

	if (!deviceId) {
		return res.this.status(400).send('缺少设备ID');
	}

	var days = parseInt(req.params.days);
	if (days === NaN) {
		days = 1;
	}

	var daysAgoTimestamp = moment(moment().subtract(days, 'days').format('YYYY-MM-DD')).valueOf();
	var todayTimestamp = moment(moment().format('YYYY-MM-DD')).valueOf();

	Data.remove({
		msgTime: {
			$lt: todayTimestamp,
			$gte: daysAgoTimestamp
		}
	}, function(err) {
		if (err) {
			return res.status(400).send(errorHandler.getErrorMessage(err));
		} else {
			var addDataFunctions = [];
			var addDataTimeArray = [];
			var fiveMinutes = 1000 * 60 * 5;
			for (var i = daysAgoTimestamp; i < todayTimestamp; i = i + fiveMinutes) {
				addDataTimeArray.push(i);
			}
			_.forEach(addDataTimeArray, function(value, index) {
				addDataFunctions.push(function(cb) {
					var data = new Data({
						data1: _.random(1, 10),
						data2: _.random(1, 10),
						data3: _.random(1, 10),
						data4: _.random(1, 10),
						data5: _.random(1, 10),
						deviceId: deviceId,
						msgTime: value
					});
					data.save(function(err) {
						cb(err, data);
					});
				});
			});

			async.series(addDataFunctions, function(err, results) {
				if (err) {
					return res.status(400).send(errorHandler.getErrorMessage(err));
				} else {
					res.status(200).send('完成');
				}
			});
		}
	});
};

exports.doPostQualifed = function(req, res) {
	var paramters = req.body;
	var qualifiedData = new QualifiedData({});
	qualifiedData.deviceId = paramters.deviceId;
	qualifiedData.msgTime = paramters.msgTime || null;

	qualifiedData.save(function(err) {
		if (err) {
			return res.status(400).send(errorHandler.getErrorMessage(err));
		} else {
			res.json({
				code: 200,
				msg: 'ok'
			});
		}
	});
};