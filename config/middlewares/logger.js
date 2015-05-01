'use strict';

var morgan = require('morgan'),
	moment = require('moment');

morgan.token('logTime', function(req, res) {
	return moment().format('YYYY-MM-DD h:mm:ss');
});

var format = {
	dev: 'dev',
	manual: '[:logTime] :remote-addr :method :url :status :res[content-length] -:response-time ms'
};

module.exports = function(app) {
	// Showing stack errors
	app.set('showStackError', true);
	app.use(morgan(format.manual));
	// Environment dependent middleware
	if (process.env.NODE_ENV === 'development') {
		// Enable logger (morgan)
		//app.use(morgan('dev'));
		// Disable views cache
		app.set('view cache', false);
	} else if (process.env.NODE_ENV === 'production') {
		app.locals.cache = 'memory';
	}
};