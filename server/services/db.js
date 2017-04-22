"use strict";

module.exports = {
    init: function (dbType) {
        let DbClass = require('../database/' + dbType);
        let config = require('config').database[dbType];
        this.db = new DbClass(config);
    },
    get: function () {
        return this.db;
    }
};