'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	autoIncrement = require('mongoose-auto-increment'),
	path = require('path'),
	config = require(path.resolve('./config/config')),
	crypto = require('crypto');

/**
 * Data Schema
 */
var DataSchema = new Schema({
	a: {
		type: String,
		trim: true
	},
	b: {
		type: String,
		trim: true
	},
	c: {
		type: String,
		required: 'mandatory',
		trim: true
	},
	d: {
		type: String,
		required: 'mandatory',
		trim: true
	},
	e: {
		type: String,
		required: 'mandatory',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Data', DataSchema);