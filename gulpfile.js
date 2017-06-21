var gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  plumber = require('gulp-plumber'),
  livereload = require('gulp-livereload'),
  sass = require('gulp-ruby-sass'),
  exec = require('child_process').exec;

gulp.task('sass', function () {
  return sass('./stoker-client/src/css/**/*.scss')
    .pipe(gulp.dest('./stoker-client/src/css'))
    .pipe(livereload());
});

gulp.task('watch', function() {
  gulp.watch('./stoker-client/src/**/*.scss', ['sass']);
});

gulp.task('develop', function () {
  livereload.listen();
  nodemon({
    script: 'app.js',
    ext: 'js coffee handlebars',
    stdout: false
  }).on('readable', function () {
    this.stdout.on('data', function (chunk) {
      if(/^Express server listening on port/.test(chunk)){
        livereload.changed(__dirname);
      }
    });
    this.stdout.pipe(process.stdout);
    this.stderr.pipe(process.stderr);
  });
});

gulp.task('yarn', function (cb) {
  exec('cd stoker-client; yarn start --port 3000', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
})

gulp.task('default', [
  'yarn',
  'sass',
  'develop',
  'watch'
]);
