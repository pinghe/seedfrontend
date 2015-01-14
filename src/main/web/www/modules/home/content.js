/**
 * Created by mengzhx on 2015-01-06.
 */
'use strict'

define(['utils', 'avalon', "text!./content.html"], function (Utils, Avalon, pagehtml) {
    avalon.templateCache.homecontent = pagehtml;

    //return {
    //    loadpage: function () {
    //        avalon.templateCache.homecontent = pagehtml;
    //    },
    //    leavepage: function(){
    //        Avalon.templateCache.homecontent = Utils.emptydiv;
    //    }
    //}

});