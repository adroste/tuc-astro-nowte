/**
 * @author progmem
 * @date 29.10.17
 */

'use strict';

const config = require('./config');

test('read valid property', () => {
    expect(config.get('server.http-port')).toBe(3000);
});

test('try to read invalid property', () => {
    expect(() => {
        config.get('magmag');
    }).toThrow('config has no property: magmag');

    expect(() => {
        config.get('server.http-port.magmag');
    }).toThrow('config has no property: server.http-port.magmag');
});