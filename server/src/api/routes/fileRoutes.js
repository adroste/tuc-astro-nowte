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


fileRoutes.get('/list-tree/:projectId', RoutesUtil.asyncMiddleware(async (req, res, next) => {
    const sessionToken = req.query['sessionToken'];
    const projectId = req.params.projectId;
    ErrorUtil.requireVarWithType('sessionToken', 'string', sessionToken);
    ErrorUtil.requireVarWithType('projectId', 'string', projectId);

    const userId = await UserController.validateSession(sessionToken);
    const tree = await FileController.listProjectTree(userId, projectId);
    res.status(200);
    res.json(tree);
}));


fileRoutes.get('/list-projects', RoutesUtil.asyncMiddleware(async (req, res, next) => {
    const sessionToken = req.query['sessionToken'];
    ErrorUtil.requireVarWithType('sessionToken', 'string', sessionToken);

    const userId = await UserController.validateSession(sessionToken);
    const projects = await FileController.listProjectsForUser(userId, true);
    res.status(200);
    res.json(projects);
}));


module.exports = fileRoutes;