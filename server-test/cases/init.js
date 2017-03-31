"use strict";

let config = require('../config');
let fs = require('fs');
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let expect = chai.expect;

chai.use(chaiHttp);
let serverConfig = config.server;
let baseUrl = serverConfig.host + ':' + serverConfig.port;

describe('Setup app for first time', () => {
    it('it fail to init with wrong input', (done) => {
        chai.request(baseUrl)
            .get('/init?username=a')
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.a('object');
                done();
            });
    });
    it('it should init first account', (done) => {
        chai.request(baseUrl)
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
        chai.request(baseUrl)
            .get('/init?username=a&password=a')
            .end((err, res) => {
                expect(res).to.have.status(409);
                expect(res.body).to.be.a('object');
                done();
            });
    });
});