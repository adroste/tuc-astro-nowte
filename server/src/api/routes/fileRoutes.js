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


fileRoutes.post('/create', RoutesUtil.asyncMiddleware(async (req, res, next) => {
    const sessionToken = req.body['sessionToken'];
    const parentId = req.body['parentId'];
    const isFolder = req.body['isFolder'];
    const title = req.body['title'];
    ErrorUtil.requireVarWithType('sessionToken', 'string', sessionToken);
    ErrorUtil.requireVarWithType('parentId', 'string', parentId);
    ErrorUtil.requireVarWithType('isFolder', 'boolean', isFolder);
    ErrorUtil.requireVarWithType('title', 'string', title);

    const userId = await UserController.validateSession(sessionToken);
    const fileId = await FileController.create(userId, parentId, isFolder, title);
    res.status(201); // Created
    res.json({
        fileId: fileId
    });
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