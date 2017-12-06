/**
 * @author progmem
 * @date 01.11.17
 */

'use strict';

const mailer = require('./mailer-init');

const TEST_MAIL_ADDRESS_RECIPIENT = 'mail@progmem.de';

// skipped the test for annoyance reasons
test('send test mail', async () => {
    const subject = 'Test Mail from Astro-Nowte unit test';
    const body = 'This is a test mail.';

    const info = await mailer.sendMail(TEST_MAIL_ADDRESS_RECIPIENT, subject, body);
    expect(info).toBeDefined();
    console.log('you should check if: ' + TEST_MAIL_ADDRESS_RECIPIENT + ' got a mail from: ' + mailer.FROM);
});