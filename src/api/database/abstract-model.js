/**
 * This abstract class is used to share common field on models
 */
'use strict';


module.exports = class AbstractModel {
    constructor() {
        this.id = undefined;
    }

    setId(id) {
        this.id = id;
    }

    getId() {
        return this.id;
    }
}
