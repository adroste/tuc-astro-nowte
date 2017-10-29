/**
 * @author progmem
 * @date 22.10.17
 */

'use strict';

const config = require('../../config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user').User;

const SALTING_ROUNDS = config.get('user.password-salting-rounds');
const PRIVATE_KEY = config.get('user.private-key');


/**
 * Creates a JWT containing payload.
 * @param payload
 * @param expiresIn expressed in seconds or a string describing a time span. Eg: 60, "2 days", "10h", "7d" (null = unlimited)
 * @param cb fn(err, token)
 */
function createJwt(payload, expiresIn, cb) {
    const options = { algorithm: 'HS256' };
    if (expiresIn)
        Object.assign(options, { expiresIn: expiresIn });
    jwt.sign(payload, PRIVATE_KEY, options, (err, token) => {
        if (err) {
            const err2 = new Error('could not create token: ' + err.message);
            err2.status = 500; // Internal Server Error
            return cb(err);
        }
        return cb(null, token);
    });
}


/**
 * Creates a JWT containing userId and sessionId.
 * @param userId
 * @param sessionId
 * @param cb fn(err, token)
 */
module.exports.createSessionToken = (userId, sessionId, cb) => {
    createJwt({
        userId: userId,
        sessionId: sessionId
    }, null, cb);
};


/**
 * Creates a JWT containing userId that expires in 24h (for email validation).
 * @param userId
 * @param cb fn(err, token)
 */
module.exports.createEmailValidationToken = (userId, cb) => {
    createJwt({
        userId: userId
    }, '24h', cb);
};


/**
 * Verifies und returns the payload of a jwt. Content could be bullsh*t if private key got leaked.
 * @param token
 * @param cb fn(err, decodedToken)
 */
module.exports.extractJwt = (token, cb) => {
    jwt.verify(token, PRIVATE_KEY, { algorithms: ['HS256'] }, (err, decodedToken) => {
        if (err)
            return cb(new Error('invalid token: ' + err.message));
        return cb(null, decodedToken);
    });
};


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
            return cb(null, user);
        });
    });
};