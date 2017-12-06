/**
 * @author progmem
 * @date 04.12.17
 */

'use strict';

const UserController = require('./UserController');
const UserModel = require('../models/UserModel');
const UserUtil = require('../utilities/UserUtil');
const db = require('../../init/mongo-init');


async function clearUsers() {
    try {
        await UserModel.remove({});
    } catch (err) {
        console.error(err);
    }
}

describe('user creation', async () => {
    beforeAll(clearUsers);

    test('bcrypt error check (wrong type)', async () => {
        try {
            await UserController.createUser('', '', 42);
        } catch (err) {
            expect(err.message).toMatch('password invalid type, password is required');
        }
    });


    test('valid user', async () => {
        const user = await UserController.createUser('Schwanzus Longus', 'sw2@example.com', 'password');
        expect(user.name).toMatch('Schwanzus Longus');
        expect(user.email).toMatch('sw2@example.com');
        // bcrypt creates hashes of length 60
        expect(user.password).toHaveLength(60);
    });

    test('empty username', async () => {
        try {
            await UserController.createUser(' ', 'sw@example.com', 'password');
        } catch (err) {
            expect(err.message).toMatch('name is required');
        }
    });

    afterAll(clearUsers);
});


describe('working on a user', async () => {
    let testuser;

    beforeEach(async () => {
        await clearUsers();
        testuser = await UserController.createUser('Schwanzus Longus', 'sw@example.com', 'password');
    });

    test('query user by email', async () => {
        const user = await UserModel.findOne({email: testuser.email});
        expect(user._id).toEqual(testuser._id);
        expect(user.name).toBe(testuser.name);
        expect(user.password).toBe(testuser.password);
    });

    test('email validation', async () => {
        const token = await UserUtil.createEmailValidationToken(testuser._id.toString());
        await UserController.validateUserEmail(token);
        try {
            await UserController.validateUserEmail(token);
        } catch (err) {
            expect(err.message).toMatch('user already validated');
        }
    });

    test('send email validation token (wrong email)', async () => {
        try {
            await UserController.createAndSendEmailValidationToken('sw@examle.com');
        } catch (err) {
            expect(err.message).toMatch('user not found');
        }
    });

    test('send password reset token (wrong email)', async () => {
        try {
            await UserController.createAndSendPasswordResetToken('sw@examle.com');
        } catch (err) {
            expect(err.message).toMatch('user not found');
        }
    });

    test('change password via password reset token', async () => {
        const token = await UserUtil.createPasswordResetToken(testuser._id.toString());
        await UserController.changePasswordViaResetToken(token, '12345678');
        const entry = await UserModel.findById(testuser._id);
        const passwordsMatch = await UserUtil.comparePassword('12345678', entry.password);
        expect(passwordsMatch).toBe(true);
    });

    test('change password via current password', async () => {
        await UserController.changePasswordViaCurrentPassword(testuser.email, 'password', '12345678');
        const entry = await UserModel.findById(testuser._id);
        const passwordsMatch = await UserUtil.comparePassword('12345678', entry.password);
        expect(passwordsMatch).toBe(true);
    });

    afterAll(clearUsers);
});


describe('working on a validated user', async () => {
    let testuser;

    beforeEach(async () => {
        await clearUsers();
        testuser = await UserController.createUser('Schwanzus Longus', 'sw@example.com', 'password');
        testuser.emailValidated = true;
        await testuser.save();
    });

    test('send email verification token (UserController already validated)', async () => {
        try {
            await UserController.createAndSendEmailValidationToken(testuser.email);
        } catch (err) {
            expect(err.message).toMatch('user already validated');
        }
    });

    test('login', async () => {
        const info = await UserController.login(testuser.email, 'password');
        const decoded = await UserUtil.extractJwt(info.sessionToken);
        expect(decoded.userId).toMatch(testuser._id.toString());
        expect(typeof info.name).toBe('string');
        expect(typeof info.folderId).toBe('string');
    });

    test('validate a valid session', async () => {
        const info = await UserController.login(testuser.email, 'password');
        const userId = await UserController.validateSession(info.sessionToken);
        expect(userId).toMatch(testuser._id.toString());
    });

    test('validate an expired session', async () => {
        const newSession = testuser.sessions.create({ expires: Date.now() });
        testuser.sessions.push(newSession);
        await testuser.save();
        const token = await UserUtil.createSessionToken(testuser._id.toString(), newSession._id.toString());
        try {
            await UserController.validateSession(token);
        } catch (err) {
            expect(err.message).toMatch('session expired');
        }
    });

    test('revoke all sessions', async () => {
        testuser.sessions.push({});
        testuser.sessions.push({});
        testuser.sessions.push({});
        let userEntry = await testuser.save();
        expect(userEntry.sessions.length).toBe(3);
        await UserController.revokeAllSessions(testuser._id.toString());
        userEntry = await UserModel.findById(testuser._id.toString());
        expect(userEntry.sessions.length).toBe(0);
    });

    test('logout', async () => {
        const info = await UserController.login(testuser.email, 'password');
        await UserController.logout(info.sessionToken);
        const userEntry = await UserModel.findById(testuser._id.toString());
        expect(userEntry.sessions.length).toBe(0);
    });

    test('logout invalid session', async () => {
        const info = await UserController.login(testuser.email, 'password');
        await UserController.logout(info.sessionToken);
        try {
            await UserController.logout(info.sessionToken);
        } catch (err) {
            expect(err.message).toMatch('invalid session');
        }
    });

    afterAll(clearUsers);
});


afterAll(() => {
    db.close();
});
