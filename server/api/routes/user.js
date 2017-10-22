/**
 * @author progmem
 * @date 21.10.17
 */

'use strict';

const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    res.json({ hello: 'world' });
});


module.exports = router;
