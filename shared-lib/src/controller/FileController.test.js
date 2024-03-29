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
const db = require('../init/mongo-init');


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
        await ProjectModel.update({_id: projectId}, {$set: {'access.0.permissions': PermissionsEnum.EDIT}});
        try {
            await FileController.createPath(testuser._id.toString(), projectId, '/1/2/3/');
        } catch (e) {
            expect(e.message).toMatch('not allowed to create path in projectId');
        }
    });

    test('title is no duplicate', async () => {
        const projectId = await FileController.createProject(testuser._id.toString(), 'ctst');
        await FileController.createPath(testuser._id.toString(), projectId, '/1/2/3/');
        const res = await FileController._checkTitleIsNoDuplicate(projectId, '/1/2/', 'magmag');
        expect(res).toBe(true);
    });

    test('title is duplicate', async () => {
        const projectId = await FileController.createProject(testuser._id.toString(), 'ctstasfd');
        let res = await FileController._checkTitleIsNoDuplicate(projectId, '/my folder/', 'my doc');
        expect(res).toBe(true);
        const documentId = await FileController.createDocument(testuser._id.toString(), projectId, '/my folder/', ' my doc', true);
        res = await FileController._checkTitleIsNoDuplicate(projectId, '/my folder/', 'my doc');
        expect(res).toBe(false);
        let err;
        try {
            await FileController.createDocument(testuser._id.toString(), projectId, '/my folder/', 'my doc', true);
        } catch (e) {
            err = e;
        }
        expect(err.message).toBe('title already exists');
    });

    test('create document', async () => {
        const projectId = await FileController.createProject(testuser._id.toString(), 'test3');
        const documentId = await FileController.createDocument(testuser._id.toString(), projectId, '/my folder/', ' my doc', true);
        const projectEntry = await ProjectModel.findById(projectId);
        expect(projectEntry.tree[1].children[0].documentId.toString()).toBe(documentId);
        expect(projectEntry.tree[1].children[0].title).toBe('my doc');
        const docEntry = await DocumentModel.findById(documentId);
        expect(docEntry !== null).toBe(true);
    });
});


