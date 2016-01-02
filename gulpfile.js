'use strict'

var gulp = require('gulp')
var plugins = require('gulp-load-plugins')()
var del = require('del')
var path = require('path')

var manifest = require('./package.json')
var mainFile = manifest.main
var config = manifest.babelOptions
var destinationFolder = path.dirname(mainFile)

gulp.task('clean', function (done) {
  del([destinationFolder, 'build-test']).then(function () {
    done()
  })
})

gulp.task('test', ['build'], function () {
  require('babel-core/register')

  return gulp.src(['test/setup/node.js', 'test/unit/**/*.js'], {read: false})
    .pipe(plugins.mocha({globals: config.mochaGlobals}))
})

gulp.task('build', ['clean'], function () {
  return gulp.src(['src/**/*.js', 'bin/**/*.js'])
    .pipe(plugins.plumber())
    .pipe(plugins.babel({presets: ['es2015']}))
    .pipe(gulp.dest(destinationFolder))
})
