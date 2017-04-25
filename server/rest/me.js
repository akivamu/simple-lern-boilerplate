"use strict";

const dbService = require('../services/db');
const authService = require('../services/auth');
const router = require('express').Router();

router.all('*', authService.requireAuthentication);

router.get('/', function (req, res) {
    dbService.get().get('accounts', {username: req.user.username}).then((me) => res.json(me));
});

module.exports = router;