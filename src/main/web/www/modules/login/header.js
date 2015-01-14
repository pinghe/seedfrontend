'use strict'

define(['utils', 'avalon', 'text!./header.html'], function(Utils, Avalon, headerhtml) {

    Avalon.define({
        $id: "loginheaderid"
    });
    Avalon.templateCache.loginheader = headerhtml;
    //return {
    //    loadpage: function () {
    //        Avalon.templateCache.loginheader = headerhtml;
    //        //Avalon.vmodels.pageroute.header = "loginheader"
    //    },
    //    leavepage: function () {
    //        Avalon.templateCache.loginheader = Utils.emptydiv;
    //        //Avalon.vmodels.pageroute.header = Utils.emptydiv
    //    }
    //}

});
