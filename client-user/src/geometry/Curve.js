import {SplinePoint} from "./SplinePoint";
import {Rect} from "./Rect";

/**
 * a curve describes the part between two spline points (bezier curve)
 */
export class Curve{

    /**
     * @param {SplinePoint} p1
     * @param {SplinePoint} p2
     */
    constructor(p1, p2, radius){
        this.p1 = p1;
        this.p2 = p2;
        this.radius = radius;
        this._bbox = this._calcBoundingBox();
    }

    get boundingBox(){
        return this._bbox;
    }

    _calcBoundingBox(){
        return new Rect(
            Math.min(this.p1.point.x, this.p1.getOutPoint().x, this.p2.point.x, this.p2.getInPoint().x) - this.radius,
            Math.min(this.p1.point.y, this.p1.getOutPoint().y, this.p2.point.y, this.p2.getInPoint().y) - this.radius,
            Math.max(this.p1.point.x, this.p1.getOutPoint().x, this.p2.point.x, this.p2.getInPoint().x) + this.radius,
            Math.max(this.p1.point.y, this.p1.getOutPoint().y, this.p2.point.y, this.p2.getInPoint().y) + this.radius,
        );
    }
}