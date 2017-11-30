/**
 * @author progmem
 * @date 27.11.17
 */

"use strict";

/**
 * Creates a permission object
 * @param read boolean
 * @param annotate boolean
 * @param edit boolean
 * @param manage boolean
 * @returns {{read: boolean, annotate: boolean, edit: boolean, manage: boolean}}
 */
function createPermissionsObject(read = true, annotate = false, edit = false, manage = false) {
    return fixPermissionsObject({
        read: Boolean(read),
        annotate: Boolean(annotate),
        edit: Boolean(edit),
        manage: Boolean(manage)
    });
}
exports.createPermissionsObject = createPermissionsObject;


/**
 * Fixes permissions on a permission object
 * @param obj permissions object
 * @returns {{read: boolean, annotate: boolean, edit: boolean, manage: boolean}}
 */
function fixPermissionsObject(obj) {
    return {
        read: Boolean(obj.read),
        annotate: Boolean(obj.annotate || obj.edit || obj.manage),
        edit: Boolean(obj.edit || obj.manage),
        manage: Boolean(obj.manage)
    }
}
exports.fixPermissionsObject = fixPermissionsObject;


/**
 * Throws error with message '{name} invalid type, {name} is required', status 400 Bad Request if type does not match
 * @param name name of parameter
 * @param type type name as string
 * @param val actual value
 */
function requireVarWithType(name, type, val) {
    if (typeof val !== type) {
        const err = new Error(`${name} invalid type, ${name} is required`);
        err.status = 400; // Bad Request
        throw err;
    }
}
exports.requireVarWithType = requireVarWithType;


/**
 * Rethrows error (with custom message if set) but logs it to console before
 * @param err Error object
 * @param msg custom message
 */
function throwAndLog(err, msg) {
    console.error(err);
    throw new Error(msg !== undefined ? msg : err.message);
}
exports.throwAndLog = throwAndLog;


/**
 * Throws error if condition is evaluated to true with msg and statuscode
 * @param condition true triggers throw
 * @param msg error message (error.message)
 * @param statuscode status code (error.status)
 */
function conditionalThrowWithStatus(condition, msg, statuscode) {
    if (!condition)
        return;
    const err = new Error(msg);
    err.status = statuscode;
    throw err;
}
exports.conditionalThrowWithStatus = conditionalThrowWithStatus;