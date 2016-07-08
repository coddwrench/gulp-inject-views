## Installation

Install package with NPM and add it to your development dependencies:

`npm install --save-dev gulp-inject-views`

## Usage

```javascript
var gulp = require('gulp');
var inject = require('gulp-inject-views');

gulp.task('inject', function () {
    gulp
        .src('**/*.js')
        .pipe(inject('**/*.html'))
        .pipe(gulp.dest('build'));
});
```