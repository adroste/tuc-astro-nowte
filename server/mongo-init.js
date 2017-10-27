/**
 * @author progmem
 * @date 27.10.17
 */

'use strict';

const mongoose = require("mongoose");
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/nowte-debug";
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