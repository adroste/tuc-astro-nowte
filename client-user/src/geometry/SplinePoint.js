/**
 * @author Alexander Droste
 * @date 08.01.18
 */


export class SplinePoint {
    /**
     * @param {Point} point point
     * @param {Point} tangent tangent
     */
    constructor(point, tangent) {
        /**
         * Spline-points position
         * @type {Point}
         */
        this.point = point;

        /**
         * Spline-points tangent
         * @type {Point}
         */
        this.tangent = tangent;
    }

    /**
     * Calculates out-point
     * @returns {Point}
     */
    getOutPoint() {
        return this.point.add(this.tangent.scale(1/3));
    }


    /**
     * Calculates in-point
     * @returns {Point}
     */
    getInPoint() {
        return this.point.subtract(this.tangent.scale(1/3));
    }
}