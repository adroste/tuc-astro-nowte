/**
 * @author progmem
 * @date 26.11.17
 */

'use strict';

const express = require('express');
const user = require('../controller/user');
const FileController = require('../controller/FileController');
const RoutesUtil = require('./RoutesUtil');


/**
 * Express.Router object containing file-api routes + handlers
 */
const fileRoutes = express.Router();


fileRoutes.post('/create', RoutesUtil.asyncMiddleware(async (req, res, next) => {
    // TODO validate session REFACTOR to promise
    const userId = await user.validateSessionAsyncWrapper(req.body['sessionToken']);
    const fileId = await FileController.create(userId, req.body['parentId'], req.body['isFolder'], req.body['title']);
    res.status(201); // Created
    res.json({
        fileId: fileId
    });
}));


fileRoutes.get('/list-folder/:folderId', RoutesUtil.asyncMiddleware(async (req, res, next) => {
    const userId = await user.validateSessionAsyncWrapper(req.query['sessionToken']);
    const listing = await FileController.getFolderListing(userId, req.params.folderId);
    res.status(200);
    res.json(listing);
}));


module.exports = fileRoutes;