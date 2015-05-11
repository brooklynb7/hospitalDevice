'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	autoIncrement = require('mongoose-auto-increment'),
	path = require('path'),
	config = require(path.resolve('./config/config'));

/**
 * Device Schema
 */
var DeviceSchema = new Schema({
	deviceId: {
		type: String,
		trim: true
	},
	name: {
		type: String,
		trim: true
	},
	type: {
		type: String,
		trim: true
	},
	description: {
		type: String,
		trim: true
	},
	updated:{
		type: Date
	},
	updatedBy:{
		type: Schema.Types.ObjectId
	},
	created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Device', DeviceSchema);