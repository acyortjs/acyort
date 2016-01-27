
var gulp = require('gulp'),
    cssmin = require('gulp-minify-css'),
    connect = require('gulp-connect');

gulp.task('server', function() {
    return connect.server({
        port: 2222
    })
})

gulp.task('cssmin', function() {
    return gulp.src(['assets/acyort.css'])
        .pipe(cssmin())
        .pipe(gulp.dest('dists/'))
})
