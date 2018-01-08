import {SplinePoint, Spline} from "./Spline";

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
    }


    /**
     * converts the path into a spline
     */
    toSpline() {
        if(this.points.length === 0){
            // TODO return something useful
            return null;
        } else if(this.points.length === 1) {
            return new Path(this.strokeStyle, [this.points[0], this.points[0]]).toSpline();
        }

        let splinePoints = [];
        // make cubic splines according to catmull rom
        // first point
        splinePoints.push(new SplinePoint(this.points[0],
            // vector to first point
            this.points[1].subtract(this.points[0]).scale(0.5)
        ));

        for(let i = 1, end = this.points.length - 1; i < end; ++i){
            const tangent = this.points[i+1].subtract(this.points[i-1]).scale(0.5);
            splinePoints.push(new SplinePoint(this.points[i], tangent));
        }

        // last point
        const back = this.points.length - 1;
        splinePoints.push(new SplinePoint(this.points[back],
            this.points[back].subtract(this.points[back-1]).scale(0.5)));

        return new Spline(this.strokeStyle, splinePoints);
    }
}