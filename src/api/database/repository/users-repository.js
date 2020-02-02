/**
 * Users Repository
 */
'use strict';
const AbstractRepository = require('../abstract-repository');
const User = require('../models/user');


module.exports = class UsersRepository extends AbstractRepository {
    constructor() {
        super(User);
    }

    async findByEmail(email) {
        try {
            const { body } = await this.client.search({
                index: this._collectionName,
                body: {
                    query: {
                        match: {
                            "email.keyword": email
                        }
                    }
                }
            });
            if (body.hits.total.value > 0) {
                return body.hits.hits[0];
            }
        }
        catch (error) {
            if (error.name === "ResponseError" && error.message === "index_not_found_exception") {
                return null;
            }
            throw error;
        }
        return null;
    }

    async existByEmail(email) {
        let user = await this.findByEmail(email);
        if (user !== null) {
            return true;
        }
        return false;
    }
}
