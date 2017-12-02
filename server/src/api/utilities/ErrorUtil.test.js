/**
 * @author progmem
 * @date 27.11.17
 */

'use strict';

const ErrorUtil = require('./ErrorUtil');

describe('error helpers', () => {
    test('requireVarWithType throws', () => {
        try {
            ErrorUtil.requireVarWithType('test123', 'string', 5);
        }
        catch (err) {
            expect(err.message).toMatch('test123 invalid type, test123 is required');
            expect(err.status).toBe(400);
        }
    });
});