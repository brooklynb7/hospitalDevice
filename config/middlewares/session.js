'use strict';

var config = require('../config'),
	passport = require('passport'),
	session = require('express-session'),
	mongoStore = require('connect-mongo')({
		session: session
	});

module.exports = function(app, db) {
	// Express MongoDB session storage
	app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: config.sessionSecret,
		store: new mongoStore({
			mongooseConnection: db.connection,
			collection: config.sessionCollection
		}),
		cookie: {
			maxAge: 2 * 60 * 60 * 1000
		}
	}));

	// use passport session
	app.use(passport.initialize());
	app.use(passport.session());

};
