import {SplinePoint, Spline} from "./Spline";

export class Path
{
    constructor(stroke, points) {
        this.stroke = stroke;
        this.points = points ? points : [];
    }

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
            return new Path(this.stroke, [this.points[0], this.points[0]]).toSpline();
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

        return new Spline(this.stroke, splinePoints);
    }
}