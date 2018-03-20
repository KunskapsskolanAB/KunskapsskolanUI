var gulp        = require('gulp');
var sass        = require('gulp-sass');

/**
 * Compile files
 */
gulp.task('sass', function () {
    return gulp.src('_scss/main.scss')
        .pipe(sass({
            includePaths: ['scss'],
            onError: sass.logError
        }))
        .pipe(gulp.dest('_site/css'))
});
