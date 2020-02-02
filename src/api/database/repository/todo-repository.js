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

    /**
     * Count all elasticsearch documents by user id
     * 
     * @param {string} userId 
     * @return the db response or null
     */
    async countWithUserId(userId) {
        try {
            const { body } = await this.client.count({
                index: this._collectionName,
                body: {
                    query: {
                        match: {
                            "user.keyword": userId
                        }
                    }
                }
            });
            return body.count;
        } catch (error) {
            if (error.name === "ResponseError" && error.message === "index_not_found_exception") {
                return 0;
            }
            throw error;
        }
    }

    /**
     * Find all elasticsearch documents by user id
     * 
     * @param {string} userId 
     * @return the db response or null
     */
    async findAllByUserId(userId, from = 0, size = 10) {
        try {
            const { body } = await this.client.search({
                index: this._collectionName,
                body: {
                    from: from,
                    size: size,
                    query: {
                        match: {
                            "user.keyword": userId
                        }
                    },
                    sort: {
                        "updated_at": { "order": "asc" }
                    }
                }
            });
            if (body.hits.total.value > 0) {
                return body.hits.hits;
            }
        } catch (error) {
            if (error.name === "ResponseError" && error.message === "index_not_found_exception") {
                return null;
            }
            throw error;
        }
        return null;
    }
}
