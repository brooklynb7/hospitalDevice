'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	mongoose = require('mongoose'),
	errorHandler = require('./errors');

exports.indexPage = function(req, res) {
	res.render('data/index');
};