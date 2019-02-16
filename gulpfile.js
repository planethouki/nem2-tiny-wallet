const gulp = require("gulp");
const superstatic = require('superstatic');
var browserify = require('browserify');
const fs = require('fs');

gulp.task("build", function(done) {
    var b = browserify();
    b.add('./row.js');
    b.bundle((error, compiled) => {
        console.log(error)
        fs.writeFile("./index.js", compiled, done);
    });
});

gulp.task('serve', function(){
    superstatic.server({
        port:3000,
        config: {
            public: "."
        },
    }).listen();
});
