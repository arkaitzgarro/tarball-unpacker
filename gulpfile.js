'use strict'

var gulp = require('gulp')
var plugins = require('gulp-load-plugins')()
var del = require('del')
var isparta = require('isparta')
var path = require('path')

var manifest = require('./package.json')
var mainFile = manifest.main
var config = manifest.babelOptions
var destinationFolder = path.dirname(mainFile)

gulp.task('clean', function (done) {
  del([destinationFolder]).then(function () {
    done()
  })
})

var test = function test () {
  return gulp.src(['test/setup/node.js', 'test/unit/**/*.js'], {read: false})
    .pipe(plugins.mocha({globals: config.mochaGlobals}))
}

gulp.task('coverage', function (done) {
  require('babel-core/register')

  gulp.src(['src/**/*.js', '!src/**/cli.js'])
    .pipe(plugins.istanbul({ instrumenter: isparta.Instrumenter }))
    .pipe(plugins.istanbul.hookRequire())
    .on('finish', function () {
      return test()
        .pipe(plugins.istanbul.writeReports({dir: './reports/coverage'}))
        .on('end', done)
    })
})

gulp.task('test', ['build'], function () {
  require('babel-core/register')

  return test()
})

gulp.task('build', ['clean'], function () {
  return gulp.src(['src/**/*.js', 'bin/**/*.js'])
    .pipe(plugins.plumber())
    .pipe(plugins.babel({presets: ['es2015']}))
    .pipe(gulp.dest(destinationFolder))
})
