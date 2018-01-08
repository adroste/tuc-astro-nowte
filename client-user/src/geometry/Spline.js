

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
    }

    /**
     * Checks if spline is valid (has at least two spline-points)
     * @returns {boolean} true if path has at least two spline-points
     */
    isValid() {
        return this.spoints.length >= 2;
    }
}