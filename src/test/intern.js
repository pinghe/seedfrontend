// Learn more about configuring this file at <https://github.com/theintern/intern/wiki/Configuring-Intern>.
// These default settings work OK for most people. The options that *must* be changed below are the
// packages, suites, excludeInstrumentation, and (if you want functional tests) functionalSuites.
// jquery avalon 不支持运行在nodejs上
define({
    // The port on which the instrumenting proxy will listen
    proxyPort: 9000,

    // A fully qualified URL to the Intern proxy
    proxyUrl: 'http://localhost:9000/',

    // Default desired capabilities for all environments. Individual capabilities can be overridden by any of the
    // specified browser environments in the `environments` array below as well. See
    // https://code.google.com/p/selenium/wiki/DesiredCapabilities for standard Selenium capabilities and
    // https://saucelabs.com/docs/additional-config#desired-capabilities for Sauce Labs capabilities.
    // Note that the `build` capability will be filled in with the current commit ID from the Travis CI environment
    // automatically
    capabilities: {
        'selenium-version': '2.44.0'
    },

    // Browsers to run integration testing against. Note that version numbers must be strings if used with Sauce
    // OnDemand. Options that will be permutated are browserName, version, platform, and platformVersion; any other
    // capabilities options specified for an environment will be copied as-is
    environments: [
        { browserName: 'chrome'}

        //{browserName: 'internet explorer', version: '11', platform: 'Windows 8.1'},
        //{browserName: 'internet explorer', version: '10', platform: 'Windows 8'},
        //{browserName: 'internet explorer', version: '9', platform: 'Windows 7'},
        //{browserName: 'firefox', version: '28', platform: ['OS X 10.9', 'Windows 7', 'Linux']},
        //{browserName: 'chrome', version: '34', platform: ['OS X 10.9', 'Windows 7', 'Linux']},
        //{browserName: 'safari', version: '6', platform: 'OS X 10.8'},
        //{browserName: 'safari', version: '7', platform: 'OS X 10.9'}
    ],

    // Maximum number of simultaneous integration tests that should be executed on the remote WebDriver service
    maxConcurrency: 3,

    // Name of the tunnel class to use for WebDriver tests
    //tunnel: 'SauceLabsTunnel',
    tunnel: 'NullTunnel',


    tunnelOptions: {
        hostname: 'localhost',
        port: 4444
    },


    // The desired AMD loader to use when running unit tests (client.html/client.js). Omit to use the default Dojo
    // loader
    useLoader: {
        //'host-node': '../requirejs',
        //'host-browser': '../requirejs/require.js'
        'host-node': 'dojo/dojo',
        'host-browser': 'node_modules/dojo/dojo.js'
    },

    // Configuration options for the module loader; any AMD configuration options supported by the specified AMD loader
    // can be used here
    loader: {
        // Packages that should be registered with the loader in each testing environment
        //packages: [{name: 'login', location: '../main/web/www/modules/login'},
        //    {name: 'home', location: '../main/web/www/modules/home'},
        //    {name: 'app', location: '../main/web/www/modules/app'}],
        paths: {
            src: 'target/web/platforms/browser/www/modules/',
            app: 'target/web/platforms/browser/www/modules/app',
            utils: 'target/web/platforms/browser/www/modules/utils',
            login: 'target/web/platforms/browser/www/modules/login',
            //home: 'target/web/platforms/browser/www/modules/home/',
            //app: 'target/web/platforms/browser/www/modules/app',
            unittest: 'src/test/unit',
            functest: 'src/test/functional',
            testamd: 'src/test/unit/testamd',
            jquery: 'target/web/platforms/browser/www/vendor/jquery/jquery-2.1.3',
            stateMachine: 'target/web/platforms/browser/www/vendor/statemachine/state-machine',
            avalon: "target/web/platforms/browser/www/vendor/avalon/avalon.mobile.shim",
            mmPromise: "target/web/platforms/browser/www/vendor/avalon/mmPromise",
            mmRequest: "target/web/platforms/browser/www/vendor/avalon/mmRequest.modern",
            mmHistory: "target/web/platforms/browser/www/vendor/avalon/mmHistory",
            mmRouter: "target/web/platforms/browser/www/vendor/avalon/mmRouter",
            text: 'target/web/platforms/browser/www/vendor/require/text',
            domReady: 'target/web/platforms/browser/www/vendor/require/domReady',
            css: 'target/web/platforms/browser/www/vendor/require/css.js',
            i18n: 'target/web/platforms/browser/www/vendor/require/i18n.js',
            cordova: "target/web/platforms/browser/www/cordova"
        },
        priority: ['text', 'css'],
        //shim: {
        //    avalon: {
        //        exports: "avalon"
        //    },
        //    "mycordova": {
        //        exports: "cordova"
        //    }
        //},
        config: {
            //'_@r6': {
            'app': {
                'basepath': '/'
            }
        }

    },

    // Non-functional test suite(s) to run in each browser
    suites: [/*'unit/login/login'*/],

    // Functional test suite(s) to run in each browser once non-functional tests are completed
    functionalSuites: ['functest/login/login'],

    reporters: ['runner'],
    // A regular expression matching URLs to files that should not be included in code coverage analysis
    //excludeInstrumentation: /src\\test|src\/test|bower_components|node_modules/
    excludeInstrumentation: /src(?:\/|\\)test(?:\/|\\)|bower_components(?:\/|\\)|node_modules(?:\/|\\)/
});
