/**
 * @author progmem
 * @date 22.10.17
 */

'use strict';

// -------------------------------------------
// Includes
// -------------------------------------------
const config = require('../../init/config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const mailer = require('../../init/mailer-init');
const User = require('../models/user').User;


// -------------------------------------------
// Globals
// -------------------------------------------
const SERVER_URL = config.get('server.url');
const SALTING_ROUNDS = config.get('user.password-salting-rounds');
// TODO advanced: private key rotation
const PRIVATE_KEY = config.get('user.private-key');
const MAIL_ACTIVATE_USER_SUBJECT = config.get('templates.mail.activateUserAccount.subject');
const MAIL_ACTIVATE_USER_BODY = config.get('templates.mail.activateUserAccount.body');
// TODO validate email request url should lead to a react screen witch handles api call instead of naked api call
const REQUEST_URL_VALIDATE_EMAIL = SERVER_URL + '/api/user/validate-email/:token';
const MAIL_RESET_PASSWORD_SUBJECT = config.get('templates.mail.resetPassword.subject');
const MAIL_RESET_PASSWORD_BODY = config.get('templates.mail.resetPassword.body');
// TODO fix link!!!
const REQUEST_URL_RESET_PASSWORD = SERVER_URL + '/PLACEHOLDER/:token';


// -------------------------------------------
// JWT
// -------------------------------------------
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
module.exports.createEmailValidationToken = createEmailValidationToken;


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
 * Creates a JWT containing userId that expires in 1h (for password reset).
 * @param userId
 * @param cb func(err, token)
 */
function createPasswordResetToken(userId, cb) {
    createJwt({
        userId: userId
    }, '1h', cb);
}
module.exports.createPasswordResetToken = createPasswordResetToken;


/**
 * Creates a JWT containing userId and sessionId.
 * Session tokens do not expire, expiry is set in db
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
module.exports.createSessionToken = createSessionToken;


/**
 * Verifies und returns the payload of a jwt. Content could be bullsh*t if private key got leaked.
 * @param token
 * @param cb func(err, decodedToken)
 */
function extractJwt(token, cb) {
    if (typeof token !== 'string') {
        const err = new Error('token invalid type, token is required');
        err.status = 400; // Bad Request
        return cb(err);
    }

    jwt.verify(token, PRIVATE_KEY, { algorithms: ['HS256'] }, (err, decodedToken) => {
        if (err) {
            const err2 = new Error('invalid token: ' + err.message);
            err2.status = 400; // Bad Request
            return cb(err2);
        }
        return cb(null, decodedToken);
    });
}
module.exports.extractJwt = extractJwt;


// -------------------------------------------
// Password
// -------------------------------------------
/**
 * Hashes a provided password
 * @param password
 * @param cb func(err, hash)
 */
function hashPassword(password, cb) {
    bcrypt.hash(password, SALTING_ROUNDS, (err, hash) => {
        if (err) {
            const err = new Error('password invalid type, password is required');
            err.status = 400; // Bad Request
            return cb(err);
        }
        return cb(null, hash);
    });
}
module.exports.hashPassword = hashPassword;


/**
 * Compares a provided password with a hash
 * @param password
 * @param hash
 * @param cb func(err, passwordsMatch)
 */
function comparePassword(password, hash, cb) {
    if (typeof password !== 'string') {
        const err = new Error('password invalid type, password is required');
        err.status = 400; // Bad Request
        return cb(err);
    }
    if (typeof hash !== 'string') {
        const err = new Error('hash invalid type, hash is required');
        err.status = 400; // Bad Request
        return cb(err);
    }

    bcrypt.compare(password, hash, (err, passwordsMatch) => {
        if (err) {
            console.error(err);
            const err2 = new Error('password or hash invalid type/data-format');
            err2.status = 400; // Bad Request
            return cb(err2);
        }
        return cb(null, passwordsMatch);
    });
}
module.exports.comparePassword = comparePassword;


/**
 * Checks if password is between 8 and 100 characters, if not returns Error
 * @param password password string to check
 * @returns Error object
 */
function validatePasswordLength(password) {
    if (password.length < 8 || password.length > 100) {
        const err = new Error('password must be between 8 and 100 characters');
        err.status = 400; // Bad Request
        return err;
    }
    return null;
}


// -------------------------------------------
// User actions
// -------------------------------------------
/**
 * Changes password for userId to newPassword and deletes/revokes all user sessions
 * @param userId
 * @param newPassword
 * @param cb func(err)
 */
function changePassword(userId, newPassword, cb) {
    if (typeof userId !== 'string') {
        const err = new Error('userId invalid type, userId is required');
        err.status = 400; // Bad Request
        return cb(err);
    }
    if (typeof newPassword !== 'string') {
        const err = new Error('newPassword invalid type, newPassword is required');
        err.status = 400; // Bad Request
        return cb(err);
    }
    // 1. checking pw length
    const err = validatePasswordLength(newPassword);
    if (err)
        return cb(err);

    hashPassword(newPassword, (err, hash) => {
        if (err)
            return cb(err); // err.status is already set to 400 Bad Request

        User.update({_id: userId}, {$set: {password: hash}}, (err, rawResponse) => {
            if (err) {
                console.error(err);
                return cb(new Error('unknown mongo error'));
            }
            if (rawResponse.n === 0) {
                const err2 = new Error('user not found');
                err2.status = 404; // Not Found
                return cb(err2);
            }

            // revoke all user sessions
            revokeAllSessions(userId, err => {
                if (err)
                    return cb(err);
                return cb(null);
            });
        });
    });
}


/**
 * Changes a users password by providing email + current password to a new password.
 * @param email
 * @param currentPassword
 * @param newPassword
 * @param cb func(err)
 */
function changePasswordViaCurrentPassword(email, currentPassword, newPassword, cb) {
    if (typeof currentPassword !== 'string') {
        const err = new Error('currentPassword invalid type, currentPassword is required');
        err.status = 400; // Bad Request
        return cb(err);
    }
    if (typeof newPassword !== 'string') {
        const err = new Error('newPassword invalid type, newPassword is required');
        err.status = 400; // Bad Request
        return cb(err);
    }
    if (typeof email !== 'string') {
        const err = new Error('email invalid type, email is required');
        err.status = 400; // Bad Request
        return cb(err);
    }
    // important: fix email format
    email = email.trim().toLowerCase();

    User.findOne({ email: email }, { _id: 1, password: 1 }, (err, userEntry) => {
        if (err)
            return cb(new Error('unknown mongo error'));
        if (userEntry === null) {
            const err2 = new Error('user not found');
            err2.status = 404; // Not Found
            return cb(err2);
        }

        comparePassword(currentPassword, userEntry.password, (err, passwordsMatch) => {
            if (err)
                return cb(err); // err.status is already set
            if (!passwordsMatch) {
                const err2 = new Error('invalid currentPassword');
                err2.authHeader = 'login realm="login"';
                err2.status = 401; // Unauthorized
                return cb(err2);
            }

            changePassword(userEntry._id.toString(), newPassword, err => {
                if (err)
                    return cb(err); // err.status is already set
                return cb(null);
            });
        });
    });
}
module.exports.changePasswordViaCurrentPassword = changePasswordViaCurrentPassword;


/**
 * Changes a users password by providing password rest token to a new password.
 * @param token passwortResetToken
 * @param newPassword
 * @param cb func(err)
 */
function changePasswordViaResetToken(token, newPassword, cb) {
    if (typeof newPassword !== 'string') {
        const err = new Error('newPassword invalid type, newPassword is required');
        err.status = 400; // Bad Request
        return cb(err);
    }

    extractJwt(token, (err, decoded) => {
        if (err)
            return cb(err); // err.status is already set to 400 Bad Request

        changePassword(decoded['userId'], newPassword, err => {
            if (err)
                return cb(err); // err.status is already set
            return cb(null);
        });
    });
}
module.exports.changePasswordViaResetToken = changePasswordViaResetToken;


/**
 * Creates email validation token for user with provided email and sends it to users email
 * @param email
 * @param cb func(err)
 */
function createAndSendEmailValidationToken(email, cb) {
    if (typeof email !== 'string') {
        const err = new Error('email invalid type, email is required');
        err.status = 400; // Bad Request
        return cb(err);
    }
    // important: fix email format
    email = email.trim().toLowerCase();

    User.findOne({ email: email }, { _id: 1, emailValidated: 1 }, (err, userEntry) => {
        if (err)
            return cb(new Error('unknown mongo error'));
        if (userEntry === null) {
            const err2 = new Error('user not found');
            err2.status = 404; // Not Found
            return cb(err2);
        }
        if (userEntry.emailValidated === true) {
            const err2 = new Error('user already validated');
            err2.status = 409; // Conflict
            return cb(err2);
        }
        createEmailValidationToken(userEntry._id.toString(), (err, token) => {
            if (err)
                return cb(new Error('could not create email validation token'));

            // call callback for success (before sending mail)
            cb(null);

            // send mail in background
            const validateLink = REQUEST_URL_VALIDATE_EMAIL.replace(/:token/g, token);
            const body = MAIL_ACTIVATE_USER_BODY.join('').replace(/:validate-link/g, validateLink);
            const mailOptions = {
                from: mailer.FROM,
                to: email,
                subject: MAIL_ACTIVATE_USER_SUBJECT,
                html: body
            };

            mailer.sendMail(mailOptions, (error, info) => {
                if (error)
                    return console.error(error);
                console.log('Validation email sent to: ' + email + ', id: ' + info.messageId);
            });
        });
    });
}
module.exports.createAndSendEmailValidationToken = createAndSendEmailValidationToken;


/**
 * Creates password reset token for user with provided email and sends it to users email
 * @param email
 * @param cb func(err)
 */
function createAndSendPasswordResetToken(email, cb) {
    if (typeof email !== 'string') {
        const err = new Error('email invalid type, email is required');
        err.status = 400; // Bad Request
        return cb(err);
    }
    // important: fix email format
    email = email.trim().toLowerCase();

    User.findOne({ email: email }, { _id: 1 }, (err, userEntry) => {
        if (err)
            return cb(new Error('unknown mongo error'));
        if (userEntry === null) {
            const err2 = new Error('user not found');
            err2.status = 404; // Not Found
            return cb(err2);
        }
        createPasswordResetToken(userEntry._id, (err, token) => {
            if (err)
                return cb(new Error('could not create password reset token'));

            // call callback for success (before sending mail)
            cb(null);

            // send mail in background
            const passwordResetLink = REQUEST_URL_RESET_PASSWORD.replace(/:token/g, token);
            const body = MAIL_RESET_PASSWORD_BODY.join('').replace(/:password-reset-link/g, passwordResetLink);
            const mailOptions = {
                from: mailer.FROM,
                to: email,
                subject: MAIL_RESET_PASSWORD_SUBJECT,
                html: body
            };

            mailer.sendMail(mailOptions, (error, info) => {
                if (error)
                    return console.error(error);
                console.log('Password reset email sent to: ' + email + ', id: ' + info.messageId);
            });
        });
    });
}
module.exports.createAndSendPasswordResetToken = createAndSendPasswordResetToken;


/**
 * Creates new user by
 * 1. checking password length (8 <= pw.len <= 100),
 * 2. hashing pw via bcrypt,
 * 3. creating user instance,
 * 4. saving user instance to db
 * and returning user
 * @param name
 * @param email
 * @param password
 * @param cb func(err, user)
 */
function createUser(name, email, password, cb) {
    if (typeof email !== 'string') {
        const err = new Error('email invalid type, email is required');
        err.status = 400; // Bad Request
        return cb(err);
    }
    if (typeof password !== 'string') {
        const err = new Error('password invalid type, password is required');
        err.status = 400; // Bad Request
        return cb(err);
    }
    // 1. checking pw length
    const err = validatePasswordLength(password);
    if (err)
        return cb(err);

    // important: fix email format
    email = email.trim().toLowerCase();

    // 2. hashing pw
    hashPassword(password, (err, hash) => {
        if (err)
            return cb(err); // err.status is already set to 400 Bad Request

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
            return cb(null, userEntry);
        });
    });
}
module.exports.createUser = createUser;


