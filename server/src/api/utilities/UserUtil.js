/**
 * @author progmem
 * @date 04.12.17
 */
const ConfigTool = require('../../ConfigTool');
const ErrorUtil = require('./ErrorUtil');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const PRIVATE_KEY = ConfigTool.get('user.private-key');
const SALTING_ROUNDS = ConfigTool.get('user.password-salting-rounds');


class UserUtil {
    /**
     * Checks if password is between 8 and 100 characters, if not throws Error object (for convenience)
     * @param {string} password password string to check
     * @throws {Error} throws if pw.length is not between 8 and 100 character with msg: password must be between 8 and 100 characters and status: 400
     */
    static validatePasswordLength(password) {
        if (password.length < 8 || password.length > 100) {
            const err = new Error('password must be between 8 and 100 characters');
            err.status = 400; // Bad Request
            throw err;
        }
    }


    /**
     * Hashes a provided password via bcrypt
     * @param {string} password password string to hash
     * @returns {Promise.<string>} resolves to hashed string
     * @throws {Error} throws if password could not get hashes (e.g. wrong type) with msg: 'password invalid type, password is required' and status: 400
     */
    static async hashPassword(password) {
        try {
            return await bcrypt.hash(password, SALTING_ROUNDS);
        } catch (err) {
            ErrorUtil.throwAndLog(err, 'password invalid type, password is required', 400);
        }
    }


    /**
     * Compares a provided password with a hash
     * @param {string} password plaintext password to compare
     * @param {string} hash hash to compare with password
     * @returns {Promise.<boolean>} resolves to compare result (true if password and hash match)
     * @throws {Error} throws if password and hash could not get compared (e.g. wrong type) with msg: 'password or hash invalid type/data-format' and status: 400
     */
    static async comparePassword(password, hash) {
        try {
            return await bcrypt.compare(password, hash);
        } catch (err) {
            ErrorUtil.throwAndLog(err, 'password or hash invalid type/data-format', 400);
        }
    }


    /**
     * Verifies und returns the payload of a jwt. Content could be bullsh*t if private key got leaked.
     * @param {string} token jwt to extract
     * @returns {Promise.<Object>} resolves to decoded token
     * @throws {Error} throws if token could not get decoded (invalid, expired, ...), msg contains: 'invalid token' and status: 400
     */
    static async extractJwt(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, PRIVATE_KEY, { algorithms: ['HS256'] }, (err, decodedToken) => {
                if (err) {
                    const err2 = new Error('invalid token: ' + err.message);
                    err2.status = 400; // Bad Request
                    reject(err2);
                }
                resolve(decodedToken);
            });
        });
    }


    /**
     * Creates a JWT containing payload.
     * @param {Object} payload
     * @param {string|number|null} expiresIn expressed in seconds or a string describing a time span. Eg: 60, "2 days", "10h", "7d" (null = unlimited)
     * @returns {Promise.<string>} resolves to jw-token
     * @throws {Error} throws if payload could not get parsed into jwt, msg contains: 'could not create token' with status 500 (internal)
     */
    static async createJwt(payload, expiresIn) {
        const options = { algorithm: 'HS256' };
        if (expiresIn)
            Object.assign(options, { expiresIn: expiresIn });
        return new Promise((resolve, reject) => {
            jwt.sign(payload, PRIVATE_KEY, options, (err, token) => {
                if (err) {
                    const err2 = new Error('could not create token: ' + err.message);
                    err2.status = 500; // Internal Server Error
                    reject(err);
                }
                resolve(token);
            });
        });
    }


    /**
     * Creates a JWT containing userId that expires in 24h (for email validation).
     * @param {string} userId
     * @returns {Promise.<string>} resolves to jw-token
     * @throws {Error} throws if userId could not get parsed into jwt (e.g. wrong type), msg contains: 'could not create token' with status 500 (internal)
     */
    static async createEmailValidationToken(userId) {
        return await this.createJwt({
            userId: userId
        }, '24h');
    }


    /**
     * Creates a JWT containing userId that expires in 1h (for password reset).
     * @param {string} userId
     * @returns {Promise.<string>} resolves to jw-token
     * @throws {Error} throws if userId could not get parsed into jwt (e.g. wrong type), msg contains: 'could not create token' with status 500 (internal)
     */
    static async createPasswordResetToken(userId) {
        return await this.createJwt({
            userId: userId
        }, '1h');
    }


    /**
     * Creates a JWT containing userId and sessionId.<br>
     * HINT: Session tokens do not expire, expiry is set in db
     * @param {string} userId
     * @param {string} sessionId
     * @returns {Promise.<string>} resolves to jw-token
     * @throws {Error} throws if userId/sessionId could not get parsed into jwt (e.g. wrong type), msg contains: 'could not create token' with status 500 (internal)
     */
    static async createSessionToken(userId, sessionId) {
        return await this.createJwt({
            userId: userId,
            sessionId: sessionId
        }, null);
    }
}


module.exports = UserUtil;