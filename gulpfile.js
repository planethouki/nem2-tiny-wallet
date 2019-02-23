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


exports.build = series(javascript);
exports.serve = serve;