/**
 * Authenticates user and creates session by
 * 1. finding user by email,
 * 2. comparing password and hash,
 * 3. creating session,
 * 4. creating session token
 * and returning session token
 * @param email
 * @param password
 * @param cb func(err, sessionToken, name) name corresponds the users name e.g. "Max Mustermann"
 */
function login(email, password, cb) {
    if (typeof email !== 'string') {
        const err = new Error('email invalid type, email is required');
        err.status = 400; // Bad Request
        return cb(err);
    }
    if (typeof password !== 'string') {
        const err = new Error('password invalid type, password is required');
        err.status = 400; // Bad Request
        return cb(err);
    }

    // important: fix email format
    email = email.trim().toLowerCase();

    // 1. find user by email
    User.findOne({ email: email }, { _id: 1, name:1, emailValidated: 1, password: 1, sessions: 1 }, (err, userEntry) => {
        if (err) {
            return cb(new Error('unknown mongo error'));
        }
        if (userEntry === null) {
            const err2 = new Error('user not found');
            err2.authHeader = 'login realm="login"';
            err2.status = 401; // Unauthorized
            return cb(err2);
        }
        if (userEntry.emailValidated === false) {
            const err2 = new Error('user account not validated');
            err2.authHeader = 'emailValidation realm="emailValidation"';
            err2.status = 401; // Unauthorized
            return cb(err2);
        }

        // 2. compare passwords
        comparePassword(password, userEntry.password, (err, passwordsMatch) => {
            if (err)
                return cb(err); // err.status is already set
            if (!passwordsMatch) {
                const err2 = new Error('invalid password');
                err2.authHeader = 'login realm="login"';
                err2.status = 401; // Unauthorized
                return cb(err2);
            }

            // 3. create session
            // TODO add expires and description fields
            const newSession = userEntry.sessions.create({});
            userEntry.sessions.push(newSession);
            userEntry.save(err => {
                if (err) {
                    console.error(err);
                    return cb(new Error('unknown mongo error'));
                }

                // 4. create session token
                createSessionToken(userEntry._id.toString(), newSession._id.toString(), (err, sessionToken) => {
                    if (err)
                        return cb(new Error('could not create session token'));
                    return cb(null, sessionToken, userEntry.name);
                });
            });
        });
    });
}
module.exports.login = login;


