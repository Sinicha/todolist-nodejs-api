/**
 * Create routes for authentication
 */
'use strict';
const Router = require('koa-router');
const jwt = require('../middlewares/jwt');
const TodosRepository = require('../database/repository/todo-repository');
const Todo = require('../database/models/todo');

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
   * CREATE
   */
  router.post('/', jwt, async (ctx, next) => {
    // Get user infos from jwt
    const userId = ctx.state.user.userid; // Todo: helper get token data

    // Valide infos
    await ctx.validate({
      message: 'maxLength:2048'
    });
    const message = ctx.request.body.message || "";

    // Create todo db model
    const todo = new Todo();
    todo.setCheck(false);
    todo.setUser(userId);
    todo.setMessage(message);

    // Save the todo model to db
    let todosRepository = new TodosRepository();
    const saveResponse = await todosRepository.save(todo, false);
    if (saveResponse.statusCode != 201) {
      ctx.status = 500;
      console.error("An error happened: ", saveResponse);
      return ctx.body = {
        message: 'An error happened.'
      };
    }

    // Send back the status
    ctx.status = ctx.status = 201;
    return ctx.body = saveResponse.datas;
  });

  /**
   * todo: VIEW
   */
  router.get('/:id', jwt, async (ctx, next) => {
    let todosRepository = new TodosRepository();
    const findResponse = await todosRepository.findById(ctx.params.id);

    if (findResponse) {
      ctx.status = ctx.status = 200;
      return ctx.body = findResponse.body._source;
    } else {
      ctx.status = ctx.status = 404;
      return ctx.body = {};
    }
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

  app.use(router.routes());
};
