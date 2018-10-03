let gulp        = require('gulp');
let sass        = require('gulp-sass');
let sassLint    = require('gulp-sass-lint');
let cleanCSS    = require('gulp-clean-css');
let rename      = require('gulp-rename');

/**
 * Compile files
 */
 
gulp.task('normal', () => {
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


gulp.task('dev', () => {
  return gulp.src('stylesheets/dev.scss')
    .pipe(sass({
      includePaths: ['scss'],
      onError: sass.logError
   }))
   .pipe(sassLint())
   .pipe(sassLint.format())
   .pipe(sassLint.failOnError())
   .pipe(gulp.dest('css'))
});

gulp.task('test', () => {
  return gulp.src('stylesheets/dev_test.scss')
    .pipe(sass({
      includePaths: ['scss'],
      onError: sass.logError
   }))
   .pipe(sassLint())
   .pipe(sassLint.format())
   .pipe(sassLint.failOnError())
   .pipe(gulp.dest('css'))
});

gulp.task('compress', () => {
  return gulp.src('stylesheets/kunskapsskolanUI.scss')
    .pipe(rename('kunskapsskolanUI.min.scss'))
    .pipe(sass({ 
      outputStyle: 'compressed',
      onError: sass.logError 
   }))
   .pipe(sassLint())
   .pipe(sassLint.format())
   .pipe(sassLint.failOnError())
   .pipe(cleanCSS())
   .pipe(gulp.dest('css'))
});
