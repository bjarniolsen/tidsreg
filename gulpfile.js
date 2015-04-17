/**
 * SETUP
 * 
 * require module dependencies
 */
var gulp = require('gulp'),
    cmdArguments = require('yargs').argv,
	// JS
	uglify = require('gulp-uglifyjs'),
	jshint = require('gulp-jshint'),
	// CSS
	sass = require('gulp-sass'),
    cssPrefixer = require('gulp-autoprefixer'),
	//less = require('gulp-less'),
	minifyCss = require('gulp-minify-css'),
    // IMAGES
    imageop = require('gulp-image-optimization'),
	// MISC
    concat = require('gulp-concat'),
	rename = require("gulp-rename"),
	plumber = require('gulp-plumber'),
	livereload = require('gulp-livereload'),
	watcherCallback = function(event) {
		console.log('=================================================================');
		console.log('File '+event.path+' was '+event.type+', running tasks...');
	};



/**
 * TASKS
 *  default: all tasks.
 *  images: run only the 'images' task.
 *  resourcecopy: copy resources to DIST folder
 *  Then add watches on folders.
 *
 *  The array of tasks (after task: default) is run on start 
 *  NB: Add and remove less/sass here
 */
gulp
	.task('default', [
		'resourcecopy',
		//'less',
		'sass',
		'js', 
		'lint'
	], function() {
		livereload.listen();
		
		// WATCH events
		
		// Watch HTML files and refresh browser
		gulp
			.watch(['*.html'])
			.on('change', livereload.changed);
		
		// Watch DIST folder and refresh browser
		gulp
			.watch(['static/dist/**'])
			.on('change', livereload.changed);

		// Watch JS-folder(s) for changes
		gulp
			.watch('static/src/js/**/*.js', ['js', 'lint'])
			.on('change', watcherCallback);
		
		// Watch LESS-folder(s) for changes
		gulp
			.watch('static/src/less/**/*.*', ['less'])
			.on('change', watcherCallback);
		
		// Watch SASS-folder(s) for changes
		gulp
			.watch('static/src/sass/**/*.*', ['sass'])
			.on('change', watcherCallback);
	});

// Compress and do stuff to images
gulp.task('images', ['images']);
gulp.task('resourcecopy', ['resourcecopy']);



/**
 * JAVASCRIPT
 *
 * Set up task for JS
 */
gulp
	.task('js', function() {

        if (cmdArguments.debug) {
            console.log(" ");
            console.log("   ************************************************");
            console.log("   * SCRIPT IS BEING COMPILED IN DEBUG-MODE!      *");
            console.log("   * No minification will be performed.           *");
            console.log("   ************************************************");
            console.log(" ");
        }

		gulp.src([
			// 'static/src/js/vendor/some.jquery.plugin.js',
			// 'static/src/js/vendor/some.other.jquery.plugin.js',
			// 'static/src/js/vendor/jquery.*.js', // Use this to include all jQuery-plugin files, usually named jQuery.pluginname.js, unconditionally.
			'static/src/js/dis.main.js',
			'static/src/js/dis.module.*.js'
		])
            .pipe(plumber())
            .pipe(cmdArguments.debug ?
                // Just concatenate, since we're in debug-mode at this stage.
                concat("main.min.js") :
                // Uglify the javascript files into "main.min.js"
                // and create a sourcemap file that matches.
                uglify('main.min.js', {
                    outSourceMap: true,
                    sourceRoot: '../../../',
                    mangle: false
                })
            )
            .pipe(plumber.stop())
            // Render the output into the DIST folder
            .pipe(gulp.dest('static/dist/js'))
            // ...and copy to BUILD (avoid a PUBLISH in VS)
            // .pipe(gulp.dest('../BUILDFOLDER/static/dist/js'))
        ;


        // Create a file for legacy-browsers, such as IE8 and below, to get rudimentary support for
        gulp.src([
                'static/src/js/vendor/consolelogfix.min.js',
                'static/src/js/vendor/html5shiv-printshiv.js',
                'static/src/js/vendor/respond.min.js'
            ])
            .pipe(plumber())
            // Uglify the javascript files into "legacy.min.js"
            // and create a sourcemap file
            .pipe(uglify('legacy.min.js', {
                outSourceMap: true,
                sourceRoot: '../../../',
                mangle: false
            }))
            .pipe(plumber.stop())
            // Render the output into the DIST folder
            .pipe(gulp.dest('static/dist/js'));
	});



