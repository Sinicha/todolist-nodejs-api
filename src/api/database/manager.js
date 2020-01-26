'use strict';
const { Client } = require('@elastic/elasticsearch')
const configDb = require('../configuration/database');

// The manager is global in this file
let client;


/**
 * This is the manager for Elasticsearch. It's use for initiate the connection only once.
 */
module.exports = class EsManager {
    constructor() {
        this.init();
    }

    /**
     * Initialize once the elasticsearch connection
     */
    init() {
        if (typeof client === 'undefined') {
            client = new Client({ 
                node: configDb.protocol + '://' + configDb.host + ':' + configDb.port.toString()
            });
        }
        this.client = client;
    }

    getClient() {
        return this.client;
    }
}
