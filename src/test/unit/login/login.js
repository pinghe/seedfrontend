/**
 * Created by mengzhx on 2015-01-07.
 */
define([
    'intern!tdd',
    'intern/chai!expect'
    //'login/body'
], function (tdd, expect) {
    require("avalon")(windows)
    tdd.suite('登录功能', function () {
		//require('avalon')(windows)
		//require('login/body')
        console.log('===================');

        var user = {name: 'testuser', password: 'pass', logintime: new Date()};
        tdd.before(function () {
            avalon.vmodels.loginbodyid.login(user.name, user.password, user.logintime);
        });

        tdd.after(function () {
            avalon.vmodels.loginbodyid.logout();
            //avalon.vmodels.loginpageid.logout();
        });

        tdd.test('成功登录', function () {
            expect(avalon.vmodels.loginpageid.password).to.equal('');
            //assert.strictEqual(avalon.vmodels.loginpageid.password, '',
            //    '口令应该不保存');
            expect(avalon.vmodels.pageroute.user).to.deep.equal({
                logged: true,
                name: user.name,
                logintime: user.logintime
            });
        });
    });
});