/**
 * Todo database model
 */
'use strict';
const AbstractModel = require("../abstract-model");


class Todo extends AbstractModel {

    constructor() {
        super();
        this.message = undefined;
        this.check = undefined;
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