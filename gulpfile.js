const
gulp = require("gulp"),
sass = require("gulp-sass"),
sassGlob = require("gulp-sass-glob"),
sourcemaps = require('gulp-sourcemaps'),
cssBase64 = require('gulp-css-base64'),
watch = require("gulp-watch"),
concat = require("gulp-concat"),
uglify = require('gulp-uglify'),
cssnano = require('gulp-cssnano'),
//imageResize = require('gulp-image-resize'),
imageop = require('gulp-image-optimization'),
clean = require('gulp-clean'),
del = require('del');
//exec = require('child_process').exec;

/*
function onError(err) {
  console.log(err);
  this.emit('end');
}
*/

gulp.task('default', [
  'cleanSass','cleanJavaScript','cleanImages',
  'sass','concatJS','compressImages',
  'sass:watch','concatJS:watch','compressImages:watch',
]);

gulp.task('cleanSass', function () {
  return gulp.src('resources/stylesheets/**/*', {read: false})
    .pipe(clean());
});

gulp.task('cleanJavaScript', function () {
  return gulp.src('resources/javascript/**/*', {read: false})
    .pipe(clean());
});

gulp.task('cleanImages', function () {
  return gulp.src('resources/images/**/*', {read: false})
    .pipe(clean());
});

gulp.task('sass',['cleanSass'], function(){
  return gulp.src('src/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass({}).on('error', sass.logError))
    .pipe(cssnano())
    .pipe(cssBase64({baseDir: "resources/images",maxWeightResource: 1000000000,extensionsAllowed: ['.png', '.jpg']}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('resources/stylesheets'));
});

gulp.task('concatJS',['cleanJavaScript'], function(){
  return gulp.src(['src/javascript/vendor/**/*','src/javascript/app/**/*'])
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('resources/javascript/'));
});

gulp.task('compressImages',['cleanImages'], function(cb){
    gulp.src(['src/images/**/*.png','src/images/**/*.jpg','src/images/**/*.gif','src/images/**/*.jpeg','src/images/**/*.svg']).pipe(imageop({
        optimizationLevel: 1,
        progressive: true,
        interlaced: true
    })).pipe(gulp.dest('resources/images')).on('end', cb).on('error', cb);
});

gulp.task('sass:watch', function(cb){
  return gulp.watch('src/scss/**/*.scss', ["sass"])
  .on('error', function(){console.log("Sass Error")});
});

gulp.task('concatJS:watch', function(cb){
  return gulp.watch('src/javascript/**/*', ["concatJS"])
  .on('error', function(){console.log("JS Error")});
});

gulp.task('compressImages:watch', function(cb){
  return gulp.watch('src/images/**/*', ["compressImages"])
  .on('error', function(){console.log("Image Compression Error")});
});
