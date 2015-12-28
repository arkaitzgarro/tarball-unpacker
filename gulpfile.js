'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var path = require('path');

var manifest = require('./package.json');
var mainFile = manifest.main;
var config = manifest.babelOptions;
var destinationFolder = path.dirname(mainFile);

var createLintTask = function createLintTask(taskName, files) {
    gulp.task(taskName, function() {
        require('babel-core/register');

        return gulp.src(files)
            .pipe(plugins.plumber())
            .pipe(plugins.jshint())
            .pipe(plugins.jshint.reporter('jshint-stylish'));
    });
};

var test = function test() {
    return gulp.src(['test/setup/node.js', 'test/unit/**/*.js'], {read: false})
        .pipe(plugins.mocha({globals: config.mochaGlobals}));
};

// Lint source code
createLintTask('lint-src', ['src/**/*.js']);

// Lint test code
createLintTask('lint-test', ['test/**/*.js', '!test/resources/**/*']);

gulp.task('test', ['lint-test', 'lint-src'], function() {
    require('babel-core/register');

    return test();
});
