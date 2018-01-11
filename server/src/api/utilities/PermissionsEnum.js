/**
 * @author progmem
 * @date 27.11.17
 */

"use strict";

/**
 * Enum for describing permissions.
 * Numbers are ordered ascending by increase of permissions.
 * Dev-Hint: If updated: need to update {@link ErrorUtil.checkPermissionsInRange}
 */
const PermissionsEnum = {
    NONE: 0,
    READ: 1,
    ANNOTATE: 2,
    EDIT: 3,
    MANAGE: 4,
    OWNER: 5
};


module.exports = PermissionsEnum;
