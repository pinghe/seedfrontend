'use strict'

define(['utils', 'mmRouter', 'text!./body.html','home/menu','home/content'], function (Utils, Avalon, pagehtml, menu, content) {

    var pagemodel = Avalon.define({
        $id: "homebodyid",
        content: "empty",
        menu: "empty",
        $loadpage: function(state) {
            pagemodel.content = state+'content';
            pagemodel.menu = state+'menu';
        },

        logout: function () {
            avalon.vmodels.loginbodyid.logout()
        }
    });
    Avalon.templateCache.homebody = pagehtml;
    //menu.loadpage();
    //content.loadpage();

    pagemodel.$loadpage('home');

    //return {
    //    loadpage: function () {
    //        Avalon.templateCache.homebody = pagehtml;
    //        menu.loadpage();
    //        content.loadpage();
    //    },
    //    leavepage: function(){
    //        Avalon.templateCache.homebody = Utils.emptydiv;
    //    }
    //}

});
