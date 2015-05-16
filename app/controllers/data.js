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
	Device = mongoose.model('Device'),
	errorHandler = require('./errors');

/*
 *	Page controller
 */

var getDeviceListFn = function(cb) {
	Device.find().sort('deviceId').select('deviceId name').exec(cb);
}

exports.indexPage = function(req, res) {
	async.parallel([getDeviceListFn], function(err, results) {
		if (err) return next(err, req, res);

		var deviceList = results[0];
		res.render('data/index', {
			deviceList: deviceList
		});
	});
};

exports.detailPage = function(req, res) {
	async.parallel([getDeviceListFn], function(err, results) {
		if (err) return next(err, req, res);

		var deviceList = results[0];
		res.render('data/detail', {
			deviceList: deviceList
		});
	});
};

/*
 *	API controller
 */

exports.getDataList = function(req, res) {
	var deviceId = req.query.deviceId;
	var date = req.query.date;
	if (!deviceId) {
		return res.status(400).send('缺少设备ID');
	} else if (!date) {
		return res.status(400).send('缺少日期');
	}

	var startTime = moment(date, 'YYYYMMDD');
	var endTime = moment(date, 'YYYYMMDD').add(1, 'days');

	Data.find({
			msgTime: {
				$lt: endTime.toDate(),
				$gte: startTime.toDate()
			},
			deviceId: deviceId
		})
		.sort('-msgTime')
		.exec(function(err, dataList) {
			if (err) return res.status(400).send(errorHandler.getErrorMessage(err));
			res.json(dataList);
		});

};

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
		},
		deviceId: deviceId
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

exports.simulateQualifiedData = function(req, res) {
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

	QualifiedData.remove({
		msgTime: {
			$lt: todayTimestamp,
			$gte: daysAgoTimestamp
		},
		deviceId: deviceId
	}, function(err) {
		if (err) {
			return res.status(400).send(errorHandler.getErrorMessage(err));
		} else {
			var addDataFunctions = [];
			var addDataTimeArray = [];
			var twoHours = 1000 * 60 * 60 * 2;
			for (var i = daysAgoTimestamp; i < todayTimestamp; i = i + twoHours) {
				addDataTimeArray.push(i);
			}
			_.forEach(addDataTimeArray, function(value, index) {
				addDataFunctions.push(function(cb) {
					var qualifiedData = new QualifiedData({
						isQualified: _.inRange(_.random(1, 6), 2),
						deviceId: deviceId,
						msgTime: value
					});
					qualifiedData.save(function(err) {
						cb(err, qualifiedData);
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