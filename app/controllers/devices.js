'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	mongoose = require('mongoose'),
	errorHandler = require('./errors');

exports.listPage = function(req, res) {
	res.render('devices/list');
};