describe('combined project operations', async () => {
    test('list tree', async () => {
        const projectId = await FileController.createProject(testuser._id.toString(), 'test4');
        const documentId = await FileController.createDocument(testuser._id.toString(), projectId, '/folder/', 'letter ', true);
        const tree = await FileController.listProjectTree(testuser._id.toString(), projectId);
        expect(tree.length).toBe(2);
        expect(tree[0].path).toBe('/');
        expect(tree[0].children.length).toBe(0);
        expect(tree[1].path).toBe('/folder/');
        expect(tree[1].children.length).toBe(1);
        expect(tree[1].children[0].title).toBe('letter');
    });

    test('list projects for user', async () => {
        await ProjectModel.remove({});
        let res = await FileController.listProjectsForUser(testuser._id.toString());
        expect(res.length).toBe(0);
        const projectId = await FileController.createProject(testuser._id.toString(), 'test5');
        const projectId2 = await FileController.createProject(testuser._id.toString(), ' ltest5');
        res = await FileController.listProjectsForUser(testuser._id.toString(), false);
        expect(res.length).toBe(2);
        expect(res[0].title).toBe('test5');
        expect(res[1].id.toString()).toBe(projectId2);
        expect(res[1].access.permissions).toBe(5);
        expect(res[1].access.grantedById.toString()).toBe(testuser._id.toString());
        res = await FileController.listProjectsForUser(testuser._id.toString(), true);
        expect(res[0].access.grantedBy.email).toBe(testuser.email);
    });

    test('set user permissions, user == shareUser', async () => {
        const usid = '5a2ff6694584c97c375288d3';
        const projectId = await FileController.createProject(testuser._id.toString(), 'test6');

        await FileController.setUserPermissionsForProject(testuser._id.toString(), projectId, usid, PermissionsEnum.OWNER);
        let access = await FileController._getUserProjectAccess(usid, projectId);
        expect(access.permissions).toBe(PermissionsEnum.OWNER);

        await FileController.setUserPermissionsForProject(testuser._id.toString(), projectId, usid, PermissionsEnum.READ);
        access = await FileController._getUserProjectAccess(usid, projectId);
        expect(access.permissions).toBe(PermissionsEnum.READ);

        await FileController.setUserPermissionsForProject(testuser._id.toString(), projectId, usid, PermissionsEnum.NONE);
        access = await FileController._getUserProjectAccess(usid, projectId);
        expect(access.permissions).toBe(PermissionsEnum.NONE);
        expect(access.grantedById).toBe(null);
    });

    test('list project access', async () => {
        const usid = '5a2ff6694584c97c375288d3';
        const projectId = await FileController.createProject(testuser._id.toString(), 'test7');
        await FileController.setUserPermissionsForProject(testuser._id.toString(), projectId, usid, PermissionsEnum.READ);
        const access = await FileController.listProjectAccess(usid, projectId);
        expect(access[0].user.name).toBe('Schwanzus Longus');
        expect(access[0].grantedBy.email).toBe('sw4@example.com');
        expect(access[1].permissions).toBe(PermissionsEnum.READ);
    });

    test('delete project and all of its documents', async () => {
        const projectId = await FileController.createProject(testuser._id.toString(), 'test8');
        const documentId = await FileController.createDocument(testuser._id.toString(), projectId, '/my folder/', ' my doc', true);
        expect(await DocumentModel.findById(documentId) !== null).toBe(true);
        await FileController.deleteProject(testuser._id.toString(), projectId);
        expect(await DocumentModel.findById(documentId) === null).toBe(true);
        expect(await ProjectModel.findById(projectId) === null).toBe(true);
        try {
            await FileController.deleteProject(testuser._id.toString(), projectId);
        } catch (err) {
            expect(err.message).toBe('projectId not found');
        }
    });

    test('delete a document from a project', async () => {
        const projectId = await FileController.createProject(testuser._id.toString(), 'test9');
        const documentId = await FileController.createDocument(testuser._id.toString(), projectId, '/my folder/', ' my doc', true);
        expect(await DocumentModel.findById(documentId) !== null).toBe(true);
        await FileController.deleteDocument(testuser._id.toString(), projectId, '/my folder/', documentId);
        expect(await DocumentModel.findById(documentId) === null).toBe(true);
        const project = await ProjectModel.findById(projectId);
        expect(project.tree[1].path).toBe('/my folder/');
        expect(project.tree[1].children.length).toBe(0);
    });

    test('delete a path from a project', async () => {
        const projectId = await FileController.createProject(testuser._id.toString(), 'test0');
        const documentId = await FileController.createDocument(testuser._id.toString(), projectId, '/my folder/', ' my doc', true);
        expect(await DocumentModel.findById(documentId) !== null).toBe(true);
        const documentId2 = await FileController.createDocument(testuser._id.toString(), projectId, '/my folder/sub/', 'doc2', true);
        expect(await DocumentModel.findById(documentId2) !== null).toBe(true);
        const documentId3 = await FileController.createDocument(testuser._id.toString(), projectId, '/magmag/my folder/', 'doc3', true);
        expect(await DocumentModel.findById(documentId3) !== null).toBe(true);

        await FileController.deletePath(testuser._id.toString(), projectId, '/my folder/');
        expect(await DocumentModel.findById(documentId) === null).toBe(true);
        expect(await DocumentModel.findById(documentId2) === null).toBe(true);
        expect(await DocumentModel.findById(documentId3) !== null).toBe(true);
        const project = await ProjectModel.findById(projectId);
        // length = 3: '/', '/magmag/', '/magmag/my folder/'
        expect(project.tree.length).toBe(3);
    });

    test('rename a document', async () => {
        const projectId = await FileController.createProject(testuser._id.toString(), 'test11');
        const documentId = await FileController.createDocument(testuser._id.toString(), projectId, '/my folder/', ' my doc', true);
        let project = await ProjectModel.findById(projectId);
        expect(project.tree[1].children[0].documentId.toString()).toBe(documentId);
        expect(project.tree[1].children[0].title).toBe('my doc');
        await FileController.moveDocument(testuser._id.toString(), documentId, projectId, projectId, '/my folder/', '/my folder/', 'my doc', 'my doc2 ', true);
        project = await ProjectModel.findById(projectId);
        expect(project.tree[1].children[0].documentId.toString()).toBe(documentId);
        expect(project.tree[1].children[0].title).toBe('my doc2');
    });

    test('move a document inside a project', async () => {
        const projectId = await FileController.createProject(testuser._id.toString(), 'test12');
        const documentId = await FileController.createDocument(testuser._id.toString(), projectId, '/my folder/', ' my doc', true);
        let project = await ProjectModel.findById(projectId);
        expect(project.tree[1].children[0].documentId.toString()).toBe(documentId);
        expect(project.tree[1].children[0].title).toBe('my doc');
        await FileController.moveDocument(testuser._id.toString(), documentId, projectId, projectId, '/my folder/', '/', 'my doc', 'my doc');
        project = await ProjectModel.findById(projectId);
        expect(project.tree[0].children[0].documentId.toString()).toBe(documentId);
        expect(project.tree[0].children[0].title).toBe('my doc');
    });

    test('move a document to a new project', async () => {
        const projectId = await FileController.createProject(testuser._id.toString(), 'test13');
        const projectId2 = await FileController.createProject(testuser._id.toString(), 'test14');
        const documentId = await FileController.createDocument(testuser._id.toString(), projectId, '/my folder/', ' my doc', true);
        let project = await ProjectModel.findById(projectId);
        expect(project.tree[1].children[0].documentId.toString()).toBe(documentId);
        expect(project.tree[1].children[0].title).toBe('my doc');
        let project2 = await ProjectModel.findById(projectId2);
        expect(project2.tree[0].children.length).toBe(0);
        await FileController.moveDocument(testuser._id.toString(), documentId, projectId, projectId2, '/my folder/', '/my folder/', 'my doc', 'my doc', true);
        project = await ProjectModel.findById(projectId);
        expect(project.tree[0].children.length).toBe(0);
        expect(project.tree[1].children.length).toBe(0);
        project2 = await ProjectModel.findById(projectId2);
        expect(project2.tree[0].children.length).toBe(0);
        expect(project2.tree[1].children.length).toBe(1);
        expect(project2.tree[1].children[0].title).toBe('my doc');
    });
});

afterAll(() => {
    db.close();
});