var gulp = require('gulp'),
    cssnano = require('gulp-cssnano'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del'),
    htmlmin = require('gulp-htmlmin'),
    connect = require('gulp-connect'),
    gutil = require('gulp-util'),
    watch = require('gulp-watch'),
    ghPages = require('gulp-gh-pages');


/*#######   Build tasks  ######*/


gulp.task('markup', function() {
  return gulp.src('*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(htmlmin({removeComments: true}))
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
    //.pipe(jshint('.jshintrc'))
    //.pipe(jshint.reporter('default'))
    //.pipe(concat('main.js'))
    //.pipe(gulp.dest('dist/src/scripts'))
    //.pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/src/scripts'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('images', function() {
  return gulp.src('src/img/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/src/img'));
    //.pipe(notify({ message: 'Images task complete' }));
});

gulp.task('lib-copy', function (){
  return gulp.src('lib/**/*')
     .pipe(gulp.dest('dist/lib'))
     .pipe(notify({ message: 'lib-copy task complete' }));
});

gulp.task('clean', function() {
    return del(['dist/lib/**/*, dist/src/**/*']);
});


gulp.task('config-copy', function (){
  return gulp.src(['browserconfig.xml', 'CNAME', 'manifest.json'])
     .pipe(gulp.dest('dist/'))
     .pipe(notify({ message: 'config-copy task complete' }));
});


/*### Dev Tasks  ###*/
gulp.task('watch', function() {
  // Watch .css files
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

gulp.task('connect', function() {
  connect.server({
    livereload: true
  });
});

 //Watch files for Livereload
gulp.task('watch', function (){
  //watch html files
  gulp.watch(['./*.html'], ['html']);
  //watch css files
  gulp.watch(['./src/**/*.css'],['css']);
  //watch js files
  gulp.watch(['./src/**/*.js'],['js'])
});

//Live watching and reloading of html and css
gulp.task('html', function (){
  gulp.src('./*.html')
    .pipe(connect.reload());
});
gulp.task('css',function(){
  gulp.src('./src/**/*.css')
    .pipe(connect.reload());
});
gulp.task('js',function(){
  gulp.src('./src/**/*.js')
    .pipe(connect.reload());
});

/*##### Ops tasks #####*/
//Minifies and optimizes code for site
gulp.task('build', ['clean','markup', 'styles', 'scripts', 'images', 'lib-copy', 'config-copy']);

gulp.task('deploy', function() {
   return gulp.src('dist/**/*')
    .pipe(ghPages());
});

// Default task.  Serves the app during development.  Enter 'gulp' on the command line.
gulp.task('default', ['connect', 'watch'], function(){
   return gutil.log('Gulp is running!')
});