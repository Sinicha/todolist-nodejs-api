/**
 * Create routes for register a new user
 */
'use strict';
const Router = require('koa-router');
const niv = require('node-input-validator');
const UsersRepository = require('../database/repository/users-repository');


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

        // Save the user
        const saveResponse = await usersRepository.save(username, email.trim().toLowerCase(), password);
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
