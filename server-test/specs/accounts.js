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

module.exports = describe('Account management', () => {
    let server = undefined;
    let adminToken = undefined;
    let userToken = undefined;
    const DB_FILE_PATH = __dirname + '/../resources/db.test.json';

    before(function (done) {
        if (fs.existsSync(config.database.lowdb.databaseFileName)) {
            fs.unlinkSync(config.database.lowdb.databaseFileName);
        }
        fs.copySync(path.resolve(DB_FILE_PATH), config.database.lowdb.databaseFileName);

        dbService.init(config.server.dbType);

        server = new Server(config.server);
        server.start(() => {
            chai.request(server.getExpressApp()).post('/rest/auth/login').send({
                username: 'admin',
                password: 'admin'
            }).then((res) => {
                adminToken = res.body.token;
                chai.request(server.getExpressApp()).post('/rest/auth/login').send({
                    username: 'user',
                    password: 'user'
                }).then((res) => {
                    userToken = res.body.token;
                    done()
                });
            });
        });
    });

    it('it fail when not login', (done) => {
        chai.request(server.getExpressApp())
            .get('/rest/accounts')
            .end((err, res) => {
                expect(res).to.have.status(401);
                done();
            });
    });

    it('it fail when logged in but not admin', (done) => {
        chai.request(server.getExpressApp())
            .get('/rest/accounts').set('Authorization', 'Bearer ' + userToken)
            .end(function (err, res) {
                expect(res).to.have.status(403);
                done();
            });
    });

    it('it success when logged in with admin', (done) => {
        chai.request(server.getExpressApp())
            .get('/rest/accounts').set('Authorization', 'Bearer ' + adminToken)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('it success to create new account', (done) => {
        chai.request(server.getExpressApp())
            .post('/rest/accounts').set('Authorization', 'Bearer ' + adminToken)
            .send({
                username: 'test',
                password: 'test',
                roles: ['USER']
            }).end(function (err, res) {
            expect(res).to.have.status(200);
            done();
        });
    });

    it('it success to edit account', (done) => {
        chai.request(server.getExpressApp())
            .patch('/rest/accounts').set('Authorization', 'Bearer ' + adminToken)
            .send({
                username: 'test',
                password: 'new_password',
                roles: ['USER']
            }).end(function (err, res) {
            expect(res).to.have.status(200);
            done();
        });
    });

    it('it success to delete account', (done) => {
        chai.request(server.getExpressApp())
            .delete('/rest/accounts/test').set('Authorization', 'Bearer ' + adminToken)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('it fail to delete non exist account', (done) => {
        chai.request(server.getExpressApp())
            .delete('/rest/accounts/test').set('Authorization', 'Bearer ' + adminToken)
            .end(function (err, res) {
                expect(res).to.have.status(500);
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