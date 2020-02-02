/**
 * ==================== Todo API test ====================
 */
const request = require('supertest');
const expect = require('chai').expect;
require('chai').should();
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


    describe('PUT /todo/{id}', function () {

        describe("Update error a todo element that don't exist", function () {
            it('Respond with status 404 NOT FOUND', function (done) {
                const id = "001122334455667788"
                const updateDoc = {
                    message: "The id don't exist :(",
                    check: false
                };

                request(app)
                    .put('/todo/' + id)
                    .set('Accept', 'application/json')
                    .set('Authorization', token)
                    .send(updateDoc)
                    .expect(404)
                    .end(done);
            });
        });

        describe('Update a todo element of an other user', function () {
            it('Respond with status 401 Unauthorized', function (done) {
                // 1. Generate first fake token
                const payload = {
                    role: 'User',
                    userid: '9876543210',
                    email: 'user.number.one@user.exi'
                };
                let tokenFirst = 'Bearer ' + jwt.sign(payload, configJwt.SECRET, { algorithm: configJwt.ALGORITHM, expiresIn: configJwt.EXPIRES_IN });

                // 2. Create a new todo element with the first token and get the id
                const updateDoc = {
                    message: "Simon, t'as un bout de pomme de terre sur la joue.",
                    check: true
                };
                request(app)
                    .post('/todo')
                    .set('Accept', 'application/json')
                    .set('Authorization', tokenFirst)
                    .send(updateDoc)
                    .then((response) => {
                        const { id } = response.body;

                        // 3. Update the new element with the other user's token
                        request(app)
                            .put('/todo/' + id)
                            .set('Accept', 'application/json')
                            .set('Authorization', token)
                            .send(updateDoc)
                            .expect(401)
                            .end(done);
                    });
            });
        });

        describe('Update a todo element with missing element', function () {
            it('Respond with status 422 Unprocessable Entity', function (done) {
                // 1. Create a new todo element and get the id
                request(app)
                    .post('/todo')
                    .set('Accept', 'application/json')
                    .set('Authorization', token)
                    .send({ message: "" })
                    .then((response) => {
                        const { id } = response.body;
                        const updateDoc = {
                            message: 123456,
                            check: "tru"
                        };

                        // 2. Update the new element
                        request(app)
                            .put('/todo/' + id)
                            .set('Accept', 'application/json')
                            .set('Authorization', token)
                            .send(updateDoc)
                            .expect(422)
                            .end(done);
                    });
            });
        });

        describe('Update a todo element with id', function () {
            it('Respond with status 200 OK and todo db new datas', function (done) {
                // 1. Create a new todo element and get the id
                request(app)
                    .post('/todo')
                    .set('Accept', 'application/json')
                    .set('Authorization', token)
                    .send({ message: "Il est bizarre ce sol, il est pas palpable…" })
                    .then((response) => {
                        const { id, created_at, updated_at } = response.body;
                        const updateDoc = {
                            message: "Le mec… Il s’appelle On ! Donc c’est le phare-à-On ! Le pharaon !",
                            check: true
                        };

                        // 2. Update the new element
                        request(app)
                            .put('/todo/' + id)
                            .set('Accept', 'application/json')
                            .set('Authorization', token)
                            .send(updateDoc)
                            .expect(200) // StatusCode
                            .expect(function (res) { // Body
                                res.body.should.have.property("id", id);
                                res.body.should.have.property("message", updateDoc.message);
                                res.body.should.have.property("check", updateDoc.check);
                                res.body.should.have.property("created_at").to.be.equal(created_at);
                                res.body.should.have.property("updated_at").to.not.be.equal(updated_at);
                            })
                            .end(done);
                    });
            });
        });

    });


    describe('DELETE /todo/{id}', function () {

        describe("Delete a todo element that don't exist", function () {
            it('Respond with status 404 NOT FOUND', function (done) {
                const id = "001122334455667788"
                request(app)
                    .delete('/todo/' + id)
                    .set('Accept', 'application/json')
                    .set('Authorization', token)
                    .send()
                    .expect(404)
                    .end(done);
            });
        });

        describe('Delete a todo element of an other user', function () {
            it('Respond with status 401 Unauthorized', function (done) {
                // 1. Generate first fake token
                const payload = {
                    role: 'User',
                    userid: '9876543210',
                    email: 'user.number.one@user.exi'
                };
                let tokenFirst = 'Bearer ' + jwt.sign(payload, configJwt.SECRET, { algorithm: configJwt.ALGORITHM, expiresIn: configJwt.EXPIRES_IN });

                // 2. Create a new todo element with the first token and get the id
                request(app)
                    .post('/todo')
                    .set('Accept', 'application/json')
                    .set('Authorization', tokenFirst)
                    .send({ message: "Here's Johnny!" })
                    .then((response) => {
                        const { id } = response.body;

                        // 3. Delete the new element with the other user's token
                        request(app)
                            .delete('/todo/' + id)
                            .set('Accept', 'application/json')
                            .set('Authorization', token)
                            .send()
                            .expect(401)
                            .end(done);
                    });
            });
        });

        describe("Delete a todo element that exist", function () {
            it('Respond with status 204 NO CONTENT', function (done) {
                // 1. Create a new todo element and get the id
                request(app)
                    .post('/todo')
                    .set('Accept', 'application/json')
                    .set('Authorization', token)
                    .send({ message: "I'll be back." })
                    .then((response) => {
                        const { id } = response.body;

                        // 2. Delete the new element
                        request(app)
                            .delete('/todo/' + id)
                            .set('Accept', 'application/json')
                            .set('Authorization', token)
                            .send()
                            .expect(204)
                            .end(done);
                    });
            });
        });

    });


    describe('GET /todo', function () {

        describe('View all todo elements of the user with no todos', function () {
            it('Respond with status 200 OK and user\'s todos in db', function (done) {
                // 1. Generate first fake token
                const payload = {
                    role: 'User',
                    userid: '000000002020',
                    email: 'get.all@obi.zero'
                };
                let tokenFirst = 'Bearer ' + jwt.sign(payload, configJwt.SECRET, { algorithm: configJwt.ALGORITHM, expiresIn: configJwt.EXPIRES_IN });

                request(app)
                    .get('/todo')
                    .set('Accept', 'application/json')
                    .set('Authorization', tokenFirst)
                    .send()
                    .expect(200) // StatusCode
                    .expect(function (res) { // Body
                        res.body.should.have.property("todos").to.be.an('array')
                        res.body.should.have.property("todos").to.have.lengthOf(0);
                        res.body.should.have.property("total").to.be.a('number');
                    })
                    .end(done);
            });
        });

        describe('View all todo elements of the user with 1 todo', function () {
            it('Respond with status 200 OK and user\'s todos in db', function (done) {
                // 1. Generate first fake token
                const payload = {
                    role: 'User',
                    userid: '000000000066',
                    email: 'get.all@obi.one'
                };
                let tokenFirst = 'Bearer ' + jwt.sign(payload, configJwt.SECRET, { algorithm: configJwt.ALGORITHM, expiresIn: configJwt.EXPIRES_IN });

                // 2. Create a new todo element and get the id
                request(app)
                    .post('/todo')
                    .set('Accept', 'application/json')
                    .set('Authorization', tokenFirst)
                    .send({ message: 'Hello there' })
                    .then((response) => {
                        // 3. Wait for ES refresh
                        setTimeout(function () {
                            // 4. View all elements
                            request(app)
                                .get('/todo')
                                .set('Accept', 'application/json')
                                .set('Authorization', tokenFirst)
                                .send()
                                .expect(200) // StatusCode
                                .expect(function (res) { // Body
                                    res.body.should.have.property("todos").to.be.an('array')
                                    res.body.should.have.property("todos").to.have.lengthOf(1);
                                    res.body.should.have.property("total").to.be.a('number');
                                })
                                .end(done);
                        }, 1500);
                    });
            });
        });

        describe('View all todo elements of the user with 2 todos', function () {
            it('Respond with status 200 OK and user\'s todos in db', function (done) {
                // 1. Generate first fake token
                const payload = {
                    role: 'User',
                    userid: '000000000077',
                    email: 'get.all@obi.two'
                };
                let tokenFirst = 'Bearer ' + jwt.sign(payload, configJwt.SECRET, { algorithm: configJwt.ALGORITHM, expiresIn: configJwt.EXPIRES_IN });

                // 2. Create a new todo elements and get the id
                new Promise(function (resolve, reject) {
                    const response = request(app)
                        .post('/todo')
                        .set('Accept', 'application/json')
                        .set('Authorization', tokenFirst)
                        .send({
                            message: 'People, who can’t throw something important away, can never hope to change anything.'
                        });
                    resolve(response);
                })
                    .then(function (result) {
                        return request(app)
                            .post('/todo')
                            .set('Accept', 'application/json')
                            .set('Authorization', tokenFirst)
                            .send({
                                message: 'Thinking you’re no-good and worthless is the worst thing you can do'
                            });
                    })
                    .then(function (result) {
                        return setTimeout(function () {
                            request(app)
                                .get('/todo')
                                .set('Accept', 'application/json')
                                .set('Authorization', tokenFirst)
                                .send()
                                .expect(200)
                                .expect(function (res) {
                                    res.body.should.have.property("todos").to.be.an('array')
                                    res.body.should.have.property("todos").to.have.lengthOf(2);
                                    res.body.should.have.property("total").to.be.a('number');
                                })
                                .end(done);
                        }, 1500);
                    });;
            });
        });

        describe('View all todo elements of the user with 2 todos and from 1', function () {
            it('Respond with status 200 OK and user\'s todos in db', function (done) {
                // 1. Generate first fake token
                const payload = {
                    role: 'User',
                    userid: '000000000088',
                    email: 'get.all@obi.three'
                };
                let tokenFirst = 'Bearer ' + jwt.sign(payload, configJwt.SECRET, { algorithm: configJwt.ALGORITHM, expiresIn: configJwt.EXPIRES_IN });

                // 2. Create a new todo elements and get the id
                new Promise(function (resolve, reject) {
                    const response = request(app)
                        .post('/todo')
                        .set('Accept', 'application/json')
                        .set('Authorization', tokenFirst)
                        .send({
                            message: 'La vie, c\'est comme une bicyclette, il faut avancer pour ne pas perdre l\'équilibre.'
                        });
                    resolve(response);
                })
                    .then(function (result) {
                        return request(app)
                            .post('/todo')
                            .set('Accept', 'application/json')
                            .set('Authorization', tokenFirst)
                            .send({
                                message: 'Pour critiquer les gens il faut les connaître, et pour les connaître, il faut les aimer.'
                            });
                    })
                    .then(function (result) {
                        return setTimeout(function () {
                            request(app)
                                .get('/todo?from=1')
                                .set('Accept', 'application/json')
                                .set('Authorization', tokenFirst)
                                .send()
                                .expect(200)
                                .expect(function (res) {
                                    res.body.should.have.property("todos").to.be.an('array')
                                    res.body.should.have.property("todos").to.have.lengthOf(1);
                                    res.body.should.have.property("total").to.be.a('number');
                                })
                                .end(done);
                        }, 1500);
                    });;
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
