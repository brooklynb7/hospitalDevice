'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
	config = require('./config/config'),
	mongoose = require('mongoose'),
	autoIncrement = require('mongoose-auto-increment'),
	path = require('path'),
	moment = require('moment'),
	chalk = require('chalk');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Bootstrap db connection
var db = mongoose.connect(config.db, function(err) {
	if (err) {
		console.error(chalk.red('Could not connect to MongoDB!'));
		console.log(chalk.red(err));
	}
});
console.log(db.connections[0].db.databaseName);
autoIncrement.initialize(db);

// Init the express application
var app = require('./config/express')(db);

// Bootstrap passport config
require('./config/passport')();

// Start the app by listening on <port>
app.listen(config.port, '127.0.0.1');

// Expose app
exports = module.exports = app;

// Logging initialization
console.log('[' + moment().format('YYYY-MM-DD HH:mm:ss') + '] Application started on port ' + config.port);