'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	mongoose = require('mongoose'),
	Data = mongoose.model('Data'),
	errorHandler = require('./errors');

exports.indexPage = function(req, res) {
	res.render('data/index');
};

exports.doPost = function(req, res) {
	var paramters = req.body;
	var data = new Data({});
	data.data1 = req.body.data1;
	data.data2 = req.body.data2;
	data.data3 = req.body.data3;
	data.data4 = req.body.data4;
	data.data5 = req.body.data5;
	//data.device

	res.json({
		code: 1
	});
};