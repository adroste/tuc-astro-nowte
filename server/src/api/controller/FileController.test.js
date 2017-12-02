/**
 * @author progmem
 * @date 26.11.17
 */

'use strict';

const UserModel = require('../models/UserModel');
const user = require('./user');
const FolderModel = require('../models/FolderModel');
const DocumentModel = require('../models/DocumentModel');
const FileController = require('./FileController');
const db = require('../../init/mongo-init');


// clear user collection
async function clearAll() {
    try {
        await UserModel.remove({});
        await FolderModel.remove({});
        await DocumentModel.remove({});
    } catch (err) {
        console.error(err);
    }
}


let testuser;
beforeAll(done => {
    clearAll().then(() => {
        user.createUser('Schwanzus Longus', 'sw@example.com', 'password', (err, user) => {
            user.emailValidated = true;
            user.save((err, user) => {
                testuser = user;
                done();
            });
        });
    });
});


describe('folder, doc basic creation/update', async () => {
    test('checkTitleIsNoDuplicate, parent not found', async () => {
        try {
            const res = await FileController.checkTitleIsNoDuplicate('', true, '5a1b1eacd94b1e24b8310e43');
        } catch(err) {
            expect(err.status).toBe(404);
            expect(err.message).toMatch('parentId not found');
        }
    });

    test('checkTitleIsNoDuplicate, success', async () => {
        const res = await FileController.checkTitleIsNoDuplicate('', true, testuser.folderId.toString());
        expect(res).toBe(true);
    });

    test('checkTitleIsNoDuplicate, duplicate', async () => {
        const doc = await FileController.create(testuser._id.toString(), testuser.folderId.toString(), false, 'duplicate title');
        const res = await FileController.checkTitleIsNoDuplicate('  duplicate title   ', false, testuser.folderId.toString());
        expect(res).toBe(false);
    });


    test('getFilePermissions, user root folder', async () => {
        const res = await FileController.getFilePermissions(testuser._id.toString(), testuser.folderId.toString(), true);
        expect(res.permissions.manage).toBe(true);
        expect(res.ownerId).toMatch(testuser._id.toString());
    });

    test('getFilePermissions, no permissions', async () => {
        const res = await FileController.getFilePermissions('5a1b7373a517712ed795e557', testuser.folderId.toString(), true);
        expect(res.permissions.read).toBe(false);

        try {
            const res2 = await FileController.create('5a1b7373a517712ed795e557', testuser.folderId.toString(), false, 'title2345');
        } catch(err) {
            expect(err.message).toMatch("not allowed to manage parentId");
        }
    });

    test('getFilePermissions, shared folder', async () => {
        throw new Error('not implemented');
    });

    test('getFilePermissions, shared document', async () => {
        throw new Error('not implemented');
    });


    test('create document, own tree', async () => {
        const res = await FileController.create(testuser._id.toString(), testuser.folderId.toString(), false, ' my first doc  ');
        const entry = await DocumentModel.findById(res);
        expect(entry.title).toMatch('my first doc');
    });

    test('create folder, own tree', async () => {
        const res = await FileController.create(testuser._id.toString(), testuser.folderId.toString(), true, ' my first folder  ');
        const entry = await FolderModel.findById(res);
        expect(entry.title).toMatch('my first folder');
    });

    test('create document, no permissions', async () => {
        try {
            const res2 = await FileController.create('5a1b7373a517712ed795e557', testuser.folderId.toString(), false, 'example');
        } catch (err) {
            expect(err.status).toBe(403);
            expect(err.message).toMatch('not allowed to manage parentId')
        }
    });

    test('create document in share', async () => {
        throw new Error('not implemented');
    });


    test('get listing', async () => {
        // TODO refactor, test on mocked structure below, move test
        throw new Error('not implemented');
        const res = await FileController.getFolderListing(testuser._id.toString(), testuser.folderId.toString());
        const t = 4;
    });


    afterAll(async () => {
        await clearAll();
    });
});


describe('file, folder operations on mocked structure', () => {
    beforeAll(async () => {
        // create 2 docs in root folder
        //await file.create()
    });
});


afterAll(() => {
    db.close();
});