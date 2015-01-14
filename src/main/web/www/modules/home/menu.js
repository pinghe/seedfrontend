/**
 * Created by mengzhx on 2015-01-06.
 */
'use strict'

define(['utils', 'avalon', "text!./menu.html"], function (Utils, Avalon, pagehtml) {
    avalon.templateCache.homemenu = pagehtml;

    //return {
    //    loadpage: function () {
    //        avalon.templateCache.homemenu = pagehtml;
    //    },
    //    leavepage: function(){
    //        Avalon.templateCache.homemenu = Utils.emptydiv;
    //    }
    //}

});