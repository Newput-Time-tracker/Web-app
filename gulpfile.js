// include node modules
var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var inject = require('gulp-inject');

// vendor files
var vendorCSS = [
  'bower_components/open-sans-fontface/open-sans.css',
  'bower_components/bootstrap/dist/css/bootstrap.min.css',
  'bower_components/font-awesome/css/font-awesome.min.css'
];

var vendorScripts = [
  'bower_components/jquery/dist/jquery.min.js',
  'bower_components/bootstrap/dist/js/bootstrap.min.js',
  'bower_components/angular/angular.min.js',
  'bower_components/angular-route/angular-route.min.js',
  'bower_components/angular-cookies/angular-cookies.min.js',
  'bower_components/ngMask/dist/ngMask.min.js',
  'bower_components/moment/min/moment.min.js',
  'app/assets/js/ui-bootstrap-tpls-0.12.1.js'
];

// application files
var applicationCSS = [ 'app/assets/styles/style.scss' ];

var applicationScripts = [
  'app/scripts/app.js',
  'app/scripts/services/httpRequest.js',
  'app/scripts/services/httpProvider.js',
  'app/scripts/services/UserService.js',
  'app/scripts/services/AuthService.js',
  'app/scripts/directives/formFieldDirectives.js',
  'app/scripts/controllers/loginController.js',
  'app/scripts/controllers/datePickerController.js',
  'app/scripts/controllers/signUpController.js',
  'app/scripts/controllers/userTimesheetController.js',
  'app/scripts/controllers/detailViewController.js',
  'app/scripts/controllers/verifyUserController.js',
  'app/scripts/controllers/forgotPasswordController.js',
  'app/scripts/controllers/logoutController.js'
];

// build assets
var buildCssPath = 'public/assets/styles';
var buildJsPath = 'public/assets/js';

// helper functions
var cssTransformFn = function(filepath, file, index, length, targetFile) {
  var path = filepath.replace('/bower_components', 'vendors')
  .replace('/app/assets/styles','dev_css')
  .replace('/public/assets/styles','css');
  return '<link rel="stylesheet" href="' + path + '">';
};

var jsTransformFn = function(filepath, file, index, length, targetFile) {
  var path = filepath.replace('/bower_components', 'vendors')
  .replace('/app/assets/js', 'dev_js')
  .replace('/app/scripts', 'scripts')
  .replace('/public/assets/js','js');;
  return '<script src="' + path + '"></script>';
};

// compile all SCSS files into their CSS versions
gulp.task('compileStyles', function() {
  return gulp.src(applicationCSS)
    .pipe(sass())
    .pipe(gulp.dest('app/assets/styles'));
});

// minify all CSS files and merge into single minified CSS file
gulp.task('prepareAppStyles', ['compileStyles'], function() {
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

//copy web fonts into public
gulp.task('copyFonts', function() {
  return gulp.src(['bower_components/open-sans-fontface/fonts/*/*', 'bower_components/font-awesome/fonts/*', 'bower_components/bootstrap/fonts/*' ])
    .pipe(gulp.dest('public/assets/styles/fonts/'));
});

// prepare the header of index.html file
gulp.task('prepareDevIndex', function () {
  var scripts = vendorScripts.concat(applicationScripts);
  var css = vendorCSS.concat(['app/assets/styles/*.css']);
  var target = gulp.src('app/index.html');
  return target
  .pipe(inject(gulp.src(css, { read: false}), {transform: cssTransformFn}))
  .pipe(inject(gulp.src(scripts, { read: false}), {transform: jsTransformFn}))
  .pipe(gulp.dest('app'));
});

// prepare the header of index.html file
gulp.task('prepareProdIndex', ['prepareVendorAssets', 'prepareAppAssets'], function () {
  var css = [buildCssPath + '/vendor.min.css', buildCssPath + '/application.min.css'];
  var scripts = [buildJsPath + '/vendor.min.js', buildJsPath + '/application.min.js'];
  var target = gulp.src('app/index.html');
  return target
  .pipe(inject(gulp.src(css, { read: false}), {transform: cssTransformFn}))
  .pipe(inject(gulp.src(scripts, { read: false}), {transform: jsTransformFn}))
  .pipe(gulp.dest('app'));
});

// task to prepare all vendor assets
gulp.task('prepareVendorAssets', ['prepareVendorStyles', 'prepareVendorScripts']);

// task to preapre all app level assets
gulp.task('prepareAppAssets', ['compileStyles', 'prepareAppStyles', 'prepareAppScripts']);

// task to build the app for dev enviroment
gulp.task('devBuildApp', ['compileStyles', 'prepareDevIndex']);

// task to build the app for prod enviroment
gulp.task('prodBuildApp', ['copyFonts', 'prepareVendorAssets', 'prepareAppAssets', 'prepareProdIndex']);
