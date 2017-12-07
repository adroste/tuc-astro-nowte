/**
 * @author progmem
 * @date 04.12.17
 */

'use strict';

const ConfigTool = require('../../ConfigTool');
const UserUtil = require('../utilities/UserUtil');
const ErrorUtil = require('../utilities/ErrorUtil');
const mongoose = require('mongoose');
const mailer = require('../../init/mailer-init');
const FolderModel = require('../models/FolderModel');
const UserModel = require('../models/UserModel');


const FRONTEND_URL = ConfigTool.get('web-frontend.url');
const MAIL_ACTIVATE_USER_SUBJECT = ConfigTool.get('templates.mail.activateUserAccount.subject');
const MAIL_ACTIVATE_USER_BODY = ConfigTool.get('templates.mail.activateUserAccount.body');
const REQUEST_URL_VALIDATE_EMAIL = FRONTEND_URL + '/email-validation-done/:token';
const MAIL_RESET_PASSWORD_SUBJECT = ConfigTool.get('templates.mail.resetPassword.subject');
const MAIL_RESET_PASSWORD_BODY = ConfigTool.get('templates.mail.resetPassword.body');
const REQUEST_URL_RESET_PASSWORD = FRONTEND_URL + '/reset-password/:token';


/**
 * UserController contains methods for user actions
 */
class UserController {
    /**
     * Creates a new user (+ root folder for user)
     * @param {string} name display name of the user e.g. 'Max Mustermann'
     * @param {string} email email address (valid format)
     * @param {string} password plaintext password to set (will get hashed during creation)
     * @returns {Promise.<Object>} resolves to user entry object (from db)
     * @throws {Error} msg contains: 'User validation failed', some params like name or email are not valid (they are required)
     * @throws {Error} msg contains: 'email already registered' if user with email already exists in db
     * @throws {Error} from {@link UserUtil.validatePasswordLength} (called with password)
     * @throws {Error} from {@link UserUtil.hashPassword} (called with password)
     */
    static async createUser(name, email, password) {
        // checking pw length
        UserUtil.validatePasswordLength(password);

        // important: fix email format
        email = email.trim().toLowerCase();

        // hashing pw
        const hash = await UserUtil.hashPassword(password);

        // userId
        const userId = mongoose.Types.ObjectId();

        // create root folder
        let rootFolder = new FolderModel({
            'title': '/',
            'parentId': null,
            'ownerId': userId
        });

        // save root folder to db
        let folderEntry;
        try {
            folderEntry = await rootFolder.save();
        } catch (err) {
            ErrorUtil.throwAndLog(err, 'unknown mongo error');
        }

        // creating user instance
        const user = new UserModel({
            '_id': userId,
            'name': name,
            'email': email,
            'password': hash,
            'folderId': folderEntry._id
        });

        // saving user instance to db
        let userEntry;
        try {
            userEntry = await user.save();
        } catch (err) {
            // try to remove previously created folder
            try {
                await folderEntry.remove();
            } catch (err2) {
                // TODO log out folderId of folderEntry that could not be removed
                console.error(err2);
            }

            // if
            ErrorUtil.conditionalThrowWithStatus(err.message.startsWith('User validation failed'), err.message, 400);
            // else if
            ErrorUtil.conditionalThrowWithStatus(err.name === 'MongoError' && err.code === 11000 && err.message.indexOf(user.email) !== -1,
                'email already exists', 409);
            // else
            ErrorUtil.throwAndLog(err, 'unknown mongo error');
        }

        return userEntry;
    }

    /**
     * Marks user email as validated if supplied token is valid
     * @param {string} token valid EmailValidationToken
     * @returns {Promise<void>} Promise has no return/resolve value
     * @throws {Error} msg contains: 'user not found' if userId from token does not exist in db
     * @throws {Error} msg contains: 'user already validated'
     * @throws {Error} from {@link UserUtil.extractJwt} (called with supplied token)
     */
    static async validateUserEmail(token) {
        const decoded = await UserUtil.extractJwt(token);

        let rawResponse;
        try {
            rawResponse = await UserModel.update({_id: decoded['userId']}, {$set: {emailValidated: true}});
        } catch (err) {
            ErrorUtil.throwAndLog(err, 'unknown mongo error');
        }

        ErrorUtil.conditionalThrowWithStatus(rawResponse.n === 0, 'user not found', 404);
        ErrorUtil.conditionalThrowWithStatus(rawResponse.nModified === 0, 'user already validated', 409);
    }


