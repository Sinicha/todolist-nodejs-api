/**
 * ==================== Todo API test ====================
 */
const request = require('supertest');
const should = require('chai').should();
const jwt = require('jsonwebtoken');
const configJwt = require('../../../api/configuration/jwt');
let app;


/**
 * Testing todo endpoint
 */
describe('Route /todo/**', function () {

    let token;

    /**
     * Start the server
     */
    before(function () {
        app = require('../../../server');

        // Generate fake token
        const payload = {
            role: 'User',
            userid: '123456789',
            email: 'user.1000@user.new'
        };
        token = 'Bearer ' + jwt.sign(payload, configJwt.SECRET, { algorithm: configJwt.ALGORITHM, expiresIn: configJwt.EXPIRES_IN });
    });

    describe('POST /todo', function () {

        describe('Create a new todo without a message', function () {
            it('Respond with status 201 Created', function (done) {
                request(app)
                    .post('/todo')
                    .set('Accept', 'application/json')
                    .set('Authorization', token)
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
                    .set('Authorization', token)
                    .send({ message: 'I am Groot!' })
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
                    .set('Authorization', token)
                    .send({ message: message })
                    .set('Accept', 'application/json')
                    .expect(422, done);
            });
        });
    });


    describe('GET /todo/{id}', function () {

        describe('View a todo element with id', function () {
            it('Respond with status 200 OK and todo db datas', function (done) {
                const message = 'I am Groot! I am Groot!';
                // 1. Create a new todo element and get the id
                request(app)
                    .post('/todo')
                    .set('Accept', 'application/json')
                    .set('Authorization', token)
                    .send({ message: message })
                    .then((response) => {
                        const { id } = response.body;

                        // 2. View the new element
                        request(app)
                            .get('/todo/' + id)
                            .set('Accept', 'application/json')
                            .set('Authorization', token)
                            .send()
                            .expect(200) // StatusCode
                            .expect(function (res) { // Body
                                res.body.should.have.property("id").to.be.a('string');
                                res.body.should.have.property("message", message);
                                res.body.should.have.property("check").to.be.a('boolean');
                                res.body.should.have.property("created_at").to.be.a('number');
                                res.body.should.have.property("updated_at").to.be.a('number');
                            })
                            .end(done);
                    });
            });
        });

        describe('View a todo element with non existant id', function () {
            it('Respond with status 404 Not Found', function (done) {
                request(app)
                    .get('/todo/' + '7894561230')
                    .set('Accept', 'application/json')
                    .set('Authorization', token)
                    .send({})
                    .set('Accept', 'application/json')
                    .expect(404, done);
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
