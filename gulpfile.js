"use strict";
var gulp = require('gulp');
var inject = require('./index.js');

gulp.task('inject:class', function () {
    gulp
        .src('test/class/**/*.js')
        .pipe(inject('test/class/**/*.html'))
        .pipe(gulp.dest('test/class/build'));
});


gulp.task('default', ['inject:class']);
