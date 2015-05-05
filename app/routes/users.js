'use strict';

var express = require('express');
var userRouter = express.Router();
var authRouter = express.Router();
var pageRouter = express.Router();
var user = require('../controllers/users');

module.exports = function(app) {
	pageRouter.get('/signin', user.signinPage);
	pageRouter.get('/signup', user.signupPage);
	pageRouter.get('/signout', user.signoutPage);
	pageRouter.get('/profile', user.requiresLoginPage, user.profilePage);
	pageRouter.get('/users', user.requiresLoginPage, user.listPage);
	app.use('/', pageRouter);

	userRouter.get('/', user.requiresLoginApi, user.getUserList);
	app.use('/api/users', userRouter);


	authRouter.post('/signin', user.signin);
	authRouter.post('/signup', user.signup);
	app.use('/api/auth', authRouter);
};