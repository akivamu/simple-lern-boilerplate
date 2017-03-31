"use strict";

const _ = require('lodash');
const db = require('./db').get();

module.exports = {
    ROLES: {
        ADMIN: 'ADMIN',
        USER: 'USER'
    },
    getCurrentAccount: function (req) {
        if (req.session && req.session.account) {
            const existedAccount = db.get('accounts').find({username: req.session.account.username}).value();
            if (existedAccount) return existedAccount;
        }
        return null;
    },
    validateRoles: function (roles) {
        return _.intersection(roles, _.keys(this.ROLES)).length === roles.length;
    },
    requireAuthentication: function (req, res, next) {
        if (!req.session || !req.session.account) {
            res.status(401).send('Not logged in');
        } else {
            next();
        }
    },
    requireAuthorization: function (roles) {
        return function (req, res, next) {
            if (_.intersection(req.session.account.roles, roles).length === 0) {
                res.status(403).send('Access denied');
            } else {
                next();
            }
        }
    }
};