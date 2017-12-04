/**
 * @author progmem
 * @date 04.12.17
 */

'use strict';

const UserUtil = require('./UserUtil');


describe('token handling', async () => {
    test('session token', async () => {
        const token = await UserUtil.createSessionToken('59f4b480459a8ac6a5aef44a', '59f4b480459a8ac6a5aef55a');
        const decoded = await UserUtil.extractJwt(token);
        expect(decoded.userId).toBe('59f4b480459a8ac6a5aef44a');
        expect(decoded.sessionId).toBe('59f4b480459a8ac6a5aef55a');
    });

    test('email validation token', async () => {
        const token = await UserUtil.createEmailValidationToken('59f4b480459a8ac6a5aef44a');
        const decoded = await UserUtil.extractJwt(token);
        expect(decoded.userId).toBe('59f4b480459a8ac6a5aef44a');
    });

    // test fails if private key gets changed
    test('expired email validation token', async () => {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1OWY0YjQ4MDQ1OWE4YWM2YTVhZWY0NGEiLCJpYXQiOjE1MDkyMTI4MzUsImV4cCI6MTUwOTIxMDIzNX0.XWNxKCvHFS7HS3n52mQPHwq92HfXSi6ZNNiaCzf8frE';
        try {
            await UserUtil.extractJwt(token);
        } catch (err) {
            expect(err.message).toMatch('invalid token: jwt expired');
        }
    });

    test('invalid signature', async () => {
        const token = await UserUtil.createEmailValidationToken('59f4b480459a8ac6a5aef44a');
        const invalidSignature = token.substring(0, token.length - 2);
        try {
            await UserUtil.extractJwt(invalidSignature);
        } catch (err) {
            expect(err.message).toMatch('invalid token: invalid signature');
        }
    });
});


describe('password hashing (bcrypt)', async () => {
    test('error check type', async () => {
        try {
            await UserUtil.hashPassword(null);
        } catch (err) {
            expect(err.message).toMatch('password invalid type');
        }
    });

    test('hash pw & compare', async () => {
        const hash = await UserUtil.hashPassword('pass123');
        // check correct pw
        const correct = await UserUtil.comparePassword('pass123', hash);
        expect(correct).toBe(true);
        // check invalid pw
        const wrong = await UserUtil.comparePassword('magmag', hash);
        expect(wrong).toBe(false);
    });
});
