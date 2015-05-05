'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	errorHandler = require('./errors'),
	User = mongoose.model('User');

/* Page controllers */
exports.signupPage = function(req, res) {
	if (req.isAuthenticated()) {
		res.redirect('/');
	} else {
		res.render('users/signup');
	}
};

exports.signinPage = function(req, res) {
	if (req.isAuthenticated()) {
		res.redirect('/');
	} else {
		res.render('users/signin');
	}
};

exports.signoutPage = function(req, res) {
	req.logout();
	req.session.user = null;
	res.redirect('/');
};


exports.listPage = function(req, res) {
	res.render('users/list');
};

exports.profilePage = function(req, res) {
	res.render('users/profile', {
		user: req.session.user
	});
};

exports.requiresLoginPage = function(req, res, next) {
	if (!req.isAuthenticated()) {
		return res.status(401).render('errors/401');
	}

	next();
};

/* API controllers */
exports.signup = function(req, res) {
	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	// Init Variables
	var user = new User(req.body);

	// Add missing user fields
	user.provider = 'local';

	// Then save the user 
	user.save(function(err) {
		if (err) {
			return res.status(400).send(errorHandler.getErrorMessage(err));
		} else {
			doLogin(user, req, res);
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
				doLogin(user, req, res);
			}
		})(req, res, next);
};

var doLogin = function(user, req, res) {
	// Remove sensitive data before login
	user.password = undefined;
	user.salt = undefined;

	req.login(user, function(err) {
		if (err) {
			res.status(400).send(err);
		} else {
			req.session.user = user;
			res.json(user);
		}
	});
};

exports.requiresLoginApi = function(req, res, next) {
	if (!req.isAuthenticated()) {
		return res.status(401).json({
			message: '请先登录'
		});
	}

	next();
};

exports.hasAuthorization = function(roles) {
	var _this = this;

	return function(req, res, next) {
		_this.requiresLogin(req, res, function() {
			if (_.intersection(req.user.roles, roles).length) {
				return next();
			} else {
				return res.status(403).send({
					message: '未授权'
				});
			}
		});
	};
};

exports.getUserList = function(req, res) {
	User.find().sort('userId').select('_id userId username roles provider mobile name email flag')
		.exec(function(err, users) {
			if (err) return res.status(400).send(errorHandler.getErrorMessage(err));
			res.json(users);
		});
};