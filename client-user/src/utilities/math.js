/**
 * @author Alexander Droste
 * @date 14.01.18
 */


/**
 * Returns a number whose value is limited to the given range.
 * @param {Number} number the number to clamp
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns {Number} A number in the range [min, max]
 */
export function clamp(number, min, max) {
    return Math.min(Math.max(number, min), max);
}