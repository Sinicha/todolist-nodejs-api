/**
 * This project is an To-do list API with jwt authentication.
 *
 * @author Sinicha Radosavljevic
 * @link https://github.com/Sinicha/todolist-nodejs-api
 */
'use strict';
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const routes = require('./api/routes');

// Configurations
const port = process.env.PORT || 8000;
const app = new Koa();
app.use(bodyParser({
    enableTypes: ['json'],
    detectJSON: function (ctx) {
        return /\.json$/i.test(ctx.path);
    }
}));

// Register the api routes
routes(app);

// Run the Koa server
let server = app.listen(port);
module.exports = server
