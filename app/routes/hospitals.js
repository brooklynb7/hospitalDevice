'use strict';

var express = require('express');
var apiRouter = express.Router();
var pageRouter = express.Router();
var user = require('../controllers/users');
var hospital = require('../controllers/hospitals');

module.exports = function(app) {
	pageRouter.get('/', user.requireLoginPage, hospital.listPage);
	app.use('/hospitals', pageRouter);
};