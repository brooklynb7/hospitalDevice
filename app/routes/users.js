'use strict';

var express = require('express');
var userRouter = express.Router();
var authRouter = express.Router();
var pageRouter = express.Router();
var user = require('../controllers/users');

module.exports = function(app) {
	pageRouter.get('/signin', user.signinPage);
	pageRouter.get('/signup', user.signupPage);
	pageRouter.get('/signout', user.signout);
	pageRouter.get('/profile', user.requiresLogin, user.profilePage);
	pageRouter.get('/users', user.requiresLogin, user.listPage);

	authRouter.post('/signin', user.signin);
	authRouter.post('/signup', user.signup);

	app.use('/api/users', userRouter);
	app.use('/api/auth', authRouter);
	app.use('/', pageRouter);
};