/**
 * @author progmem
 * @date 26.11.17
 */

'use strict';

const express = require('express');
const router = express.Router();
const user = require('../controller/user');
const file = require('../controller/file');
const utility = require('./utility');


router.post('/create', utility.asyncMiddleware(async (req, res, next) => {
    // TODO validate session REFACTOR to promise
    const userId = await user.validateSessionAsyncWrapper(req.body['sessionToken']);
    const fileId = await file.create(userId, req.body['parentId'], req.body['isFolder'], req.body['title']);
    res.status(201); // Created
    res.json({
        fileId: fileId
    });
}));


router.get('/list-folder/:folderId', utility.asyncMiddleware(async (req, res, next) => {
    const userId = await user.validateSessionAsyncWrapper(req.query['sessionToken']);
    const listing = await file.getFolderListing(userId, req.params.folderId);
    res.status(200);
    res.json(listing);
}));



module.exports = router;