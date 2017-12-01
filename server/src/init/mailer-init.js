/**
 * @author progmem
 * @date 01.11.17
 */

'use strict';

const ConfigTool = require('./ConfigTool');
const nodemailer = require('nodemailer');

const options = ConfigTool.get('mail.connection');
const transporter = nodemailer.createTransport(options);

// verify connection configuration
transporter.verify(function(error, success) {
    if (error) {
        console.error('Could not connect to mail server: ' + error.toString());
    } else {
        console.log('Connected to mail server at: ' + options.host);
    }
});

module.exports = transporter;
exports.FROM = ConfigTool.get('mail.from');