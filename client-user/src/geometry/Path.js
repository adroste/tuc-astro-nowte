import {Spline} from "./Spline";
import {PathFitter} from "./PathFitter";
import {Point} from "./Point";
import {StrokeStyle} from "../drawing/StrokeStyle";
import {fromObjectArray, leanArray} from "../utilities/arrayConverter";


export class Path
{
    /**
     * @param {StrokeStyle} strokeStyle stroke style to use
     * @param {Point[]} [points=[]] points to create path from (empty by default)
     */
    constructor(strokeStyle, points = []) {
        /**
         * Stroke styling
         * @type {StrokeStyle}
         */
        this.strokeStyle = strokeStyle;

        /**
         * Points describing the path (start to end)
         * @type {Point[]}
         */
        this.points = points;
        this.bbox = this._calcBoundingBox();
    }


    /**
     * Creates Path from object with properties
     * @param {Object} obj
     * @returns {Path}
     */
    static fromObject(obj) {
        return new Path(StrokeStyle.fromObject(obj.strokeStyle), fromObjectArray(obj.points, Point.fromObject));
    }


    /**
     * Returns lean js object
     * @returns {{strokeStyle: StrokeStyleOptions, points: Array<{x: number, y: number}>}}
     */
    lean() {
        return {
            strokeStyle: this.strokeStyle? this.strokeStyle.lean() : null,
            // points can be used as they are
            points: leanArray(this.points),
        };
    }


    /**
     * Checks if path is valid (has at least two points)
     * @returns {boolean} true if path has at least two points
     */
    isValid() {
        return this.points.length >= 2;
    }


    /**
     * Adds a point to the end of the path
     * @param {Point} point point to add
     */
    addPoint(point) {
        this.points.push(point);

        // update bbox
        if(this.bbox) {
            // adjust bbox
            this.bbox.topLeft.x = Math.min(this.bbox.topLeft.x, point.x);
            this.bbox.topLeft.y = Math.min(this.bbox.topLeft.y, point.y);
            this.bbox.bottomRight.x = Math.max(this.bbox.bottomRight.x, point.x);
            this.bbox.bottomRight.y = Math.max(this.bbox.bottomRight.y, point.y);
        }
        else {
            // bbox was not calculated before due to lack of points
            this.bbox = {
                topLeft: point.clone(),
                bottomRight: point.clone(),
            }
        }
    }


    /**
     * converts the path into a spline
     * @returns {Spline}
     */
    toSpline() {
        const splinePoints = new PathFitter(this, false).fit(2.5);
        if(!splinePoints)
            return null; // some error during converting?
        return new Spline(this.strokeStyle, splinePoints);
    }


    /**
     * @return {{topLeft: Point, bottomRight: Point}|null}
     */
    getBoundingBox() {
        return this.bbox;
    }


    /**
     * @return {{topLeft: Point, bottomRight: Point}|null}
     * @private
     */
    _calcBoundingBox() {
        if(this.points.length < 1)
            return null;

        let topLeft = this.points[0].clone();
        let bottomRight = this.points[0].clone();

        for(let pt of this.points){
            topLeft.x = Math.min(topLeft.x, pt.x);
            topLeft.y = Math.min(topLeft.y, pt.y);
            bottomRight.x = Math.max(bottomRight.x, pt.x);
            bottomRight.y = Math.max(bottomRight.y, pt.y);
        }

        return {
            topLeft: topLeft,
            bottomRight: bottomRight,
        };
    }


    }
}