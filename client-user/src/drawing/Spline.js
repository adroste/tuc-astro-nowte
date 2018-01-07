
export class SplinePoint {
    /**
     * @param point point
     * @param tangent tangent
     */
    constructor(point, tangent) {
        this.point = point;
        this.tangent = tangent;
    }

    getOutPoint() {
        return this.point.add(this.tangent.scale(0.33));
    }

    getInPoint() {
        return this.point.subtract(this.tangent.scale(0.33));
    }
}

export class Spline {
    constructor(strokeStyle, splinePoints){
        this.strokeStyle = strokeStyle;
        this.spoints = splinePoints;
    }
}