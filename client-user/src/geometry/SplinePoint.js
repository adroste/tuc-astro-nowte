/**
 * @author Alexander Droste
 * @date 08.01.18
 */


export class SplinePoint {
    /**
     * @param {Point} point point
     * @param {Point} tangentIn incomming tangent
     * @param {Point} tangentOut incomming tangent
     */
    constructor(point, tangentIn, tangentOut) {
        /**
         * Spline-points position
         * @type {Point}
         */
        this.point = point;

        /**
         * Spline-points tangent
         * @type {Point}
         */
        this.tangentIn = tangentIn;
        this.tangentOut = tangentOut;
    }

    /**
     * Calculates out-point
     * @returns {Point}
     */
    getOutPoint() {
        return this.point.add(this.tangentOut);
    }


    /**
     * Calculates in-point
     * @returns {Point}
     */
    getInPoint() {
        return this.point.add(this.tangentIn);
    }
}