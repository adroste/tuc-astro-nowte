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
 * @param cb func(err, token)
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
 * @param cb func(err, token)
 */
function createSessionToken(userId, sessionId, cb) {
    createJwt({
        userId: userId,
        sessionId: sessionId
    }, null, cb);
}


/**
 * Creates a JWT containing userId that expires in 24h (for email validation).
 * @param userId
 * @param cb func(err, token)
 */
function createEmailValidationToken(userId, cb) {
    createJwt({
        userId: userId
    }, '24h', cb);
}


/**
 * Verifies und returns the payload of a jwt. Content could be bullsh*t if private key got leaked.
 * @param token
 * @param cb func(err, decodedToken)
 */
function extractJwt(token, cb) {
    jwt.verify(token, PRIVATE_KEY, { algorithms: ['HS256'] }, (err, decodedToken) => {
        if (err) {
            const err2 = new Error('invalid token: ' + err.message);
            err2.status = 400; // Bad Request
            return cb(err2);
        }
        return cb(null, decodedToken);
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
 * 2. hashing pw via bcrypt,
 * 3. creating user instance,
 * 4. saving user instance to db
 * and returning { "success": true }
 * @param name
 * @param email
 * @param password
 * @param cb func(err, user)
 */
function createUser(name, email, password, cb) {
    if (typeof password !== 'string') {
        const err = new Error('password invalid type');
        err.status = 400; // Bad Request
        return cb(err);
    }
    // 1. checking pw length
    if (password.length < 8 || password.length > 100) {
        const err = new Error('password must be between 8 and 100 characters');
        err.status = 400; // Bad Request
        return cb(err);
    }

    // 2. hashing pw
    bcrypt.hash(password, SALTING_ROUNDS, (err, hash) => {
        if (err){
            const err = new Error('password invalid type');
            err.status = 400; // Bad Request
            return cb(err);
        }

        // 3. creating user instance
        // TODO create root folder
        const user = new User({
            'name': name,
            'email': email,
            'password': hash
        });

        // 4. saving user instance
        user.save((err, userEntry) => {
            if (err) {
                if (err.message.startsWith('User validation failed')) {
                    err.status = 400; // Bad Request
                    return cb(err);
                }
                // 11000: duplicate key (for email)
                if (err.name === 'MongoError' && err.code === 11000  && err.message.indexOf(user.email) !== -1) {
                    const err = new Error('email already exists');
                    err.status = 409; // Conflict
                    return cb(err);
                }
                console.error(err);
                return cb(new Error('unknown mongo error'));
            }
            return cb(null, user);
        });
    });
}


/**
 * Marks user email as validated if given token is valid
 * @param token valid EmailValidationToken
 * @param cb func(err, validated) validated is a bool. true if ok, false if user was already validated
 */
function validateUserEmail(token, cb) {
    if (typeof token !== 'string')
        throw new Error('token is not a valid string');

    extractJwt(token, (err, decoded) => {
        if (err)
            return cb(err); // err.status is already set to 400 Bad Request

        User.update({ _id: decoded.userId }, { $set: { emailValidated: true } }, (err, rawResponse) => {
            if (err) {
                console.error(err);
                return cb(new Error('unknown mongo error'));
            }
            if (rawResponse.n === 0) {
                const err2 = new Error('user not found');
                err2.status = 404; // Not Found
                return cb(err2);
            }
            if (rawResponse.nModified === 0)
                return cb(null, false);
            return cb(null, true);
        });
    });
}


// exports
module.exports.createSessionToken = createSessionToken;
module.exports.createEmailValidationToken = createEmailValidationToken;
module.exports.extractJwt = extractJwt;
module.exports.createUser = createUser;
module.exports.validateUserEmail = validateUserEmail;
