/**
 * @author progmem
 * @date 27.10.17
 */

'use strict';

const ConfigTool = require('../ConfigTool');
const mongoose = require('mongoose');

const MONGO_URL = ConfigTool.get('mongodb.url');
mongoose.Promise = Promise;


// mongodb connection
mongoose.connect(MONGO_URL, {
    promiseLibrary: global.Promise
});


/**
 * Active Mongoose db connection object
 */
const dbConnection = mongoose.connection;

dbConnection.on('error', console.error.bind(console, 'connection error:'));

dbConnection.once('open', () => {
    console.log(`Connected to Mongo at: ${new Date()}`)
});


module.exports = dbConnection;