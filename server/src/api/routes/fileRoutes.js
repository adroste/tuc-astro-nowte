/**
 * @author progmem
 * @date 26.11.17
 */

'use strict';

const express = require('express');
const UserController = require('../controller/UserController');
const FileController = require('../controller/FileController');
const RoutesUtil = require('../utilities/RoutesUtil');
const ErrorUtil = require('../utilities/ErrorUtil');


/**
 * Express.Router object containing file-api routes + handlers
 */
const fileRoutes = express.Router();


fileRoutes.post('/create-project', RoutesUtil.asyncMiddleware(async (req, res, next) => {
    const sessionToken = req.body['sessionToken'];
    const title = req.body['title'];
    ErrorUtil.requireVarWithType('sessionToken', 'string', sessionToken);
    ErrorUtil.requireVarWithType('title', 'string', title);

    const userId = await UserController.validateSession(sessionToken);
    const projectId = await FileController.createProject(userId, title);
    res.status(201); // Created
    res.json({
        projectId: projectId
    });
}));

fileRoutes.post('/create-path', RoutesUtil.asyncMiddleware(async (req, res, next) => {
    const sessionToken = req.body['sessionToken'];
    const projectId = req.body['projectId'];
    const path = req.body['path'];
    ErrorUtil.requireVarWithType('sessionToken', 'string', sessionToken);
    ErrorUtil.requireVarWithType('projectId', 'string', projectId);
    ErrorUtil.requireVarWithType('path', 'string', path);

    const userId = await UserController.validateSession(sessionToken);
    await FileController.createPath(userId, projectId, path);
    res.status(204);
    res.json({});
}));


fileRoutes.post('/create-document', RoutesUtil.asyncMiddleware(async (req, res, next) => {
    const sessionToken = req.body['sessionToken'];
    const projectId = req.body['projectId'];
    const path = req.body['path'];
    const title = req.body['title'];
    let upsertPath = req.body['upsertPath'];
    ErrorUtil.requireVarWithType('sessionToken', 'string', sessionToken);
    ErrorUtil.requireVarWithType('projectId', 'string', projectId);
    ErrorUtil.requireVarWithType('path', 'string', path);
    ErrorUtil.requireVarWithType('title', 'string', title);
    upsertPath = typeof upsertPath === 'boolean' ? upsertPath : false;

    const userId = await UserController.validateSession(sessionToken);
    const documentId = await FileController.createDocument(userId, projectId, path, title, upsertPath);
    res.status(201); // Created
    res.json({
        documentId: documentId
    });
}));


fileRoutes.post('/create-share', RoutesUtil.asyncMiddleware(async (req, res, next) => {
    const sessionToken = req.body['sessionToken'];
    const fileId = req.body['fileId'];
    const isFolder = req.body['isFolder'];
    const shareEmail = req.body['shareEmail'];
    const permissions = req.body['permissions'];
    ErrorUtil.requireVarWithType('sessionToken', 'string', sessionToken);
    ErrorUtil.requireVarWithType('fileId', 'string', fileId);
    ErrorUtil.requireVarWithType('isFolder', 'boolean', isFolder);
    ErrorUtil.requireVarWithType('shareEmail', 'string', shareEmail);
    ErrorUtil.requireVarWithType('permissions', 'number', permissions);

    const userId = await UserController.validateSession(sessionToken);
    const shareUserId = await UserController.getUserIdForEmail(shareEmail);
    await FileController.createShare(userId, fileId, isFolder, shareUserId, permissions);
    res.status(204);
    res.json({});
}));


fileRoutes.get('/list-folder/:folderId', RoutesUtil.asyncMiddleware(async (req, res, next) => {
    const sessionToken = req.query['sessionToken'];
    const folderId = req.params.folderId;
    ErrorUtil.requireVarWithType('sessionToken', 'string', sessionToken);
    ErrorUtil.requireVarWithType('folderId', 'string', folderId);

    const userId = await UserController.validateSession(sessionToken);
    const listing = await FileController.getFolderListing(userId, folderId);
    res.status(200);
    res.json(listing);
}));


module.exports = fileRoutes;