/**
 * @author progmem
 * @date 26.11.17
 */

'use strict';

// -------------------------------------------
// Includes
// -------------------------------------------
const config = require('../../init/config');
const Folder = require('../models/folder').Folder;
const Document = require('../models/document').Document;
const Share = require('../models/share').Share;
const utility = require('./utility');


// -------------------------------------------
// File actions
// -------------------------------------------
/**
 * Checks if provided title is already existent in specified folder
 * @param title
 * @param isFolder specified is title is folder or document title
 * @param parentId id of folder
 * @returns {Promise.<boolean>} true if no duplicate
 */
async function checkTitleIsNoDuplicate(title, isFolder, parentId) {
    utility.requireVarWithType('parentId', 'string', parentId);
    utility.requireVarWithType('title', 'string', title);
    utility.requireVarWithType('isFolder', 'boolean', isFolder);
    title = title.trim();

    let parentFolder;
    try {
        parentFolder = await Folder.findById(parentId, isFolder ? { childIds: 1 } : { documentIds : 1});
    } catch (err) {
        utility.throwAndLog(err, 'unknown mongo error');
    }
    utility.conditionalThrowWithStatus(parentFolder === null, 'parentId not found', 404);

    let fileEntries;
    try {
        fileEntries = isFolder ?
            await Folder.find({ _id: { $in: parentFolder.childIds }}, { title: 1 })
            : await Document.find({ _id: { $in: parentFolder.documentIds }}, { title: 1 });
    } catch (err) {
        utility.throwAndLog(err, 'unknown mongo error');
    }

    const matchingEntry = fileEntries.find((elem) => {
        return elem.title === title;
    });
    return matchingEntry === undefined;
}
module.exports.checkTitleIsNoDuplicate = checkTitleIsNoDuplicate;


/**
 * Creates a file (folder/document) in specified folder (parentId) with title
 * @param userId userId of user requesting create
 * @param parentId id of parent folder
 * @param isFolder true if folder, false if document
 * @param title
 * @returns {Promise.<string>}
 */
async function create(userId, parentId, isFolder, title) {
    utility.requireVarWithType('userId', 'string', userId);
    utility.requireVarWithType('parentId', 'string', parentId);
    utility.requireVarWithType('title', 'string', title);
    utility.requireVarWithType('isFolder', 'boolean', isFolder);
    title = title.trim();

    // check user is allowed to create file in parent folder
    const permissions = await getFilePermissions(userId, parentId, true);
    utility.conditionalThrowWithStatus(permissions.permissions.manage === false, 'not allowed to manage parentId', 403);

    // check title is no duplicate
    utility.conditionalThrowWithStatus(
        !await checkTitleIsNoDuplicate(title, isFolder, parentId),
        'title already exists', 409);

    // create folder/document (file)
    let file = {
        'title': title,
        'parentId': parentId,
        'ownerId': permissions.ownerId
    };
    file = isFolder ? new Folder(file) : new Document(file);
    // save file to db
    try {
        await file.save();
    } catch (err) {
        if (err.message.startsWith('Document validation failed') || err.message.startsWith('Folder validation failed'))
            utility.conditionalThrowWithStatus(true, err.message, 400);
        else
            utility.throwAndLog(err, 'unknown mongo error');
    }

    // add fileId to parent folder (link back)
    let rawResponse;
    try {
        const pushop = isFolder ? { childIds: file._id } : { documentIds: file._id };
        rawResponse = await Folder.update({ _id: parentId }, { $push: pushop});
    } catch (err) {
        utility.throwAndLog(err, 'unknown mongo error');
    }
    utility.conditionalThrowWithStatus(rawResponse.n === 0, 'parentId not found', 404);

    // TODO FIX concurrency check, repair if backlink via id fails

    return file._id.toString();
}
module.exports.create = create;


/**
 * Retrieves user-permissions and ownerId for a specified file
 * @param userId
 * @param fileId
 * @param isFolder
 * @returns {Promise.<{ownerId: string, permissions: {read: boolean, annotate: boolean, edit: boolean, manage: boolean}}>}
 */
async function getFilePermissions(userId, fileId, isFolder) {
    const projection = { ownerId: 1, shareIds: 1 };
    let fileEntry;
    try {
        fileEntry = isFolder ?
            await Folder.findById(fileId, projection)
            : await Document.findById(fileId, projection);
    } catch (err) {
        utility.throwAndLog(err, 'unknown mongo error');
    }

    if (fileEntry.ownerId.toString() === userId)
        return { ownerId: userId, permissions: utility.createPermissionsObject(true, true, true, true) };

    const shares = await Share.find({ _id: { $in: fileEntry.shareIds }}, { userId: 1, permissions: 1});
    const shareEntryForUser = shares.find((elem) => {
        return elem.userId === userId;
    });
    const permissions = shareEntryForUser === undefined ?
        utility.createPermissionsObject(false, false, false, false)
        : utility.fixPermissionsObject(shareEntryForUser.permissions);
    return { ownerId: fileEntry.ownerId.toString(), permissions: permissions };
}
module.exports.getFilePermissions = getFilePermissions;


/**
 * Creates listing for a specified folder
 * TODO unit test
 * @param userId
 * @param folderId
 * @returns {Promise.<{title: string, isShared: boolean, documents: Array.<{id: string, title: string, isShared: boolean}>, folders: Array.<{id: string, title: string, isShared: boolean}>}>}
 */
async function getFolderListing(userId, folderId) {
    utility.requireVarWithType('userId', 'string', userId);
    utility.requireVarWithType('parentId', 'string', folderId);

    // check if user is allowed to read folder
    const permissions = await getFilePermissions(userId, folderId, true);
    utility.conditionalThrowWithStatus(permissions.permissions.read === false, 'not allowed to read folderId', 403);

    const entry = await Folder.findById(folderId).
        populate({ path: 'childIds', select: 'title shareIds'}).
        populate({ path: 'documentIds', select: 'title shareIds'});

    const mapFunc = (obj) => {
        return {
            id: obj._id.toString(),
            title: obj.title,
            isShared: obj.shareIds.length > 0
        };
    };
    const sortFunc = (a, b) => {
        if(a.title < b.title) return -1;
        if(a.title > b.title) return 1;
        return 0;

    };

    return {
        title: entry.title,
        isShared: entry.shareIds.length > 0,
        documents: entry.documentIds.map(mapFunc).sort(sortFunc),
        folders: entry.childIds.map(mapFunc).sort(sortFunc),
    };
}
module.exports.getFolderListing = getFolderListing;