/**
 * @author progmem
 * @date 21.10.17
 */

'use strict';

const lib = require('nowte-shared-lib');
const express = require('express');
const UserController = lib.controller.UserController;
const RoutesUtil = require('../utilities/RoutesUtil');
const ErrorUtil = lib.utilities.ErrorUtil;


/**
 * Express.Router object containing user-api routes + handlers
 */
const userRoutes = express.Router();


userRoutes.put('/change-password', RoutesUtil.asyncMiddleware(async (req, res, next) => {
    const passwordResetToken = req.body['passwordResetToken'];
    const newPassword = req.body['newPassword'];
    ErrorUtil.requireVarWithType('newPassword', 'string', newPassword);

    if (typeof passwordResetToken !== 'undefined') {
        await UserController.changePasswordViaResetToken(passwordResetToken, newPassword);
    }
    else {
        const email = req.body['email'];
        const currentPassword = req.body['currentPassword'];
        ErrorUtil.requireVarWithType('email', 'string', email);
        ErrorUtil.requireVarWithType('currentPassword', 'string', currentPassword);
        await UserController.changePasswordViaCurrentPassword(email, currentPassword, newPassword);
    }

    res.status(204); // No Content
    res.json({});
}));


userRoutes.post('/create', RoutesUtil.asyncMiddleware(async (req, res, next) => {
    const name = req.body['name'];
    const email = req.body['email'];
    const password = req.body['password'];
    ErrorUtil.requireVarWithType('name', 'string', name);
    ErrorUtil.requireVarWithType('email', 'string', email);
    ErrorUtil.requireVarWithType('password', 'string', password);

    const userEntry = await UserController.createUser(name, email, password);
    res.status(204); // No Content
    res.json({});

    // create emailValidationToken and send validate link via email, silently in background
    await UserController.createAndSendEmailValidationToken(userEntry.email);
}));


userRoutes.post('/login', RoutesUtil.asyncMiddleware(async (req, res, next) => {
    const email = req.body['email'];
    const password = req.body['password'];
    ErrorUtil.requireVarWithType('email', 'string', email);
    ErrorUtil.requireVarWithType('password', 'string', password);

    const info = await UserController.login(email, password);
    res.status(201); // Created
    res.json(info);
}));


userRoutes.post('/logout', RoutesUtil.asyncMiddleware(async (req, res, next) => {
    const sessionToken = req.body['sessionToken'];
    ErrorUtil.requireVarWithType('sessionToken', 'string', sessionToken);

    await UserController.logout(sessionToken);
    res.status(204); // No Content
    res.json({});
}));


userRoutes.post('/request-password-reset', RoutesUtil.asyncMiddleware(async (req, res, next) => {
    const email = req.body['email'];
    ErrorUtil.requireVarWithType('email', 'string', email);

    await UserController.createAndSendPasswordResetToken(email);
    res.status(204); // No Content
    res.json({});
}));


userRoutes.post('/resend-validation-email', RoutesUtil.asyncMiddleware(async (req, res, next) => {
    const email = req.body['email'];
    ErrorUtil.requireVarWithType('email', 'string', email);

    await UserController.createAndSendEmailValidationToken(email);
    res.status(204); // No Content
    res.json({});
}));


userRoutes.post('/validate-email', RoutesUtil.asyncMiddleware(async (req, res, next) => {
    const emailValidationToken = req.body['emailValidationToken'];
    ErrorUtil.requireVarWithType('emailValidationToken', 'string', emailValidationToken);

    await UserController.validateUserEmail(emailValidationToken);
    res.status(204); // No Content
    res.json({});
}));


module.exports = userRoutes;
