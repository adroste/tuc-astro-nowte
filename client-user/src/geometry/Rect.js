/**
 * @author Alexander Droste
 * @date 10.01.18
 */


import {Point} from "./Point";

export class Rect {
    /**
     * x1 coordinate
     * @type {number}
     */
    x1 = 0;

    /**
     * x2 coordinate
     * @type {number}
     */
    x2 = 0;

    /**
     * y1 coordinate
     * @type {number}
     */
    y1 = 0;

    /**
     * y2 coordinate
     * @type {number}
     */
    y2 = 0;


    /**
     * @type {Point}
     */
    get topLeft() {
        return new Point(this.x1, this.y1);
    }

    /**
     * @type {Point}
     */
    set topLeft(point) {
        this.x1 = point.x;
        this.y1 = point.y;
    }


    /**
     * @type {Point}
     */
    get bottomRight() {
        return new Point(this.x2, this.y2);
    }

    /**
     * @type {Point}
     */
    set bottomRight(point) {
        this.x2 = point.x;
        this.y2 = point.y;
    }


    /**
     * @type {number}
     */
    get width() {
        return this.x2 - this.x1;
    }

    /**
     * @type {number}
     */
    set width(width) {
        this.x2 = this.x1 + width;
    }


    /**
     * @type {number}
     */
    get height() {
        return this.y2 - this.y1;
    }

    /**
     * @type {number}
     */
    set height(height) {
        this.y2 = this.y1 + height;
    }


    /**
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     */
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }


    /**
     * Creates Rect from object with same properties
     * @param {Object} obj
     * @returns {Rect}
     */
    static fromObject(obj) {
        return new Rect(obj.x1, obj.y1, obj.x2, obj.y2);
    }


    /**
     * Creates Recct from top left and bottom right points
     * @param {Point} topLeft
     * @param {Point} bottomRight
     * @returns {Rect}
     */
    static fromPoints(topLeft, bottomRight) {
        return new Rect(topLeft.x, topLeft.y, bottomRight.x, bottomRight.y);
    }


    /**
     * Returns lean js object
     * @returns {{x1: number, y1: number, x2: number, y2: number}}
     */
    lean() {
        return {
            x1: this.x1,
            y1: this.y1,
            x2: this.x2,
            y2: this.y2,
        };
    }


    /**
     * Returns a copy of the rect
     * @returns {Rect}
     */
    clone() {
        return new Rect(this.x1, this.y1, this.x2, this.y2);
    }


    /**
     * Moves rect
     * @param {number} tx
     * @param {number} ty
     */
    move(tx, ty) {
        this.x1 += tx;
        this.x2 += tx;
        this.y1 += ty;
        this.y2 += ty;
    }


    /**
     * Scales rect
     * @param {number} s
     */
    scale(s) {
        this.width = this.width * s;
        this.height = this.height * s;
    }


    /**
     * Grows rect in all directions by m
     * @param {number} m
     */
    grow(m) {
        this.x1 -= m;
        this.y1 -= m;
        this.x2 += m;
        this.y2 += m;
    }

    /**
     * Tests if two rectangles overlap. if rect is null overlaps returns false
     * @param {Rect|null} rect
     * @return {boolean}
     */
    overlaps(rect) {
        return rect && (this.x1 <= rect.x2 && this.x2 >= rect.x1) &&
            (this.y1 <= rect.y2 && this.y2 >= rect.y1);
    }

    /**
     * fits the rect to include the bounding box
     * @param {Point} point
     */
    includePoint(point) {
        this.x1 = Math.min(this.x1, point.x);
        this.y1 = Math.min(this.y1, point.y);
        this.x2 = Math.max(this.x2, point.x);
        this.y2 = Math.max(this.y2, point.y);
    }
}