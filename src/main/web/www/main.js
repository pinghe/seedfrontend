/**
 * Created by mengzhx on 2015-01-04.
 */
'use strict';

require.config({//第一块，配置
    baseUrl: './modules/',
    paths: {
        main: '../main',
        jquery: '../vendor/jquery/jquery-2.1.3',
        stateMachine: '../vendor/statemachine/state-machine',
        avalon: "../vendor/avalon/avalon.mobile.shim",
        mmPromise: "../vendor/avalon/mmPromise",
        mmRequest: "../vendor/avalon/mmRequest.modern",
        mmHistory: "../vendor/avalon/mmHistory",
        mmRouter: "../vendor/avalon/mmRouter",
        text: '../vendor/require/text',
        domReady: '../vendor/require/domReady',
        css: '../vendor/require/css.js',
        i18n: '../vendor/require/i18n.js',
        mycordova: "../cordova"
    },
    priority: ['text', 'css'],
    shim: {
        //avalon: {
        //    exports: "avalon"
        //},
        "mycordova": {
            exports: "cordova"
        }
    },
    config: {
        //'_@r6': {
        'app': {
            'basepath': '/'
        }
    },
    deps: ['./app']
});