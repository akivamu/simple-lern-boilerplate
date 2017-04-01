'use strict';

const session = require('express-session');
const sessionFileStore = require('session-file-store');
const Store = sessionFileStore(session);

module.exports = {
    sessionCookieIdName: undefined,
    sessionMiddleware: undefined,
    init: function (sessionCookieIdName) {
        if (!this.sessionMiddleware) {
            this.sessionCookieIdName = sessionCookieIdName;
            this.sessionMiddleware = session({
                secret: 'wtffff',
                resave: false,
                saveUninitialized: false,
                store: new Store(),
                name: sessionCookieIdName
            });
        }

        return this.sessionMiddleware;
    }
};