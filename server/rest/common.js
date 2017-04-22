"use strict";

const _ = require('lodash');
const router = require('express').Router();
const db = require('../services/db').get();
const authService = require('../services/auth');

router.get('/init', function (req, res) {
    db.get('accounts').then((accounts) => {
        if (accounts && _.values(accounts).length > 0) {
            res.status(409).json({error: 'Already initialized'});
        } else if (!req.query.u || !req.query.p) {
            res.status(400).json({error: 'Wrong input'});
        } else {
            const newAccount = {
                username: req.query.u,
                password: req.query.p,
                roles: [authService.ROLES.ADMIN, authService.ROLES.USER]
            };

            db.post('accounts', newAccount).then((account) => res.status(201).json(account));
        }
    });
});

module.exports = router;