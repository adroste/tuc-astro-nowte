/**
 * @author progmem
 * @date 26.11.17
 */

'use strict';

const lib = require('nowte-shared-lib');
const express = require('express');
const UserController = lib.controller.UserController;
const FileController = lib.controller.FileController;
const RoutesUtil = require('../utilities/RoutesUtil');
const ErrorUtil = lib.utilities.ErrorUtil;


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
    ErrorUtil.checkPathFormat(path);

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
    ErrorUtil.checkPathFormat(path);

    const userId = await UserController.validateSession(sessionToken);
    const documentId = await FileController.createDocument(userId, projectId, path, title, upsertPath);
    res.status(201); // Created
    res.json({
        documentId: documentId
    });
}));


fileRoutes.delete('/delete-project', RoutesUtil.asyncMiddleware(async (req, res, next) => {
    const sessionToken = req.body['sessionToken'];
    const projectId = req.body['projectId'];
    ErrorUtil.requireVarWithType('sessionToken', 'string', sessionToken);
    ErrorUtil.requireVarWithType('projectId', 'string', projectId);

    const userId = await UserController.validateSession(sessionToken);
    await FileController.deleteProject(userId, projectId);
    res.status(204);
    res.json({});
}));


fileRoutes.delete('/delete-document', RoutesUtil.asyncMiddleware(async (req, res, next) => {
    const sessionToken = req.body['sessionToken'];
    const projectId = req.body['projectId'];
    const path = req.body['path'];
    const documentId = req.body['documentId'];
    ErrorUtil.requireVarWithType('sessionToken', 'string', sessionToken);
    ErrorUtil.requireVarWithType('projectId', 'string', projectId);
    ErrorUtil.requireVarWithType('path', 'string', path);
    ErrorUtil.requireVarWithType('documentId', 'string', documentId);
    ErrorUtil.checkPathFormat(path);

    const userId = await UserController.validateSession(sessionToken);
    await FileController.deleteDocument(userId, projectId, path, documentId);
    res.status(204);
    res.json({});
}));


fileRoutes.delete('/delete-path', RoutesUtil.asyncMiddleware(async (req, res, next) => {
    const sessionToken = req.body['sessionToken'];
    const projectId = req.body['projectId'];
    const path = req.body['path'];
    ErrorUtil.requireVarWithType('sessionToken', 'string', sessionToken);
    ErrorUtil.requireVarWithType('projectId', 'string', projectId);
    ErrorUtil.requireVarWithType('path', 'string', path);
    ErrorUtil.checkPathFormat(path);

    const userId = await UserController.validateSession(sessionToken);
    await FileController.deletePath(userId, projectId, path);
    res.status(204);
    res.json({});
}));


fileRoutes.put('/set-access', RoutesUtil.asyncMiddleware(async (req, res, next) => {
    const sessionToken = req.body['sessionToken'];
    const projectId = req.body['projectId'];
    const shareEmail = req.body['shareEmail'];
    const permissions = req.body['permissions'];
    ErrorUtil.requireVarWithType('sessionToken', 'string', sessionToken);
    ErrorUtil.requireVarWithType('projectId', 'string', projectId);
    ErrorUtil.requireVarWithType('shareEmail', 'string', shareEmail);
    ErrorUtil.requireVarWithType('permissions', 'number', permissions);
    ErrorUtil.checkPermissionsInRange(permissions);

    const userId = await UserController.validateSession(sessionToken);
    const shareUserId = await UserController.getUserIdForEmail(shareEmail);
    await FileController.setUserPermissionsForProject(userId, projectId, shareUserId, permissions);
    res.status(204);
    res.json({});
}));


fileRoutes.put('/move-document', RoutesUtil.asyncMiddleware(async (req, res, next) => {
    const sessionToken = req.body['sessionToken'];
    const documentId = req.body['documentId'];
    const projectIdFrom = req.body['projectIdFrom'];
    const projectIdTo = req.body['projectIdTo'];
    const pathFrom = req.body['pathFrom'];
    const pathTo = req.body['pathTo'];
    const oldTitle = req.body['oldTitle'];
    const newTitle = req.body['newTitle'];
    let upsertPath = req.body['upsertPath'];
    ErrorUtil.requireVarWithType('sessionToken', 'string', sessionToken);
    ErrorUtil.requireVarWithType('documentId', 'string', documentId);
    ErrorUtil.requireVarWithType('projectIdFrom', 'string', projectIdFrom);
    ErrorUtil.requireVarWithType('projectIdTo', 'string', projectIdTo);
    ErrorUtil.requireVarWithType('pathFrom', 'string', pathFrom);
    ErrorUtil.requireVarWithType('pathTo', 'string', pathTo);
    ErrorUtil.requireVarWithType('oldTitle', 'string', oldTitle);
    ErrorUtil.requireVarWithType('newTitle', 'string', newTitle);
    upsertPath = typeof upsertPath === 'boolean' ? upsertPath : false;
    ErrorUtil.checkPathFormat(pathFrom);
    ErrorUtil.checkPathFormat(pathTo);

    const userId = await UserController.validateSession(sessionToken);
    await FileController.moveDocument(userId, documentId, projectIdFrom, projectIdTo, pathFrom, pathTo, oldTitle, newTitle, upsertPath);
    res.status(204);
    res.json({});
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


fileRoutes.get('/list-access/:projectId', RoutesUtil.asyncMiddleware(async (req, res, next) => {
    const sessionToken = req.query['sessionToken'];
    const projectId = req.params.projectId;
    ErrorUtil.requireVarWithType('sessionToken', 'string', sessionToken);
    ErrorUtil.requireVarWithType('projectId', 'string', projectId);

    const userId = await UserController.validateSession(sessionToken);
    const access = await FileController.listProjectAccess(userId, projectId);
    res.status(200);
    res.json(access);
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