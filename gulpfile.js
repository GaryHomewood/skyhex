var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var tinylr;

gulp.task('express', function(cb) {
    return nodemon({
        script: 'server.js'
    }).on('start', function() {
        cb();
    });
});

gulp.task('livereload', function() {
    tinylr = require('tiny-lr')();
    tinylr.listen(4002);
});

function notifyLiveReload(event) {
  var fileName = require('path').relative(__dirname, event.path);

  tinylr.changed({
    body: {
      files: [fileName]
    }
  });
}

gulp.task('watch', function() {
  gulp.watch('public/**/*.html', notifyLiveReload);
  gulp.watch('public/scipts/*.js', notifyLiveReload);
  gulp.watch('public/styles/*.css', notifyLiveReload);
});

gulp.task('default', ['express', 'livereload', 'watch'], function() {

});
