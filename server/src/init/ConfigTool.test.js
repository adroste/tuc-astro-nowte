/**
 * @author progmem
 * @date 29.10.17
 */

'use strict';

const ConfigTool = require('./ConfigTool');

test('read valid property', () => {
    expect(ConfigTool.get('server.http-port')).toBe(3000);
});

test('try to read invalid property', () => {
    expect(() => {
        ConfigTool.get('magmag');
    }).toThrow('config has no property: magmag');

    expect(() => {
        ConfigTool.get('server.http-port.magmag');
    }).toThrow('config has no property: server.http-port.magmag');
});