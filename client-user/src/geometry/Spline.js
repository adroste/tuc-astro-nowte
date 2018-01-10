import {StrokeStyle} from "../drawing/StrokeStyle";
import {Point} from "./Point";
import {SplinePoint} from "./SplinePoint";
import {fromObjectArray, leanArray} from "../utilities/arrayConverter";
import {Rect} from "./Rect";


export class Spline {
    /**
     * @type {Rect|null}
     */
    get boundingBox() {
        const b = this._bbox.clone();
        if (this.strokeStyle)
            b.grow(this.strokeStyle.thickness / 2);
        return b;
    }


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

        /**
         * Bounding box
         * @type {Rect}
         * @private
         */
        this._bbox = this._calcBoundingBox();
    }


    /**
     * Creates Spline from object with same properties
     * @param {Object} obj
     * @returns {Spline}
     */
    static fromObject(obj) {
        return new Spline(StrokeStyle.fromObject(obj.strokeStyle), fromObjectArray(obj.spoints, SplinePoint.fromObject));
    }


    /**
     * Returns lean js object
     * @returns {{strokeStyle: StrokeStyleOptions, spoints: Array<{point: {x: number, y: number}, tangentIn: {x: number, y: number}, tangentOut: {x: number, y: number}}>}}
     */
    lean() {
        return {
            strokeStyle: this.strokeStyle? this.strokeStyle.lean() : null,
            // can be used as they are
            spoints: leanArray(this.spoints),
        };
    }


    /**
     * Checks if spline is valid (has at least two spline-points)
     * @returns {boolean} true if path has at least two spline-points
     */
    isValid() {
        return this.spoints.length >= 2;
    }


    /**
     * @return {Rect|null}
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

        return Rect.fromPoints(topLeft, bottomRight);
    }


    /**
     * Draws spline in rendering context
     * @param {Object} context 2d rendering context of canvas
     */
    draw(context) {
        if (!this.isValid())
            throw new Error('invalid splines can not be drawn');

        context.beginPath();
        this.strokeStyle.apply(context);

        // start point
        context.moveTo(this.spoints[0].point.x, this.spoints[0].point.y);

        for(let i = 1; i < this.spoints.length; i++) {
            // draw cubic spline
            const c1 = this.spoints[i - 1].getOutPoint();
            const c2 = this.spoints[i].getInPoint();
            context.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, this.spoints[i].point.x, this.spoints[i].point.y);
        }
        context.stroke();
    }
}