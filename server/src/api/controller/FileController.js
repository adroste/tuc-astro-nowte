/**
 * @author progmem
 * @date 26.11.17
 */

'use strict';


const ConfigTool = require('../../ConfigTool');
const ProjectModel = require('../models/ProjectModel');
const DocumentModel = require('../models/DocumentModel');
const UserModel = require('../models/UserModel');
const PermissionsEnum = require('../utilities/PermissionsEnum');
const ErrorUtil = require('../utilities/ErrorUtil');
const FileUtil = require('../utilities/FileUtil');


/**
 * FileController contains methods for file actions
 */
class FileController {
    /**
     * Creates a project with specified title
     * @param {string} userId id of user creating the project
     * @param {string} title title for project
     * @returns {Promise<string>} resolves to projectId
     * @throws {Error} msg contains: 'validation failed' with status: 400 if specified data does not match Model requirements
     */
    static async createProject(userId, title) {
        title = title.trim();

        const project = new ProjectModel({
            title: title,
            access: [{
                userId: userId,
                grantedById: userId,
                permissions: PermissionsEnum.OWNER
            }],
            tree: [{
                path: "/",
                children: []
            }]
        });

        try {
            await project.save();
        } catch (err) {
            if (err.message.includes('validation failed'))
                ErrorUtil.conditionalThrowWithStatus(true, err.message, 400);
            else
                ErrorUtil.throwAndLog(err, 'unknown mongo error');
        }

        return project._id.toString();
    }


    /**
     * Creates whole path (and subpaths if they don't exist) in projectIds tree
     * @param {string} userId id of user trying to create path
     * @param {string} projectId id of project into the path is inserted
     * @param {string} path string of path, starting and ending with a '/', e.g.: '/folder1/folder1.1/'
     * @returns {Promise<void>} Promise has no return/resolve value
     * @throws {Error} msg: 'invalid path format' with status: 400 if provided path does not start and end with a '/'
     * @throws {Error} msg: 'not allowed to create path in projectId' with status: 403 if user with userId has no manage permissions for projectId
     * @throws {Error} from {@link FileController.getUserProjectAccess}
     */
    static async createPath(userId, projectId, path) {
        path = path.trim();

        // check path starts and ends with '/'
        ErrorUtil.checkPathFormat(path);

        // ensure permissions
        const access = await this.getUserProjectAccess(userId, projectId);
        ErrorUtil.conditionalThrowWithStatus(
            access.permission < PermissionsEnum.MANAGE,
            'not allowed to create path in projectId', 403);

        const subpaths = FileUtil.getAllSubpaths(path);

        // create whole path by creating all subpaths
        for (let subpath of subpaths) {
            try {
                // single query here: slower but safe (atomic)
                await ProjectModel.update(
                    {_id: projectId, 'tree.path': {$ne: subpath}},
                    {$push: {tree: {path: subpath, children: []}}});
                let j = 0;
            } catch (err) {
                ErrorUtil.throwAndLog(err, 'unknown mongo error');
            }
        }
    }


    /**
     * @todo unit test
     * Retrieves access information for a specified user for a specified project
     * @param {string} userId id of user to lookup
     * @param {string} projectId id of project to retrieve access information from
     * @returns {Promise<{grantedById: string|null, permissions: number}>}
     * @throws {Error} from {@link FileController.getAllProjectAccess}
     */
    static async getUserProjectAccess(userId, projectId) {
        const access = await this.getAllProjectAccess(projectId);
        const userAccess = access.find((elem) => {
            return elem.userId.toString() === userId;
        });
        if (userAccess === undefined)
            return { grantedById: null, permissions: PermissionsEnum.NONE };
        return { grantedById: userAccess.grantedById.toString(), permissions: userAccess.permissions };
    }


