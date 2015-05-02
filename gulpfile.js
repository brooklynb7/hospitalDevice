'use strict';

var gulp = require('gulp');
var del = require('del');
var through = require('through');
var gutil = require('gulp-util');
var plugins = require('gulp-load-plugins')();

var env = process.env.NODE_ENV || 'development';

var paths = {
	serverViews: ['app/views/**/*.jade'],
	serverJs: ['app/**/*.js', 'config/**/*.js', '*.js'],
	clientViews: [],
	clientJs: ['public/javascripts/**/*.js'],
	clientCss: ['public/stylesheets/**/*.css']
};


function count(taskName, message) {
	var fileCount = 0;

	function countFiles(file) {
		fileCount++; // jshint ignore:line
	}

	function endStream() {
		gutil.log(gutil.colors.cyan(taskName + ': ') + fileCount + ' ' + message || 'files processed.');
		this.emit('end'); // jshint ignore:line
	}
	return through(countFiles, endStream);
}


console.log('Invoking gulp -', env);

gulp.task('help', plugins.taskListing);

gulp.task('clean', function(cb) {
	//return del(['public/libbuild'], cb);
	cb();
});

gulp.task('default', ['clean'], function(cb) {
	// run with paramater
	gulp.start(env);
});

var defaultTasks = ['clean', 'jshint', 'csslint', 'devServe'];

gulp.task('env:development', function() {
	process.env.NODE_ENV = 'development';
});

gulp.task('jshint', function() {
	return gulp.src(paths.serverJs.concat(paths.clientJs))
		.pipe(plugins.jshint())
		.pipe(plugins.jshint.reporter('jshint-stylish'))
		.pipe(plugins.jshint.reporter('fail'))
		.pipe(count('jshint', 'files lint free'));
});

gulp.task('csslint', function() {
	return gulp.src(paths.clientCss)
		.pipe(plugins.csslint('.csslintrc'))
		.pipe(plugins.csslint.reporter())
		.pipe(count('csslint', 'files lint free'));
});

gulp.task('devServe', ['env:development'], function() {
	plugins.nodemon({
		script: 'server.js',
		ext: 'js jade',
		env: {
			'NODE_ENV': 'development'
		},
		ignore: ['node_modules/'],
		nodeArgs: ['--debug']
	});
});

gulp.task('development', defaultTasks);