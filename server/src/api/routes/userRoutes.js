/**
 * @author progmem
 * @date 21.10.17
 */

'use strict';

const express = require('express');
const user = require('../controller/user');


/**
 * Express.Router object containing user-api routes + handlers
 */
const userRoutes = express.Router();


userRoutes.put('/change-password', (req, res, next) => {
    const actionHandler = (err) => {
        if (err) {
            if (err.status === 401)
                res.setHeader('WWW-Authenticate', err.authHeader);
            return next(err);
        }
        res.status(204); // No Content
        res.json({});
    };

    const passwordResetToken = req.body['passwordResetToken'];
    if (typeof passwordResetToken !== 'undefined')
        user.changePasswordViaResetToken(passwordResetToken, req.body['newPassword'], actionHandler);
    else
        user.changePasswordViaCurrentPassword(req.body['email'], req.body['currentPassword'], req.body['newPassword'], actionHandler);
});


userRoutes.post('/create', (req, res, next) => {
    user.createUser(req.body['name'], req.body['email'], req.body['password'], (err, userEntry) => {
        if (err)
            return next(err);
        res.status(204); // No Content
        res.json({});

        // create emailValidationToken and send validate link via email
        user.createAndSendEmailValidationToken(userEntry.email, err => {
            // if it fails, it fails silently for the user
            if (err)
                console.error('Could not create and send emailValidationToken after user creation for user: ' + userEntry.email + ' with err: ' + err);
        });
    });
});


userRoutes.post('/login', (req, res, next) => {
    user.login(req.body['email'], req.body['password'], (err, sessionToken, name, folderId, userId) => {
        if (err) {
            if (err.status === 401)
                res.setHeader('WWW-Authenticate', err.authHeader);
            return next(err);
        }
        res.status(201); // Created
        res.json({
            sessionToken: sessionToken,
            name: name,
            folderId: folderId,
            userId: userId
        });
    });
});


userRoutes.post('/logout', (req, res, next) => {
    user.logout(req.body['sessionToken'], err => {
        if (err) {
            if (err.status === 401)
                res.setHeader('WWW-Authenticate', err.authHeader);
            return next(err);
        }
        res.status(204); // No Content
        res.json({});
    });
});


userRoutes.post('/request-password-reset', (req, res, next) => {
    user.createAndSendPasswordResetToken(req.body['email'], err => {
        if (err)
            return next(err);
        res.status(204); // No Content
        res.json({});
    });
});


userRoutes.post('/resend-validation-email', (req, res, next) => {
    user.createAndSendEmailValidationToken(req.body['email'], err => {
        if (err)
            return next(err);
        res.status(204); // No Content
        res.json({});
    });
});


userRoutes.post('/validate-email', (req, res, next) => {
    user.validateUserEmail(req.body['emailValidationToken'], err => {
        if (err)
            return next(err);
        res.status(204); // No Content
        res.json({});
    });
});


module.exports = userRoutes;