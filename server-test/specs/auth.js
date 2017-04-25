"use strict";

const fs = require('fs-extra');
const path = require('path');
const config = require('config');
const Server = require('../../server');
const dbService = require('../../server/services/db');

const chai = require('chai');
const should = chai.should();
const expect = chai.expect;
chai.use(require('chai-http'));

module.exports = describe('Authentication', function () {
    let server = undefined;
    const DB_FILE_PATH = __dirname + '/../resources/db.test.json';

    before(function (done) {
        if (fs.existsSync(config.database.lowdb.databaseFileName)) {
            fs.unlinkSync(config.database.lowdb.databaseFileName);
        }
        fs.copySync(path.resolve(DB_FILE_PATH), config.database.lowdb.databaseFileName);

        dbService.init(config.server.dbType);

        server = new Server(config.server);
        server.start(done);
    });

    it('it success to login', (done) => {
        chai.request(server.getExpressApp())
            .post('/rest/auth/login')
            .send({
                username: 'admin',
                password: 'admin'
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('token');
                done();
            });
    });
    it('it fail to login with incorrect info', (done) => {
        chai.request(server.getExpressApp())
            .post('/rest/auth/login')
            .send({
                username: '.find(username:',
                password: 'wrong'
            })
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body).to.be.a('object');
                done();
            });
    });
    it('it success to use token', (done) => {
        chai.request(server.getExpressApp())
            .post('/rest/auth/login')
            .send({
                username: 'admin',
                password: 'admin'
            })
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('token');
                return res.body.token;
            })
            .then((token) => {
                chai.request(server.getExpressApp())
                    .get('/rest/me').query({token: token})
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.a('object');
                        expect(res.body).to.have.property('password').and.equal('admin');
                        done();
                    });
            });
    });
    it('it fail to use wrong token', (done) => {
        chai.request(server.getExpressApp())
            .get('/rest/me').query({token: 'wrong token'})
            .end((err, res) => {
                expect(res).to.have.status(401);
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