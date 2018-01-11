/**
 * @author progmem
 * @date 11.12.17
 */

'use strict';

const FileUtil = require('./FileUtil');

test('getAllSubpaths method', () => {
    const subpaths = FileUtil.getAllSubpaths('/1/2/3/');
    expect(subpaths[0]).toBe('/');
    expect(subpaths[1]).toBe('/1/');
    expect(subpaths[2]).toBe('/1/2/');
    expect(subpaths[3]).toBe('/1/2/3/');
});
