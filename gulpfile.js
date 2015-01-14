'use strict';

/////// SETTINGS ////////////

//var argv = require('minimist')(process.argv.slice(2));
//console.dir(argv);
//var proEnv = (argv.proEnv == undefined) ? false : true;
var configparam = require('./configparam.json');
var syncfrontedsftp = (configparam === undefined) ? false : ((configparam.sftp.host === undefined) ? false : true);
var syncfrontedlocal = (configparam === undefined) ? false : ((configparam.localserver.localPath === undefined) ? false : true);
var proEnv = (configparam === undefined) ? false : ((configparam.proEnv === undefined) ? false : configparam.proEnv);

if (configparam == undefined) {
    syncfrontedsftp = false
} else if (configparam.sftp.enabled == undefined) {
    syncfrontedsftp = false
} else {
    syncfrontedsftp = configparam.sftp.enabled
}

if (configparam == undefined) {
    syncfrontedlocal = false
} else if (configparam.localserver.enabled == undefined) {
    syncfrontedlocal = false
} else {
    syncfrontedlocal = configparam.localserver.enabled
}

if (configparam == undefined) {
    proEnv = false
} else if (configparam.proEnv == undefined) {
    proEnv = false
} else {
    proEnv = configparam.proEnv
}

console.log("proEnv: " + proEnv);
console.log("syncfrontedsftp: " + syncfrontedsftp);
console.log("syncfrontedlocal: " + syncfrontedlocal);

var pkg = require('./package.json'),
    gulp = require('gulp'),
    $ = require('gulp-load-plugins')();

var minifyCss = require('gulp-minify-css');

var path = require('path'),
    del = require('del'),
    fs = require('graceful-fs'),
    cordova_lib = require('cordova-lib'),
    cdv = cordova_lib.cordova.raw,
    browsersync = require('browser-sync'),
    amdoptimize = require('amd-optimize'),
    mergestream = require('merge-stream'),
    eventstream = require('event-stream'),
    q = require('q'),
    FTPS = require('node-sftp'),
    streamqueue = require('streamqueue'),
    http = require('http'),
    ecstatic = require('ecstatic'),
    format = require('format'),
    util = require('util');

var srcWEBDir = path.join(__dirname, 'src', 'main', 'web'),
    srcWWWDir = path.join(__dirname, 'src', 'main', 'web', 'www'),
    cordovaBuildDir = path.join(__dirname, 'target', 'web'),
    targetWEBDir = path.join(__dirname, 'target', 'web'),
    targetWWWDir = path.join(__dirname, 'target', 'web', 'www'),
    targetCSSDir = path.join(__dirname, 'target', 'web', 'www', 'css'),
    targetIMGDir = path.join(__dirname, 'target', 'web', 'www', 'img'),
    targetVENDORDir = path.join(__dirname, 'target', 'web', 'www', 'vendor');

var AUTOPREFIXER_BROWSERS = [
    'ie >= 11',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
];

