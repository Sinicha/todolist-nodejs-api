/**
 * Users Repository
 */
'use strict';
const AbstractRepository = require('../abstract-repository');
const Todo = require('../models/todo');


module.exports = class TodoRepository extends AbstractRepository {
    constructor() {
        super(Todo);
    }
}