function logout(userId, sessionId) {
    throw new Error('Not implemented yet');
}


/**
 * Iterates over sessions in userEntry and removes expired ones
 * @param userEntry user-db object
 */
function removeExpiredSessionsFromUserEntry(userEntry) {
    for (let i = userEntry.sessions.length - 1; i >= 0; i--) {
        if (userEntry.sessions[i].get('expires')) {
            if (userEntry.sessions[i].expires.getTime() < Date.now())
                userEntry.sessions[i].remove();
        }
    }
}


/**
 * Removes/revokes all sessions from a userEntry
 * @param userId
 * @param cb func(err)
 */
function revokeAllSessions(userId, cb) {
    User.findById(userId, { sessions: 1 }, (err, userEntry) => {
        if (err) {
            console.error(err);
            return cb(new Error('unknown mongo error'));
        }
        if (userEntry === null) {
            const err2 = new Error('user not found');
            err2.status = 404; // Not Found
            return cb(err2);
        }
        userEntry.sessions.splice(0, userEntry.sessions.length);
        userEntry.save(err => {
            if (err) {
                console.error(err);
                return cb(new Error('unknown mongo error'));
            }
            return cb(null);
        });
    });
}
module.exports.revokeAllSessions = revokeAllSessions;


/**
 * Validates a provided session (as sessionToken) by
 * 1. extracting jwt
 * 2. querying user
 * 3. check sessions
 * 4. saving user entry
 * and returning userId
 * @param token sessionToken
 * @param cb func(err, userId)
 */
