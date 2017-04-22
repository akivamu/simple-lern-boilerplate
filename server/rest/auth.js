"use strict";

const router = require('express').Router();
const authService = require('../services/auth');
const sessionService = require('../services/session');
const db = require('../services/db').get();
const ExpressBrute = require('express-brute');
const logger = require('../logger')(module);

function removeSensitiveAccountProps(account) {
    return {
        username: account.username,
        roles: account.roles
    };
}

const bruteforce = new ExpressBrute(new ExpressBrute.MemoryStore(), {
        freeRetries: 3,
        minWait: 5 * 60 * 1000,
        maxWait: 60 * 60 * 1000
    }
);

router.post('/login', bruteforce.prevent, function (req, res) {
    // Already logged in
    const currentAccount = req.session && req.session.account ? req.session.account : null;
    if (currentAccount) {
        req.brute.reset();
        res.json(removeSensitiveAccountProps(currentAccount));
        return;
    }

    db.get('accounts', {username: req.body.username})
        .then((account) => {
            if (account
                && account.username === req.body.username
                && account.password === req.body.password) {
                req.brute.reset();
                req.session.account = account;
                res.json(removeSensitiveAccountProps(account));
            } else {
                res.status(401).json({error: 'Username and password are incorrect'});
            }
        });
});

router.get('/sync', function (req, res) {
    // Already logged in
    const currentAccount = req.session && req.session.account ? req.session.account : null;
    if (currentAccount) {
        res.json(removeSensitiveAccountProps(currentAccount));
    } else {
        res.json({});
    }
});

router.get('/logout', authService.requireAuthentication, function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            logger.error(err);
            res.sendStatus(500);
        } else {
            res.clearCookie(sessionService.sessionCookieIdName);
            res.sendStatus(200);
        }
    });
});

module.exports = router;