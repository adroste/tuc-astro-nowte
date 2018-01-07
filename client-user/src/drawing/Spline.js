
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

    draw(context) {
        this.strokeStyle.apply(context);
        context.beginPath();

        let prevPoint = null;
        for(let point of this.spoints){
            if(prevPoint){
                // draw cubic spline
                const c1 = prevPoint.getOutPoint();
                const c2 = point.getInPoint();
                context.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, point.point.x, point.point.y);
            }
            else {
                // initial point
                context.moveTo(point.point.x, point.point.y);
            }
            prevPoint = point;
        }

        context.stroke();
    }
}