/**
 * @author progmem
 * @date 21.10.17
 */

'use strict';

const express = require('express');
const router = express.Router();


router.post('/login', (req, res) => {
    res.json({
        route: 'POST /login',
        body: req.body
    });
});

router.post('/logout', (req, res) => {
    res.json({
        route: 'POST /logout',
        body: req.body
    });
});

router.post('/create', (req, res) => {
    res.json({
        route: 'POST /create',
        body: req.body
    });
});


module.exports = router;
