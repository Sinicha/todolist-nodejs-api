/**
 * Create routes for authentication
 */
'use strict';
const Router = require('koa-router');
const authenticate = require('../middlewares/authenticate');


const router = new Router({
  prefix: '/login'
});

module.exports = function (app) {
  router.post('/', (ctx, next) => {
    authenticate(ctx);
  });


  //app.use(router.allowedMethods());
  app.use(router.routes());
};
