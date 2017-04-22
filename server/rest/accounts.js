"use strict";

const dbService = require('../services/db');
const auth = require('../services/auth');
const requireAuthentication = auth.requireAuthentication;
const requireAuthorization = auth.requireAuthorization;
const router = require('express').Router();
const logger = require('../logger')(module);

router.all('*', requireAuthentication);
router.all('*', requireAuthorization([auth.ROLES.ADMIN]));

router.get('/', function (req, res) {
    dbService.get().get('accounts').then((accounts) => res.json(accounts));
});

router.post('/', function (req, res) {
    const newAccount = req.body;

    if (!auth.validateRoles(newAccount.roles)) {
        logger.error('create new account: invalid roles');
        res.status(400).send('Invalid roles');
    } else {
        dbService.get().get('accounts', {username: newAccount.username})
            .then((existedAccount) => {
                if (existedAccount) {
                    logger.error('create new account: Username existed');
                    res.status(400).send('Username existed');
                } else {
                    dbService.get().post('accounts', newAccount).then((result) => res.json(result));
                }
            });
    }
});

router.patch('/', function (req, res) {
    dbService.get().get('accounts', {username: req.body.username})
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
    dbService.get().delete('accounts', {username: req.params.username})
        .then(() => res.sendStatus(200))
        .catch((error) => res.status(500).send(error));
});

module.exports = router;