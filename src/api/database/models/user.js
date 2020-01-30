/**
 * User database model
 */
'use strict';
const AbstractModel = require("../abstract-model");


class User extends AbstractModel {

    constructor() {
        super();
        this.username = undefined;
        this.email = undefined;
        this.password = undefined;
    }

    getUsername() {
        return this.username;
    }

    setUsername(value) {
        this.username = value;
    }

    getEmail() {
        return this.email;
    }

    setEmail(value) {
        this.email = value;
    }

    getPassword() {
        return this.password;
    }

    setPassword(value) {
        this.password = value;
    }
}
User._collectionName = "users";

module.exports = User;