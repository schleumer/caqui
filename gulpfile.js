const path = require('path');
const gulp = require('gulp');
const babel = require('gulp-babel');
const changed = require('gulp-changed');
const watch = require('gulp-watch');
const plumber = require('gulp-plumber');
const less = require('gulp-less');

const babelConfig = {
  "plugins": [
    "transform-class-properties"
  ],
  "presets": [
    "es2015",
    "stage-0",
    "react",
    "es2015-loose"
  ]
};

gulp.task('babel', () => {
	return gulp.src('src/javascript/**/*.js')
    .pipe(plumber())
    .pipe(changed('lib'))
		.pipe(babel(babelConfig))
		.pipe(gulp.dest('lib'));
});

gulp.task('copy-files', () => {
  return gulp.src(['./src/javascript/icons.svg'])
    .pipe(plumber())
    .pipe(gulp.dest('lib'));
});

gulp.task('dev-less', () => {
  return gulp.src('./demo/src/less/app.less')
    .pipe(plumber())
    .pipe(less({
      paths: [ path.join(__dirname, 'node_modules') ]
    }))
    .pipe(gulp.dest('./demo/dist/'))
});

gulp.task('watch-javascript', () => {
  return watch('src/javascript/**/*.js', () => {
    gulp.start("babel");
  });
});

gulp.task('watch-less', () => {
  return watch(['src/less/**/*.less', 'demo/src/less/**/*.less'], () => {
    gulp.start("dev-less");
  });
});


gulp.task('default', [
  'babel',
  'dev-less',
  'watch-javascript',
  'watch-less',
  'copy-files'
]);