/**
 * Create routes for authentication
 */
'use strict';
const Router = require('koa-router');
const jwt = require('../middlewares/jwt');


const router = new Router({
  prefix: '/todo'
});

module.exports = function (app) {
  /**
   * todo: ALL
   */
  router.get('/', jwt, (ctx, next) => {
    // Get all todo elements links to the user
 
    // Return the list of all
    ctx.status = ctx.status = 400;
    return ctx.body = {
      "todos": [{}]
    };
  });

  /**
   * todo: CREATE
   */
  router.post('/', jwt, (ctx, next) => {
    ctx.status = ctx.status = 400;
    return ctx.body = {
      "todos": [{}]
    };
  });

  /**
   * todo: VIEW
   */
  router.post('/:id', jwt, (ctx, next) => {
    // ctx.params.id;
    ctx.status = ctx.status = 400;
    return ctx.body = {
      "todos": [{}]
    };
  });

  /**
   * todo: UPDATE
   */
  router.put('/:id', jwt, (ctx, next) => {
    // ctx.params.id;
    ctx.status = ctx.status = 400;
    return ctx.body = {
      "todos": [{}]
    };
  });

  /**
   * todo: DELETE
   */
  router.delete('/:id', jwt, (ctx, next) => {
    // ctx.params.id;
    ctx.status = ctx.status = 400;
    return ctx.body = {
      "todos": [{}]
    };
  });

  //app.use(router.allowedMethods());
  app.use(router.routes());
};
