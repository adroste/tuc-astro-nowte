
import {Rect} from "./Rect";
import {Spline} from "./Spline";
import {clamp} from "../utilities/math";

/**
 * defines a line with a thickness
 */
export class Capsule {

    /**
     * @param {Point} p1
     * @param {Point} p2
     * @param {number} radius half of the thickness
     */
    constructor(p1, p2, radius) {
        this._p1 = p1;
        this._p2 = p2;
        this._radius = radius;
        this._bbox = this._calcBoundingBox();
    }

    /**
     * tests if two objects overlap
     * @param {Rect|Spline|Curve|Capsule} other
     * @return {boolean}
     */
    overlaps(other) {
        if(other.constructor.name === "Rect"){
            if(!this._bbox.overlaps(other))
                return false;

            // TODO further tests
        } else if (other.constructor.name === "Spline") {
            if (!this.overlaps(other.boundingBox))
                return false;

            if(other.spoints.length === 1)
                return true; // bounding box test was enough

            // test for all inner bounding boxes
            for (let curveIdx = 0; curveIdx < other.spoints.length - 1; ++curveIdx) {
                const curve = other.getCurve(curveIdx);
                if(this.overlaps(curve))
                    return true;
            }

            return false;
        }
        else if(other.constructor.name === "Curve") {
            if (!this.overlaps(other.boundingBox))
                return false;

            // TODO further curve testing
            const capsule = new Capsule(other.p1.point, other.p2.point, other.radius);
            return this.overlaps(capsule);
        }
        else if(other.constructor.name === "Capsule") {
            // first check bbox
            if (!this.overlaps(other.boundingBox))
                return false;

            const dist2 = Capsule._closestPointCapsuleCapsule(this._p1, this._p2, other._p1, other._p2);
            const radius = this._radius + other._radius;
            return dist2 <= radius * radius;
        } else {
            alert("invalid overlap check");
        }
        return true;
    }

    get boundingBox(){
        return this._bbox;
    }

    _calcBoundingBox() {
        return new Rect(
            Math.min(this._p1.x, this._p2.x) - this._radius,
            Math.min(this._p1.y, this._p2.y) - this._radius,
            Math.max(this._p1.x, this._p2.x) + this._radius,
            Math.max(this._p1.y, this._p2.y) + this._radius
        );
    }

    /**
     * computes the closest point between s1(s) = p1 + s * (q1 - p1)
     * and s2(t) = p2 + t * (q2 - p2).
     * @param p1 start of first line
     * @param q1 end of first line
     * @param p2 start of second line
     * @param q2 end of second line
     * @return {number} squared distance between the two points
     * @private
     */
    static _closestPointCapsuleCapsule(p1, q1, p2, q2){
        const EPSILON = 1e-12;

        const d1 = q1.subtract(p1); // direction of first line
        const d2 = q2.subtract(p2); // direction of second line
        const r = p1.subtract(p2);
        const a = d1.dot(d1); // squared length of segment S1
        const e = d2.dot(d2); // squared length of segment S2
        const f = d2.dot(r);

        let s = 0.0;
        let t = 0.0;

        // check if either or both segments degenarate into points
        if(a <= EPSILON && e <= EPSILON) {
            // both lines are just points
            return p1.distSq(p2);
        }
        if( a <= EPSILON){
            // first segment is just a point
            s = 0.0;
            t = f / e; // s = 0 => t = (b*s + f) / e = f / e
            t = clamp(t, 0.0, 1.0);
        }
        else {
            const c = d1.dot(r);
            if(e <= EPSILON){
                // second segment is just a point
                t = 0.0;
                s = clamp(-c / a, 0.0, 1.0); // t = 0 => s = (b*t - c) / a = -c / a
            }
            else {
                // closest point between two line
                const b = d1.dot(d2);
                const denom = a * e - b * b;

                // if segments not parallel compute closest point
                if(denom !== 0.0) {
                    s = clamp((b * f - c * e) / denom, 0.0, 1.0);
                } else {
                    s = 0.0;
                }

                // compute point on l2 closest to s1
                t = (b * s + f) / e;

                // clamp t
                if(t < 0.0) {
                    t = 0.0;
                    s = clamp(-c / a, 0.0, 1.0);
                } else if(t > 1.0) {
                    t = 1.0;
                    s = clamp((b - c) / a, 0.0, 1.0);
                }
            }
        }

        // set closest points
        const c1 = p1.add(d1.multiply(s));
        const c2 = p2.add(d2.multiply(t));

        return c1.distSq(c2);
    }
}