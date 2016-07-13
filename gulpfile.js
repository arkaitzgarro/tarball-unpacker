'use strict'

var gulp = require('gulp')
var plugins = require('gulp-load-plugins')()
var del = require('del')
var path = require('path')

var manifest = require('./package.json')
var mainFile = manifest.main
var destinationFolder = path.dirname(mainFile)

gulp.task('clean', function (done) {
  del([destinationFolder]).then(function () {
    done()
  })
})

gulp.task('build', ['clean'], function () {
  return gulp.src(['src/**/*.js', 'bin/**/*.js'])
    .pipe(plugins.plumber())
    .pipe(plugins.babel({presets: ['es2015']}))
    .pipe(gulp.dest(destinationFolder))
})
