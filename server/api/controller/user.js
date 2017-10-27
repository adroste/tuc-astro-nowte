/**
 * @author progmem
 * @date 22.10.17
 */

'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user').User;

const PRIVATE_KEY = 'magmag';
const SALTING_ROUNDS = 10;


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

/**
 * Creates new user by
 * 1. hashing pw via bcrypt,
 * 2. creating user instance,
 * 3. saving user instance to db
 * @param name
 * @param email
 * @param password
 * @param cb fn(err, user)
 */
module.exports.createUser = (name, email, password, cb) => {
    return bcrypt.hash(password, SALTING_ROUNDS, (err, hash) => {
        if (err)
            return cb(err);

        // TODO create root folder
        const user = new User({
            'name': name,
            'email': email,
            'password': hash
        });

        user.save((err, user) => {
            if (err)
                //return cb(new Error('user could not get created'))
                return cb(err);
            return cb(null, user);
        });
    });
};