    /**
     * @todo unit test
     * Retrieves access object of specified project
     * @param {string} projectId id of project
     * @returns {Promise<[accessSchema]>} Array of accessSchema {@link ProjectModel}
     * @throws {Error} msg: 'projectId not found' with status: 404 if no project with specified if could be found
     */
    static async getAllProjectAccess(projectId) {
        let projectEntry;
        try {
            projectEntry = await ProjectModel.findById(projectId, { access: 1 });
        } catch (err) {
            ErrorUtil.throwAndLog(err, 'unknown mongo error');
        }
        ErrorUtil.conditionalThrowWithStatus(projectEntry === null, 'projectId not found', 404);

        return projectEntry.access;
    }


    static async getProjectAccessInfo(projectId) {
        // TODO populate userID from getAllProjectAccess
        // TODO case: userId refers to a non existing user
    }


    /**
     * Creates a new (empty) document inside path in project with projectId.
     * @param {string} userId id of user creating document
     * @param {string} projectId id of project to create document in
     * @param {string} path path to put document in
     * @param {string} title title of the document
     * @param {boolean} [upsertPath] indicates if specified path should be upserted, defaults to false
     * @returns {Promise<string>} resolves to documentId
     * @throws {Error} msg: 'not allowed to create document in projectId' with status: 403 if user with userId has no manage permissions for projectId
     * @throws {Error} msg: 'could not find projectId with path' with status: 404 if specified projectId or path inside projectId does not exist
     * @throws {Error} msg: 'title already exists' with status: 409 if path already contains a document with the same title
     * @throws {Error} from {@link FileController.createPath} (if upsertPath is set to true)
     */
    static async createDocument(userId, projectId, path, title, upsertPath = false) {
        path = path.trim();
        title = title.trim();

        // ensure title is no duplicate
        ErrorUtil.conditionalThrowWithStatus(
            !this.checkTitleIsNoDuplicate(projectId, path, title),
            'title already exists', 409);

        // upsert
        if (upsertPath)
            await this.createPath(userId, projectId, path);

        // ensure permissions
        const access = await this.getUserProjectAccess(userId, projectId);
        ErrorUtil.conditionalThrowWithStatus(
            access.permission < PermissionsEnum.MANAGE,
            'not allowed to create document in projectId', 403);

        const documentEntry = new DocumentModel({
            projectId: projectId,
            createdById: userId
        });

        let rawResponse;
        try {
            rawResponse = await ProjectModel.update(
                { _id: projectId, 'tree.path': path },
                { $push: { 'tree.$.children': { documentId: documentEntry._id, title: title }}});
        } catch (err) {
            ErrorUtil.throwAndLog(err, 'unknown mongo error');
        }
        ErrorUtil.conditionalThrowWithStatus(rawResponse.nModified === 0, 'could not find projectId with path', 404);

        try {
            await documentEntry.save();
        } catch (err) {
            ErrorUtil.throwAndLog(err, 'unknown mongo error');
        }

        return documentEntry._id.toString();
    }


    /**
     * Checks if provided title inside a path in a project already exists
     * @param {string} projectId id of project
     * @param {string} path path to search in
     * @param {string} title title to check for
     * @returns {Promise<boolean>} true if title is no duplicate
     */
    static async checkTitleIsNoDuplicate(projectId, path, title) {
        path = path.trim();
        title = title.trim();

        let entry;
        try {
            entry = await ProjectModel.findOne({ _id: projectId, 'tree.path': path }, { 'tree.$': 1 });
        } catch (err) {
            ErrorUtil.throwAndLog(err, 'unknown mongo error');
        }
        if (entry === null)
            return true;

        const matching = entry.tree[0].children.find((elem) => {
            return elem.title === title;
        });
        return matching === undefined;
    }


    /**
     * Retrieves whole tree of a project (projectId)
     * @todo convert all objectIds to strings
     * @param {string} userId id of user requesting tree
     * @param {string} projectId id of project
     * @returns {Promise<[treeSchema]>} Array of treeSchema {@link ProjectModel}
     * @throws {Error} msg: 'not allowed to list project tree' with status: 403 if the user has no read permissions for the project
     * @throws {Error} msg: 'projectId not found' with status: 404 if no project with specified if could be found
     * @throws {Error} from {@link FileController.getUserProjectAccess}
     */
    static async listProjectTree(userId, projectId) {
        // ensure permissions (READ)
        const access = await this.getUserProjectAccess(userId, projectId);
        ErrorUtil.conditionalThrowWithStatus(
            access.permission < PermissionsEnum.READ,
            'not allowed to list project tree', 403);

        let projectEntry;
        try {
            projectEntry = await ProjectModel.findById(projectId, { tree: 1 }).lean();
        } catch (err) {
            ErrorUtil.throwAndLog(err, 'unknown mongo error');
        }
        ErrorUtil.conditionalThrowWithStatus(projectEntry === null, 'projectId not found', 404);

        return projectEntry.tree;
    }


