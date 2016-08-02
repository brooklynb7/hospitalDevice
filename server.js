'use strict';
/**
 * Module dependencies.
 */
const path = require('path'),
	init = require(path.resolve('./config/init'))(),
	config = require(path.resolve('./config/config')),
	mongoose = require('mongoose'),
	autoIncrement = require('mongoose-auto-increment'),
	moment = require('moment'),
	chalk = require('chalk');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Bootstrap db connection
var db = mongoose.connect(config.db, config.dbOptions, function(err) {
	if (err) {
		console.error(chalk.red('Could not connect to MongoDB!'));
		console.log(chalk.red(err));
	}
});
autoIncrement.initialize(db);

// Init the express application
var app = require(path.resolve('./config/express'))(db);

// Bootstrap passport config
require(path.resolve('./config/passport'))();

// Start the app by listening on <port>
app.listen(config.port);

// Expose app
exports = module.exports = app;

// Logging initialization
console.log('[' + moment().format('YYYY-MM-DD HH:mm:ss') + '] Application started on port ' + config.port);
