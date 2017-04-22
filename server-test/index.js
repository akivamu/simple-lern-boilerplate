"use strict";
const config = require('config');

const dbService = require('../server/services/db');
dbService.init(config.server.dbType);

describe('Full testing', () => {
    require('./cases/init');
    require('./cases/auth');
});