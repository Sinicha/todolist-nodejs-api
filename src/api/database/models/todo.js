/**
 * Todo database model
 */
'use strict';
const AbstractModel = require("../abstract-model");


class Todo extends AbstractModel {

    constructor() {
        super();
        this.user = undefined;
        this.message = undefined;
        this.check = undefined;
    }

    getUser() {
        return this.user;
    }

    setUser(value) {
        this.user = value;
    }

    getMessage() {
        return this.message;
    }

    setMessage(value) {
        this.message = value;
    }

    getCheck() {
        return this.check;
    }

    setCheck(value) {
        this.check = value;
    }
}
Todo._collectionName = "todos";

module.exports = Todo;