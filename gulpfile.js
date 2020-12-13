const { parallel, src, dest } = require('gulp');
const superstatic = require('superstatic');
const browserify = require('browserify');
const fs = require('fs');
const ejs = require('ejs');

function javascript(cb) {
    const b = browserify({
        ignoreMissing : true
    });
    b.add('./src/index.js');
    b.bundle((error, compiled) => {
        if (error) console.log(error)
        fs.writeFile("./dist/index.js", compiled, cb);
    });
}

function html(cb) {
    ejs.renderFile("./src/index.ejs", {env: "hosting"}, {}, function(err, str){
        fs.writeFile("./dist/index.html", str, cb);
    });
}
function dockerHtml(cb) {
    ejs.renderFile("./src/index.ejs", {env: "docker"}, {}, function(err, str){
        fs.writeFile("./dist/docker.html", str, cb);
    });
}

function css() {
    return src('./src/*.css')
        .pipe(dest('dist/'));
}

function serve() {
    superstatic.server({
        port:3000,
        config: {
            public: "./dist/"
        },
    }).listen();
}

function docsJs() {
    return src('./dist/index.js')
        .pipe(dest('docs/'));
}
function docsHtml() {
    return src('./dist/index.html')
        .pipe(dest('docs/'));
}
function docsCss() {
    return src('./dist/*.css')
        .pipe(dest('docs/'));
}


exports.build = parallel(javascript, html, dockerHtml, css);
exports.serve = serve;
exports.docs = parallel(docsJs, docsHtml, docsCss);
