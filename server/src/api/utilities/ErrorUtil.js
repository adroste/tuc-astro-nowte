/**
 * @author progmem
 * @date 02.12.17
 */


/**
 * Static class for providing Error-Helper methods
 */
class ErrorUtil {
    /**
     * Throws error with message '{name} invalid type, {name} is required', status 400 Bad Request if type does not match
     * @param {string} name name of parameter
     * @param {string} type typename as string
     * @param val actual value
     * @throws {Error} message '{name} invalid type, {name} is required', status 400 Bad Request if type does not match
     */
    static requireVarWithType(name, type, val) {
        if (typeof val !== type) {
            const err = new Error(`${name} invalid type, ${name} is required`);
            err.status = 400; // Bad Request
            throw err;
        }
    }


    /**
     * Rethrows error (with custom message if set) but logs it to console before
     * @param {Error} err Error object
     * @param {string} msg custom message
     * @throws {Error} rethrows err (with custom message if set)
     */
    static throwAndLog(err, msg) {
        console.error(err);
        throw new Error(msg !== undefined ? msg : err.message);
    }


    /**
     * Throws error if condition is evaluated to true with msg and statuscode
     * @param {boolean} condition true triggers throw
     * @param {string} msg error message (error.message)
     * @param {number} statuscode status code (error.status)
     * @throws {Error} throws if condition is met with supplied msg and statuscode
     */
    static conditionalThrowWithStatus(condition, msg, statuscode) {
        if (!condition)
            return;
        const err = new Error(msg);
        err.status = statuscode;
        throw err;
    }
}


module.exports = ErrorUtil;
