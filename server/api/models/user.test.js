/**
 * @author progmem
 * @date 24.10.17
 */

'use strict';

const validator = require('validator');
const User = require('./user').User;

describe('valid user', () => {
    const user = new User({
        name: 'Mäçx Muëstermann ',
        email: ' Max.Mustermann@web.de  ',
        // bcrypt of 'password'
        password: '$2y$10$Fmi6jDvpY13xWyovsOdi6OJKdvdFVex.vBAu5jz1qAsWDjPej3eTu'
    });

    test('no error (undefined)', () => {
        const err = user.validateSync();
        expect(err).toBeUndefined();
    });

    test('has _id', () => {
        expect(user._id).toBeDefined();
    });

    test('`created` is a date object', () => {
        expect(Object.prototype.toString.call(user.created)).toBe('[object Date]');
    });

    test('`name` is correct (unicode) and got trimmed', () => {
        expect(user.name).toBe('Mäçx Muëstermann');
    });

    test('`email` is correct, got trimmed and transformed to lowercase', () => {
        expect(user.email).toBe('max.mustermann@web.de');
    });

    test('`password` is correct', () => {
        expect(user.password).toBe('$2y$10$Fmi6jDvpY13xWyovsOdi6OJKdvdFVex.vBAu5jz1qAsWDjPej3eTu');
    });
});

describe('faulty user', () => {
    test('empty user (error is defined)', () => {
        const user = new User({});
        const err = user.validateSync();
        expect(err).toBeDefined();
    });

    test('name is required', () => {
        const user = new User({
            email: ' Max.Mustermann@web.de  ',
            // bcrypt of 'password'
            password: '$2y$10$Fmi6jDvpY13xWyovsOdi6OJKdvdFVex.vBAu5jz1qAsWDjPej3eTu'
        });
        const err = user.validateSync();
        expect(err.errors.name.message).toBe('name is required');

        user.name = '  ';
        const err2 = user.validateSync();
        expect(err2.errors.name.message).toBe('name is required');
    });

    test('email is required', () => {
        const user = new User({
            name: 'Mäçx Muëstermann ',
            // bcrypt of 'password'
            password: '$2y$10$Fmi6jDvpY13xWyovsOdi6OJKdvdFVex.vBAu5jz1qAsWDjPej3eTu'
        });
        const err = user.validateSync();
        expect(err.errors.email.message).toBe('email is required');

        user.email = '  ';
        const err2 = user.validateSync();
        expect(err2.errors.email.message).toBe('email is required');
    });

    test('password is required', () => {
        const user = new User({
            name: 'Mäçx Muëstermann ',
            email: ' Max.Mustermann@web.de  '
        });
        const err = user.validateSync();
        expect(err.errors.password.message).toBe('password is required');
    });

    test('email must be valid', () => {
        const user = new User({
            name: 'Mäçx Muëstermann ',
            email: ' Max.Mustermannweb.de  ',
            // bcrypt of 'password'
            password: '$2y$10$Fmi6jDvpY13xWyovsOdi6OJKdvdFVex.vBAu5jz1qAsWDjPej3eTu'
        });
        const err = user.validateSync();
        expect(err.errors.email.message).toBe('invalid email');

        user.email = '  ääçççç@äçççcom ';
        const err2 = user.validateSync();
        expect(err2.errors.email.message).toBe('invalid email');
    });
});

describe('user sessions', () => {
    let user;

    beforeEach(() => {
        // clear the array
        user = new User({
            name: 'Mäçx Muëstermann ',
            email: ' Max.Mustermann@web.de  ',
            // bcrypt of 'password'
            password: '$2y$10$Fmi6jDvpY13xWyovsOdi6OJKdvdFVex.vBAu5jz1qAsWDjPej3eTu'
        });
    });

    test('add simple session object', () => {
        user.sessions.push({});
        const err = user.validateSync();
        expect(err).toBeUndefined();
    });

    test('invalid expires property', () => {
        user.sessions.push({
            expires: 'magmag'
        });
        const err = user.validateSync();
        expect(err.errors['sessions.0.expires'].message).toBeDefined();
    });

    test('`created` is a date object', () => {
        user.sessions.push({});
        expect(Object.prototype.toString.call(user.sessions[0].created)).toBe('[object Date]');
    });

    test('has _id', () => {
        user.sessions.push({});
        expect(user.sessions[0]._id).toBeDefined();
    });

    test('faulty session object', () => {
        user.sessions.push({
            _id: 'magmag'
        });
        const err = user.validateSync();
        expect(err.errors['sessions.0._id'].message).toBeDefined();
    });
});