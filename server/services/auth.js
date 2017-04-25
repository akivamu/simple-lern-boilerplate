"use strict";

const _ = require('lodash');
const crypto = require('crypto');
const config = require('config');
const jwt = require('jsonwebtoken');

function encrypt(text) {
    const cipher = crypto.createCipher('aes-256-ctr', config.server.auth.secret);
    let crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text) {
    const decipher = crypto.createDecipher('aes-256-ctr', config.server.auth.secret);
    let dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

module.exports = {
    ROLES: {
        ADMIN: 'ADMIN',
        USER: 'USER'
    },
    generateToken: function (account) {
        return jwt.sign({data: encrypt(JSON.stringify(account))}, config.server.auth.secret, {expiresIn: '1h'});
    },
    validateRoles: function (roles) {
        return _.intersection(roles, _.keys(this.ROLES)).length === roles.length;
    },
    requireAuthentication: function (req, res, next) {
        let token = undefined;
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
            token = req.query.token;
        }
        if (token) {
            jwt.verify(token, config.server.auth.secret, function (err, decoded) {
                if (err) {
                    return res.status(401).json({success: false, message: 'Failed to authenticate token.'});
                } else {
                    req.user = JSON.parse(decrypt(decoded.data));
                    next();
                }
            });
        } else {
            return res.status(401).json({
                success: false,
                message: 'No token provided.'
            });
        }
    },
    requireAuthorization: function (roles) {
        return function (req, res, next) {
            if (_.intersection(req.user.roles, roles).length === 0) {
                res.status(403).send('Access denied');
            } else {
                next();
            }
        }
    }
};