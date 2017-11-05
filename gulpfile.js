var gulp = require('gulp'),
    //sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del');
    htmlmin = require('gulp-htmlmin');


gulp.task('html', function() {
  return gulp.src('*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist/'))
    .pipe(notify({ message: 'html task complete' }));
});

gulp.task('styles', function() {
    return gulp.src('src/styles/main.css')
        .pipe(cssnano())
        .pipe(gulp.dest('dist/src/styles'))
        .pipe(notify({ message: 'Styles task complete' }));
});


gulp.task('scripts', function() {
  return gulp.src('src/scripts/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/src/scripts'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/src/scripts'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('images', function() {
  return gulp.src('src/img/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/src/img'))
    .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('clean', function() {
    return del(['dist/src/css', 'dist/src/js', 'dist/src/img']);
});

gulp.task('watch', function() {

  // Watch .scss files
  gulp.watch('src/styles/**/*.css', ['styles']);

  // Watch .js files
  gulp.watch('src/scripts/**/*.js', ['scripts']);

  // Watch image files
  gulp.watch('src/img/**/*', ['images']);
  
  // Create LiveReload server
  livereload.listen();

  // Watch any files in dist/, reload on change
  gulp.watch(['dist/**']).on('change', livereload.changed);

});

gulp.task('build', ['clean','html', 'styles', 'scripts', 'images']);

gulp.task('default', ['connect', 'watch'], function(){
   return gutil.log('Gulp is running!')
});