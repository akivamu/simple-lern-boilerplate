"use strict";

const db = require('../services/db').get(),
    auth = require('../services/auth'),
    requireAuthentication = auth.requireAuthentication,
    requireAuthorization = auth.requireAuthorization,
    router = require('express').Router();

router.all('*', requireAuthentication);
router.all('*', requireAuthorization([auth.ROLES.ADMIN]));

router.get('/', function (req, res) {
    db.get('accounts').then((accounts) => res.json(accounts));
});

router.post('/', function (req, res) {
    const newAccount = req.body;

    if (!auth.validateRoles(newAccount.roles)) {
        res.status(400).send('Invalid roles');
    } else {
        db.get('accounts', {username: newAccount.username})
            .then((existedAccount) => {
                if (existedAccount) {
                    res.status(400).send('Username existed');
                } else {
                    db.post('accounts', newAccount).then(() => res.json(newAccount));
                }
            });
    }
});

router.patch('/', function (req, res) {
    db.get('accounts', {username: newAccount.username})
        .then((existedAccount) => {
            if (existedAccount) {
                if (!auth.validateRoles(req.body.roles)) {
                    res.status(400).send('Invalid roles');
                } else {
                    db.patch('accounts', {username: req.body.username}, {
                        password: req.body.password,
                        roles: req.body.roles
                    }).then(() => res.sendStatus(200));
                }
            } else {
                res.status(400).send('Account not existed: ' + req.body.username);
            }
        });
});

router.delete('/:username', function (req, res) {
    db.delete('accounts', {username: req.params.username}).then(() => res.sendStatus(200));
});

module.exports = router;