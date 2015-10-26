// Include gulp
var gulp = require('gulp'); 

// Include Our Plugins
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');

// initialize variables.

var buildCssPath = 'build/assets/styles';
var buildJsPath = 'build/assets/js';
var vendorJsArr = ['bower_components/jquery/dist/jquery.min.js', 
'bower_components/bootstrap/dist/js/bootstrap.min.js', 
'bower_components/angular-route/angular-route.min.js',
'bower_components/angular/angular.min.js', 'bower_components/angular-cookies/angular-cookies.min.js', 
'bower_components/ngMask/dist/ngMask.min.js'];

var applicationJsArr = ['app/scripts/app.js', 
'app/scripts/services/userService.js',
'app/scripts/controllers/loginController.js',
'app/scripts/controllers/signUpController.js',
'app/scripts/controllers/userTimesheetController.js',
'app/scripts/controllers/detalViewController.js',
'app/scripts/controllers/verifyController.js'
];

var vendorCss = ['bower_components/bootstrap/dist/css/bootstrap.min.css', 
'bower_components/open-sans-fontface/open-sans.css'];

// Task only for development environment
gulp.task('generateDevCss', function() {
  return gulp.src('app/assets/styles/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('app/assets/styles'));
});

//Compress vendor css
gulp.task('compressVendorCss', function() {
  return gulp.src(vendorCss)
    .pipe(minifyCss())
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest(buildCssPath));
});

// Compile, concat, and minify vendor js files
gulp.task('minifyjs', function() {
  return gulp.src(vendorJsArr)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(buildJsPath));
});

//compile, concat and minify appication js files
gulp.task('applicationjs', function() {
  return gulp.src(applicationJsArr)
   .pipe(uglify())
   .pipe(concat('application.js'))
   .pipe(gulp.dest(buildJsPath));
});

// copy images .pipe(changed(imgDst))
gulp.task('copyimage', function() {
  return gulp.src('app/assets/images/*.{png, jpg, jpeg}')
    .pipe(gulp.dest('build/assets/images'));
});

//copy index.html pages
gulp.task('copyHtmlPage', function() {
  return gulp.src('app/*.html')
    .pipe(gulp.dest('build'));
});

//copy partials to build
gulp.task('copyPartials', function() {
  return gulp.src('app/views/*.html')
    .pipe(gulp.dest('build/views'));
});

//copy favicon.ico
gulp.task('favicon', function() {
  return gulp.src('app/*.ico')
    .pipe(gulp.dest('build'));
});

// Compile, concat, and minify Our Sass
gulp.task('minifycss', function() {
  return gulp.src('app/assets/styles/*.css')
    .pipe(minifyCss())
    .pipe(gulp.dest(buildCssPath));
 });
