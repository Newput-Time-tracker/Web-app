// include node modules
var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');

// vendor files
var vendorCSS = [
  'bower_components/open-sans-fontface/open-sans.css',
  'bower_components/bootstrap/dist/css/bootstrap.min.css'
];

var vendorScripts = [
  'bower_components/jquery/dist/jquery.min.js',
  'bower_components/bootstrap/dist/js/bootstrap.min.js',
  'bower_components/angular/angular.min.js',
  'bower_components/angular-route/angular-route.min.js',
  'bower_components/angular-cookies/angular-cookies.min.js',
  'bower_components/ngMask/dist/ngMask.min.js',
];

// application files
var applicationScripts = [
  'app/scripts/app.js',
  'app/scripts/services/userService.js',
  'app/scripts/controllers/loginController.js',
  'app/scripts/controllers/signUpController.js',
  'app/scripts/controllers/userTimesheetController.js',
  'app/scripts/controllers/detalViewController.js',
  'app/scripts/controllers/verifyController.js'
];

var srcArr = ['app/index.html', 'app/favicon.ico', 'app/404.html'];

// build assets
var buildCssPath = 'build/assets/styles';
var buildJsPath = 'build/assets/js';

// compile all SCSS files into their CSS versions
gulp.task('compileStyles', function() {
  return gulp.src('app/assets/styles/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('app/assets/styles'));
});

// minify all CSS files and merge into single minified CSS file
gulp.task('prepareAppStyles', function() {
  return gulp.src('app/assets/styles/*.css')
    .pipe(minifyCss())
    .pipe(concat('application.min.css'))
    .pipe(gulp.dest(buildCssPath));
 });

// minify and merge all app JS into single JS file
gulp.task('prepareAppScripts', function() {
  return gulp.src(applicationScripts)
   .pipe(uglify())
   .pipe(concat('application.min.js'))
   .pipe(gulp.dest(buildJsPath));
});

// merge all vendor CSS into single CSS file
gulp.task('prepareVendorStyles', function() {
  return gulp.src(vendorCSS)
    .pipe(concat('vendor.min.css'))
    .pipe(gulp.dest(buildCssPath));
});

// merge all vendor JS into single JS file
gulp.task('prepareVendorScripts', function() {
  return gulp.src(vendorScripts)
    .pipe(concat('vendor.min.js'))
    .pipe(gulp.dest(buildJsPath));
});

// copy images into build directory
gulp.task('copyImage', function() {
  return gulp.src('app/assets/images/*.{png, jpg, jpeg}')
    .pipe(gulp.dest('build/assets/images'));
});

//copy partials into build directory
gulp.task('copyPartials', function() {
  return gulp.src('app/views/*.html')
    .pipe(gulp.dest('build/views'));
});

//copy app level files into build directory
gulp.task('copyFiles', function() {
  return gulp.src(srcArr)
    .pipe(gulp.dest('build'));
});

// task to copy all files into build directory
gulp.task('copyAppFiles', ['copyImage', 'copyPartials', 'copyFiles']);

// task to prepare all vendor assets
gulp.task('prepareVendorAssets', ['prepareVendorStyles', 'prepareVendorScripts']);

// task to preapre all app level assets
gulp.task('prepareAppAssets', ['compileStyles', 'prepareAppStyles', 'prepareAppScripts']);

// task to build the app
gulp.task('buildApp', ['copyAppFiles', 'prepareVendorAssets', 'prepareAppAssets']);
