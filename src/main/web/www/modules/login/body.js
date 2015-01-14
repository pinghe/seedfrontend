'use strict'

define(['utils', "avalon", "text!./body.html", "mmRequest"], function (Utils, Avalon, pagehtml) {

    var pagemodel = Avalon.define({
        $id: "loginbodyid",
        username: "",
        password: "",
        login: function (username, password, logintime) {
            console.log(pagemodel.username, username);
            // todo ajax 登录
            if (logintime === undefined) {
                logintime = new Date();
            }
            avalon.vmodels.pageroute.$fsm.logged(username, password, logintime);
            // pagemodel
        },
        logout: function () {
            console.log(pagemodel.username);
            avalon.vmodels.pageroute.$fsm.logout();
            // pagemodel
        }
    });
    Avalon.templateCache.loginbody = pagehtml;

    //return {
    //    loadpage: function () {
    //        Avalon.templateCache.loginpage = pagehtml;
    //    },
    //    leavepage: function(){
    //        Avalon.templateCache.loginpage = Utils.emptydiv;
    //    }
    //}
});
