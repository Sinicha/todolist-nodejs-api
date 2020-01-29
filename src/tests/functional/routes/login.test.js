/**
 * ==================== Login API test ====================
 */
const request = require('supertest');
const UsersRepository = require('../../../api/database/repository/users-repository');
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
     * Start the server
     */
    before(async () => {
        app = require('../../../server');

        let usersRepository = new UsersRepository();
        const saveResponse = await usersRepository.save(user.username, user.email.trim().toLowerCase(), user.password);
        if (saveResponse === null || saveResponse === undefined) {
            console.error("Login with an known user; saveResponse::", saveResponse);
            return;
        }
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
