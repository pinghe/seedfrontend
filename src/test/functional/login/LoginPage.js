/**
 * Created by mengzhx on 2015-01-12.
 */
define([], function () {
    // the page object is created as a constructor
    // so we can provide the remote Command object
    // at runtime
    function LoginPage(remote) {
        this.remote = remote;
    }

    LoginPage.prototype = {
        constructor: LoginPage,

        // the login function accepts username and password
        // and returns a promise that resolves to `true` on
        // success or rejects with an error on failure
        login: function (username, password) {
            return this.remote
                .get(require.toUrl('http://localhost:8888/index.html'))
                .setFindTimeout(5000)
                // first, we perform the login action, using the
                // specified username and password
                .findById('username').findByTagName('input')
                .click()
                .type(password)
                .end(2)
                .findById('password').findByTagName('input')
                .click()
                .type(username)
                .end(2)
                .findById('login')
                .click()
                .end(2)
                // then, we verify the success of the action by
                // looking for a login success marker on the page
                .setFindTimeout(5000)
                .findById('logedusername')
                .then(function (elm) {
                    return elm;
                });
        }
    };

    return LoginPage;
});