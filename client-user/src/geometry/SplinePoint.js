/**
 * @author Alexander Droste
 * @date 08.01.18
 */
import {Point} from "./Point";


export class SplinePoint {
    /**
     * @param {Point} point point
     * @param {Point} tangentIn incomming tangent
     * @param {Point} tangentOut outgoing tangent
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
     * Creates SplinePoint from object with properties
     * @param {Object} obj
     * @returns {SplinePoint}
     */
    static fromObject(obj) {
        return new SplinePoint(
            Point.fromObject(obj.point),
            Point.fromObject(obj.tangentIn),
            Point.fromObject(obj.tangentOut),
        );
    }


    /**
     * Returns lean js object
     * @returns {{point: {x: number, y: number}, tangentIn: {x: number, y: number}, tangentOut: {x: number, y: number}}}
     */
    lean() {
        return {
            point: this.point.lean(),
            tangentIn: this.tangentIn.lean(),
            tangentOut: this.tangentOut.lean(),
        };
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