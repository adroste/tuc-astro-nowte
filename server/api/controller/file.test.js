/**
 * @author progmem
 * @date 26.11.17
 */

'use strict';

const User = require('../models/user').User;
const user = require('./user');
const Folder = require('../models/folder').Folder;
const Document = require('../models/document').Document;
const file = require('./file');
const db = require('../../init/mongo-init');


// clear user collection
async function clearUsers() {
    try {
        await User.remove({});
    } catch (err) {
        console.error(err);
    }
}

// clear folder collection
async function clearFolders() {
    try {
        await Folder.remove({});
    } catch (err) {
        console.error(err);
    }
}

// clear doc collection
async function clearDocuments() {
    try {
        await Document.remove({});
    } catch (err) {
        console.error(err);
    }
}


describe('folder, doc creation/update', () => {
    let testuser;

    beforeAll(done => {
        clearUsers().then(() => {
            user.createUser('Schwanzus Longus', 'sw@example.com', 'password', (err, user) => {
                user.emailValidated = true;
                user.save((err, user) => {
                    testuser = user;
                    done();
                });
            });
        });
    });


    test('checkTitleIsNoDuplicate, parent not found', async () => {
        try {
            const res = await file.checkTitleIsNoDuplicate('', true, '5a1b1eacd94b1e24b8310e43');
        } catch(err) {
            expect(err.status).toBe(404);
            expect(err.message).toMatch('parentId not found');
        }
    });

    test('checkTitleIsNoDuplicate, success', async () => {
        const res = await file.checkTitleIsNoDuplicate('', true, testuser.folderId.toString());
        expect(res).toBe(true);
    });

    test('checkTitleIsNoDuplicate, duplicate', async () => {
        const doc = await file.create(testuser._id.toString(), testuser.folderId.toString(), false, 'duplicate title');
        const res = await file.checkTitleIsNoDuplicate('  duplicate title   ', false, testuser.folderId.toString());
        expect(res).toBe(false);
    });


    test('getFilePermissions, user root folder', async () => {
        const res = await file.getFilePermissions(testuser._id.toString(), testuser.folderId.toString(), true);
        expect(res.manage).toBe(true);
    });

    test('getFilePermissions, no permissions', async () => {
        const res = await file.getFilePermissions('5a1b7373a517712ed795e557', testuser.folderId.toString(), true);
        expect(res.read).toBe(false);

        const res2 = await file.create('5a1b7373a517712ed795e557', testuser.folderId.toString(), false);
        expect(res.read).toBe(false);
    });

    test('getFilePermissions, shared folder', async () => {
        throw new Error('not implemented');
    });

    test('getFilePermissions, shared document', async () => {
        throw new Error('not implemented');
    });


    test('create document', async () => {
        const res = await file.create(testuser._id.toString(), testuser.folderId.toString(), false, ' my first doc  ');
        const entry = await Document.findById(res);
        expect(entry.title).toMatch('my first doc');
    });

    test('create folder', async () => {
        const res = await file.create(testuser._id.toString(), testuser.folderId.toString(), true, ' my first folder  ');
        const entry = await Folder.findById(res);
        expect(entry.title).toMatch('my first folder');
    });

    test('create document, no permissions', async () => {
        try {
            const res2 = await file.create('5a1b7373a517712ed795e557', testuser.folderId.toString(), false, 'example');
        } catch (err) {
            expect(err.status).toBe(403);
            expect(err.message).toMatch('not allowed to manage parentId')
        }
    });


    afterAll(async () => {
        await clearUsers();
        await clearFolders();
        await clearDocuments();
    });
});


afterAll(() => {
    db.close();
});