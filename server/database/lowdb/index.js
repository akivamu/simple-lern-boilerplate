"use strict";

const _ = require('lodash');
const low = require('lowdb');
const fileAsync = require('lowdb/lib/storages/file-async');
const logger = require('../../logger')(module);

const DEFAULT_SCHEMA = {
    accounts: [],
    links: [],
    settings: {}
};

class LowDb {
    constructor(config) {
        this.config = config;

        logger.info('Init database LowDb: ' + config.databaseFileName);
        this.lowDb = low(config.databaseFileName, {
            storage: fileAsync
        });

        this.lowDb.defaults(DEFAULT_SCHEMA).write();
    }

    get(type, match) {
        return new Promise((resolve, reject) => {
            if (match) {
                resolve(this.lowDb.get(type).find(match).value());
            } else {
                resolve(this.lowDb.get(type).value());
            }
        });
    }

    search(type, match) {
        return new Promise((resolve, reject) => {
            resolve(this.lowDb.get(type).filter(match).value());
        });
    }

    set(path, item) {
        return new Promise((resolve, reject) => {
            this.lowDb.set(path, item).write();
            resolve(item);
        });
    }

    post(type, item) {
        return new Promise((resolve, reject) => {
            this.lowDb.get(type).push(item).write();
            resolve(item);
        });
    }

    patch(type, match, item) {
        return new Promise((resolve, reject) => {
            this.lowDb.get(type).find(match).assign(item).write();
            resolve(item);
        });
    }

    delete(type, match) {
        return new Promise((resolve, reject) => {
            if (this.lowDb.get(type).find(match).value()) {
                this.lowDb.get(type).remove(match).write();
                resolve();
            } else {
                reject('Item not found');
            }
        });
    }

    clear() {
        this.lowDb.setState({});
    }
}

module.exports = LowDb;