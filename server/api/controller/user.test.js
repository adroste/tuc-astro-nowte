/**
 * @author progmem
 * @date 26.10.17
 */

'use strict';

const User = require('../models/user').User;
const user = require('./user');
const db = require('../../init/mongo-init');

// clear user collection
function clearUsers(done) {
    User.remove({}, err => {
        if (err)
            console.error(err);
        done();
    });
}


describe('token handling', () => {
    test('session token', done => {
        user.createSessionToken('59f4b480459a8ac6a5aef44a', '59f4b480459a8ac6a5aef55a', (err, token) => {
            user.extractJwt(token, (err, decoded) => {
                expect(decoded.userId).toBe('59f4b480459a8ac6a5aef44a');
                expect(decoded.sessionId).toBe('59f4b480459a8ac6a5aef55a');
                done();
            });
        });
    });

    test('email validation token', done => {
        user.createEmailValidationToken('59f4b480459a8ac6a5aef44a', (err, token) => {
            user.extractJwt(token, (err, decoded) => {
                expect(decoded.userId).toBe('59f4b480459a8ac6a5aef44a');
                done();
            });
        });
    });

    // test fails if private key gets changed
    test('expired email validation token', done => {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1OWY0YjQ4MDQ1OWE4YWM2YTVhZWY0NGEiLCJpYXQiOjE1MDkyMTI4MzUsImV4cCI6MTUwOTIxMDIzNX0.XWNxKCvHFS7HS3n52mQPHwq92HfXSi6ZNNiaCzf8frE';
        user.extractJwt(token, (err, decoded) => {
            expect(err.message).toMatch('invalid token: jwt expired');
            done();
        });
    });

    test('invalid signature', done => {
        user.createEmailValidationToken('59f4b480459a8ac6a5aef44a', (err, token) => {
            const invalidSignature = token.substring(0, token.length - 2);
            user.extractJwt(invalidSignature, (err, decoded) => {
                expect(err.message).toMatch('invalid token: invalid signature');
                done();
            });
        });
    });
});


describe('bcrypt', () => {
    test('error check type', done => {
        user.hashPassword(null, (err, hash) => {
            expect(err.message).toMatch('password invalid type');
            done();
        });
    });

    test('hash pw & compare', done => {
        user.hashPassword('pass123', (err, hash) => {
            // check correct pw
            user.comparePassword('pass123', hash, (err, passwordsMatch) => {
                expect(passwordsMatch).toBe(true);
                // check invalid pw
                user.comparePassword('magmag', hash, (err, passwordsMatch) => {
                    expect(passwordsMatch).toBe(false);
                    done();
                });
            });
        });
    });
});


describe('user creation', () => {
    beforeAll(clearUsers);

    test('bcrypt error check (null)', done => {
        user.createUser('', '', null, (err) => {
            expect(err.message).toMatch('password invalid type');
            done();
        });
    });

    test('bcrypt error check (wrong type)', done => {
        user.createUser('', '', 42, (err) => {
            expect(err.message).toMatch('password invalid type');
            done();
        });
    });

    test('valid user', done => {
        user.createUser('Schwanzus Longus', 'sw@example.com', 'password', (err, user) => {
            expect(err).toBeNull();
            expect(user.name).toMatch('Schwanzus Longus');
            expect(user.email).toMatch('sw@example.com');
            // bcrypt creates hashes of length 60
            expect(user.password).toHaveLength(60);
            done();
        });
    });

    test('empty username', done => {
        user.createUser(' ', 'sw@example.com', 'password', (err, user) => {
            expect(err.errors.name.message).toMatch('name is required');
            done();
        });
    });

    afterAll(clearUsers);
});


