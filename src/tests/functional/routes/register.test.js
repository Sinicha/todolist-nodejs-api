//apiTest.js
const request = require('supertest');
const app = require('../../../server');

//==================== register API test ====================

/**
 * Testing post register endpoint
 */
describe('POST /register', function () {

    describe('Create an user with valide datas', function () {
        it('Respond with status 201 Created', function (done) {
            request(app)
                .post('/register')
                .set('Accept', 'application/json')
                .send({ username: 'John', email: 'john.doe@do.jo', password: 'PaSSwOrd2020' })
                .set('Accept', 'application/json')
                .expect(201, done);
        });
    });

    describe('Create an user with not valide datas', function () {
        it('Respond with status 422 Unprocessable Entity', function (done) {
            request(app)
                .post('/register')
                .set('Accept', 'application/json')
                .send({ username: 'John', email: 'john.@.jo', password: 'pass' })
                .set('Accept', 'application/json')
                .expect(422, done);
        });
    });

    describe('Create an existing user', function () {
        it('Respond with status 409 Conflict', function (done) {
            request(app)
                .post('/register')
                .set('Accept', 'application/json')
                .send({ username: 'John', email: 'john.doe@do.jo', password: 'PaSSwOrd2020' })
                .set('Accept', 'application/json')
                .expect(409, done);
        });
    });

    after(function () {
        app.close();
    });
});
