/**
 * Create routes for authentication
 */
'use strict';
const Router = require('koa-router');
const jwt = require('jsonwebtoken');
const configJwt = require('../configuration/jwt');
const UsersRepository = require('../database/repository/users-repository');
const niv = require('node-input-validator');
const Crypt = require('../security/crypt');


const router = new Router({
  prefix: '/login'
});

module.exports = function (app) {
  // keep this under your error handler
  app.use(niv.koa());

  /**
   * Authenticate a user with email and password and return a jwt
   */
  router.post('/', async (ctx, next) => {
    // Validate inputs
    await ctx.validate({
      email: 'required',
      password: 'required'
    });
    const { email, password } = ctx.request.body;

    // Check if the user exist
    let usersRepository = new UsersRepository();
    const user = await usersRepository.findByEmail(email.trim().toLowerCase());

    // If exist, check the password and send token
    if (user != null && Crypt.compare(password, user._source.password)) {
      const payload = {
        role: 'User',
        email: email.trim().toLowerCase()
      };

      ctx.status = 200;
      return ctx.body = {
        token: jwt.sign(payload, configJwt.SECRET, { algorithm: configJwt.ALGORITHM, expiresIn: configJwt.EXPIRES_IN }),
        message: "Successfully logged in!"
      };
    }

    // If authentication failed, return 401 Unauthorized
    ctx.status = ctx.status = 401;
    return ctx.body = {
      message: "Authentication failed"
    }
  });

  app.use(router.routes());
};
