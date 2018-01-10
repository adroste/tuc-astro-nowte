import {StrokeStyle} from "../drawing/StrokeStyle";
import {Point} from "./Point";
import {SplinePoint} from "./SplinePoint";
import {deserializeArray, serializeArray} from "../utilities/serialize";


export class Spline {
    /**
     * @param {StrokeStyle} strokeStyle style to use
     * @param {SplinePoint[]} [splinePoints=[]] spline-points of spline (empty by default)
     */
    constructor(strokeStyle, splinePoints = []){
        /**
         * Stroke styling
         * @type {StrokeStyle}
         */
        this.strokeStyle = strokeStyle;

        /**
         * Spline-points describing the path (start to end)
         * @type {SplinePoint[]}
         */
        this.spoints = splinePoints;
        this.bbox = this._calcBoundingBox();
    }

    /**
     * Checks if spline is valid (has at least two spline-points)
     * @returns {boolean} true if path has at least two spline-points
     */
    isValid() {
        return this.spoints.length >= 2;
    }

    /**
     * returns the pre-calculated bounding box
     * @return {{topLeft, bottomRight}|null}
     */
    getBoundingBox() {
        return this.bbox;
    }

    /**
     * @return {{topLeft: Point, bottomRight: Point}}
     */
    _calcBoundingBox() {
        if(this.spoints.length < 1)
            return null;

        let topLeft = this.spoints[0].point.clone();
        let bottomRight = this.spoints[0].point.clone();

        const fitPoint = (pt) => {
            topLeft.x = Math.min(topLeft.x, pt.x);
            topLeft.y = Math.min(topLeft.y, pt.y);
            bottomRight.x = Math.max(bottomRight.x, pt.x);
            bottomRight.y = Math.max(bottomRight.y, pt.y);
        };

        for(let pt of this.spoints){
            fitPoint(pt.point);
            fitPoint(pt.getInPoint());
            fitPoint(pt.getOutPoint());
        }

        return {
            topLeft: topLeft,
            bottomRight: bottomRight,
        }
    }

    serialize() {
        return {
            strokeStyle: this.strokeStyle? this.strokeStyle.serialize() : null,
            // can be used as they are
            spoints: serializeArray(this.spoints),
        }
    }

    static deserialize(obj) {
        return new Spline(StrokeStyle.deserialize(obj.strokeStyle), deserializeArray(obj.spoints, SplinePoint.deserialize));
    }
}