
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
     * @param right point to subtract from
     * @return {Point}
     */
    subtract(right) {
        return new Point(this.x - right.x, this.y - right.y);
    }

    /**
     * adds two points
     * @param right
     * @return {Point}
     */
    add(right) {
        return new Point(this.x + right.x, this.y + right.y);
    }

    /**
     * scales the points components
     * @param scalar scaling factor
     * @return {Point}
     */
    scale(scalar){
        return new Point(this.x * scalar, this.y * scalar);
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
}