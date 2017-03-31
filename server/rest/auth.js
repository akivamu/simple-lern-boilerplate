"use strict";

const router = require('express').Router();
const authService = require('../services/auth');
const db = require('../services/db').get();

router.post('/login', function (req, res) {
    // Already logged in
    const currentAccount = authService.getCurrentAccount(req);
    if (currentAccount) {
        res.json(currentAccount);
        return;
    }

    const account = db.get('accounts').find({
        username: req.body.username,
        password: req.body.password
    }).value();
    if (account) {
        req.session.account = account;
        res.json(account);
        return;
    }

    res.status(401).json({error: 'Username and password are incorrect'});
});

module.exports = router;