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
			db: db.connections[0].db.databaseName,
			collection: config.sessionCollection
		})
	}));

	// use passport session
	app.use(passport.initialize());
	app.use(passport.session());

};