    /**
     * Creates email validation token for user with provided email and sends it to users email
     * @param {string} email valid user email
     * @returns {Promise<void>} Promise has no return/resolve value
     * @throws {Error} msg: 'user not found' with status: 404 if no user with provided email could be found in db
     * @throws {Error} msg: 'user already validated' with status 409
     * @throws {Error} from {@link UserUtil.createEmailValidationToken} (called with userId of user with email)
     * @throws {Error} from {@link sendMail} (email to users email)
     */
    static async createAndSendEmailValidationToken(email) {
        // important: fix email format
        email = email.trim().toLowerCase();

        // find user with email
        let userEntry = null;
        try {
            userEntry = await UserModel.findOne({email: email}, {_id: 1, emailValidated: 1});
        } catch (err) {
            ErrorUtil.throwAndLog(err, 'unknown mongo error');
        }
        ErrorUtil.conditionalThrowWithStatus(userEntry === null, 'user not found', 404);
        ErrorUtil.conditionalThrowWithStatus(userEntry.emailValidated === true, 'user already validated', 409);

        // get new token
        const token = await UserUtil.createEmailValidationToken(userEntry._id.toString());

        // create and send mail
        const validateLink = REQUEST_URL_VALIDATE_EMAIL.replace(/:token/g, token);
        const body = MAIL_ACTIVATE_USER_BODY.join('').replace(/:validate-link/g, validateLink);
        const info = await mailer.sendMail(email, MAIL_ACTIVATE_USER_SUBJECT, body);
        // TODO debug log
        // console.log('Validation email sent to: ' + email + ', id: ' + info.messageId);
    }


    /**
     * Creates password reset token for user with provided email and sends it to users email
     * @param {string} email valid user email
     * @returns {Promise<void>} Promise has no return/resolve value
     * @throws {Error} msg: 'user not found' with status: 404 if no user with provided email could be found in db
     * @throws {Error} from {@link UserUtil.createPasswordResetToken} (called with userId of user with email)
     * @throws {Error} from {@link sendMail} (email to users email)
     */
    static async createAndSendPasswordResetToken(email) {
        // important: fix email format
        email = email.trim().toLowerCase();

        // find user with email
        let userEntry = null;
        try {
            userEntry = await UserModel.findOne({email: email}, {_id: 1});
        } catch (err) {
            ErrorUtil.throwAndLog(err, 'unknown mongo error');
        }
        ErrorUtil.conditionalThrowWithStatus(userEntry === null, 'user not found', 404);

        // create token
        const token = await UserUtil.createPasswordResetToken(userEntry._id.toString());

        // send mail in background
        const passwordResetLink = REQUEST_URL_RESET_PASSWORD.replace(/:token/g, token);
        const body = MAIL_RESET_PASSWORD_BODY.join('').replace(/:password-reset-link/g, passwordResetLink);
        const info = await mailer.sendMail(email, MAIL_RESET_PASSWORD_SUBJECT, body);
        // TODO debug log
        //console.log('Password reset email sent to: ' + email + ', id: ' + info.messageId);
    }


    /**
     * Changes password for userId to newPassword and deletes/revokes all user sessions
     * @param {string} userId id of user to change
     * @param {string} newPassword new password to set
     * @returns {Promise<void>} Promise has no return/resolve value
     * @throws {Error} msg contains: 'user not found' if userId does not exist in db
     * @throws {Error} from {@link UserUtil.validatePasswordLength} (called with newPassword)
     * @throws {Error} from {@link UserUtil.hashPassword} (called with newPassword)
     */
    static async changePassword(userId, newPassword) {
        // checking pw length
        UserUtil.validatePasswordLength(newPassword);

        const hash = await UserUtil.hashPassword(newPassword);

        let rawResponse;
        try {
            rawResponse = await UserModel.update({_id: userId}, {$set: {password: hash}});
        } catch (err) {
            ErrorUtil.throwAndLog(err, 'unknown mongo error');
        }
        ErrorUtil.conditionalThrowWithStatus(rawResponse.n === 0, 'user not found', 404);

        // revoke all user sessions
        await this.revokeAllSessions(userId);
    }


    /**
     * Removes/revokes all sessions from a user
     * @param {string} userId id of user
     * @returns {Promise<void>} Promise has no return/resolve value
     * @throws {Error} msg contains: 'user not found' if userId does not exist in db
     */
    static async revokeAllSessions(userId) {
        let userEntry = null;
        try {
            userEntry = await UserModel.findById(userId, {sessions: 1});
        } catch (err) {
            ErrorUtil.throwAndLog(err, 'unknown mongo error');
        }
        ErrorUtil.conditionalThrowWithStatus(userEntry === null, 'user not found', 404);
        userEntry.sessions.splice(0, userEntry.sessions.length);
        try {
            await userEntry.save();
        } catch (err) {
            ErrorUtil.throwAndLog(err, 'unknown mongo error');
        }
    }


