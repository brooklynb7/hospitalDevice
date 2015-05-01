'use strict';

var //config = require('../config'),
	session = require('express-session'),
	mongoStore = require('connect-mongo')({
		session: session
	});

module.exports = function(app, db) {
	// Express MongoDB session storage
	app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: 'mean',//config.sessionSecret,
		store: new mongoStore({
			db: db.connections[0].db.databaseName,
			collection: 'collection'//config.sessionCollection
		})
	}));
};