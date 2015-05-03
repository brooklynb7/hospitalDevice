'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	errorHandler = require('./errors'),
	User = mongoose.model('User');

exports.signupPage = function(req, res) {
	res.render('users/signup');
};

exports.signinPage = function(req, res) {
	res.render('users/signin');
};

exports.signoutPage = function(req, res) {
	res.send('sign out');
};


exports.signup = function(req, res) {
	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	// Init Variables
	var user = new User(req.body);
	var message = null;

	// Add missing user fields
	user.provider = 'local';

	// Then save the user 
	user.save(function(err) {
		if (err) {
			return res.status(400).send(errorHandler.getErrorMessage(err));
		} else {
			// Remove sensitive data before login
			user.password = undefined;
			user.salt = undefined;

			req.login(user, function(err) {
				if (err) {
					res.status(400).send(err);
				} else {
					res.json(user);
				}
			});
		}
	});
};

exports.signin = function(req, res, next) {
	passport.authenticate('local', {
			badRequestMessage: '请输入用户名和密码'
		},
		function(err, user, info) {
			if (err || !user) {
				res.status(400).send(info);
			} else {
				// Remove sensitive data before login
				user.password = undefined;
				user.salt = undefined;

				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.json(user);
					}
				});
			}
		})(req, res, next);
};

/**
 * Signout
 */
exports.signout = function(req, res) {
	req.logout();
	res.redirect('../');
};