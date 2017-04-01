'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const sessionService = require('./services/session');
const dbService = require('./services/db');

class Server {
    constructor(config) {
        this.config = config;

        console.log('Creating server:');
        console.log('   Host:          ' + config.host);
        console.log('   Port:          ' + config.port);

        dbService.init(this.config.databaseFileName);

        this.app = express();

        this.app.use(sessionService.init(this.config.sessionCookieIdName));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));

        // Rest
        this.app.use('/rest/auth', require('./rest/auth'));
        this.app.use('/', require('./rest/common'));
    }

    start(done) {
        const that = this;
        this.httpServer = this.app.listen(this.config.port, this.config.host, function onStart(err) {
            if (err) {
                console.log(err);
            }
            console.info('==> Listening on http://%s:%s', that.config.host, that.config.port);
            done && done();
        });
    };

    stop(done) {
        this.httpServer.close(done);
    }

    getExpressApp() {
        return this.app;
    }
}

module.exports = Server;