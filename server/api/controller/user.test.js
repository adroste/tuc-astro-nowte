/**
 * @author progmem
 * @date 26.10.17
 */

'use strict';

const User = require('../models/user').User;
const user = require('./user');
const db = require('../../mongo-init');

// clear user collection
function clearUsers(done) {
    User.remove({}, err => {
        if (err)
            console.error(err);
        done();
    });
}


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

    beforeAll(done => {
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

    afterAll(clearUsers);
});

afterAll(() => {
    db.close();
});
