const { series, parallel, src, dest } = require('gulp');
const superstatic = require('superstatic');
const browserify = require('browserify');
const fs = require('fs');

function javascript(cb) {
    var b = browserify();
    b.add('./raw.js');
    b.bundle((error, compiled) => {
        if (error) console.log(error)
        fs.writeFile("./index.js", compiled, cb);
    });
}

function serve() {
    superstatic.server({
        port:3000,
        config: {
            public: "."
        },
    }).listen();
}

function docsJs() {
    return src('index.js')
        .pipe(dest('docs/'));
}
function docsHtml() {
    return src('index.html')
        .pipe(dest('docs/'));
}
function docsCss() {
    return src('*.css')
        .pipe(dest('docs/'));
}

exports.build = series(javascript);
exports.serve = serve;
exports.docs = parallel(docsJs, docsHtml, docsCss);