    /**
     * Changes a users password by providing email + current password to a new password.
     * @param {string} email valid user email
     * @param {string} currentPassword current users password as plaintext
     * @param {string} newPassword new password to set as plaintext
     * @returns {Promise<void>} Promise has no return/resolve value
     * @throws {Error} msg: 'user not found' with status: 404 if no user with provided email could be found in db
     * @throws {Error} msg: 'invalid currentPassword' with status: 401 (authHeader: 'login realm="login"') if provided password does not match the db entry
     * @throws {Error} from {@link changePassword} (called with newPassword)
     */
    static async changePasswordViaCurrentPassword(email, currentPassword, newPassword) {
        // important: fix email format
        email = email.trim().toLowerCase();

        let userEntry = null;
        try {
            userEntry = await UserModel.findOne({email: email}, {_id: 1, password: 1});
        } catch (err) {
            ErrorUtil.throwAndLog(err, 'unknown mongo error');
        }
        ErrorUtil.conditionalThrowWithStatus(userEntry === null, 'user not found', 404);

        let passwordsMatch;
        passwordsMatch = await UserUtil.comparePassword(currentPassword, userEntry.password);
        ErrorUtil.conditionalThrowWithStatus(!passwordsMatch, 'invalid currentPassword', 401, 'login realm="login"');

        await this.changePassword(userEntry._id.toString(), newPassword);
    }


    /**
     * Changes a users password by providing password rest token to a new password.
     * @param {string} token passwortResetToken
     * @param {string} newPassword new password to set
     * @returns {Promise<void>} Promise has no return/resolve value
     * @throws {Error} from {@link UserUtil.extractJwt} (called with supplied token)
     * @throws {Error} from {@link changePassword} (called with newPassword)
     */
    static async changePasswordViaResetToken(token, newPassword) {
        const decoded = await UserUtil.extractJwt(token);
        await this.changePassword(decoded['userId'], newPassword);
    }


    /**
     * Authenticates user and creates session
     * @param {string} email valid user email
     * @param {string} password users password (plaintext)
     * @returns {Promise<{sessionToken: string, name: string, folderId: string, userId: string}>} login info object containing sessionToken, name e.g. 'Max Mustermann', root folder id and user id
     * @throws {Error} msg: 'user not found' with status: 401 (authHeader: 'login realm="login"') if provided email does not match any user db entry
     * @throws {Error} msg: 'user account not validated' with status: 401 (authHeader: 'emailValidation realm="emailValidation"') if user is not validated
     * @throws {Error} msg: 'invalid password' with status: 401 (authHeader: 'login realm="login"') if provided password does not match users passwords
     * @throws {Error} from {@link UserUtil.comparePassword}
     * @throws {Error} from {@link UserUtil.createSessionToken}
     */
    static async login(email, password) {
        // important: fix email format
        email = email.trim().toLowerCase();

        // find user by email
        let userEntry = null;
        try {
            userEntry = await UserModel.findOne({email: email}, {
                _id: 1,
                name: 1,
                emailValidated: 1,
                password: 1,
                sessions: 1,
                folderId: 1
            });
        } catch (err) {
            ErrorUtil.throwAndLog(err, 'unknown mongo error');
        }
        ErrorUtil.conditionalThrowWithStatus(userEntry === null, 'user not found', 401, 'login realm="login"');
        ErrorUtil.conditionalThrowWithStatus(userEntry.emailValidated === false, 'user account not validated', 401, 'emailValidation realm="emailValidation"');

        // check password
        const passwordsMatch = await UserUtil.comparePassword(password, userEntry.password);
        ErrorUtil.conditionalThrowWithStatus(!passwordsMatch, 'invalid password', 401, 'login realm="login"');

        // create session
        // TODO add expires and description fields
        const newSession = userEntry.sessions.create({});
        userEntry.sessions.push(newSession);
        try {
            await userEntry.save();
        } catch (err) {
            ErrorUtil.throwAndLog(err, 'unknown mongo error');
        }

        // create session token
        const token = await UserUtil.createSessionToken(userEntry._id.toString(), newSession._id.toString());
        return {
            sessionToken: token,
            name: userEntry.name,
            folderId: userEntry.folderId.toString(),
            userId: userEntry._id.toString()
        };
    }


