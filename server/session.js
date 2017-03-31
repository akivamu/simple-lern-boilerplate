'use strict';

const session = require('express-session');
const sessionFileStore = require('session-file-store');

module.exports = function (sessionCookieIdName) {
    const Store = sessionFileStore(session);
    return session({
        secret: 'wtffff',
        resave: false,
        saveUninitialized: false,
        store: new Store(),
        name: sessionCookieIdName
    });
};