/**
 * Created by mengzhx on 2015-01-04.
 */
'use strict'

define(['utils', 'avalon', 'home/body'], function (Utils, Avalon, body) {//第三块，加载其他模块

    //body.loadpage();
    Avalon.templateCache.homeheader = Utils.emptydiv;
    Avalon.templateCache.homefooter = Utils.emptydiv;

    //return {
    //    load: function () {
    //        body.loadpage();
    //        Avalon.templateCache.homeheader = Utils.emptydiv;
    //        Avalon.templateCache.homefooter = Utils.emptydiv;
    //        Avalon.log("加载homepage完毕!");
    //    },
    //    leave: function () {
    //        body.leavepage();
    //        Avalon.templateCache.homeheader = Utils.emptydiv;
    //        Avalon.templateCache.homefooter = Utils.emptydiv;
    //        Avalon.log("卸载homepage完毕!");
    //    }
    //}
});