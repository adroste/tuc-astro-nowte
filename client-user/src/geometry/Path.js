import {Spline} from "./Spline";
import {PathFitter} from "./PathFitter";
import {Point} from "./Point";
import {StrokeStyle} from "../editor/drawing/StrokeStyle";
import {fromObjectArray, leanArray} from "../utilities/arrayConverter";
import {Rect} from "./Rect";


export class Path {
    /**
     * @type {Rect|null}
     */
    get boundingBox() {
        if(!this._bbox)
            return null;

        const b = this._bbox.clone();
        if (this.strokeStyle)
            // + 1 is additional tolerance
            b.grow(this.strokeStyle.thickness / 2 + 1);
        return b;
    }


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

        /**
         * Bounding box _bbox
         * @type {Rect}
         * @private
         */
        this._calcBoundingBox();
    }


    /**
     * Creates Path from object with same properties
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
     * Adds a point to the end of the path
     * @param {Point} point point to add
     */
    addPoint(point) {
        this.points.push(point);

        // update bbox
        if(this._bbox) {
            // adjust bbox
            const i = this.points.length - 1;
            if(i - 1 >= 0){
                // adjust due to new control point (catmull rom)
                this._includePointInBBox(i - 1);
            }
            this._includePointInBBox(i);
        }
        else {
            // bbox was not calculated before due to lack of points
            this._bbox = Rect.fromPoints(point, point);
        }
    }

    _includePointInBBox(index){
        let pt = this.points[index];
        let tangent = this._calcTangent(index).multiply(0.3333);
        this._bbox.includePoint(pt);
        if(index < this.points.length - 1)
            this._bbox.includePoint(pt.add(tangent));
        if(index > 0)
            this._bbox.includePoint(pt.subtract(tangent));
    }

    /**
     * calculates a tangent for a point
     * @param index point index (must be valid)
     * @returns {Point} tangent
     * @private
     */
    _calcTangent(index) {
        if(index - 1 >= 0)
        {
            // point can be computed normally
            if(index + 1 < this.points.length)
                return this.points[index + 1].subtract(this.points[index - 1]).multiply(0.5);
            // no successor
            return this.points[index].subtract(this.points[index - 1]);
        } else if(index + 1 < this.points.length){
            // no predecessor
            return this.points[index + 1].subtract(this.points[index]);
        } else return new Point(0.0, 0.0);
    }

    /**
     * converts the path into a spline
     * @returns {Spline}
     */
    toSpline() {
        const splinePoints = new PathFitter(this, false).fit(5);
        if(!splinePoints)
            return null; // some error during converting?
        return new Spline(this.strokeStyle, splinePoints);
    }


    /**
     * Calculates bounding box
     * @return {Rect|null}
     * @private
     */
    _calcBoundingBox() {
        if(this.points.length < 1)
            return null;

        this._bbox = Rect.fromPoints(this.points[0], this.points[0]);

        for(let i = 0; i < this.points.length; ++i){
            this._includePointInBBox(i);
        }
    }


    /**
     * Draws path in rendering context
     * @param {Object} context2d 2d rendering context of canvas
     * @param {number} [startIndex=0] index of the first path point. This point and all subsequent points will be drawn.
     */
    draw(context2d, startIndex = 0) {
        if (this.points.length < 1)
            return;

        context2d.beginPath();
        this.strokeStyle.apply(context2d);

        // draw single point
        if (this.points.length === 1 && startIndex < 1) {
            // strokeStyle = fillStyle, thickness = radius
            context2d.fillStyle = this.strokeStyle.color;
            context2d.arc(this.points[0].x, this.points[0].y, this.strokeStyle.thickness / 2, 0, 2 * Math.PI, true);
            context2d.fill();
            return;
        }

        if(startIndex + 1 >= this.points.length)
            return; // nothing to be drawn

        //startIndex = Math.max(startIndex - 1, 0);
        // start point
        context2d.moveTo(this.points[startIndex].x, this.points[startIndex].y);

        // experimental:
        // draw catmull rom splines

        for (let i = startIndex + 1; i < this.points.length; i++) {
            const p1 = this.points[i - 1];
            const p2 = this.points[i];

            // use standard tangents
            let t1 = p2.subtract(p1);
            let t2 = t1;

            // calculate tangents
            // take previous point for tangent
            if(i - 2 >= 0)
                t1 = p2.subtract(this.points[i - 2]).multiply(0.5);
            // take next point for tangent
            if(i + 1 < this.points.length)
                t2 = this.points[i + 1].subtract(p1).multiply(0.5);

            // compute control points
            const c1 = p1.add(t1.multiply(1.0 / 3.0));
            const c2 = p2.subtract(t2.multiply(1.0 / 3.0));

            context2d.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, p2.x, p2.y);
        }

        /*for (let i = startIndex + 1; i < this.points.length; i++) {
            context2d.lineTo(this.points[i].x, this.points[i].y);
        }*/
        context2d.stroke();
    }
}