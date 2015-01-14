/**
 * Created by mengzhx on 2015-01-07.
 */
define([
    'intern!bdd',
    'intern/chai!assert',
    'functest/login/LoginPage'
], function (bdd, assert, LoginPage) {
    bdd.describe('登录注销', function () {

        var loginPage;
        bdd.before(function () {
            loginPage = new LoginPage(this.remote);
        });

        bdd.after(function () {
            //browser.quit();
        });


        bdd.it('当用户输入正确的用户名和口令，单击登录时进入主页面', function () {


            return loginPage
                .login('test', 'test')
                .getVisibleText()
                .then(function(logedusername){
                    console.log("-----%s",logedusername)
                    assert.strictEqual(logedusername,'已登录用户：test','成功登录后，已登录用户名应该等于登录页面输入用户名')
                    assert.isString(logedusername,'应该是一个字符串')
                });

            //this.remote // This is following the syntax WD.js https://github.com/admc/wd#supported-methods
            //    .get(require.toUrl('http://localhost:8888/index.html'))     // @todo: find out if you can get this value from Node.js settings
            //    .findById('username')  // Find Element By Id
            //    .type('testuser')
            //    .getValue().should().equal('testuser')
            //    .end()
            //    .findById('password')  // Find Element By Id
            //    .type('password')
            //    .end()
            //    .findById('login')  // Find Element By Id
            //    .click()            // Click Event
            //    .end()
            //    //.fin(function () {
            //    //    browser.elementById('username')
            //    //        .getValue().should.become('testuser')
            //    //        .elementById('logout')
            //    //        .click()
            //    //        .fin(function () {
            //    //            browser.elementById('password')
            //    //                .getValue().should.become('')
            //    //        });
            //    //    return browser.quit();
            //    //})
            //    .done();
        });
    });
});