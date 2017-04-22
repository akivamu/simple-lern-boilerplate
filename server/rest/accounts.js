"use strict";

const dbService = require('../services/db'),
    auth = require('../services/auth'),
    requireAuthentication = auth.requireAuthentication,
    requireAuthorization = auth.requireAuthorization,
    router = require('express').Router();

router.all('*', requireAuthentication);
router.all('*', requireAuthorization([auth.ROLES.ADMIN]));

router.get('/', function (req, res) {
    dbService.get().get('accounts').then((accounts) => res.json(accounts));
});

router.post('/', function (req, res) {
    const newAccount = req.body;

    if (!auth.validateRoles(newAccount.roles)) {
        res.status(400).send('Invalid roles');
    } else {
        dbService.get().get('accounts', {username: newAccount.username})
            .then((existedAccount) => {
                if (existedAccount) {
                    res.status(400).send('Username existed');
                } else {
                    dbService.get().post('accounts', newAccount).then(() => res.json(newAccount));
                }
            });
    }
});

router.patch('/', function (req, res) {
    dbService.get().get('accounts', {username: newAccount.username})
        .then((existedAccount) => {
            if (existedAccount) {
                if (!auth.validateRoles(req.body.roles)) {
                    res.status(400).send('Invalid roles');
                } else {
                    dbService.get().patch('accounts', {username: req.body.username}, {
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
    dbService.get().delete('accounts', {username: req.params.username}).then(() => res.sendStatus(200));
});

module.exports = router;