var gulp        = require('gulp');
var sass        = require('gulp-sass');
var sassLint    = require('gulp-sass-lint');

/**
 * Compile files
 */
gulp.task('sass', function () {
    return gulp.src('_scss/main.scss')
        .pipe(sass({
            includePaths: ['scss'],
            onError: sass.logError
        }))
        .pipe(sassLint())
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError())
        .pipe(gulp.dest('_site/css'))
});
