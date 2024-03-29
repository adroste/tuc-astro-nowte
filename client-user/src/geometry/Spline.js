import {StrokeStyle} from "../editor/drawing/StrokeStyle";
import {SplinePoint} from "./SplinePoint";
import {fromObjectArray, leanArray} from "../utilities/arrayConverter";
import {Rect} from "./Rect";
import {Curve} from "./Curve";


export class Spline {
    /**
     * @type {Rect|null}
     */
    get boundingBox() {
        const b = this._bbox.clone();
        if (this.strokeStyle)
            // + 1 is additional tolerance
            b.grow(this.strokeStyle.thickness / 2 + 1);
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
     * @param {Object} context2d 2d rendering context of canvas
     */
    draw(context2d) {
        if (this.spoints.length < 1)
            return;

        context2d.beginPath();
        this.strokeStyle.apply(context2d);

        // draw single point
        if (this.spoints.length === 1) {
            // strokeStyle = fillStyle, thickness = radius
            context2d.fillStyle = this.strokeStyle.color;
            context2d.arc(this.spoints[0].point.x, this.spoints[0].point.y, this.strokeStyle.thickness / 2, 0, 2 * Math.PI, true);
            context2d.fill();
            return;
        }

        // start point
        context2d.moveTo(this.spoints[0].point.x, this.spoints[0].point.y);

        for(let i = 1; i < this.spoints.length; i++) {
            // draw cubic spline
            const c1 = this.spoints[i - 1].getOutPoint();
            const c2 = this.spoints[i].getInPoint();
            context2d.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, this.spoints[i].point.x, this.spoints[i].point.y);
        }
        context2d.stroke();
    }

    /**
     * gets curve
     * @param index range [0, spoints.length - 2]
     * @return {Curve}
     */
    getCurve(index){
        return new Curve(this.spoints[index], this.spoints[index + 1], this.strokeStyle.thickness / 2.0);
    }
}