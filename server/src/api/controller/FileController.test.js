/**
 * @author progmem
 * @date 26.11.17
 */

'use strict';

const UserModel = require('../models/UserModel');
const DocumentModel = require('../models/DocumentModel');
const ProjectModel = require('../models/ProjectModel');
const FileController = require('./FileController');
const UserController = require('./UserController');
const PermissionsEnum = require('../utilities/PermissionsEnum');
const db = require('../../init/mongo-init');


async function clearAll() {
    try {
        await UserModel.remove({});
        await DocumentModel.remove({});
        await ProjectModel.remove({});
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


describe('basic project operations', async () => {
    test('create project', async () => {
        const projectId = await FileController.createProject(testuser._id.toString(), '  My Project   ');
        expect(typeof projectId).toBe('string');
        const projectEntry = await ProjectModel.findById(projectId);
        expect(projectEntry._id.toString()).toBe(projectId);
        expect(projectEntry.title).toBe('My Project');
        expect(projectEntry.tree[0].path).toBe('/');
        expect(projectEntry.access[0].userId.toString()).toBe(testuser._id.toString());
        expect(projectEntry.access[0].grantedById.toString()).toBe(testuser._id.toString());
        expect(projectEntry.access[0].permissions).toBe(PermissionsEnum.OWNER);
    });

    test('create project, validation fail', async () => {
        try {
            await FileController.createProject(null, 'm');
        } catch (err) {
            expect(err.message).toMatch('validation failed');
        }
    });

    test('create path', async () => {
        const projectId = await FileController.createProject(testuser._id.toString(), 'abctest');
        await FileController.createPath(testuser._id.toString(), projectId, '/1/2/3/');
        const projectEntry = await ProjectModel.findById(projectId);
        expect(projectEntry.tree[1].path).toBe('/1/');
        expect(projectEntry.tree[2].path).toBe('/1/2/');
        expect(projectEntry.tree[3].path).toBe('/1/2/3/');
    });

    test('create path, wrong format', async () => {
        try {
            await FileController.createPath(testuser._id.toString(), testuser._id.toString(), '1/2/3/');
        } catch (e) {
            expect(e.message).toMatch('invalid path format');
        }
    });

    test('create path, no permissions', async () => {
        const projectId = await FileController.createProject(testuser._id.toString(), 'ctest');
        await ProjectModel.update({_id: projectId}, { $set: { 'access.0.permissions': PermissionsEnum.EDIT }});
        try {
            await FileController.createPath(testuser._id.toString(), projectId, '/1/2/3/');
        } catch (e) {
            expect(e.message).toMatch('not allowed to create path in projectId');
        }
    });

    test('title is no duplicate', async () => {
        const projectId = await FileController.createProject(testuser._id.toString(), 'ctst');
        await FileController.createPath(testuser._id.toString(), projectId, '/1/2/3/');
        const res = await FileController.checkTitleIsNoDuplicate(projectId, '/1/2/', 'magmag');
        expect(res).toBe(true);
    });

    test('title is duplicate', async () => {
        throw new Error('not implemented yet');
    });

    test('create document', async () => {
        const projectId = await FileController.createProject(testuser._id.toString(), 'test3');
        const documentId = await FileController.createDocument(testuser._id.toString(), projectId, '/', ' my doc');

    });
});

afterAll(() => {
    db.close();
});