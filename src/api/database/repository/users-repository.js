/**
 * Users Repository
 */
'use strict';
const EsManager = require('../manager');
const client = new EsManager().getClient();
const INDEX_NAME = "users";


module.exports = class UsersRepository {
    constructor() {

    }

    async findByEmail(email) {
        try {
            const { body } = await client.search({
                index: INDEX_NAME,
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

    async save(username, email, password) {
        try {
            const response = await client.index({
                index: INDEX_NAME,
                body: {
                    username: username,
                    email: email,
                    password: password

                }
            });
            await client.indices.refresh({ index: INDEX_NAME });
            return response;
        }
        catch (error) {
            if (error.name === "ResponseError" && error.message === "index_not_found_exception") {
                return false;
            }
            throw error;
        }
    }
}
