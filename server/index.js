'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./logger')(module);

class Server {
    constructor(config) {
        this.config = config;

        logger.info('Creating server for ' + config.env);
        logger.info('   Host:          ' + config.host);
        logger.info('   Port:          ' + config.port);

        this.app = express();

        this.app.all('*', function (req, res, next) {
            res.header('Access-Control-Allow-Credentials', true);
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
            next();
        });

        this.app.options('*', function (req, res, next) {
            res.sendStatus(200);
        });

        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));

        // Rest
        this.app.use('/rest/auth', require('./rest/auth'));
        this.app.use('/rest/accounts', require('./rest/accounts'));
        this.app.use('/rest/me', require('./rest/me'));
        this.app.use('/', require('./rest/common'));
    }

    start(done) {
        const that = this;
        this.httpServer = this.app.listen(this.config.port, this.config.host, function onStart(err) {
            if (err) {
                logger.error(err);
            }
            logger.info('==> Listening on http://%s:%s', that.config.host, that.config.port);
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