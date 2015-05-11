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
	data1: {
		type: String,
		trim: true
	},
	data2: {
		type: String,
		trim: true
	},
	data3: {
		type: String,
		required: 'mandatory',
		trim: true
	},
	data4: {
		type: String,
		required: 'mandatory',
		trim: true
	},
	data5: {
		type: String,
		required: 'mandatory',
		trim: true
	},
	device: {
		type: Schema.Types.ObjectId,
		ref: 'Device'
	},
	msgTime: {
		type: Date,
		default: Date.now
	},
	created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Data', DataSchema);