"use strict";

const router = require('express').Router();
const authService = require('../services/auth');
const dbService = require('../services/db');
const ExpressBrute = require('express-brute');
const logger = require('../logger')(module);

const bruteforce = new ExpressBrute(new ExpressBrute.MemoryStore(), {
        freeRetries: 3,
        minWait: 5 * 60 * 1000,
        maxWait: 60 * 60 * 1000
    }
);

router.post('/login', bruteforce.prevent, function (req, res) {
    dbService.get().get('accounts', {username: req.body.username})
        .then((account) => {
            if (account
                && account.username === req.body.username
                && account.password === req.body.password) {
                req.brute.reset();
                res.json({
                    username: account.username,
                    roles: account.roles,
                    token: authService.generateToken(account)
                });
            } else {
                res.status(401).json({error: 'Username and password are incorrect'});
            }
        });
});

router.get('/sync', authService.requireAuthentication, function (req, res) {
    if (req.user && req.user.username) {
        // Already logged in, re create token
        dbService.get().get('accounts', {username: req.user.username})
            .then((account) => {
                if (account) {
                    if (account.username === req.user.username && account.password === req.user.password) {
                        res.json({
                            username: account.username,
                            roles: account.roles,
                            token: authService.generateToken(account)
                        });
                        return;
                    }
                }
                res.status(401).json({error: 'Account has changed'});
            });
    } else {
        res.status(401).json({error: 'Invalid account info'});
    }
});

module.exports = router;