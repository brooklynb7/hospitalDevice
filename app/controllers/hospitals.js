'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	mongoose = require('mongoose'),
	errorHandler = require('./errors');

/*
 * Page controllers
 */

exports.listPage = function(req, res) {
	res.render('hospitals/list');
};

/*
 * API controllers
 */