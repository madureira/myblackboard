var gulp            = require('gulp');
var clean           = require('gulp-clean');
var cssmin          = require('gulp-cssmin');
var exec            = require('gulp-exec');
var insert          = require('gulp-insert');
var gutil           = require('gulp-util');
var less            = require('gulp-less');
var rename          = require('gulp-rename');
var replace         = require('gulp-replace');
var path            = require('path');
var browserify      = require('browserify');
var source          = require('vinyl-source-stream');
var buffer          = require('vinyl-buffer');
var sourcemaps      = require('gulp-sourcemaps');
var uglify          = require('gulp-uglify');
var watchify        = require('watchify');
var assign          = require('lodash/assignWith');
var fs              = require('fs');

var SETTINGS = {
  BUILD_DIR: 'dist',
  IMAGES_DIR: 'src/images',
  MAIN_JS: 'src/js/app.js',
  MAIN_CSS: 'src/less/app.less',
  MAIN_HTML: 'src/index.html',
  VENDORS: JSON.parse(fs.readFileSync('vendors.json', 'utf8')),
  LESS_VENDORS: 'src/less/vendors/index.less'
};

function compile(watch) {
  var customOpts = {
    entries: [SETTINGS.MAIN_JS],
    debug: true
  };

  var opts = assign({}, watchify.args, customOpts),
    bundler = browserify(opts);

  SETTINGS.VENDORS.forEach(function(vendor) {
    bundler.external(vendor);
  });

  bundler.transform('babelify', { presets: ['es2015', 'react'] });

  function bundle() {

    return bundler.bundle()
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source('bundle.min.js'))
      .pipe(buffer())
      //.pipe(uglify()) // uglify js
      .pipe(gulp.dest(SETTINGS.BUILD_DIR + '/js'));
  }

  if (watch) {
    bundler = watchify(bundler)
    .on('update', bundle)
    .on('log', gutil.log);
  }

  return bundle();
}

gulp.task('clean', function () {
  return gulp.src(SETTINGS.BUILD_DIR, { read: false }).pipe(clean());
});

gulp.task('vendors', function () {
  var stream = browserify({
    debug: false,
    require: SETTINGS.VENDORS
  });

  stream.bundle()
  .pipe(source('vendors.min.js'))
  .pipe(buffer())
  //.pipe(uglify())
  .pipe(gulp.dest(SETTINGS.BUILD_DIR + '/js'));

  return stream;
});

gulp.task('build:js', function() {
  return compile();
});

gulp.task('build:less', function() {
  return gulp.src(SETTINGS.MAIN_CSS)
    .pipe(less().on('error', gutil.log))
    .pipe(cssmin().on('error', gutil.log))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest(SETTINGS.BUILD_DIR + '/css'));
});

gulp.task('build:vendors-less', function() {
  return gulp.src(SETTINGS.LESS_VENDORS)
    .pipe(less().on('error', gutil.log))
    .pipe(cssmin().on('error', gutil.log))
    .pipe(rename('vendors.min.css'))
    .pipe(gulp.dest(SETTINGS.BUILD_DIR + '/css'));
});

gulp.task('build:html', function() {
  return gulp.src(SETTINGS.MAIN_HTML).pipe(gulp.dest(SETTINGS.BUILD_DIR));
});

gulp.task('watch:js', function() {
  return compile(true);
});

gulp.task('watch:less', function() {
  return gulp.watch(['src/less/**/*.less', '!src/less/vendors/**/*'], ['build:less']);
});

gulp.task('watch:vendors-less', function() {
  return gulp.watch('src/less/vendors/**/*.less', ['build:vendors-less']);
});

gulp.task('watch:html', function() {
  return gulp.watch([SETTINGS.MAIN_HTML], ['build:html']);
});

gulp.task('copy:images', function () {
  return gulp.src(SETTINGS.IMAGES_DIR + '/**/*.*')
    .pipe(gulp.dest(SETTINGS.BUILD_DIR + '/images/'));
});

gulp.task('fontawesome', function() {
  return gulp.src(['node_modules/font-awesome/fonts/fontawesome-webfont.*'])
    .pipe(gulp.dest(SETTINGS.BUILD_DIR + '/fonts'));
});

gulp.task('open:blackboard', function() {
  process.env.NODE_ENV = 'development';
  return gulp.src('./**/**')
    .pipe(exec('electron .', {
      continueOnError: false, // default = false, true means don't emit error event
      pipeStdout: false, // default = false, true means stdout is written to file.contents
      customTemplatingThing: "test" // content passed to gutil.template()
    }))
    .pipe(exec.reporter({
      err: true, // default = true, false means don't write err
      stderr: true, // default = true, false means don't write stderr
      stdout: true // default = true, false means don't write stdout
    }));
});

gulp.task('build', ['clean'], function() {
  gulp.start('vendors');
  gulp.start('build:js');
  gulp.start('build:less');
  gulp.start('build:vendors-less');
  gulp.start('build:html');
  gulp.start('copy:images');
  gulp.start('fontawesome');
});

gulp.task('packager:clean', function() {
  return gulp.src('./packager', { read: false }).pipe(clean());
});

gulp.task('packager:copy', ['packager:clean'], function() {
  return gulp.src([
    './main.js',
    './system-utils.js'
  ]).pipe(gulp.dest('./packager'));
});

gulp.task('packager:generate', ['packager:copy'], function(cb){
  fs.writeFile('./packager/package.json', `{
    "name"    : "blackboard",
    "version" : "0.1.0",
    "main"    : "main.js"
  }`, cb);
});

gulp.task('packager', ['packager:generate'], function() {
  return gulp.src(['./dist/**/**']).pipe(gulp.dest('./packager/dist'));
});

gulp.task('packer', ['generate:packer-files', 'copy:packer-files'], function() {
  return gulp.src('./**/**')
    .pipe(exec('electron-packager ./dist blackboard --platform=linux --arch=all', {
      continueOnError: false, // default = false, true means don't emit error event
      pipeStdout: false, // default = false, true means stdout is written to file.contents
      customTemplatingThing: "test" // content passed to gutil.template()
    }))
    .pipe(exec.reporter({
      err: true, // default = true, false means don't write err
      stderr: true, // default = true, false means don't write stderr
      stdout: true // default = true, false means don't write stdout
    }));
});


gulp.task('watch', ['watch:js', 'watch:less', 'watch:vendors-less', 'watch:html', 'open:blackboard']);
