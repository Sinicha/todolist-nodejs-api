/**
 * Abstract Repository
 */
'use strict';
const Manager = require('./manager');
const AbstractModel = require("./abstract-model");


module.exports = class AbstractRepository extends Manager {

    /**
     * Constructor of AbstractRepository
     *
     * @param model
     */
    constructor(model) {
        super();
        if (model === undefined
            || model === null
            || !('_collectionName' in model)
            || typeof model._collectionName !== "string"
            || model._collectionName === "") {
            throw new TypeError('Abstract class "AbstractRepository" cannot load CollectionName.');
        }
        this._collectionName = model._collectionName;
    }

    /**
     * Convert a model to a document by keeping only variables
     * 
     * @param {object} mObject - A mapped object 
     * @param {boolean} refresh - Send refresh index signal to database
     * @return the database response
     */
    async save(mObject, refresh = false) {
        try {
            const response = await this.client.index({
                index: this._collectionName,
                body: mObject
            });
            await this.client.indices.refresh({ index: this._collectionName });
            return response;
        }
        catch (error) {
            if (error.name === "ResponseError" && error.message === "index_not_found_exception") {
                return false;
            }
            throw error;
        }
    }

    /**
     * Convert a model to a document by keeping only variables
     *
     * @param {object} model - A database object class that must be map to object for save
     * @param update, boolean that check if the object must be build for update or save
     * @return an object ready to save
     */
    modelToObject(model, update = false) {
        if (model === undefined || model === null) {
            throw new Error("(modelToObject) The given model is null. 'this._collectionName':'" + this._collectionName + "'");
        }

        let obj = {};
        let arr = Object.getOwnPropertyNames(model);
        for (let prop in arr) {
            let key = arr[prop];
            let value;

            // Save subobject
            if (model[key] !== null && model[key] !== undefined && model[key] instanceof AbstractModel) {
                value = this.modelToObject(model[key]);
            } else {
                value = model[key];
            }
            if (key.substring(0, 1) === "_") {
                key = key.substring(1);
            }

            // Don't keep undefined vars when update
            if (value !== undefined) {
                obj[key] = value;
            } else {
                if (!update) {
                    obj[key] = null;
                }
            }
        }
        return obj;
    }
}
