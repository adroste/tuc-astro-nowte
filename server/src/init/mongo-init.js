/**
 * @author progmem
 * @date 27.10.17
 */

'use strict';

const ConfigTool = require('./ConfigTool');
const mongoose = require('mongoose');

const MONGO_URL = ConfigTool.get('server.mongo-url');
mongoose.Promise = Promise;


// mongodb connection
mongoose.connect(MONGO_URL, {
    useMongoClient: true,
    promiseLibrary: global.Promise
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', () => {
    console.log(`Connected to Mongo at: ${new Date()}`)
});


module.exports = db;