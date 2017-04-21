"use strict";

const db = require('../services/db').get(),
    auth = require('../services/auth'),
    requireAuthentication = auth.requireAuthentication,
    requireAuthorization = auth.requireAuthorization,
    router = require('express').Router();

router.all('*', requireAuthentication);
router.all('*', requireAuthorization([auth.ROLES.ADMIN]));

router.get('/', function (req, res) {
    res.json(db.get('accounts').value());
});

router.post('/', function (req, res) {
    const newAccount = req.body;

    if (!auth.validateRoles(newAccount.roles)) {
        res.status(400).send('Invalid roles');
    } else {
        const existedAccount = db.get('accounts').find({username: newAccount.username}).value();

        if (existedAccount) {
            res.status(400).send('Username existed');
        } else {
            db.get('accounts').push(newAccount).write();
            res.json(newAccount);
        }
    }
});

router.patch('/', function (req, res) {
    const existedAccount = db.get('accounts').find({username: req.body.username}).value();
    if (existedAccount) {
        if (!auth.validateRoles(req.body.roles)) {
            res.status(400).send('Invalid roles');
        } else {
            db.get('accounts')
                .find({
                    username: req.body.username
                })
                .assign({
                    password: req.body.password,
                    roles: req.body.roles
                })
                .write();

            res.sendStatus(200);
        }
    } else {
        res.status(400).send('Account not existed: ' + req.body.username);
    }
});

router.delete('/', function (req, res) {
    const account = req.body;

    db.get('accounts').remove({username: account.username}).write();
    res.sendStatus(200);
});

module.exports = router;