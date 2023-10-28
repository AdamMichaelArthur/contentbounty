const { src, dest } = require("gulp");

function copySchemas() {
  return src('./schematics/**/schema.json')
    .pipe(dest('../../dist/file-header/schematics'));
}

function copyFiles() {
  return src('./schematics/**/files/*')
    .pipe(dest('../../dist/file-header/schematics'));
}

function copyCollection() {
  return src('./schematics/collection.json')
    .pipe(dest('../../dist/file-header/schematics'));
}
exports.copySchemas = copySchemas;
exports.copyFiles = copyFiles;
exports.copyCollection = copyCollection;