/**
 * Abstract Repository
 */
'use strict';
const Manager = require('./manager');
const AbstractModel = require("./abstract-model");
const uuidv4 = require('uuid/v4');


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
     * Find an elasticsearch document by id
     * 
     * @param {string} id 
     * @return the db response or null
     */
    async findById(id) {
        try {
            const response = await this.client.get({
                index: this._collectionName,
                id: id,
            });
            return response;
        }
        catch (error) {
            if (error.name === "ResponseError" && error.message === "index_not_found_exception") { // Index Not Found
                return null;
            } else if (error.name === "ResponseError" && error.message === "Response Error") { // Document Not Found
                return null;
            }
            throw error;
        }
    }

    /**
     * Convert a model to a document by keeping only variables
     * 
     * @param {object} mObject - An object to map and save
     * @param {boolean} refresh - Send refresh index signal to database
     * @return the database response
     */
    async save(mObject, refresh = false) {
        const newId = uuidv4().replace(/-/g, '');
        mObject.setId(newId);

        const rObject = this.modelToObject(mObject);
        try {
            const response = await this.client.index({
                index: this._collectionName,
                id: newId,
                body: rObject
            });
            if (refresh) {
                await this.client.indices.refresh({ index: this._collectionName });
            }
            response.datas = mObject;
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
     * Update a model to database
     * 
     * @param {object} mObject - An object to map and save
     * @return the database response
     */
    async update(mObject) {
        if (mObject === null || mObject === undefined || typeof mObject.getId() !== 'string' || mObject.getId() === '') {
            return null;
        }

        const rObject = this.modelToObject(mObject, true);
        try {
            const response = await this.client.update({
                index: this._collectionName,
                id: mObject.getId(),
                body: {doc: rObject}
            });
            response.datas = rObject;
            return response;
        }
        catch (error) {
            throw error;
        }
    }

    /**
     * Save a model to database
     * 
     * @param {object} mObject - An object to map and save
     * @param {boolean} refresh - Send refresh index signal to database
     * @return the database response
     */
    async save(mObject, refresh = false) {
        const newId = uuidv4().replace(/-/g, '');
        mObject.setId(newId);

        const rObject = this.modelToObject(mObject);
        try {
            const response = await this.client.index({
                index: this._collectionName,
                id: newId,
                body: rObject
            });
            if (refresh) {
                await this.client.indices.refresh({ index: this._collectionName });
            }
            response.datas = rObject;
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
     * @param {boolean} isUpdate, boolean that check if the object must be build for update or save
     * @param {boolean} root, Use to know in recursive call to know if we are in root element
     * @return an object ready to save
     */
    modelToObject(model, isUpdate = false, root = true) {
        if (model === undefined || model === null) {
            throw new Error("(modelToObject) The given model is '" + typeof model + "'. 'this._collectionName':'" + this._collectionName + "'");
        }

        let obj = {};
        let arr = Object.getOwnPropertyNames(model);
        for (let prop in arr) {
            let key = arr[prop];
            let value;

            // Save subobject
            if (model[key] !== null && model[key] !== undefined && model[key] instanceof AbstractModel) {
                value = this.modelToObject(model[key], isUpdate, false);
            } else {
                value = model[key];
            }
            if (key.substring(0, 1) === "_") {
                key = key.substring(1);
            }

            // Don't keep undefined vars
            if (typeof value !== 'undefined') {
                obj[key] = value;
            } else {
                // Exception: don't insert date in recusrive call
                if (!root && (key === 'created_at' || key === 'updated_at')) {
                    continue;
                }
                obj[key] = null;
            }
        }

        // Add created and updated date on element
        if (root) {
            if (!isUpdate) {
                obj.created_at = Date.now();
            }
            obj.updated_at = Date.now();
        }

        return obj;
    }
}
