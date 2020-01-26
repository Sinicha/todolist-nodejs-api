/**
 * Authentication function
 * Send a 200 OK Response with the generate Token when informations are correct or 401 Unauthorized
 */
'use strict';
const jwt = require('jsonwebtoken');
const configJwt = require('../configuration/jwt');


/**
 * Todo: Check user in ES
 */
module.exports = function (ctx) {
    if (ctx.request.body.password === 'password') { // Todo: unsafe
        ctx.status = 200;
        ctx.body = {
            token: jwt.sign({ role: 'admin' }, configJwt.SECRET, { algorithm: configJwt.ALGORITHM, expiresIn: configJwt.EXPIRES_IN }),
            message: "Successfully logged in!"
        };
    } else {
        ctx.status = ctx.status = 401;
        ctx.body = {
            message: "Authentication failed"
        };
    }
    return ctx;
}
