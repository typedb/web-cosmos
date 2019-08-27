const { src, dest, watch, series, parallel, task } = require("gulp");
const rename = require("gulp-rename");
const concat = require("gulp-concat");
const terser = require("gulp-terser");

const handlebars = require("gulp-compile-handlebars");

const sourcemaps = require("gulp-sourcemaps");
const sass = require("gulp-sass");

const paths = {
  hbs: {
    src: "src/pages/*.hbs",
    dest: "dist",
    partials: "src/partials",
    watch: "src/**/*.hbs"
  },
  scss: {
    src: "src/assets/scss/*.scss",
    dest: "dist/css",
    watch: "src/assets/scss/*.scss"
  },
  js: {
    src: "src/assets/js/**/*.js",
    dest: "dist/js",
    watch: "src/assets/js/**/*.js"
  }
};

function hbsToHtml() {
  return src(paths.hbs.src)
    .pipe(
      handlebars(
        {},
        {
          ignorePartials: true,
          batch: [paths.hbs.partials]
        }
      )
    )
    .pipe(
      rename({
        extname: ".html"
      })
    )
    .pipe(dest(paths.hbs.dest));
}

function scssToCss() {
  return src(paths.scss.src)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write("."))
    .pipe(dest(paths.scss.dest));
}

function minifyJs() {
  return src([
    paths.js.src,
    "!" + "src/vendor/jquery-3.3.1.min.js",
    "!" + "src/vendor/modernizr-3.7.1.min.js"
  ])
    .pipe(terser())
    .pipe(concat("scripts.js"))
    .pipe(dest(paths.js.dest));
}

function copyFonts() {
  return src("src/assets/fonts/**/*").pipe(dest("./dist/fonts"));
}

function copyImages() {
  return src("src/assets/img/**/*").pipe(dest("./dist/img"));
}

function copyIcons() {
  return src("src/assets/icons/**/*").pipe(dest("./dist/icons"));
}

function copyJsVendors() {
  return src("src/assets/js/vendor/**/*").pipe(dest("./dist/js/vendor/"));
}

function copyCssVendors() {
  return src("src/assets/scss/vendor/*.css").pipe(dest("./dist/css/vendor"));
}

function copyBrowserConfig() {
  return src("browserconfig.xml").pipe(dest("./dist/"));
}

function copyManifest() {
  return src("site.webmanifest").pipe(dest("./dist/"));
}

function copyRobot() {
  return src("robots.txt").pipe(dest("./dist/"));
}

function watchAll() {
  watch(
    [paths.hbs.watch, paths.scss.watch, paths.js.watch],
    parallel(hbsToHtml, scssToCss, minifyJs)
  );
}

const buildAll = parallel(
  hbsToHtml,
  scssToCss,
  minifyJs,
  copyFonts,
  copyImages,
  copyIcons,
  copyJsVendors,
  copyCssVendors,
  copyBrowserConfig,
  copyManifest,
  copyRobot
);

task("build", buildAll);
task("watch", watchAll);