describe('working on a user', () => {
    let testuser;

    beforeEach(done => {
        clearUsers(() => {
            user.createUser('Schwanzus Longus', 'sw@example.com', 'password', (err, user) => {
                testuser = user;
                done();
            });
        });
    });

    test('query user by email', done => {
        User.findOne({email: testuser.email}, (err, user) => {
            expect(user._id).toEqual(testuser._id);
            expect(user.name).toBe(testuser.name);
            expect(user.password).toBe(testuser.password);
            done();
        })
    });

    test('email validation', done => {
        user.createEmailValidationToken(testuser._id.toString(), (err, token) => {
            user.validateUserEmail(token, err => {
                expect(err).toBeNull();
                user.validateUserEmail(token, err => {
                    expect(err.message).toMatch('user already validated');
                    done();
                });
            });
        });
    });

    test('send email validation token (wrong email)', done => {
        user.createAndSendEmailValidationToken('sw@examle.com', (err) => {
            expect(err.message).toMatch('user not found');
            done();
        });
    });

    test('send password reset token (wrong email)', done => {
        user.createAndSendPasswordResetToken('sw@examle.com', (err) => {
            expect(err.message).toMatch('user not found');
            done();
        });
    });

    test('change password via password reset token', done => {
        user.createPasswordResetToken(testuser._id.toString(), (err, token) => {
            user.changePasswordViaResetToken(token, '12345678', err => {
                User.findById(testuser._id, (err, doc) => {
                    user.comparePassword('12345678', doc.password, (err, passwordsMatch) => {
                        expect(passwordsMatch).toBe(true);
                        done();
                    });
                });
            });
        });
    });

    test('change password via current password', done => {
        user.changePasswordViaCurrentPassword(testuser.email, 'password', '12345678', err => {
            User.findById(testuser._id, (err, doc) => {
                user.comparePassword('12345678', doc.password, (err, passwordsMatch) => {
                    expect(passwordsMatch).toBe(true);
                    done();
                });
            });
        });
    });

    afterAll(clearUsers);
});


describe('working on a validated user', () => {
    let testuser;

    beforeEach(done => {
        clearUsers(() => {
            user.createUser('Schwanzus Longus', 'sw@example.com', 'password', (err, user) => {
                user.emailValidated = true;
                user.save((err, user) => {
                    testuser = user;
                    done();
                });
            });
        });
    });

    test('send email verification token (user already validated)', done => {
        user.createAndSendEmailValidationToken(testuser.email, (err) => {
            expect(err.message).toMatch('user already validated');
            done();
        });
    });

    test('login', done => {
        user.login(testuser.email, 'password', (err, sessionToken) => {
            user.extractJwt(sessionToken, (err, decoded) => {
                expect(decoded.userId).toMatch(testuser._id.toString());
                done();
            });
        });
    });

    test('validate a valid session', done => {
        user.login(testuser.email, 'password', (err, sessionToken) => {
            user.validateSession(sessionToken, (err, userId) => {
                expect(userId).toMatch(testuser._id.toString());
                done();
            });
        });
    });

    test('validate an expired session', done => {
        const newSession = testuser.sessions.create({ expires: Date.now() });
        testuser.sessions.push(newSession);
        testuser.save((err, userEntry) => {
            user.createSessionToken(testuser._id.toString(), newSession._id.toString(), (err, token) => {
                user.validateSession(token, (err, userId) => {
                    expect(err.message).toMatch('session expired');
                    done();
                });
            });
        });
    });

    test('revoke all sessions', done => {
        testuser.sessions.push({});
        testuser.sessions.push({});
        testuser.sessions.push({});
        testuser.save((err, userEntry) => {
            expect(userEntry.sessions.length).toBe(3);
            user.revokeAllSessions(testuser._id.toString(), (err) => {
                User.findById(testuser._id.toString(), (err, userEntry) => {
                    expect(userEntry.sessions.length).toBe(0);
                    done();
                });
            });
        });
    });

    test('logout', done => {
        user.login(testuser.email, 'password', (err, sessionToken) => {
            user.logout(sessionToken, err => {
                User.findById(testuser._id.toString(), (err, userEntry) => {
                    expect(userEntry.sessions.length).toBe(0);
                    done();
                });
            });
        });
    });

    test('logout invalid session', done => {
        user.login(testuser.email, 'password', (err, sessionToken) => {
            user.logout(sessionToken, err => {
                user.logout(sessionToken, err => {
                    expect(err.message).toMatch('invalid session');
                    done();
                });
            });
        });
    });

    afterAll(clearUsers);
});


afterAll(() => {
    db.close();
});