var paths = {
    coffeescripts: ['src/main/web/www/**/*.coffee', '!src/main/web/www/vendor/**/*.coffee'],
    //jsscripts: ['src/main/web/www/**/*.js', '!src/main/web/www/vendor/**/*.js'],
    jsscripts: ['src/main/web/www/**/*.js', '!src/main/web/www/vendor/require/require*.js'],
    vendorjsscripts: 'src/main/web/www/vendor/**/*.js',
    sassscripts: ['src/main/web/**/*.scss', '!src/main/web/www/vendor/**/*.scss'],
    lessscripts: ['src/main/web/**/*.less', '!src/main/web/www/vendor/**/*.less'],
    cssscripts: ['src/main/web/**/*.css', '!src/main/web/www/vendor/**/*.css'],
    images: 'src/main/web/www/img/**/*',
    appconfig: 'src/main/web/config.xml',
    indexhtml: 'src/main/web/www/index.html',
    mainjs: 'src/main/web/www/main.js',
    targetstylecss: 'target/web/www/css/style.css',
    targetbrowserfiles: 'target/web/platforms/browser/www/**/*',
    targetbrowsercordovafiles: ['target/web/platforms/browser/www/cordova*.js', 'target/web/platforms/browser/www/plugins/**/*'],
    targetbrowserwww: 'target/web/platforms/browser/www/',
    targetbrowserwwwtmp: 'target/web/platforms/browser/wwwtmp/',
    targetbrowserwwwtmpmodules: 'target/web/platforms/browser/wwwtmp/modules',
    targetbrowserwwwtmpjsfiles: ['target/web/wwwtmp/**/*.js', '!target/web/wwwtmp/vendor/require/require*.js'],
    targetwww: 'target/web/www/',
    targetwwwmodules: 'target/web/www/modules',
    targetwwwfiles: 'target/web/www/**/*',
    targetwwwnotjsfiles: ['target/web/www/**/*', '!target/web/www/**/*.js'],
    targetwwwjsfiles: ['target/web/www/**/*.js', '!target/web/www/vendor/require/require*.js'],
    targetwwwrequirejsfiles: 'target/web/www/**/require*.js',
    htmls: 'src/main/web/www/**/*.html'
};


function errrHandler(e) {
    // 控制台发声,错误时beep一下
    $.util.beep();
    $.util.log(e);
}

// http server Basic Options
var options = {
    p: 'http://',
    webServer: '0.0.0.0',
    webPort: 8888,
    index: 'index.html',
    cache: 5,
    selServer: 'localhost',
    selPort: 4444,
    mockServer: 'localhost',
    mockPort: 9999
};

// List of platforms determined form pkd.dependencies. This way platform file
// downloading and version preferences are entirely handled by npm install.
var platforms = [];  // List like ['cordova-ios', 'cordova-android']
var platform_dirs = [];  // List of subdirs with platform files under node_moduels
var p;
for (p in cordova_lib.cordova_platforms) {
    var pname = 'cordova-' + p;
    if (pkg.dependencies[pname]) {
        platforms.push(pname);
        platform_dirs.push(path.join(__dirname, 'node_modules', pname));
        // TODO: Check if those dirs exist and if not ask the user to run "npm install"
    }
}

// Plugins can't be stores in package.josn right now.
//  - They are published to plugin registry rather than npm.
//  - They don't list their dependency plugins in their package.json.
//    This might even be impossible because dependencies can be platform specific.
var plugins = pkg.cordovaplugins;

// Platform to use for run/emulate. Alternatively, create tasks like runios, runandroid.
var testPlatform = ['android', 'browser'];

// utils

//var mkdirsSync = module.exports.mkdirsSync = 
function mkdirsSync(dirpath, mode) {
    if (fs.existsSync(dirpath)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirpath), mode)) {
            fs.mkdirSync(dirpath, mode);
            return true;
        }
    }
};

// var mkdirs = module.exports.mkdirs = 
function mkdirs(dirpath, mode, callback) {
    fs.exists(dirpath, function (exists) {
        if (exists) {
            callback(dirpath);
        } else {
            //尝试创建父目录，然后再创建当前目录
            mkdirs(path.dirname(dirpath), mode, function () {
                fs.mkdir(dirpath, mode, callback);
            });
        }
    });
};

//////////////////////// TASKS /////////////////////////////

