/**
 * @author progmem
 * @date 26.11.17
 */

'use strict';

const UserModel = require('../models/UserModel');
const FolderModel = require('../models/FolderModel');
const DocumentModel = require('../models/DocumentModel');
const ShareModel = require('../models/ShareModel');
const FileController = require('./FileController');
const UserController = require('./UserController');
const PermissionsEnum = require('../utilities/PermissionsEnum');
const db = require('../../init/mongo-init');


async function clearAll() {
    try {
        await UserModel.remove({});
        await FolderModel.remove({});
        await DocumentModel.remove({});
        await ShareModel.remove({});
    } catch (err) {
        console.error(err);
    }
}


let testuser;
beforeAll(async () => {
    await clearAll();
    testuser = await UserController.createUser('Schwanzus Longus', 'sw4@example.com', 'password');
    testuser.emailValidated = true;
    await testuser.save();
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
        const doc = await FileController.createFile(testuser._id.toString(), testuser.folderId.toString(), false, 'duplicate title');
        const res = await FileController.checkTitleIsNoDuplicate('  duplicate title   ', false, testuser.folderId.toString());
        expect(res).toBe(false);
    });

    test('getFilePermissions, user root folder', async () => {
        const res = await FileController.getFilePermissions(testuser._id.toString(), testuser.folderId.toString(), true);
        expect(res.value).toBe(PermissionsEnum.MANAGE);
        expect(res.ownerId).toMatch(testuser._id.toString());
    });

    test('getFilePermissions, wrong folder', async () => {
        try {
            const res = await FileController.getFilePermissions(testuser._id.toString(), '5a1b7373a517712ed795e557', true);
        } catch (err) {
            expect(err.message).toMatch('fileId not found');
        }
    });

    test('getFilePermissions, no permissions', async () => {
        const res = await FileController.getFilePermissions('5a1b7373a517712ed795e557', testuser.folderId.toString(), true);
        expect(res.value).toBe(PermissionsEnum.NONE);

        try {
            const res2 = await FileController.createFile('5a1b7373a517712ed795e557', testuser.folderId.toString(), false, 'title2345');
        } catch(err) {
            expect(err.message).toMatch("not allowed to manage parentId");
        }
    });

    test('getFilePermissions, shared folder', async () => {
        const folderId = await FileController.createFile(testuser._id.toString(), testuser.folderId.toString(), true, 'folder43');
        const shareId = await FileController.createShare(testuser._id.toString(), folderId, true, '5a1b7373a517712ed795e557', PermissionsEnum.ANNOTATE);
        const p = await FileController.getFilePermissions('5a1b7373a517712ed795e557', folderId, true);
        expect(p.ownerId).toMatch(testuser._id.toString());
        expect(p.value).toBe(PermissionsEnum.ANNOTATE);
    });

    test('create document, own tree', async () => {
        const res = await FileController.createFile(testuser._id.toString(), testuser.folderId.toString(), false, ' my first doc  ');
        const entry = await DocumentModel.findById(res);
        expect(entry.title).toMatch('my first doc');
    });

    test('create folder, own tree', async () => {
        const res = await FileController.createFile(testuser._id.toString(), testuser.folderId.toString(), true, ' my first folder  ');
        const entry = await FolderModel.findById(res);
        expect(entry.title).toMatch('my first folder');
    });

    test('create document, no permissions', async () => {
        try {
            const res2 = await FileController.createFile('5a1b7373a517712ed795e557', testuser.folderId.toString(), false, 'example');
        } catch (err) {
            expect(err.status).toBe(403);
            expect(err.message).toMatch('not allowed to manage parentId')
        }
    });

    test('create share for document', async () => {
        const docId = await FileController.createFile(testuser._id.toString(), testuser.folderId.toString(), false, 'tiiiiiitle');
        const shareId = await FileController.createShare(testuser._id.toString(), docId, false, '5a1b7373a517712ed795e550', PermissionsEnum.EDIT);
        const shareEntry = await ShareModel.findById(shareId);
        const docEntry = await DocumentModel.findById(docId);
        expect(shareEntry.fileId.toString()).toMatch(docEntry._id.toString());
        expect(shareEntry.isFolder).toBe(false);
        expect(shareEntry.userId.toString()).toMatch('5a1b7373a517712ed795e550');
        expect(shareEntry.permissions).toBe(PermissionsEnum.EDIT);
        const foundId = docEntry.shareIds.find((elem) => {
            return elem.toString() === shareId;
        });
        expect(foundId.toString()).toMatch(shareId);
    });

    test('create share, wrong fileId', async () => {
        try {
            await FileController.createShare('5a1b7373a517712ed795e557', '5a1b7373a517712ed795e550', true, '5a1b7373a517712ed795e550', PermissionsEnum.READ);
        } catch (err) {
            expect(err.message).toMatch('fileId not found');
        }
    });

    test('create share, not allowed', async () => {
        try {
            await FileController.createShare('5a1b7373a517712ed795e557', testuser.folderId.toString(), true, '5a1b7373a517712ed795e557', PermissionsEnum.EDIT);
        } catch (err) {
            expect(err.message).toMatch('not allowed to create share for fileId');
        }
    });

    test('create document in share', async () => {
        const sharedFolderId = await FileController.createFile(testuser._id.toString(), testuser.folderId.toString(), true, 'sharedFolder');
        const shareId = await FileController.createShare(testuser._id.toString(), sharedFolderId, true, '5a1b7373a517712ed795e557', PermissionsEnum.MANAGE);
        const newDocId = await FileController.createFile('5a1b7373a517712ed795e557', sharedFolderId, false, 'sharedDoc');
        const newDocEntry = await DocumentModel.findById(newDocId);
        const sharedFolderEntry = await FolderModel.findById(sharedFolderId);
        expect(newDocEntry.ownerId.toString()).toMatch(testuser._id.toString());
        expect(newDocEntry.parentId.toString()).toMatch(sharedFolderId);
        const foundShareInFolder = sharedFolderEntry.shareIds.find((elem) => {
            return elem.toString() === shareId;
        });
        expect(foundShareInFolder.toString()).toMatch(shareId);
        const foundDocinFolder = sharedFolderEntry.documentIds.find((elem) => {
            return elem.toString() === newDocId;
        });
        expect(foundDocinFolder.toString()).toMatch(newDocId);
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