/**
 * @author progmem
 * @date 01.11.17
 */

'use strict';

const ErrorUtil = require('../api/utilities/ErrorUtil');
const ConfigTool = require('../ConfigTool');
const nodemailer = require('nodemailer');

const options = ConfigTool.get('mail.connection');
const transport = nodemailer.createTransport(options);
const FROM = ConfigTool.get('mail.from');


// verify connection configuration
transport.verify(function(error, success) {
    if (error) {
        console.error('Could not connect to mail server: ' + error.toString());
    } else {
        console.log('Connected to mail server at: ' + options.host);
    }
});


/**
 * Sends a mail via mail.connection from mail.from
 * @param {string} to email address to send to
 * @param {string} subject email subject text
 * @param {string} body (html) email body text
 * @returns {Promise.<Object>} nodemailer info object
 * @throws {Error} msg: 'mail transport error' if mail could not get delivered
 */
async function sendMail(to, subject, body) {
    const mailOptions = {
        from: FROM,
        to: to,
        subject: subject,
        html: body
    };


    // TODO check if promises work here
    try {
        return await transport.sendMail(mailOptions);
    } catch (err) {
        ErrorUtil.throwAndLog(err, 'mail transport error');
    }
}
exports.sendMail = sendMail;

