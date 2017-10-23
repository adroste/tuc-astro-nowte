/**
 * @author progmem
 * @date 22.10.17
 */

'use strict';

const jwt = require('jsonwebtoken');
const privateKey = 'magmag';


/**
 * Creates a JWT containing userId and sessionId.
 * @param userId
 * @param sessionId
 * @returns {String} jwt
 */
function createJwt(userId, sessionId) {
    return jwt.sign({
        userId: userId,
        sessionId: sessionId
    }, privateKey, {
        algorithm: 'HS256'
    });
}

/**
 * Verifies und returns the payload of a jwt. Content could be bullsh*t if private key got leaked.
 * @param jwt
 * @returns {{userID: String, sessionId: String}}
 * @throws error if jwt is invalid
 */
function extractJwt(jwt) {
    // does not verify
    return jwt.verify(
        jwt,
        privateKey, {
        algorithms: ['HS256']
    });
}

function login(email, password) {
    throw new Error('Not implemented yet');
    // return jwt
}

function validateSession(userId, sessionId) {
    throw new Error('Not implemented yet');
}

function logout(userId, sessionId) {
    throw new Error('Not implemented yet');
}

function createUser(name, email, password) {
    throw new Error('Not implemented yet');
}