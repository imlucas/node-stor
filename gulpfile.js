"use strict";

var gulp = require('gulp'),
  child_process = require('child_process'),
  browserify = require('gulp-browserify');

gulp.task('build', function(){
  gulp.src('./test/*.js')
    .pipe(browserify({insertGlobals: true, debug : true}))
    .pipe(gulp.dest('./.build'));

  gulp.src('./test/*.html')
    .pipe(gulp.dest('./.build'));

  gulp.src('node_modules/mocha/mocha.*')
    .pipe(gulp.dest('./.build'));
});

gulp.task('serve', function(){
  var port = 3000;
  require('http').createServer(
    require('ecstatic')({ root: __dirname + '/.build' })
  ).listen(port);
});

gulp.task('watch', function (){
  gulp.watch(['./stores/*.js','test/*.js'], ['build']);
});

gulp.task('phantom', function(){
  child_process.exec('mocha-phantomjs http://localhost:3000/index.test.html', function(err, stdout){
    console.log(stdout.toString());
    process.exit(0);
  });
});

gulp.task('dev', ['build', 'serve', 'watch']);
gulp.task('test', ['build', 'serve', 'phantom']);
