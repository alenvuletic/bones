const gulp = require( 'gulp' ),
		sourcemaps = require( 'gulp-sourcemaps' ),
		sass = require( 'gulp-sass' ),
		gutil = require( 'gulp-util' ),
		autoprefixer = require( 'gulp-autoprefixer' ),
		nunjucksRender = require( 'gulp-nunjucks-render' ),
		del = require( 'del' ),
		filesToWatch = [
			'src/assets/sass/**/*.scss',
			'src/*.html',
		];

// Build SASS
gulp.task( 'build:sass', function( done ) {
	'use strict';

	return gulp.src( 'src/assets/sass/**/*.scss' )
		.pipe( sourcemaps.init() )
		.pipe(
			sass( {
				outputStyle: 'compressed',
			} )
			.on( 'error', gutil.log )
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
		.pipe( sourcemaps.write() )
		.pipe(
			gulp.dest( 'pub/assets/css/' )
		)
		.on( 'end', done );
} );

// Build nunjucks
gulp.task( 'build:nunjucks', function() {
	'use strict';

	return gulp.src( 'src/*.html' )
		.pipe( nunjucksRender() )
		.pipe(
			gulp.dest( 'pub/' )
		);
} );

// Clean
gulp.task( 'clean', function( done ) {
	'use strict';

	return del( [
		'pub/',
	] )
	.then( function() {
		done();
	} );
} );

// Copy assets
gulp.task( 'copy:assets', function() {
	'use strict';

	return gulp.src( [
		'src/assets/**/*',
		'!src/assets/sass',
		'!src/assets/sass/**',
	] )
		.pipe( gulp.dest( 'pub/assets' ) );
} );

// Default (Build)
gulp.task(
	'default',
	gulp.series( [
		'clean',
		'build:sass',
		'build:nunjucks',
		'copy:assets',
	] )
);

// Watch
gulp.task( 'watch', function( done ) {
	'use strict';

	gulp.watch(
		filesToWatch,
		gulp.series( [
			'default',
		] )
	);

	done();
} );