    /**
     * Lists all projects a user has access to
     * @param {string} userId id of user
     * @param {boolean} populateGrantedBy if true 'access.grantedById' will be populated by user info object containing name and email
     * @returns {Promise<Array<{_id: string, title: string, access: Object}>>}
     * returns array of projects with _id, title and user access, access object will look like:<br>
     * { grantedById: string, permissions: number } - if populateGrantedBy is false,<br>
     * { grantedBy: { name: string, email: string}, permissions: number} - if populateGrantedBy is true
     */
    static async listProjectsForUser(userId, populateGrantedBy = true) {
        let p;
        try {
            p = await ProjectModel.find(
                { 'access.userId': userId },
                { _id: 1, title: 1, 'access.$': 1 }).lean();
        } catch (err) {
            ErrorUtil.throwAndLog(err, 'unknown mongo error');
        }

        for(let i = 0; i < p.length; i++) {
            p[i].id = p[i]._id.toString();
            delete p[i]._id;
            p[i].access = p[i].access[0];
            delete p[i].access.userId;
            if (populateGrantedBy) {
                try {
                    p[i].access.grantedBy = await UserModel.findById(p[i].access.grantedById.toString(), {_id: 0, name: 1, email: 1}).lean();
                } catch (e) {
                    ErrorUtil.throwAndLog(e, 'unknown mongo error');
                }
                delete p[i].access.grantedById;
            }
        }

        return p;
    }


    /**
     * Grants or updates a users permissions for a project.
     * @param {string} userId id of user updating permissions
     * @param {string} projectId id of project
     * @param {string} shareUserId id of user that retrieves permissions
     * @param {number} permissions see {@link PermissionsEnum} (NONE removes access)
     * @returns {Promise<void>} Promise has no return/resolve value
     * @throws {Error} msg: 'userId and shareUserId must not be the same' with status: 400
     * @throws {Error} msg: 'not allowed to edit access rights for project' with status: 403 if user trying to update other users permissions has no owner permissions on projectId
     * @throws {Error} from {@link FileController.getUserProjectAccess}
     */
    static async setUserPermissionsForProject(userId, projectId, shareUserId, permissions) {
        ErrorUtil.conditionalThrowWithStatus(userId === shareUserId, 'userId and shareUserId must not be the same', 400);

        // ensure permissions (OWNER)
        const access = await this.getUserProjectAccess(userId, projectId);
        ErrorUtil.conditionalThrowWithStatus(
            access.permission < PermissionsEnum.OWNER,
            'not allowed to edit access rights for project', 403);

        try {
            if (permissions === PermissionsEnum.NONE) {
                // remove access entry if permissions is set to NONE
                await ProjectModel.update(
                    {_id: projectId, 'access.userId': shareUserId},
                    {$pull: {access: {userId: shareUserId}}});
            }
            else {
                // try to update existing entry
                const raw = await ProjectModel.update(
                    {_id: projectId, 'access.userId': shareUserId},
                    {$set: {'access.$.grantedById': userId, 'access.$.permissions': permissions}});

                // if no existing was found, push new access entry
                if (raw.n === 0)
                    await ProjectModel.update(
                        {_id: projectId, 'access.userId': {$ne: shareUserId}},
                        {$push: {access: {userId: shareUserId, grantedById: userId, permissions: permissions}}});
            }
        } catch (err) {
            ErrorUtil.throwAndLog(err, 'unknown mongo error');
        }
    }
}


module.exports = FileController;