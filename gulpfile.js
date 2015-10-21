// Include gulp
var gulp = require('gulp'); 

// Include Our Plugins
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var path = 'app/assets/';
var buildCssPath = 'build/css';
var buildJsPath = 'build/js';
var components = 'bower_components/' ; 
var pathArr = [components+'jquery/dist/jquery.min.js', 
components+'bootstrap/dist/js/bootstrap.min.js', 
components+'angular-route/angular-route.min.js', components+'angular/angular.min.js'];
var appjs = 'app/scripts/';

// Compile, concat, and minify Our Sass

gulp.task('minifycss', function() {
  return gulp.src(path+'styles/**/*.scss')
  .pipe(concat('.min.css'))
	  .pipe(minifyCss({
		  	relativeTo: '../bower_components',
	    processImport: true
	  }))
	  .pipe(gulp.dest(buildCssPath));
});


gulp.task('tempTask', function() {
  return gulp.src(path+'styles/**/*.scss')
  .pipe(sass())
  .pipe(gulp.dest(path+'styles'));
});

gulp.task('compressVendorCss', function() {
  return gulp.src(components+'bootstrap/dist/css/bootstrap.min.css')
  .pipe(rename('vendor.min.css'))
  .pipe(gulp.dest(buildCssPath));
});

// Compile, concat, and minify Our js

gulp.task('minifyjs', function() {
  return gulp.src(pathArr)
	  .pipe(uglify())
	  .pipe(concat('vendor.js'))
	  .pipe(gulp.dest(buildJsPath));
});

//compile appication js

gulp.task('applicationjs', function() {
	return gulp.src(appjs+'app.js')
	 .pipe(addsrc.append(appjs+'services/*.js'))
	 .pipe(addsrc.append(appjs+'controllers/*.js'))
	 .pipe(uglify())
	 .pipe(concat('application.js'))
	 .pipe(gulp.dest(build+'js'));
});

// copy images .pipe(changed(imgDst))
gulp.task('copyimage', function() {
  var imgSrc = path+'images/**/*',
      imgDst = build+'images';
  gulp.src(imgSrc)
    //.pipe(imagemin())
    .pipe(gulp.dest(imgDst));
});

//copy index.html page

gulp.task('copyindexpage', function() {
   return gulp.src('app/*.html')
     //.pipe(minifyHTML())
     .pipe(gulp.dest('build'));
	
});

gulp.task('copyviewfiles', function() {
   return gulp.src('app/views/*.html')
     //.pipe(minifyHTML())
     .pipe(gulp.dest(build+'views'));
	
});