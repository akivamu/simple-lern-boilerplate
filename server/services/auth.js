"use strict";

const _ = require('lodash');

module.exports = {
    ROLES: {
        ADMIN: 'ADMIN',
        USER: 'USER'
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