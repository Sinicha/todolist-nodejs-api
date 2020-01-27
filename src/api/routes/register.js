/**
 * Create routes for register a new user
 */
'use strict';
const Router = require('koa-router');
const niv = require('node-input-validator');


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

        // Todo: Check in database if user exist
        if(!true) {
            ctx.status = 409;
            ctx.body = {
                message: 'Account already exist'
            };
        }

        // Todo: Save the user

        // Return the status
        ctx.status = 201;
        ctx.body = {
            message: 'Account created'
        };
    });

    app.use(router.routes());
};
