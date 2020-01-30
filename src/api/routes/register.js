/**
 * Create routes for register a new user
 */
'use strict';
const Router = require('koa-router');
const niv = require('node-input-validator');
const UsersRepository = require('../database/repository/users-repository');
const Crypt = require('../security/crypt');
const User = require('../database/models/user');


const router = new Router({
    prefix: '/register'
});

module.exports = function (app) {
    // keep this under your error handler
    app.use(niv.koa());

    router.post('/', async (ctx, next) => {
        // Validate inputs
        await ctx.validate({
            username: 'required|minLength:2|maxLength:16',
            email: 'required|email',
            password: 'required|minLength:8|maxLength:64'
        });
        const { username, email, password } = ctx.request.body;

        // Check in database if user exist
        let usersRepository = new UsersRepository();
        const exist = await usersRepository.existByEmail(email.trim().toLowerCase());
        if (exist) {
            ctx.status = 409;
            return ctx.body = {
                message: 'Account already exist'
            };
        }

        // Create the user model
        const hashPass = Crypt.crypt(password);
        const user = new User();
        user.setUsername(username);
        user.setEmail(email.trim().toLowerCase());
        user.setPassword(hashPass);

        // Save the user
        const saveResponse = await usersRepository.save(user, true);
        if (saveResponse.statusCode != 201) {
            ctx.status = 500;
            console.error("An error happened: ", saveResponse);
            return ctx.body = {
                message: 'An error happened.'
            };
        }

        // Return the status
        ctx.status = 201;
        return ctx.body = {
            message: 'Account created'
        };
    });

    app.use(router.routes());
};
