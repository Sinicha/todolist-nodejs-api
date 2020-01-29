/**
 * ==================== Login API test ====================
 */
const request = require('supertest');
const UsersRepository = require('../../../api/database/repository/users-repository');
const Crypt = require('../../../api/security/crypt');
let app;


/**
 * Testing post login endpoint
 */
describe('POST /login', function () {

    // Create the user
    const user = {
        username: "User1000",
        email: "user.1000@user.new",
        password: "PassWord2020"
    };

    /**
     * Start the server and create a user
     */
    before(function (done) {
        this.timeout(10000); // Fix long time init es index with first user

        app = require('../../../server');

        const hashPass = Crypt.crypt(user.password);
        let usersRepository = new UsersRepository();
        usersRepository.save(user.username, user.email.trim().toLowerCase(), hashPass)
            .then(function (res) {
                if (res === null || res === undefined) {
                    console.error("Login with an known user; saveResponse::", res);
                    throw Error("Login with an known user; saveResponse");
                }
            })
            .then(done, done)
            .catch(function (error) {
                console.log("Error, /Login test, Before(): ", error);
            });
    });

    describe('Login with missing email', function () {
        it('Respond with status 422 Unprocessable Entity', function (done) {
            request(app)
                .post('/login')
                .set('Accept', 'application/json')
                .send({ password: 'null' })
                .set('Accept', 'application/json')
                .expect(422, done);
        });
    });

    describe('Login with missing password', function () {
        it('Respond with status 422 Unprocessable Entity', function (done) {
            request(app)
                .post('/login')
                .set('Accept', 'application/json')
                .send({ email: 'user.unknown@null.null' })
                .set('Accept', 'application/json')
                .expect(422, done);
        });
    });

    describe('Login with missing params', function () {
        it('Respond with status 422 Unprocessable Entity', function (done) {
            request(app)
                .post('/login')
                .set('Accept', 'application/json')
                .send()
                .set('Accept', 'application/json')
                .expect(422, done);
        });
    });

    describe('Login with an unknown user', function () {
        it('Respond with status 401 Unauthorized', function (done) {
            request(app)
                .post('/login')
                .set('Accept', 'application/json')
                .send({ email: 'user.unknown@null.null', password: 'null' })
                .set('Accept', 'application/json')
                .expect(401, done);
        });
    });

    describe('Login with a known user and right password', () => {
        it('Respond with status 200 OK with token', (done) => {
            // Send the request, check status code and token
            request(app)
                .post('/login')
                .set('Accept', 'application/json')
                .send({ email: user.email, password: user.password })
                .set('Accept', 'application/json')
                .expect(200)
                .expect((res) => {
                    if (!('token' in res.body)) throw new Error("missing 'token' key");
                })
                .end(done);
        });
    });

    describe('Login with a known user and wrong password', () => {
        it('Respond with status 401 Unauthorized', (done) => {
            // Send the request, check status code and token
            request(app)
                .post('/login')
                .set('Accept', 'application/json')
                .send({ email: user.email, password: '1234' })
                .set('Accept', 'application/json')
                .expect(401)
                .end(done);
        });
    });

    /**
     * Stop the server
     */
    after(function () {
        app.close();
    });
});
