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
			'src/assets/sass/**/*.scss',
			'src/*.html',
		];

// Build SASS
gulp.task( 'build:sass', function() {
	'use strict';

	return gulp.src( 'src/assets/sass/**/*.scss' )
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
			gulp.dest( 'pub/assets/css/' )
		);
} );

// Build nunjucks
gulp.task( 'build:nunjucks', function() {
	'use strict';

	return gulp.src( 'src/**/*.html' )
		.pipe(
			nunjucksRender().on( 'error', gutil.log )
		)
		.pipe(
			gulp.dest( 'pub/' )
		);
} );

// Copy assets
gulp.task( 'copy:assets', function() {
	'use strict';

	return gulp.src( [
		'src/assets/**/*',
		'!src/assets/sass',
		'!src/assets/sass/**',
		'!src/assets/images',
		'!src/assets/images/**',
	] )
		.pipe(
			gulp.dest( 'pub/assets' )
		);
} );

// Compress images
gulp.task( 'compress:images', function() {
	'use strict';

	return gulp.src( 'src/assets/images/**/*' )
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
			gulp.dest( 'pub/assets/images' )
		);
} );

// Build assets
gulp.task(
	'build:assets',
	gulp.parallel(
		'copy:assets',
		'compress:images'
	)
);

// Clean
gulp.task( 'clean', function() {
	'use strict';

	return del( [
		'pub/',
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
		'build:assets'
	)
);
