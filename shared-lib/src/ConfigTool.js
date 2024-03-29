/**
 * @author progmem
 * @date 29.10.17
 */

'use strict';

const ENV = process.env.NODE_ENV;
let configJSON;

if (ENV === 'production')
    configJSON = require('../config/production.json');
else
    configJSON = require('../config/development.json');

/**
 * ConfigTool class for reading json configs based on NODE_ENV
 */
class ConfigTool {

    /**
     * Reads property from config
     * @param {string} prop property to return
     * @returns {Object} requested property object
     * @throws {Error} throws with msg: 'prop is not a valid string' if prop is no string
     * @throws {Error} throws if config does not specify requested property
     */
    static get(prop) {
        if (typeof prop !== 'string')
            throw new Error('prop is not a valid string');

        const split = prop.split('.');
        let res = configJSON;
        for (let i = 0; i < split.length; i++) {
            if (!res.hasOwnProperty(split[i]))
                throw new Error('config has no property: ' + prop);
            res = res[split[i]];
        }

        return res;
    }
}
module.exports = ConfigTool;
