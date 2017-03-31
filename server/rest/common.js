"use strict";

const router = require('express').Router();
const db = require('../services/db').get();
const authService = require('../services/auth');

router.get('/', function (req, res, next) {
    // TODO: handle request
    res.send('OK');
});

router.get('/init', function (req, res) {
    if (db.get('accounts').size().value() > 0) {
        res.status(409).json({error: 'Already initialized'});
    } else if (!req.query.u || !req.query.p) {
        res.status(400).json({error: 'Wrong input'});
    } else {
        const newAccount = {
            username: req.query.u,
            password: req.query.p,
            roles: [authService.ROLES.ADMIN, authService.ROLES.USER]
        };

        db.get('accounts').push(newAccount).write();

        res.status(201).json(newAccount);
    }
});

module.exports = router;