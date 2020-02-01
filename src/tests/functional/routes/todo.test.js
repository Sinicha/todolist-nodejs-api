/**
 * ==================== Todo API test ====================
 */
const request = require('supertest');
const jwt = require('jsonwebtoken');
const configJwt = require('../../../api/configuration/jwt');
let app;


/**
 * Testing todo endpoint
 */
describe('POST /todo/**', function () {

    let token;

    /**
     * Start the server
     */
    before(function () {
        app = require('../../../server');

        const payload = {
            role: 'User',
            userid: '123456789',
            email: 'user.1000@user.new'
        };
        token = jwt.sign(payload, configJwt.SECRET, { algorithm: configJwt.ALGORITHM, expiresIn: configJwt.EXPIRES_IN });
    });

    describe('POST /todo', function () {

        describe('Create a new todo without a message', function () {
            it('Respond with status 201 Created', function (done) {
                request(app)
                    .post('/todo')
                    .set('Accept', 'application/json')
                    .set('Authorization', 'Bearer ' + token)
                    .send({})
                    .set('Accept', 'application/json')
                    .expect(201, done);
            });
        });

        describe('Create a new todo with a message', function () {
            it('Respond with status 201 Created', function (done) {
                request(app)
                    .post('/todo')
                    .set('Accept', 'application/json')
                    .set('Authorization', 'Bearer ' + token)
                    .send({ message: 'John' })
                    .set('Accept', 'application/json')
                    .expect(201, done);
            });
        });

        describe('Create a new todo with a message too long', function () {
            it('Respond with status 422 Unprocessable Entity', function (done) {
                let message = '';
                for (let i = 0; i < 2049; i++) message += Math.random().toString(36).substring(2, 3);
                request(app)
                    .post('/todo')
                    .set('Accept', 'application/json')
                    .set('Authorization', 'Bearer ' + token)
                    .send({ message: message })
                    .set('Accept', 'application/json')
                    .expect(422, done);
            });
        });
    });

    /**
     * Stop the server
     */
    after(function () {
        app.close();
    });
});
