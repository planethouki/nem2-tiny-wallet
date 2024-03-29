const { parallel, series, src, dest } = require('gulp');
const superstatic = require('superstatic');
const browserify = require('browserify');
const fs = require('fs');
const ejs = require('ejs');

function checkDistFolder(cb) {
    fs.access('dist', fs.constants.F_OK, (err) => {
        if (err) {
            // distフォルダが存在しない場合は作成
            fs.mkdirSync('dist');
        }
        cb();
    });
}

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
    ejs.renderFile("./src/index.ejs", {}, {}, function(err, str){
        fs.writeFile("./dist/index.html", str, cb);
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

exports.build = series(checkDistFolder, parallel(javascript, html, css));
exports.serve = serve;
