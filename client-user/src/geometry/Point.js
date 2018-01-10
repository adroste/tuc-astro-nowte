
export class Point {
    /**
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }


    /**
     * Creates Point from object with properties
     * @param {Object} obj
     * @returns {Point}
     */
    static fromObject(obj) {
        return new Point(obj.x, obj.y);
    }


    /**
     * Returns lean js object
     * @returns {{x: number, y: number}}
     */
    lean() {
        return {
            x: this.x,
            y: this.y,
        };
    }


    /**
     * deep copy of object
     * @return {Point}
     */
    clone() {
        return new Point(this.x, this.y);
    }

    /**
     * @param {point} point point to compare
     * @return {boolean}
     */
    equals(point) {
        return point && (this.x === point.x && this.y === point.y);
    }

    /**
     * subtracts this point from the right point
     * @param {Point|number} right point to subtract from
     * @return {Point}
     */
    subtract(right) {
        if(typeof right === typeof this)
            return new Point(this.x - right.x, this.y - right.y);
        return new Point(this.x - right, this.y - right);
    }

    /**
     * adds two points
     * @param {Point|number} right
     * @return {Point}
     */
    add(right) {
        if(typeof right === typeof this)
            return new Point(this.x + right.x, this.y + right.y);
        return new Point(this.x + right, this.y + right);
    }

    /**
     * dot product of two vectors
     * @param {Point} right
     * @return {number}
     */
    dot(right) {
        return this.x * right.x + this.y * right.y;
    }

    /**
     * pseudo cross product (signed area of two vectors)
     * @param {Point} right
     * @return {number}
     */
    cross(right) {
        return this.x * right.y - this.y * right.x;
    }

    /**
     * component wise multiplication
     * @param {Point|number} right
     * @return {Point}
     */
    multiply(right) {
        if(typeof right === typeof this)
            return new Point(this.x * right.x, this.y * right.y);
        return new Point(this.x * right, this.y * right);
    }

    /**
     * negation of all components
     * @return {Point}
     */
    negate() {
        return new Point(-this.x, -this.y);
    }

    /**
     * squared length
     * @return {number}
     */
    lengthSq() {
        return this.x * this.x + this.y * this.y;
    }

    /**
     * length of the point
     * @return {number}
     */
    length() {
        return Math.sqrt(this.lengthSq());
    }

    /**
     * calculates distance between two points
     * @param point
     * @return number
     */
    dist(point) {
        return this.subtract(point).length();
    }

    /**
     * normalizes the point if this.length() != 0
     * @param {number} length length to normalize to
     * @return {Point}
     */
    normalize(length = 1) {
        let len = this.length();
        if(len === 0)
            len = 1; // we don't want to divide by zero
        return new Point(this.x * length / len, this.y * length / len);
    }
}