gulp.task('css', function () {
    return streamqueue(
        {objectMode: true},
        //gulp.src(paths.lessscripts).pipe($.plumber({errorHandler: errrHandler})).pipe($.watch(paths.lessscripts)).pipe($.less()),
        //gulp.src(paths.sassscripts).pipe($.plumber({errorHandler: errrHandler})).pipe($.watch(paths.sassscripts)).pipe($.sass()),
        //gulp.src(paths.cssscripts).pipe($.plumber({errorHandler: errrHandler})).pipe($.watch(paths.cssscripts))
        gulp.src(paths.lessscripts).pipe($.plumber({errorHandler: errrHandler})).pipe($.less()),
        gulp.src(paths.sassscripts).pipe($.plumber({errorHandler: errrHandler})).pipe($.sass()),
        gulp.src(paths.cssscripts).pipe($.plumber({errorHandler: errrHandler}))
    )
        //.pipe($.plumber({errorHandler: errrHandler}))
        .pipe($.cond(proEnv, $.concat('style.css')))
        .pipe($.cond(proEnv, $.rename({suffix: '.min'})))
        .pipe($.cond(proEnv, minifyCss()))
        .pipe(gulp.dest(targetCSSDir));
});

gulp.task('htmls', function () {
    return gulp.src(paths.htmls)
        .pipe($.plumber({errorHandler: errrHandler}))
        //.pipe($.watch(paths.htmls))
        .pipe($.cond(proEnv, $.htmlmin({collapseWhitespace: true})))
        .pipe($.cond(proEnv, $.replace('main.js', 'main.min.js'))) // todo bugs
        .pipe($.cond(proEnv, $.replace('style.css', 'style.min.css')))
        .pipe(gulp.dest(targetWWWDir));
});

// 压缩图片
gulp.task('img', function () {
    return gulp.src(paths.images)
        .pipe($.plumber({errorHandler: errrHandler}))
        //.pipe($.watch(paths.images))
        .pipe($.imagemin({optimizationLevel: 3, progressive: true, interlaced: true}))
        .pipe(gulp.dest(targetIMGDir));
});

gulp.task('requirescripts', function () {
    gulp.src('src/main/web/www/vendor/require/require*.js')
        .pipe($.plumber({errorHandler: errrHandler}))
        .pipe(gulp.dest('target/web/www/vendor/require/'));
});

gulp.task('scripts', function () {
    return streamqueue(
        {objectMode: true},
        //gulp.src(paths.coffeescripts).pipe($.plumber({errorHandler: errrHandler})).pipe($.watch(paths.coffeescripts)).pipe($.cond(proEnv, $.sourcemaps.init())).pipe($.coffee({"bare":true})),
        //gulp.src(paths.jsscripts).pipe($.plumber({errorHandler: errrHandler})).pipe($.watch(paths.jsscripts)).pipe($.cond(proEnv, $.sourcemaps.init()))
        //gulp.src(paths.coffeescripts).pipe($.plumber({errorHandler: errrHandler})).pipe($.cond(proEnv, $.sourcemaps.init())).pipe($.coffee({"bare": true})),
        //gulp.src(paths.jsscripts).pipe($.plumber({errorHandler: errrHandler})).pipe($.cond(proEnv, $.sourcemaps.init()))
        gulp.src(paths.coffeescripts).pipe($.plumber({errorHandler: errrHandler})).pipe($.coffee({"bare": true})),
        gulp.src(paths.jsscripts).pipe($.plumber({errorHandler: errrHandler}))
    )
        //.pipe($.plumber({errorHandler: errrHandler}))
        //.pipe(amdoptimize())
        .
        pipe($.jshint())
        .pipe($.jshint.reporter('default'))
        .pipe(gulp.dest(targetWWWDir));
});

gulp.task('vendorscripts', function () {
    return gulp.src(paths.vendorjsscripts)
        .pipe($.plumber({errorHandler: errrHandler}))
        .pipe(gulp.dest(targetVENDORDir));
});

// All cordova-lib calls (except "cordova create") must be done from within
// the cordova project dir because cordova-lib determines projectRoot from
// process.cwd() in cordova-lib/src/cordova/util.js:isCordova()

gulp.task('clean', function (cb) {
    // Alternative package for cleaning is gulp-rimraf
    return gulp.src('target', {read: false})
        .pipe($.rimraf());
    //del(['target'], cb);
});

