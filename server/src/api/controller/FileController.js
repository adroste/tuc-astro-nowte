/**
 * @author progmem
 * @date 26.11.17
 */

'use strict';


const ConfigTool = require('../../ConfigTool');
const FolderModel = require('../models/FolderModel');
const DocumentModel = require('../models/DocumentModel');
const ShareModel = require('../models/ShareModel');
const PermissionsEnum = require('../utilities/PermissionsEnum');
const ErrorUtil = require('../utilities/ErrorUtil');


/**
 * File controller contains methods for file actions
 */
class FileController {
    /**
     * Checks if provided title is already existent in specified folder
     * @param title
     * @param isFolder specified is title is folder or document title
     * @param parentId id of folder
     * @returns {Promise.<boolean>} true if no duplicate
     */
    static async checkTitleIsNoDuplicate(title, isFolder, parentId) {
        ErrorUtil.requireVarWithType('parentId', 'string', parentId);
        ErrorUtil.requireVarWithType('title', 'string', title);
        ErrorUtil.requireVarWithType('isFolder', 'boolean', isFolder);
        title = title.trim();

        let parentFolder;
        try {
            parentFolder = await FolderModel.findById(parentId, isFolder ? {childIds: 1} : {documentIds: 1});
        } catch (err) {
            ErrorUtil.throwAndLog(err, 'unknown mongo error');
        }
        ErrorUtil.conditionalThrowWithStatus(parentFolder === null, 'parentId not found', 404);

        let fileEntries;
        try {
            fileEntries = isFolder ?
                await FolderModel.find({_id: {$in: parentFolder.childIds}}, {title: 1})
                : await DocumentModel.find({_id: {$in: parentFolder.documentIds}}, {title: 1});
        } catch (err) {
            ErrorUtil.throwAndLog(err, 'unknown mongo error');
        }

        const matchingEntry = fileEntries.find((elem) => {
            return elem.title === title;
        });
        return matchingEntry === undefined;
    }


    /**
     * Creates a file (folder/document) in specified folder (parentId) with title
     * @param userId userId of user requesting create
     * @param parentId id of parent folder
     * @param isFolder true if folder, false if document
     * @param title
     * @returns {Promise.<string>}
     */
    static async create(userId, parentId, isFolder, title) {
        ErrorUtil.requireVarWithType('userId', 'string', userId);
        ErrorUtil.requireVarWithType('parentId', 'string', parentId);
        ErrorUtil.requireVarWithType('title', 'string', title);
        ErrorUtil.requireVarWithType('isFolder', 'boolean', isFolder);
        title = title.trim();

        // check user is allowed to create file in parent folder
        const permissions = await this.getFilePermissions(userId, parentId, true);
        ErrorUtil.conditionalThrowWithStatus(permissions.value < PermissionsEnum.MANAGE, 'not allowed to manage parentId', 403);

        // check title is no duplicate
        ErrorUtil.conditionalThrowWithStatus(
            !await this.checkTitleIsNoDuplicate(title, isFolder, parentId),
            'title already exists', 409);

        // create folder/document (file)
        let file = {
            'title': title,
            'parentId': parentId,
            'ownerId': permissions.ownerId
        };
        file = isFolder ? new FolderModel(file) : new DocumentModel(file);

        // save file to db
        try {
            await file.save();
        } catch (err) {
            if (err.message.startsWith('Document validation failed') || err.message.startsWith('Folder validation failed'))
                ErrorUtil.conditionalThrowWithStatus(true, err.message, 400);
            else
                ErrorUtil.throwAndLog(err, 'unknown mongo error');
        }

        // add fileId to parent folder (link back)
        let rawResponse;
        try {
            const pushop = isFolder ? {childIds: file._id} : {documentIds: file._id};
            rawResponse = await FolderModel.update({_id: parentId}, {$push: pushop});
        } catch (err) {
            ErrorUtil.throwAndLog(err, 'unknown mongo error');
        }
        ErrorUtil.conditionalThrowWithStatus(rawResponse.n === 0, 'parentId not found', 404);

        // TODO FIX concurrency check, repair if backlink via id fails

        return file._id.toString();
    }


    /**
     * Retrieves user-permissions and ownerId for a specified file
     * @param userId
     * @param fileId
     * @param isFolder
     * @returns {Promise.<{ownerId: string, value: number}>}
     */
    static async getFilePermissions(userId, fileId, isFolder) {
        const projection = {ownerId: 1, shareIds: 1};
        let fileEntry;
        try {
            fileEntry = isFolder ?
                await FolderModel.findById(fileId, projection)
                : await DocumentModel.findById(fileId, projection);
        } catch (err) {
            ErrorUtil.throwAndLog(err, 'unknown mongo error');
        }

        if (fileEntry.ownerId.toString() === userId)
            return {ownerId: userId, value: PermissionsEnum.MANAGE};

        const shares = await ShareModel.find({_id: {$in: fileEntry.shareIds}}, {userId: 1, permissions: 1});
        const shareEntryForUser = shares.find((elem) => {
            return elem.userId === userId;
        });
        const permissions = shareEntryForUser === undefined ? PermissionsEnum.NONE : shareEntryForUser.permissions;
        return {ownerId: fileEntry.ownerId.toString(), value: permissions};
    }


    /**
     * Creates listing for a specified folder
     * @todo unit test
     * @param userId
     * @param folderId
     * @returns {Promise.<{title: string, isShared: boolean, documents: Array.<{id: string, title: string, isShared: boolean}>, folders: Array.<{id: string, title: string, isShared: boolean}>}>}
     */
    static async getFolderListing(userId, folderId) {
        ErrorUtil.requireVarWithType('userId', 'string', userId);
        ErrorUtil.requireVarWithType('parentId', 'string', folderId);

        // check if user is allowed to read folder
        const permissions = await this.getFilePermissions(userId, folderId, true);
        ErrorUtil.conditionalThrowWithStatus(permissions.value < PermissionsEnum.READ, 'not allowed to read folderId', 403);

        const entry = await FolderModel.findById(folderId).populate({
            path: 'childIds',
            select: 'title shareIds'
        }).populate({path: 'documentIds', select: 'title shareIds'});

        const mapFunc = (obj) => {
            return {
                id: obj._id.toString(),
                title: obj.title,
                isShared: obj.shareIds.length > 0
            };
        };
        const sortFunc = (a, b) => {
            if (a.title < b.title) return -1;
            if (a.title > b.title) return 1;
            return 0;

        };

        return {
            title: entry.title,
            isShared: entry.shareIds.length > 0,
            documents: entry.documentIds.map(mapFunc).sort(sortFunc),
            folders: entry.childIds.map(mapFunc).sort(sortFunc),
        };
    }
}


module.exports = FileController;