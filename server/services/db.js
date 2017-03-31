"use strict";

const low = require('lowdb');
const fileAsync = require('lowdb/lib/storages/file-async');

let fileName = '';
let lowDb = undefined;

const DEFAULT_SCHEMA = {
    accounts: []
};

module.exports = {
    init: function (dbFileName) {
        if (this.isInitialized()) {
            console.error('Already initialized: ' + fileName);
            return;
        }

        fileName = dbFileName;
        lowDb = low(dbFileName, {
            storage: fileAsync
        });

        lowDb.defaults(DEFAULT_SCHEMA).write();
    },
    isInitialized: function () {
        return !!lowDb;
    },
    get: function () {
        return lowDb;
    },
    clear: function () {
        if (!this.isInitialized()) {
            console.error('Not initialize');
            return;
        }
        lowDb.get('accounts').remove().write();
        lowDb.get('links').remove().write();
    }
};