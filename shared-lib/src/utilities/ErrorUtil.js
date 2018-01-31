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
     * Rethrows error (with custom message & status if set) but logs it to console before
     * @param {Error} err Error object
     * @param {string} msg custom message
     * @param {number} statuscode status code (error.status), defaults to 500
     * @throws {Error} rethrows err (with custom message if set)
     */
    static throwAndLog(err, msg, statuscode = 500) {
        // TODO error log does not contain calling method
        console.error(err);
        const err2 = new Error(msg !== undefined ? msg : err.message);
        err2.status = statuscode;
        throw err2;
    }


    /**
     * Throws error if condition is evaluated to true with msg and statuscode
     * @param {boolean} condition true triggers throw
     * @param {string} msg error message (error.message)
     * @param {number} statuscode status code (error.status)
     * @param {string|null} authHeader authentication header (null if not set)
     * @throws {Error} throws if condition is met with supplied msg and statuscode
     */
    static conditionalThrowWithStatus(condition, msg, statuscode, authHeader = null) {
        if (!condition)
            return;
        const err = new Error(msg);
        err.status = statuscode;
        if (authHeader !== null)
            err.authHeader = authHeader;
        throw err;
    }


    /**
     * Throws error if permissions out of range
     * @param {number} n number to check
     * @throws {Error} msg: 'permissions out of range' with status: 400 if permissions n is out of range
     */
    static checkPermissionsInRange(n) {
        if (n >= 0 && n <= 5)
            return;

        const err = new Error('permissions out of range');
        err.status = 400;
        throw err;
    }


    /**
     * Throws error if path does not start and end with a '/'
     * @param {string} path path to check
     * @throws {Error} msg: 'invalid path format' with status: 400 if provided path does not start and end with a '/'
     */
    static checkPathFormat(path) {
        this.conditionalThrowWithStatus(
            path.charAt(0) !== '/' || path.charAt(path.length - 1) !== '/',
            'invalid path format', 400);
    }
}


module.exports = ErrorUtil;
