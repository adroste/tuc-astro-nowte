/**
 * @author progmem
 * @date 12.11.17
 */

'use strict';

const db = require('../../init/mongo-init');
const FolderModel = require('./FolderModel');

describe('folder tests', () => {
    test('create simple folder', () => {
        const folder = new FolderModel({
            title: 'My Folder',
            ownerId: '5a0871918fbac02a8a7439e7'
        });
        const err = folder.validateSync();
        expect(err).toBeUndefined();
    });

    test('create folder with children and documents', async () => {
        const folder = new FolderModel({
            title: 'My Second Folder',
            ownerId: '5a0871918fbac02a8a7439e7',
            childIds: [
                '5a0871918fbac02a8a7439e7',
                '5a0871918fbac02a8a7439e7',
                '5a0871918fbac02a8a7439e7'
            ]
        });
        const folderEntry = await folder.save();
        const res = await FolderModel.findByIdAndRemove(folderEntry._id);
        expect(res.title).toMatch('My Second Folder');
    });
});


afterAll(() => {
    db.close();
});