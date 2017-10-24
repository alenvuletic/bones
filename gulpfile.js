const gulp = require( 'gulp' ),
		sourcemaps = require( 'gulp-sourcemaps' ),
		sass = require( 'gulp-sass' ),
		gutil = require( 'gulp-util' ),
		autoprefixer = require( 'gulp-autoprefixer' ),
		nunjucksRender = require( 'gulp-nunjucks-render' ),
		del = require( 'del' ),
		combineMq = require( 'gulp-combine-mq' ),
		imagemin = require( 'gulp-imagemin' ),
		imageminJpegRecompress = require( 'imagemin-jpeg-recompress' ),
		imageminPngquant = require( 'imagemin-pngquant' ),
		filesToWatch = [
			'src/sass/**/*.scss',
			'src/templates/**/*.html',
		];

// Build SASS
gulp.task( 'build:sass', function() {
	'use strict';

	return gulp.src( 'src/sass/**/*.scss' )
		.pipe(
			sourcemaps.init()
		)
		.pipe(
			sass( {
				outputStyle: 'compressed',
			} ).on( 'error', gutil.log )
		)
		.pipe(
			autoprefixer( {
				browsers: [
					'Chrome >= 45',
					'Firefox ESR',
					'Edge >= 12',
					'Explorer >= 10',
					'iOS >= 9',
					'Safari >= 9',
					'Android >= 4.4',
					'Opera >= 30',
				],
				flexbox: 'no-2009',
			} )
		)
		.pipe(
			combineMq( {
				beautify: false,
			} )
		)
		.pipe(
			sourcemaps.write()
		)
		.pipe(
			gulp.dest( 'dist/css' )
		);
} );

// Build nunjucks
gulp.task( 'build:nunjucks', function() {
	'use strict';

	return gulp.src( 'src/templates/**/*.html' )
		.pipe(
			nunjucksRender().on( 'error', gutil.log )
		)
		.pipe(
			gulp.dest( 'dist' )
		);
} );

// Copy assets
gulp.task( 'copy:assets', function() {
	'use strict';

	return gulp.src( [
		'src/**/*',
		'!src/sass',
		'!src/sass/**',
		'!src/images',
		'!src/images/**',
		'!src/templates',
		'!src/templates/**',
	] )
		.pipe(
			gulp.dest( 'dist' )
		);
} );

// Compress images
gulp.task( 'compress:images', function() {
	'use strict';

	return gulp.src( 'src/images/**/*' )
		.pipe(
			imagemin( [
				imageminJpegRecompress( {
					max: 80,
				} ),
				imageminPngquant( {
					quality: 85,
				} ),
				imagemin.svgo(),
			], { verbose: true } ).on( 'error', gutil.log )
		)
		.pipe(
			gulp.dest( 'dist/images' )
		);
} );

// Clean
gulp.task( 'clean', function() {
	'use strict';

	return del( [
		'dist',
	] );
} );

// Watch
gulp.task( 'watch', function() {
	'use strict';

	gulp.watch(
		filesToWatch,
		gulp.parallel(
			'build:sass',
			'build:nunjucks'
		)
	);
} );

// Default (Build everything)
gulp.task(
	'default',
	gulp.series(
		'clean',
		'build:sass',
		'build:nunjucks',
		'copy:assets',
		'compress:images'
	)
);
