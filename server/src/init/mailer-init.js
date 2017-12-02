/**
 * @author progmem
 * @date 01.11.17
 */

'use strict';

const ConfigTool = require('../ConfigTool');
const nodemailer = require('nodemailer');

const options = ConfigTool.get('mail.connection');
const transport = nodemailer.createTransport(options);


// verify connection configuration
transport.verify(function(error, success) {
    if (error) {
        console.error('Could not connect to mail server: ' + error.toString());
    } else {
        console.log('Connected to mail server at: ' + options.host);
    }
});


/**
 * (Node)mailer object to send mails
 * @property {string} FROM mail address used for transport
 */
const mailer = Object.assign(transport, { FROM: ConfigTool.get('mail.from')});


module.exports = mailer;