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

    serialize() {
        return {
            point: this.point.serialize(),
            tangentIn: this.tangentIn.serialize(),
            tangentOut: this.tangentOut.serialize(),
        }
    }

    static deserialize(obj) {
        return new SplinePoint(
            Point.deserialize(obj.point),
            Point.deserialize(obj.tangentIn),
            Point.deserialize(obj.tangentOut),
        )
    }
}