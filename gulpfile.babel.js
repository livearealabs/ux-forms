import autoprefixer from 'autoprefixer';
import babel from 'gulp-babel';
import browserSync from 'browser-sync';
import config from './config.json';
import cssnano from 'cssnano';
import fs from 'fs';
import gulp from 'gulp';
import path from 'path';
import postcss from 'gulp-postcss';
import rename from 'gulp-rename';
import sass from 'gulp-sass';

const browser = browserSync.create();

function gobbleError(error) {
	console.error(error.toString());
	this.emit('end');
}

gulp.task('generate-html', () => {
	gulp.src(`${config.source.root + config.source.partials}master.html`)
		.pipe(rename('index.html'))
		.pipe(gulp.dest(config.build.root))
		.pipe(browser.stream());
});

gulp.task('scripts', () => {
	return gulp.src(config.source.root + config.source.scripts.entry)
		.pipe(babel())
		.on('error', gobbleError)
		.pipe(rename('app.js'))
		.pipe(gulp.dest(config.build.root + config.build.scripts.path))
		.pipe(browser.stream());
});

gulp.task('styles', () => {
	const processors = [
		autoprefixer(config.source.styles.supported)
	];

	return gulp.src(config.source.root + config.source.styles.entry)
		.pipe(sass())
		.on('error', gobbleError)
		.pipe(postcss(processors))
		.pipe(rename('app.css'))
		.pipe(gulp.dest(config.build.root + config.build.styles.path))
		.pipe(postcss([cssnano]))
		.pipe(rename('app.min.css'))
		.pipe(gulp.dest(config.build.root + config.build.styles.path))
		.pipe(browser.stream());
});

gulp.task('watch', () => {
	gulp.watch(config.source.root + config.source.scripts.files, ['scripts']);
	gulp.watch(config.source.root + config.source.styles.files, ['styles']);
	gulp.watch([`${config.source.root}*.html`, `${config.source.root + config.source.partials}*.html`], ['generate-html'], browser.reload);
});

gulp.task('serve', () => {
	browser.init({
		open: true,
		port: config.server.port || '8000',
		notify: false,
		ghostMode: false,
		server: {
			baseDir: config.build.root,
		}
	});
});

gulp.task('build', ['styles', 'scripts', 'generate-html']);
gulp.task('default', ['build', 'serve', 'watch']);