gulp.task('cleanwww', function (cb) {

    var deleteFolderRecursive = function (path) {
        var files = [];
        if (fs.existsSync(path)) {
            files = fs.readdirSync(path);
            files.forEach(function (file, index) {
                var curPath = path + "/" + file;
                if (fs.statSync(curPath).isDirectory()) { // recurse
                    deleteFolderRecursive(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    };
    // Alternative package for cleaning is gulp-rimraf
    // todo platforms 遍历删除
    var delfiles = ['!target/web/platforms/browser/www/plugins',
        '!target/web/platforms/browser/www/plugins/**/*',
        '!target/web/platforms/browser/www/cordova*.js',
        'target/web/platforms/browser/www/**/*',
        'target/web/platforms/browser/wwwtmp/**/*',
        'target/web/platforms/android/ant-build',
        'target/web/www/**/*',];
    if (syncfrontedlocal) {
        deleteFolderRecursive(configparam.localserver.localPath)
        //delfiles.push(configparam.localserver.localPath) //
    }
    if (syncfrontedsftp) {
        var ftps = new FTPS({
            username: configparam.sftp.user,
            password: configparam.sftp.pass,
            host: configparam.sftp.host,
            port: configparam.sftp.port
        }, function (err) {
            console.log(err)
        });
        ftps.rmdir(configparam.sftp.remotePath)
    }
    return gulp.src(delfiles, {read: false}) // todo 删除sftp 远程目录
        .pipe($.rimraf());
    //del(['target/web/www/**/*', 'target/web/platforms/browser/www', 'target/web/platforms/android/ant-build'], cb);
});


gulp.task('syncapptmp', function () {
    var files = paths.targetbrowsercordovafiles;
    files.push(paths.targetwwwfiles);
    return gulp.src(files)
        //.pipe($.plumber({errorHandler: errrHandler}))
        .pipe(gulp.dest(paths.targetbrowserwwwtmp));
});

gulp.task('synclocal', ['syncapptmp'], function () {
    if (proEnv) {
        return mergestream(
            gulp.src(paths.targetwwwnotjsfiles)
                .pipe($.plumber({errorHandler: errrHandler}))
                .pipe(gulp.dest(paths.targetbrowserwww)),
            gulp.src(paths.targetwwwrequirejsfiles)
                .pipe($.plumber({errorHandler: errrHandler}))
                .pipe(gulp.dest(paths.targetbrowserwww)),
            gulp.src(paths.targetbrowserwwwtmpjsfiles)
                .pipe($.plumber({errorHandler: errrHandler}))
                .pipe($.requirejs({
                    name: 'main',
                    baseUrl: paths.targetbrowserwwwtmpmodules,
                    out: 'main.min.js',
                    mainConfigFile: paths.targetbrowserwwwtmp + '/main.js',
                    shim: {}
                }))
                //.pipe($.cond(proEnv, amdoptimize))
                //.pipe($.cond(proEnv, $.concat('all.js')))
                //.pipe($.cond(proEnv, $.rename({suffix: '.min'})))
                .pipe($.cond(proEnv, $.uglify()))
                //.pipe($.cond(proEnv, $.sourcemaps.write()))
                .pipe(gulp.dest(paths.targetbrowserwww))
        );

    } else {
        return gulp.src(paths.targetwwwfiles)
            .pipe($.plumber({errorHandler: errrHandler}))
            .pipe(gulp.dest(paths.targetbrowserwww))
        //.pipe($.livereload())
    }
});

gulp.task('syncfronted', ['synclcoal'], function () {
    //console.log("syncfrontedsftp:" + syncfrontedsftp);
    return gulp.src(paths.targetbrowserfiles)
        .pipe($.plumber({errorHandler: errrHandler}))
        .pipe($.changed(paths.targetbrowserfiles))
        .pipe($.cond(syncfrontedsftp, $.sftp(configparam.sftp)))
        .pipe($.cond(syncfrontedlocal, gulp.dest(configparam.localserver.localPath)))
    //.pipe($.livereload())
});

// Prepare is not really needed
gulp.task('appprepare', function () {
    process.chdir(cordovaBuildDir);
    return cdv.prepare();
});

gulp.task('appbuild', function () {
    process.chdir(cordovaBuildDir);
    return cdv.build();
});

gulp.task('apprun', function (cb) {
    process.chdir(cordovaBuildDir);
    return cdv.run({platforms: testPlatform, options: ['--device']});
});

gulp.task('appemulate', function () {
    process.chdir(cordovaBuildDir);
    return cdv.emulate({platforms: testPlatform});
});

gulp.task('apprelease', function () {
    process.chdir(cordovaBuildDir);
    return cdv.build({options: ['--release']});
    // TODO: copy the apk file(s) out of ./target/.
});


// Create the cordova project under ./app/. This version doesn't use cordova
// create, instead just links config.xml and www/
gulp.task('initdir', ['clean'], function () {
    mkdirsSync(targetWWWDir);
    return gulp.src(paths.appconfig)
        .pipe(gulp.dest(targetWEBDir))
});

gulp.task('recreate', ['initdir'], function () {
    console.log("=====recreate");
    process.chdir(cordovaBuildDir);

    //fs.symlinkSync(path.join('..', 'src', 'main','web','config.xml'), 'config.xml');
    //fs.symlinkSync(path.join('..', 'target', 'web', 'www'), 'www');
    // We could alternatively copy www and then watch it to copy changes.
    // Useful if using SASS CoffeeScrite etc.

    // Must first add plugins then platforms. If adding platforms first,
    // cordova fails expecting to find the ./build/plugins directory.
    // TODO: try 3rd param {cli_variables: {...}}.
    return cdv.plugins('add', plugins)
        .then(function () {
            return cdv.platform('add', platform_dirs);
        });
});


// Alternative version of recreate that uses "cordova create" rather than
// creating the links manually.
gulp.task('cdvcreate', ['clean'], function () {
    var cfg = {lib: {www: {url: srcWEBDir, link: true}}};

    return cdv.create(cordovaBuildDir, pkg.appId, pkg.name, cfg)
        .then(function () {
            // Further Cordova commands must be run inside the cordova project dir.
            process.chdir(cordovaBuildDir);
        })
        .then(function () {
            return cdv.platform('add', platform_dirs);
        })
        .then(function () {
            // TODO: try 3rd param, cli_variables etc.
            return cdv.plugins('add', plugins);
        })
    //.then(function () {
    //    gulp.src(paths.appconfig)
    //        .pipe(gulp.dest(targetWEBDir));
    //});
});

gulp.task('appcreate', ['cdvcreate'], function () {
    return gulp.src(targetWWWDir, {read: false}) // much faster
        .pipe($.rimraf());
});


// A task to run a local server instace of the project
gulp.task('startLocalServer', function () {
    console.log('cwd: ' + process.cwd());

    //@todo: Add a promise here.
    http.createServer(ecstatic({
        root: __dirname + '/' + paths.targetbrowserwww,
        cache: options.cache
    })).listen(options.webPort);
    util.puts(format('WebServer Listening on %s:%s', options.webServer, options.webPort));

});

gulp.task('startMockLocalServer', function () {
    //@todo: Add a promise here.
    http.createServer(ecstatic({root: __dirname + '/src/test/svr', cache: options.cache})).listen(options.mockPort);
    util.puts(format('WebServer Listening on %s:%s, baseUrl: %s', options.mockServer, options.mockPort, process.cwd()));

});


// A task to open the website URL
gulp.task('open', function () {
    var url = format("%s%s:%s/%s", options.p, options.webServer, options.webPort, options.index);
    gulp.src("index.html")//@todo: find out why gulp.src
        .pipe(open("", {url: url}));
});

// A task to run the Selenium Server Standalone
gulp.task("selenium:start", function () {
    var Promise = require("bluebird");

    var deferred = Promise.defer();

    var jar = require("selenium-server-standalone-jar");
    var webdriver = require("selenium-webdriver"),
        remote = require("selenium-webdriver/remote"),
        chromedriver = require("chromedriver");

    var server = new remote.SeleniumServer(jar.path, {
        host: options.selServer,
        port: options.selPort,
        args: [
            "-Dwebdriver.chrome.driver=" + chromedriver.path,
            "-singleWindow", "-trustAllSSLCertificates", "-browserSessionReuse"
        ]
    });

    server.loopbackOnly_ = true; // force use of 127.0.0.1

    server.start().then(function (url) {
        util.puts("Selenium Standalone server started at " + url);
        deferred.resolve(server);
    });

    return deferred.promise;
});

//gulp.task('utest', ['startLocalServer'], $.shell.task([
gulp.task('utest', $.shell.task([
    'intern-client config=src/test/intern'
    //'dir'
]));

//gulp.task('ftest', ['startLocalServer', 'startMockLocalServer', "selenium:start"], $.shell.task([
gulp.task('ftest', $.shell.task([
//gulp.task('ftest', $.shell.task([
    'intern-runner config=src/test/intern'
]));

// A task to run the tests. It has two dependencies: selenium and local servers.
//gulp.task('itest', ['selenium:start'], function () {
gulp.task('itest', ['selenium:start'], function () {

    process.argv = ['node', './node_modules/intern/bin/intern-runner.js', 'config=src/test/intern'];

    var runner = require('intern/runner');

    //@todo: should be run this using gulp-spawn? We need to know when the process finished.
    // We could also 'listen' for the 'runner/end' event to stop selenium and the local server.
    // How do you run just: unit testing or just functional testing?
});

//gulp.task('dev', ['css', 'htmls', 'img', 'scripts', 'vendorscripts']);
gulp.task('dev', ['css', 'htmls', 'img', 'requirescripts', 'scripts']);

gulp.task('watchdev', function () {
    gulp.run('css', 'htmls', 'img', 'requirescripts', 'scripts');

    // 监听html文件变化
    gulp.watch(paths.htmls, ['htmls']);

    // Watch .css .less .scss files
    gulp.watch('src/main/web/www/css/**/*', ['css']);

    // Watch require*.js files
    gulp.watch(['src/main/web/www/vendor/require/require*.js'], ['requirescripts']);

    // Watch .js .coffee files
    gulp.watch(['!src/main/web/www/vendor/require/require*.js',
        'src/main/web/www/main.js',
        'src/main/web/www/modules/**/*.js',
        'src/main/web/www/modules/**/*.coffee',
        'src/main/web/www/vendor/**/*'], ['scripts']);

    // Watch image files
    gulp.watch('src/main/web/www/img/**/*', ['img']);


    //// Watch vendor files
    //gulp.watch('src/main/web/www/vendor/**/*', ['vendorscripts', 'build']);
});

gulp.task('watchapp', function () {
    gulp.watch(['target/web/config.xml', 'target/web/www/**/*'], ['appbuild']);
});

gulp.task('watchapprun', function () {
    gulp.watch(['target/web/config.xml', 'target/web/www/**/*'], ['apprun']);
});

gulp.task('watchsync', function () {
    gulp.watch(['target/web/www/**/*'], ['syncfronted']);
});

gulp.task('watchsynclocal', function () {
    gulp.run('startLocalServer');

    gulp.watch(['target/web/www/**/*'], ['synclocal']);
});

gulp.task('watchtest', function () {
    //gulp.run('selenium:start');
    gulp.watch([paths.targetbrowserfiles], ['utest', 'ftest']);
});

// 默认任务
gulp.task('default', ['watchdev']);