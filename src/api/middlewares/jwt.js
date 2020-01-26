/**
 * Check the given token with the JWT Configuration
 */
'use strict';
const koaJwt = require('koa-jwt');
const configJwt = require('../configuration/jwt');


module.exports = koaJwt({
    algorithms: configJwt.ALGORITHM,
    secret: configJwt.SECRET
});
