'use strict';

define(['mmRouter', 'module', 'stateMachine', 'utils', 'login/page', 'home/page', 'mycordova', 'domReady!'], function (avalon, rjsmodule, StateMachine, Utils) {//第二块，添加根VM（处理共用部分）

    avalon.log("加载avalon完毕，开始构建根VM与加载其他模块");

    //avalon.templateCache.empty = "&nbsp;";
    avalon.templateCache.empty = Utils.emptydiv;
    var pageroutemodel = avalon.define({
        $id: "pageroute",
        header: "empty",
        footer: "empty",
        body: "empty",
        $loadpage: function (state) {
            pageroutemodel.header = state + 'header';
            pageroutemodel.footer = state + 'footer';
            pageroutemodel.body = state + 'body';
        },
        //下面是路由路径参数
        currPath: "/index.html",
        //params: {},
        //query: {},
        //args: "[]",
        //缓存的登录用户信息
        user: {
            logged: false,
            name: '不明',
            logintime: new Date() // 登录时间
        },
        //页面路由状态机
        $fsm: StateMachine.create({
            initial: {state: 'login', event: 'init', defer: true},
            events: [
                {name: 'logged', from: 'login', to: 'home'},
                {name: 'logout', from: 'home', to: 'login'}
            ],
            callbacks: { // onlogged --> onleavelogin --> onenterhome --> onafterlogget
                onbeforelogged: function (event, from, to, username, password, logintime) {
                    // noop
                },
                onleavelogin: function (event, from, to, username, password, logintime) {
                    //缓存登录用户信息
                    pageroutemodel.user.logged = true;
                    pageroutemodel.user.name = username;
                    pageroutemodel.user.logintime = logintime;
                    //loginpage.leavepage();
                },
                onhome: function (event, from, to, username, password, logintime) {
                    //切换home页面
                    pageroutemodel.currPath = '/home';
                    avalon.router.navigate(pageroutemodel.currPath);
                    //avalon.vmodels.pageroute.currPath = '/home';
                    //avalon.router.navigate('/home');
                    //loginpage.loadpage();
                    //avalon.vmodels.pageroute.loadpage('home');
                    //pageroutemodel.$loadpage('home');
                },
                onlogged: function (event, from, to, username, password, logintime) {
                    // noop
                },

                onbeforelogout: function (event, from, to) {
                    // noop
                },
                onleavehome: function (event, from, to, username, logintime) {
                    pageroutemodel.user.logged = false;
                    pageroutemodel.user.name = '不明';
                    //homepage.leavepage();
                },
                onlogin: function (event, from, to) {
                    pageroutemodel.currPath = '/login';
                    avalon.router.navigate(pageroutemodel.currPath);
                    //avalon.router.navigate('/login');
                    ////avalon.vmodels.pageroute.loadpage('login');
                    //pageroutemodel.$loadpage('login');
                },
                onlogout: function (event, from, to) {
                    // noop
                }

            }
        })
    });

    var init = function () {
        avalon.router.get("/login", function () {
            //avalon.router.navigate('/login');
            pageroutemodel.$loadpage('login');
            console.log('加载loginpage完毕')
        });
        avalon.router.get("/home", function () {
            pageroutemodel.$loadpage('home');
        });

        avalon.history.start({
            basepath: rjsmodule.config().basepath,
            html5Mode: false
        });

        console.log(avalon.router.getLastPath());
        //avalon.router.navigate('/login');
        pageroutemodel.$fsm.init();
        avalon.scan(document.body);

    };

    document.addEventListener('deviceready', init, false);
});
