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
 * 1. checking password length (8 <= pw.len <= 100),
 * 1. hashing pw via bcrypt,
 * 2. creating user instance,
 * 3. saving user instance to db
 * and returning db entry
 * and returning { "success": true }
 * @param name
 * @param email
 * @param password
 * @param cb fn(err, success)
 */
module.exports.createUser = (name, email, password, cb) => {
    if (typeof password !== 'string') {
        const err = new Error('password invalid type');
        err.status = 400; // Bad Request
        return cb(err);
    }
    if (password.length < 8 || password.length > 100) {
        const err = new Error('password must be between 8 and 100 characters');
        err.status = 400; // Bad Request
        return cb(err);
    }

    bcrypt.hash(password, SALTING_ROUNDS, (err, hash) => {
        if (err){
            const err = new Error('password invalid type');
            err.status = 400; // Bad Request
            return cb(err);
        }

        // TODO create root folder
        const user = new User({
            'name': name,
            'email': email,
            'password': hash
        });

        user.save((err, userEntry) => {
            if (err) {
                if (err.message.startsWith('User validation failed')) {
                    err.status = 400; // Bad Request
                    return cb(err);
                }
                // 11000: duplicate key (for email)
                else if (err.name === 'MongoError' && err.code === 11000  && err.message.indexOf(user.email) !== -1) {
                    const err = new Error('email already exists');
                    err.status = 409; // Conflict
                    return cb(err);
                }
            }
            return cb(null, { success: true });
        });
    });
};