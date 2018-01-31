/**
 * @author progmem
 * @date 19.10.17
 */

'use strict';

const lib = require('nowte-shared-lib');
const ConfigTool = lib.ConfigTool;
const db = lib.dbConnection;
const express = require('express');
const cors = require('cors');
const jsonParser = require('body-parser').json;
const logger = require('morgan');
const userRoutes = require('./routes/userRoutes');
const fileRoutes = require('./routes/fileRoutes');

const PORT =  ConfigTool.get('rest-api-service.http-port');
const app = express();


// TODO only enable cors for specific routes
app.use(cors());
// TODO change logger format depending on environment: https://github.com/expressjs/morgan
app.use(logger('dev'));
app.use(jsonParser());


// routes
app.use('/api/user', userRoutes);
app.use('/api/file', fileRoutes);


// err handling
// 404
app.use((req, res, next) => {
    const err = new Error("not found");
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    if (err.status === 401)
        res.setHeader('WWW-Authenticate', err.authHeader);
    res.json({
        error: {
            message: err.message
        }
    });
});

// start http server
const server = app.listen(PORT, function() {
    console.log('express listening on:', PORT);
});


const gracefulExit = function() {
    server.close(() => {
        console.log('Express server stopped');
        db.close(function () {
            console.log('Mongoose default connection is disconnected through app termination');
            process.exit(0);
        });
    });
};

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);
