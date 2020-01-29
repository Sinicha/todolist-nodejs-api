/**
 * Functions for crypt and compare
 */
'use strict';
const bcrypt = require('bcryptjs');
const configSec = require('../configuration/security');


module.exports = {
    /**
     * Hash a string with the security configuration
     * 
     * @param {string} str - A string not hash
     * @return {string} The hash of the string
     */
    crypt: function (str) {
        const salt = bcrypt.genSaltSync(configSec.SALT);
        return bcrypt.hashSync(str, salt);
    },

    /**
     * Compare a string with a hash string
     * 
     * @param {string} str - A string not hash
     * @param {string} hashStr - A string hash
     * @return {boolean} The comparaison result
     */
    compare: function (str, hashStr) {
        return bcrypt.compareSync(str, hashStr);
    }
}