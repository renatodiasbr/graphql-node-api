const gulp = require("gulp");
const { series, src, dest, watch } = require("gulp");
const del = require("del");
const ts = require("gulp-typescript");

const tsProject = ts.createProject("tsconfig.json");

const clean = () => del("dist");

const static = () => src(["src/**/*.json"]).pipe(gulp.dest("dist"));

const scripts = () => {
  return ts
    .createProject("tsconfig.json")
    .src()
    .pipe(ts.createProject("tsconfig.json")())
    .js.pipe(dest("dist"));
};

const build = series(static, scripts);

exports.clean = clean;
exports.static = series(clean, static);
exports.scripts = series(clean, scripts);
exports.build = build;
exports.default = series(build, cb => {
  watch(["src/**/*.ts", "src/**/*.json"], build);
  cb();
});
