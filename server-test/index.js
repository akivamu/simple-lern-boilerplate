"use strict";

const fs = require('fs');
const config = require('./config');
const Server = require('../server');

const server = new Server(config.server);

describe('Full testing', () => {
    before(function (done) {
        server.start(done);
    });

    require('./cases/init');

    after(function () {
        fs.unlinkSync(config.server.databaseFileName);
    })
});