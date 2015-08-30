var gulp       = require('gulp'),
    jsmin      = require('gulp-uglify'),
    sass       = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    gutil      = require('gulp-util'),
    cssmin     = require('gulp-minify-css'),
    prefixer   = require('gulp-autoprefixer'),
    rename     = require('gulp-rename'),
    connect    = require('gulp-connect');

gulp.task('js', function() {
    gulp.src('./src/vunits.js')
        .pipe(jsmin({
                preserveComments: 'some'
            }).on('error', gutil.log))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest('./dist'))
        .pipe(gulp.dest('./demo/js'))
});

gulp.task('styles', function() {
    gulp.src('./demo/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({errLogToConsole: true}))
        .pipe(prefixer({
            browsers: ['last 35 versions']
        }))
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./demo/css'));
});


gulp.task('build', [
    'js',
    'styles'
]);

gulp.task('server', function() {
    connect.server({
        root: './demo/',
        port: 8081
    });
});

gulp.task('watch', function() {
    gulp.watch(['./src/vunits.js'], function() {
        gulp.start('js');
    });

    gulp.watch(['./demo/scss/**/*.scss'], function() {
        gulp.start('styles');
    });

});

gulp.task('default', ['build', 'watch', 'server']);