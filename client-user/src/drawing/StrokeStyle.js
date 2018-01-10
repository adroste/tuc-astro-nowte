import {Record} from 'immutable';


/**
 * @typedef {Object} StrokeStyleOptions
 * @property {string} color color-string, e.g. 'white', '#f0f0f0'
 * @property {number} thickness stroke-thickness (line width)
 */


/**
 * StrokeStyle Class, Immutable Record
 *
 * Properties match {@link StrokeStyleOptions}
 */
export class StrokeStyle extends Record({
    color: '',
    thickness: 0
}) {
    /**
     * @param {StrokeStyleOptions} options
     */
    // eslint-disable-next-line
    constructor(options) {
        super(options);
    }


    /**
     * Creates StrokeStyle from object with properties
     * @param {Object} obj
     * @returns {StrokeStyle}
     */
    static fromObject(obj) {
        return new StrokeStyle({
            color: obj.color,
            thickness: obj.thickness,
        });
    }


    /**
     * Returns lean js object
     * @returns {{color: string, thickness: number}}
     */
    lean() {
        return {
            color: this.color,
            thickness: this.thickness,
        };
    }


    }
}