    /**
     * Logout a provided session (via session token)
     * @param token sessionToken
     * @returns {Promise<void>} Promise has no return/resolve value
     * @throws {Error} msg contains: 'user not found' with status: 404 if userId from token does not exist in db
     * @throws {Error} msg contains: 'invalid session' with status: 401 (authHeader: 'login realm="login"') if sessionId from token does not exist in db
     * @throws {Error} from {@link UserUtil.extractJwt} (called with token)
     */
    static async logout(token) {
        const decoded = await UserUtil.extractJwt(token);

        let userEntry = null;
        try {
            userEntry = await UserModel.findById(decoded['userId'], {sessions: 1});
        } catch (err) {
            ErrorUtil.throwAndLog(err, 'unknown mongo error');
        }
        ErrorUtil.conditionalThrowWithStatus(userEntry === null, 'user not found', 404);

        // find & remove session
        const session = userEntry.sessions.find((elem) => {
            return elem._id.toString() === decoded.sessionId;
        });
        ErrorUtil.conditionalThrowWithStatus(session === undefined, 'invalid session', 401, 'login realm="login"');
        session.remove();

        try {
            await userEntry.save();
        } catch (err) {
            ErrorUtil.throwAndLog(err, 'unknown mongo error');
        }
    }


    /**
     * Iterates over sessions in userEntry and removes expired ones<br>
     * HINT: Operation is done on object, no copy will be created
     * @param {Object} userEntry user-db object
     * @returns {boolean} true if session(s) got removed, false if object was not changed
     */
    static removeExpiredSessionsFromUserEntry(userEntry) {
        let removed = false;
        for (let i = userEntry.sessions.length - 1; i >= 0; i--) {
            if (userEntry.sessions[i].get('expires')) {
                if (userEntry.sessions[i].expires.getTime() < Date.now()) {
                    userEntry.sessions[i].remove();
                    removed = true;
                }
            }
        }
        return removed;
    }


    /**
     * Validates a provided session (as sessionToken) and returns userId
     * @param {string} token sessionToken
     * @returns {Promise<string>} resolves to userId
     * @throws {Error} msg contains: 'invalid token' with status: 401 (authHeader: 'login realm="login"') if provided token is invalid/expired
     * @throws {Error} msg contains: 'session expired' with status: 401 (authHeader: 'login realm="login"') if provided session got revoked/expired
     * @throws {Error} msg contains: 'user not found' with status: 404 if userId from token does not exist in db
     */
    static async validateSession(token) {
        let decoded;
        try {
            decoded = await UserUtil.extractJwt(token);
        } catch (err) {
            ErrorUtil.conditionalThrowWithStatus(err.message.startsWith('invalid token'),
                err.message, 401, 'login realm="login"');
            /*
            There is no need to check whether jwt is expired,
            because sessionTokens cannot expire atm.
            Expiry is set server-side (in db)
             */
        }

        // find user
        let userEntry = null;
        try {
            userEntry = await UserModel.findById(decoded.userId, {sessions: 1});
        } catch (err) {
            ErrorUtil.throwAndLog(err, 'unknown mongo error');
        }
        ErrorUtil.conditionalThrowWithStatus(userEntry === null, 'user not found', 404);

        // check sessions
        if (this.removeExpiredSessionsFromUserEntry(userEntry)) {
            // saving user entry if something changed (session(s) got removed)
            try {
                userEntry = await userEntry.save();
            } catch (err) {
                ErrorUtil.throwAndLog(err, 'unknown mongo error');
            }
        }

        // no session found => expired
        const session = userEntry.sessions.find((elem) => {
            return elem._id.toString() === decoded.sessionId;
        });
        ErrorUtil.conditionalThrowWithStatus(session === undefined, 'session expired', 401, 'login realm="login"');

        return decoded.userId;
    }


    /**
     * Retrieves userId for user with email
     * @param {string} email valid email address
     * @returns {Promise<string>} id of user with provided email
     * @throws {Error} msg: 'email not found' with status: 404 if user with provided email could not be found
     */
    static async getUserIdForEmail(email) {
        let userEntry;
        try {
            userEntry = await UserModel.findOne({ email: email }, { _id: 1 });
        } catch (err) {
            ErrorUtil.throwAndLog(err, 'unknown mongo error');
        }
        ErrorUtil.conditionalThrowWithStatus(userEntry === undefined, 'email not found', 404);
        return userEntry._id.toString();
    }

}


module.exports = UserController;