var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var uglify = require('gulp-uglify');

var paths = {
  sass: ['assets/scss/**/*.scss'],
  js:   ['assets/js/*.js']
};

gulp.task('default', ['sass', 'concatjs', 'concatcss', 'scripts']);

gulp.task('sass', function(done) {
  gulp.src('assets/scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

var path = 'assets/';

// CONCATENANDO ARQUIVOS DE PLUGINS
gulp.task('concatjs', function(){
  return gulp.src([
    path + 'lib/ionic/js/ionic.bundle.min.js',
  ])
  .pipe(concat('vendor.js'))
  .pipe(gulp.dest('www/dist/js'));
});

gulp.task('concatcss', function(){
  return gulp.src([
    path + 'lib/ladda/dist/ladda.min.css',
  ])
  .pipe(concat('vendor.min.css'))
  .pipe(gulp.dest('www/dist/css'));
});

// CONCATENANDO ARQUIVOS DO PROJETO
gulp.task('scripts', function(){
  return gulp.src([
    path + 'js/*.js',
    // path + 'js/controllers/TabController.js',
    // path + 'js/services/AlertService.js',
  ])
  .pipe(concat('app.js'))
  .pipe(uglify({
    mangle : false
  }))
  .pipe(gulp.dest('www/dist/js'));
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.js, ['scripts']);
  // gulp.watch(path + 'js/controllers/*.js', ['scripts']);
  // gulp.watch(path + 'js/services/*.js', ['scripts']);
  // gulp.watch('www/dist/js/min/*.js', ['minify']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
