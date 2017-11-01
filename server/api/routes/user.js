/**
 * @author progmem
 * @date 21.10.17
 */

'use strict';

const express = require('express');
const router = express.Router();
const user = require('../controller/user');


router.post('/login', (req, res, next) => {
    user.login(req.body['email'], req.body['password'], (err, sessionToken) => {
        if (err) {
            if (err.status === 401)
                res.setHeader('WWW-Authenticate', err.authHeader);
            return next(err);
        }
        res.status(201); // Created
        res.json({ sessionToken: sessionToken });
    });
});


router.post('/logout', (req, res, next) => {
    res.json({
        route: 'POST /logout',
        body: req.body
    });
});


router.post('/create', (req, res, next) => {
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


router.get('/validate-email/:token', (req, res, next) => {
    user.validateUserEmail(req.params.token, (err, validated) => {
        if (err)
            return next(err);
        if (!validated) {
            const err2 = new Error('user not found');
            err2.status = 404; // Not Found
            return next(err2);
        }
        res.status(204); // No Content
        res.json({});
    });
});


module.exports = router;
