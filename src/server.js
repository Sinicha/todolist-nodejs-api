/**
 * This project is an To-do list API with jwt authentication.
 *
 * @author Sinicha Radosavljevic
 * @link https://github.com/Sinicha/todolist-nodejs-api
 */
'use strict';
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

// Configurations
const port = process.env.PORT || 8000;
const app = new Koa();
app.use(bodyParser({
    enableTypes: ['json'],
    detectJSON: function (ctx) {
        return /\.json$/i.test(ctx.path);
    }
}));

// Register routes
const authRoutes = require('./api/routes/authRoute');
const registerRoutes = require('./api/routes/register');
authRoutes(app);
registerRoutes(app);

// Run the Koa server
app.listen(port);