function validateSession(token, cb) {
    // 1. extract jwt
    extractJwt(token, (err, decoded) => {
        if (err) {
            if (err.message.startsWith('invalid token')) {
                err.authHeader = 'login realm="login"';
                err.status = 401; // Unauthorized
            }
            return cb(err);
            /*
            There is no need to check whether jwt is expired,
            because sessionTokens cannot expire atm.
            Expiry is set server-side (in db)
             */
        }

        // 2. querying user
        User.findById(decoded.userId, { sessions: 1 }, (err, userEntry) => {
            if (err) {
                console.error(err);
                return cb(new Error('unknown mongo error'));
            }
            if (userEntry === null) {
                const err2 = new Error('user not found');
                err2.status = 404; // Not Found
                return cb(err2);
            }

            // 3. check sessions
            removeExpiredSessionsFromUserEntry(userEntry);

            // 4. saving user entry
            userEntry.save((err, userEntry) => {
                if (err) {
                    console.error(err);
                    return cb(new Error('unknown mongo error'));
                }
                // no session found => expired
                const session = userEntry.sessions.find((elem) => {
                    return elem._id.toString() === decoded.sessionId;
                });
                if (session === undefined) {
                    const err2 = new Error('session expired');
                    err2.authHeader = 'login realm="login"';
                    err2.status = 401; // Unauthorized
                    return cb(err2);
                }
                return cb(null, decoded.userId);
            });
        });
    });
}
module.exports.validateSession = validateSession;


/**
 * Marks user email as validated if given token is valid
 * @param token valid EmailValidationToken
 * @param cb func(err)
 */
function validateUserEmail(token, cb) {
    extractJwt(token, (err, decoded) => {
        if (err)
            return cb(err); // err.status is already set to 400 Bad Request

        User.update({ _id: decoded['userId'] }, { $set: { emailValidated: true } }, (err, rawResponse) => {
            if (err) {
                console.error(err);
                return cb(new Error('unknown mongo error'));
            }
            if (rawResponse.n === 0) {
                const err2 = new Error('user not found');
                err2.status = 404; // Not Found
                return cb(err2);
            }
            if (rawResponse.nModified === 0) {
                const err2 = new Error('user already validated');
                err2.status = 409; // Conflict
                return cb(err2);
            }
            return cb(null);
        });
    });
}
module.exports.validateUserEmail = validateUserEmail;
