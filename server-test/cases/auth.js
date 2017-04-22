"use strict";

const fs = require('fs');

const chai = require('chai');
const should = chai.should();
const expect = chai.expect;
chai.use(require('chai-http'));

const config = require('config');
const Server = require('../../server');
const server = new Server(config.server);

describe('Authentication', () => {
    before(function (done) {
        fs.createReadStream(__dirname + '/../resources/' + config.database.lowdb.databaseFileName).pipe(fs.createWriteStream(config.database.lowdb.databaseFileName));
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
    it('it success to resume auth session when user comeback', (done) => {
        const agent = chai.request.agent(server.getExpressApp());
        agent.post('/rest/auth/login')
            .send({
                username: 'admin',
                password: 'admin'
            })
            .then(function () {
                agent.get('/rest/auth/sync')
                    .then(function (res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.a('object');
                        expect(res.body).to.have.property('username').and.equal('admin');
                        done();
                    });
            })
    });
    it('it fail to resume auth session when not logged in', (done) => {
        const agent = chai.request.agent(server.getExpressApp());
        agent.get('/rest/auth/sync')
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.be.empty;
                done();
            });
    });
    it('it success to logout', (done) => {
        const agent = chai.request.agent(server.getExpressApp());
        agent.post('/rest/auth/login')
            .send({
                username: 'admin',
                password: 'admin'
            })
            .then(function () {
                agent.get('/rest/auth/logout')
                    .then(function (res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.empty;
                        done();
                    });
            })
    });
    it('it fail to logout without login', (done) => {
        chai.request(server.getExpressApp())
            .get('/rest/auth/logout')
            .end((err, res) => {
                expect(res).to.have.status(401);
                done();
            });
    });

    after(function (done) {
        fs.unlinkSync(config.database.lowdb.databaseFileName);
        server.stop(done);
    })
});