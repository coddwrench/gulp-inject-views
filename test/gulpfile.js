"use strict";
var gulp = require('gulp');
var filesort = require('gulp-inject-views');
var sourcemaps = require('gulp-sourcemaps');


gulp.task('inject:tst', function () {
    gulp
        .src('test/Controllers/*.ts')
        .pipe(sourcemaps.init())
        .pipe(filesort({
            controllerPostfix: "Element",
            viewsSrc: "test/Views/*.html",
            property: "_test",
            baseClass: "UiElement"
        }))
        .pipe(sourcemaps.write('test/map'))
        .pipe(gulp.dest('test/build'));
});


gulp.task('default', ['inject:tst']);
