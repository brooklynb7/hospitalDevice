'use strict';

module.exports = {
	app: {
		title: '设备管理',
		description: '设备管理',
		keywords: ''
	},
	port: process.env.PORT || 9101,
	roles: {
		all: '*',
		user: 'user',
		service: 'service',
		admin: 'admin',
		super: 'super'
	},
	templateEngine: 'jade',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions'
};