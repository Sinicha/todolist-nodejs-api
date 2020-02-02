/**
 * This abstract class is used to share common field on models
 */
'use strict';


module.exports = class AbstractModel {
    constructor() {
        this.id = undefined;
        this.created_at = undefined;
        this.updated_at = undefined;
    }

    setId(id) {
        this.id = id;
    }

    getId() {
        return this.id;
    }

    setCreatedAt(createdAt) {
        this.created_at = createdAt;
    }

    getCreatedAt() {
        return this.created_at;
    }

    setUpdatedAt(updatedAt) {
        this.updated_at = updatedAt;
    }

    getUpdatedAt() {
        return this.updated_at;
    }


}
