'use strict';

var gulp = require('gulp');

var env = process.env.NODE_ENV || 'development';

console.log('Invoking gulp -', env);

gulp.task('default', ['clean'], function(defaultTasks) {
	// run with paramater
	gulp.start(env);
});