/**
 * JS Linter
 *
 * Set up task for JSHint 
 */
gulp
	.task("lint", function() {
		gulp.src("static/src/js/*.js")
			// Run file through JSHint
			.pipe(jshint())
			// Pipe the result of that through to the JSHint reporter
			.pipe(jshint.reporter("default"));
	});



/**
 * LESS
 *
 * Set up task for LESS
 */
gulp
	.task('less', function () {
    	gulp.src('static/src/less/main.less')
        	.pipe(plumber())
    		// Run file through LESS-compiler
    		.pipe(less())
            // Auto-prefix CSS3-properties
            .pipe(cssPrefixer({cascade: false}))
    		// Minify the CSS
			.pipe(minifyCss())
			// Rename CSS file
			.pipe(rename('main.min.css'))
        	.pipe(plumber.stop())
    		// Render the output into the DIST folder
    		.pipe(gulp.dest('static/dist/css'))
    		// ...and copy to BUILD (avoid a PUBLISH in VS)
    		//.pipe(gulp.dest('../BUILDFOLDER/static/dist'));
	});



/**
 * SASS
 *
 * Set up task for SASS
 */
gulp
	.task('sass', function () {
    	gulp.src('static/src/sass/main.scss')
        	.pipe(plumber())
    		// Run file through SASS-compiler
    		.pipe(sass())
            // Auto-prefix CSS3-properties
            .pipe(cssPrefixer({cascade: false}))
    		// Minify the CSS
			.pipe(minifyCss())
			// Rename CSS file
			.pipe(rename('main.min.css'))
        	.pipe(plumber.stop())
    		// Render the output into the DIST folder
    		.pipe(gulp.dest('static/dist/css'))
    		// ...and copy to BUILD (avoid a PUBLISH in VS)
    		//.pipe(gulp.dest('../BUILDFOLDER/static/dist'));
	});



/**
 * RESOURCECOPY
 *
 * Set up tasks for copying folders and files to /dist/
 * and compress images.
 *
 * TODO: needs some SVG optimation.
 */
gulp
	.task('resourcecopy', function () {
		gulp.src([
			'static/src/fonts/*.*',
			'static/src/js/vendor/modernizr*',
			'static/src/js/vendor/jquery-*'
		], { base: 'static/src' })
    		// Render the output into the DIST folder
    		.pipe(gulp.dest('static/dist'));

		gulp.src([
			'static/src/img/*.{png,jpg,jpeg,gif,svg}',
		], { base: 'static/src' })
        	.pipe(plumber())
			.pipe(imageop({
				optimizationLevel: 5,
        		progressive: true,
        		interlaced: true,
        		quality: '65-80'
			}))
        	.pipe(plumber.stop())
    		// Render the output into the DIST folder
    		.pipe(gulp.dest('static/dist'));
	});



/**
 * IMAGES
 *
 * Set up task for IMAGES
 * Run this task: 'npm run gulpimg'
 *
 * TODO: needs some SVG optimation.
 */
gulp
	.task('images', function () {
		gulp.src([
			'static/src/img/*.{png,jpg,jpeg,gif,svg}',
		], { base: 'static/src' })
        	.pipe(plumber())
			.pipe(imageop({
				optimizationLevel: 5,
        		progressive: true,
        		interlaced: true,
        		quality: '65-80'
			}))
        	.pipe(plumber.stop())
    		// Render the output into the DIST folder
    		.pipe(gulp.dest('static/dist'));
	});
