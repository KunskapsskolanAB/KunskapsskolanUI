var gulp        = require('gulp');
var sass        = require('gulp-sass');
var sassLint    = require('gulp-sass-lint');

/**
 * Compile files
 */
gulp.task('sass', function () {
    return gulp.src('stylesheets/kunskapsskolanUI.scss')
        .pipe(sass({
            includePaths: ['scss'],
            onError: sass.logError
        }))
        .pipe(sassLint())
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError())
        .pipe(gulp.dest('css'))
});

gulp.task('compress', function(){
    return gulp.src('stylesheets/kunskapsskolanUI.scss')
        .pipe(sass({ 
            outputStyle: 'compressed',
            onError: sass.logError 
        }))
        .pipe(sassLint())
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError())
        .pipe(rename({
            suffix: "_min"
          }))
        .pipe(gulp.dest('css'))
});