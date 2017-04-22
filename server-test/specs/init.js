"use strict";

const fs = require('fs');
const config = require('config');
const Server = require('../../server');
const dbService = require('../../server/services/db');

const chai = require('chai');
const should = chai.should();
const expect = chai.expect;
chai.use(require('chai-http'));

module.exports = describe('Setup app for first time', function () {
    let server = undefined;

    before(function (done) {
        if (fs.existsSync(config.database.lowdb.databaseFileName)) {
            fs.unlinkSync(config.database.lowdb.databaseFileName);
        }

        dbService.init(config.server.dbType);

        server = new Server(config.server);
        server.start(done);
    });

    it('it fail to init with wrong input', (done) => {
        chai.request(server.getExpressApp())
            .get('/init?username=a')
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.a('object');
                done();
            });
    });
    it('it should init first account', (done) => {
        chai.request(server.getExpressApp())
            .get('/init?u=admin&p=admin')
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.be.a('object');
                expect(res.body.username, 'invalid username').to.equal('admin');
                expect(res.body.password, 'invalid password').to.equal('admin');
                expect(res.body.roles).to.be.a('array');
                done();
            });
    });
    it('it fail to re init first account', (done) => {
        chai.request(server.getExpressApp())
            .get('/init?u=admin&p=admin')
            .end((err, res) => {
                expect(res).to.have.status(409);
                expect(res.body).to.be.a('object');
                done();
            });
    });

    after(function (done) {
        if (fs.existsSync(config.database.lowdb.databaseFileName)) {
            fs.unlinkSync(config.database.lowdb.databaseFileName);
        }
        server.stop(done);
    })
});