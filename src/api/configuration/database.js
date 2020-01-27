/**
 * Configuration for database
 */
'use strict';


module.exports = {
    protocol: 'http',
    host: process.env.ES_HOST || 'localhost',
    port: process.env.ES_PORT || 9200
}
