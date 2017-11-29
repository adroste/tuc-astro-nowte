/**
 * @author progmem
 * @date 27.11.17
 */

'use strict';

const utility = require('./utility');

describe('error helpers', () => {
    test('requireVarWithType throws', () => {
        try {
            utility.requireVarWithType('test123', 'string', 5);
        }
        catch (err) {
            expect(err.message).toMatch('test123 invalid type, test123 is required');
            expect(err.status).toBe(400);
        }
    });


});