// Gulp 모듈 호출 
const { series, parallel, src, dest, watch, lastRun } = require('gulp'), // gulp
	  fileinclude = require('gulp-file-include'), //html include 모듈
	  scss = require('gulp-sass')(require('sass')), // scss 컴파일용
	  minifycss = require('gulp-clean-css'), // CSS MINIFY
	  sourcemaps  = require('gulp-sourcemaps'), // scss 소스맵
	  concat = require('gulp-concat'), //concat 플러그인(script 파일을 하나로 뭉침)
	  uglify = require('gulp-uglify'), //minify 후 코드 난독화 // script 파일을 전달해야 할 경우 사용 자제 할것
	  babel = require("gulp-babel"), // babel
	  imagemin = require('gulp-imagemin'), // 이미지 최적화
	  changed = require('gulp-changed'), // 변경된 파일만 캐치
	  spritesmith = require('gulp.spritesmith'), // 이미지 스프라이트 만들기
	  del = require('del'), // 삭제 모듈
	  rename = require('gulp-rename'), // gulp-rename 모듈 호출
	  nodemon = require('gulp-nodemon'), // 웹서버
	  browserSync = require('browser-sync'), //브라우저싱크 화면 자동 새로 고침
	  cached = require('gulp-cached'), //cached
	  stripDebug = require('gulp-strip-debug'); //stripDebug - console, alert 을 void 0 으로 전체 치환, 상황 봐가면서 써야 할듯

// 파일 경로
const paths = {
	all: {
		dest: './project/dist/'
	},
	html: {
        src: './project/src/**/*.html',
        dest: './project/dist/'
	},
	styles: {
			src: './project/src/assets/scss/common.scss',
			dest: './project/dist/assets/css/'
	},
	scripts: {
	src:  './project/src/assets/js/*.js',
	dest: './project/dist/assets/js/'
	},
	assets:{
		js:{
			src: './project/src/assets/js/*',
			dest: './project/dist/assets/js/'
		},
		import: {
			src: './project/src/assets/js/import/*',
			dest: './project/dist/assets/js/import/'
		},
		fonts:{
			src: './project/src/assets/fonts/*',
			dest: './project/dist/assets/fonts/'
		},
		images:{
			src: './project/src/assets/images/**/*',
			dest: './project/dist/assets/images/'
		},
		sprite:{
			src: './project/src/assets/sp_images/*.png',
			dest: './project/dist/assets/images/sp_images/'
		}
	}
};

// 웹서버 스타트
function serverStart(){
	nodemon({
		script: 'app.js',
		watch: 'app' 
	});
};

// 브라우저 싱크 실행(화면 새로고침)
function liveServer(){
	browserSync.init( null, { proxy: 'http://localhost:8090' , port: 8091 });
};

//html 관련
function htmlCompile(done){
	return src([paths.html.src, '!./project/src/pages/includes/*','!./project/src/pages/**/*_content.html'])
			.pipe(fileinclude({ prefix: '@@', basepath: './project/src/', indent : true}))
			.pipe(cached(htmlCompile))
			.pipe(dest(paths.html.dest))
			.pipe( browserSync.reload({stream: true}) );
	done();
};

//html include
function htmlInclude(done){
	return src([paths.html.src, '!./project/src/pages/includes/*'])
			.pipe(cached(htmlInclude))
			.pipe(fileinclude({ prefix: '@@', basepath: './project/src/'}))
			.pipe(dest(paths.html.dest))
			.pipe(browserSync.reload({stream: true}));
	done();
};

//script 관련
function jsCompile(done){
	return src(paths.scripts.src)
			.pipe(cached(jsCompile))
			.pipe(concat('ui.common.js'))
		    // .pipe(babel())
			.pipe(dest(paths.scripts.dest))
			// .pipe(stripDebug())
			.pipe(uglify())
			.pipe(rename('ui.common.min.js'))
			.pipe(dest(paths.scripts.dest))
			.pipe( browserSync.reload({stream: true} ) );
	done();
};

function handleError(err) {
	this.emit('end');
}

//scss compile
function scssCompile(done){
	//scss compile option
	let scssOptions = {
		outputStyle : "expanded", // Values : nested, expanded, compact, compressed
		indentType : "space", // Values : space , tab
		indentWidth : 0, // outputStyle 이 nested, expanded 인 경우에 사용
		precision: 4, // 컴파일 된 CSS 의 소수점 자리수
		sourceComments: true // 컴파일 된 CSS 에 원본소스의 위치와 줄수 주석표시.
	};

	return src(paths.styles.src)
			.pipe(sourcemaps.init())
			.pipe(changed(paths.styles.dest))
			.pipe(scss(scssOptions.normal).on('error', scss.logError))
			.pipe(dest(paths.styles.dest), { sourcemaps:  true })
			.pipe(minifycss())
			.pipe(rename('common.min.css'))
			.pipe(sourcemaps.write())
			.pipe(dest(paths.styles.dest), { sourcemaps:  true })
			.pipe(browserSync.reload({stream: true}) );
	done();
};

// 웹폰트 배포
function libraryFonts(done){
	return src(paths.assets.fonts.src, { encoding: false })
			.pipe(dest(paths.assets.fonts.dest));
	done();
};

// 이미지 배포
function libraryImages(done){
	return src(paths.assets.images.src, { encoding: false })
			.pipe(cached(libraryImages))
			.pipe(changed(paths.assets.images.dest))
			.pipe(dest(paths.assets.images.dest))
			.pipe(browserSync.reload({stream: true})
	);
	done();
};

//이미지 최적화
function optImage(done){
	return src(paths.assets.images.src)
			.pipe( 
			imagemin([ 
				imagemin.gifsicle({interlaced: false}),
				imagemin.mozjpeg({quality: 75, progressive: true}),
				imagemin.optipng({optimizationLevel: 5}),
				imagemin.svgo({
					plugins: [
						{removeViewBox: true},
						{cleanupIDs: false}
					]
				}) 
			]))
			.pipe(dest(paths.assets.images.dest));
	done();
};

// clean
function clean(done){
	del.sync(paths.all.dest);
	done();
};

// 지정한 파일, 경로에 대해 실시간 파일 변경 감지
function watchFiles() {
	watch(paths.html.src, series([htmlCompile]));
	watch(['./project/src/assets/js/*.js'], series([jsCompile]));
	watch(['./project/src/assets/scss/*.scss'], series([scssCompile]));
};

exports.default = series(parallel(serverStart, liveServer, watchFiles)); // 기본 task liveserver용으로
exports.build = series(parallel(clean, htmlCompile, jsCompile, 
	scssCompile, libraryImages, libraryFonts)); // 전체 빌드 task
exports.semibuild = series(parallel(htmlCompile ,jsCompile, scssCompile, libraryImages)); // 세미 빌드 task
exports.optImage = series(parallel(optImage)); // 이미지 최적화