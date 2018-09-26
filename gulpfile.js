let gulp = require('gulp');
let autoprefixer = require('gulp-autoprefixer');
let cleanCSS = require('gulp-clean-css');
let uglify = require('gulp-uglify');
let rename = require("gulp-rename");
let htmlmin = require("gulp-htmlmin");
let htmlclean = require("gulp-htmlclean");
let del = require('del');

var configs = {
    autoprefixer: {
        browsers: [
            'last 2 versions',
            '> 1%',
            'Chrome >= 40',
            'Firefox >= 40',
            'ie >= 10',
            'Safari >= 8',
        ],
    },
    cleanCSS: {
        compatibility: 'ie10'
    },
};


function minifyJS() {
    return gulp.src('src/**/*.js')
        .pipe(uglify({
            output: {
                comments: /^!/
            }
        }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist'));
}

function minifyCSS() {
    return gulp.src('src/**/*.css')
        .pipe(autoprefixer(configs.autoprefixer))
        .pipe(cleanCSS(configs.cleanCSS))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist'));
}

function minifyHTML() {
    return gulp.src('src/**/*.html')
        .pipe(htmlmin({
            removeComments: true,
            minifyJS: true,
            minifyCSS: true,
            collapseWhitespace: true,
        }))
        .pipe(htmlclean())
        .pipe(gulp.dest('dist'))
}

function copyDist() {
    return gulp.src('dist/**/*')
        .pipe(gulp.dest('public'))
}

function copyAssets() {
    return gulp.src('src/**/*')
        .pipe(gulp.dest('public'))
}

function clean() {
    return del([
        'public/**/*'
    ]);
}

exports.clean = clean;
exports.minifyJS = minifyJS;
exports.minifyCSS = minifyCSS;
exports.minifyHTML = minifyHTML;
exports.copyDist = copyDist;
exports.copyAssets = copyAssets;

gulp.task('build', gulp.series(
    clean,
    gulp.parallel(
        minifyJS,
        minifyCSS,
        minifyHTML
    ),
    gulp.series(
        copyAssets,
        copyDist
    )
));

gulp.task('default', gulp.series('build'));

gulp.task('watch', function () {
    gulp.watch('src/**', gulp.series('build'));
});