/**
 * @author progmem
 * @date 21.10.17
 */

'use strict';

const express = require('express');
const router = express.Router();
const user = require('../controller/user');


router.post('/login', (req, res, next) => {
    res.json({
        route: 'POST /login',
        body: req.body
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
        return res.json(userEntry);
    });
});


module.exports = router;
