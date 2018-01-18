
import {Rect} from "./Rect";
import {Spline} from "./Spline";

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
     * @param {Rect|Spline} other
     * @return {boolean}
     */
    overlaps(other) {
        if(other.constructor.name === "Rect"){
            if(!this._bbox.overlaps(other))
                return false;

            // TODO further tests
        } else if (other.constructor.name === "Spline"){
            if(!this.overlaps(other.boundingBox))
                return false;

            // TODO further tests
        } else {
            alert("invalid overlap check");
        }
        return true;
    }

    _calcBoundingBox() {
        return new Rect(
            Math.min(this._p1.x, this._p2.x) - this._radius,
            Math.min(this._p1.y, this._p2.y) - this._radius,
            Math.max(this._p1.x, this._p2.x) + this._radius,
            Math.max(this._p1.y, this._p2.y) + this._radius
        );
    }
}