'use strict';
const loginRoutes = require('./routes/login');
const registerRoutes = require('./routes/register');
const todoRoutes = require('./routes/todo');


/**
 * Register api routes on the given app
 */
module.exports = function (app) {
    loginRoutes(app);
    registerRoutes(app);
    todoRoutes(app);
}
