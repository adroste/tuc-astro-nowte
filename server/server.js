/**
 * @author progmem
 * @date 19.10.17
 */

'use strict';

const express = require('express');
const jsonParser = require('body-parser').json;
const logger = require('morgan');
const app = express();
const port = process.env.PORT || 3000;
const userRoutes = require('./api/routes/user');
const db = require('mongo-init');


// TODO change logger format depending on environment: https://github.com/expressjs/morgan
app.use(logger('dev'));
app.use(jsonParser());


// routes
app.use('/api/user', userRoutes);


// err handling
// 404
app.use((req, res, next) => {
    const err = new Error("not found");
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message
        }
    });
});

// start http server
const server = app.listen(port, function() {
    console.log('express listening on:', port);
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
