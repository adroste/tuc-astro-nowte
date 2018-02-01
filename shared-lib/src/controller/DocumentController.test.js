/**
 * @author Alexander Droste
 * @date 01.02.18
 */

const DocumentController = require('./DocumentController');
const UserModel = require('../models/UserModel');
const DocumentModel = require('../models/DocumentModel');
const ProjectModel = require('../models/ProjectModel');
const FileController = require('./FileController');
const UserController = require('./UserController');
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
let projectId;
let documentId;
beforeAll(async () => {
    await clearAll();
    testuser = await UserController.createUser('Schwanzus Longus', 'sw4@example.com', 'password');
    testuser.emailValidated = true;
    await testuser.save();
    projectId = await FileController.createProject(testuser._id.toString(), '  My Project   ');
    documentId = await FileController.createDocument(testuser._id.toString(), projectId, '/my folder/', ' my doc', true);
});


describe('load/save of document state', async () => {
    test('load of non existent document', async () => {
        const docId = '5a2ff6694584c97c375288d3';
        try {
            await DocumentController.loadDocument(docId, docId);
        } catch (err) {
            expect(err.message).toBe('documentId not found');
        }
    });


    test('save to non existent document', async () => {
        const docId = "5a2ff6694584c97c375288d3";
        try {
            await DocumentController.saveDocument(docId, docId, {magmag: '4'});
        } catch (err) {
            expect(err.message).toBe('documentId not found');
        }
    });


    test('load empty document', async () => {
        const dat = await DocumentController.loadDocument(projectId, documentId);
        expect(Object.keys(dat).length).toBe(0);
    });


    test('save and reload document state', async () => {
        const dat = {magmag: "magedi"};
        await DocumentController.saveDocument(projectId, documentId, dat);
        const datReload = await DocumentController.loadDocument(projectId, documentId);
        expect(datReload.magmag).toBe("magedi");
    });
});

afterAll(() => {
    db.close();
});