'use strict';
const { Client } = require('@elastic/elasticsearch')
const configDb = require('../configuration/database');

// The client instance is global
let gClient;


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
        if (typeof gClient === 'undefined') {
            gClient = new Client({ 
                node: configDb.protocol + '://' + configDb.host + ':' + configDb.port.toString()
            });
        }
        this.client = gClient;
    }

    getClient() {
        return this.client;
    }
}
