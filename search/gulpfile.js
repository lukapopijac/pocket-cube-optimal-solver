var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var express = require('express');

gulp.task('build', function () {
    return browserify({entries: 'search.js', debug: true})
        .transform(babelify, {presets: ['es2015']})
        .bundle()
		.on('error', function(err) {console.log(err.toString()); this.emit('end');})
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('.'));
});

gulp.task('server', function() {
	var app = express();
	app.use(express.static('.'));
	app.listen(1234);
});

gulp.task('watch', function() {
	gulp.watch('*.js', ['build']);
});

gulp.task('default', ['build', 'server', 'watch']);
