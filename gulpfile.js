// Gulp 모듈 호출 
const fs = require('fs');
const { series, parallel, src, dest, watch } = require('gulp');// gulp
const fileinclude = require('gulp-file-include');//html include 모듈
const sass = require('gulp-sass')(require('sass'));// scss 컴파일용
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');// scss 소스맵
const concat = require('gulp-concat');//concat 플러그인(script 파일을 하나로 뭉침)
const uglify = require('gulp-uglify');//minify 후 코드 난독화 // script 파일을 전달해야 할 경우 사용 자제 할것
const rename = require('gulp-rename');// gulp-rename 모듈 호출
const imagemin = require('gulp-imagemin');// 이미지 최적화
const nodemon = require('gulp-nodemon');// 웹서버
const browserSync = require('browser-sync').create();//브라우저싱크 화면 자동 새로 고침

// ---------------- paths ----------------
const paths = {
	dist: './project/dist/',

	html: './project/src/**/*.html',

	scss: './project/src/assets/scss/common.scss',

	js: './project/src/assets/js/*.js',

	images: './project/src/assets/images/**/*',

	fonts: './project/src/assets/fonts/*',

	pdf: './project/src/**/*.pdf'
};

// ---------------- clean ----------------
function clean(done){
	if(fs.existsSync(paths.dist)){
		fs.rmSync(paths.dist,{
			recursive:true,
			force:true
		});
	}
	done();
}

// ---------------- server ----------------
// 웹서버 스타트
function serverStart(){
	return nodemon({
		script:'app.js',
		watch:'app'
	});
}

// 브라우저 싱크 실행(화면 새로고침)
function liveServer(){
	browserSync.init({
		proxy:'http://localhost:8090',
		port:8091
	});
}

// ---------------- html ----------------
function html(){
	return src([
		paths.html,
		'!./project/src/pages/includes/*',
		'!./project/src/pages/**/*_content.html'
	])
	.pipe(fileinclude({
		prefix:'@@',
		basepath:'./project/src/',
		indent:true
	}))
	.pipe(dest(paths.dist))
	.pipe(browserSync.stream());
}

// ---------------- pdf ----------------
function pdf(){
	return src(paths.pdf,{ base:'./project/src' })
		.pipe(dest(paths.dist))
		.pipe(browserSync.stream());
}

// ---------------- scss ----------------
function styles(){
	return src(paths.scss)
		.pipe(sourcemaps.init())

		.pipe(
			sass({
				outputStyle:'expanded'
			}).on('error',sass.logError)
		)

		.pipe(dest('./project/dist/assets/css'))

		.pipe(cleanCSS())
		.pipe(rename('common.min.css'))

		.pipe(sourcemaps.write('.'))
		.pipe(dest('./project/dist/assets/css'))

		.pipe(browserSync.stream());
}

// ---------------- js ----------------
function scripts(){
	return src(paths.js)
		.pipe(concat('ui.common.js'))
		.pipe(dest('./project/dist/assets/js'))

		.pipe(uglify())
		.pipe(rename('ui.common.min.js'))
		.pipe(dest('./project/dist/assets/js'))

		.pipe(browserSync.stream());
}

// ---------------- images ----------------
function images(){
	return src(paths.images)
		.pipe(dest('./project/dist/assets/images'))
		.pipe(browserSync.stream());
}

function optimizeImages(){
	return src(paths.images)
		.pipe(imagemin())
		.pipe(dest('./project/dist/assets/images'));
}

// ---------------- fonts ----------------
function fonts(){
	return src(paths.fonts)
		.pipe(dest('./project/dist/assets/fonts'));
}

// ---------------- watch ----------------
// 지정한 파일, 경로에 대해 실시간 파일 변경 감지
function watcher(){
	watch(paths.html, html);
	watch(paths.pdf, pdf);
	watch('./project/src/assets/scss/**/*.scss', styles);
	watch(paths.js, scripts);
	watch(paths.images, images);
}

// ---------------- tasks ----------------
// 기본 task liveserver용으로
exports.default = series(
	parallel(serverStart, liveServer),
	parallel(html, pdf, styles, scripts, images, fonts),
	watcher
);
// 전체 빌드 task
exports.build = series(clean, parallel (html, pdf, styles, scripts, images, fonts));
// 세미 빌드 task
exports.semibuild = series(parallel(html, pdf, styles, scripts, images));
// 이미지 최적화
exports.optImage = optimizeImages;