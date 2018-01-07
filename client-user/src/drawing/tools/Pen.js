import {Point} from "../../geometry/Point";
import {StrokeStyle} from "../StrokeStyle";
import {Path} from "../Path";

/**
 * @author Alexander Droste
 * @date 07.01.18
 */

export class Pen {
    /**
     * Stroke styling
     * @type {StrokeStyle}
     */
    strokeStyle = null;

    /**
     * onPathBegin callback
     * @type {function()}
     */
    onPathBegin = null;

    /**
     * onPathPoint callback
     * @type {function(p: Point)}
     */
    onPathPoint = null;

    /**
     * onPathEnd callback
     * @type {function()}
     */
    onPathEnd = null;

    /**
     * last received point
     * @type {Point}
     * @private
     */
    _lastPoint = null;


    /**
     * @param {StrokeStyle} [strokeStyle] stroke style to use, defaults to default stroke styling
     */
    constructor(strokeStyle = new StrokeStyle()) {
        this.strokeStyle = strokeStyle;
    }


    handlePointerDown(ref, e) {
        const mouse = ref.getCanvasCoordinate(e);

        this._lastPoint = mouse;

        if (this.onPathBegin)
            this.onPathBegin();
        if (this.onPathPoint)
            this.onPathPoint(mouse);
    }


    handlePointerUp(ref, e) {
        if(this._lastPoint === null)
            return; // line already finished

        this._lastPoint = null;

        if (this.onPathEnd)
            this.onPathEnd();
    }


    handlePointerMove(ref, e) {
        // drawing not required
        if(this._lastPoint == null)
            return;

        // check bit-flag 1 (primary button)
        // important if somehow mouse-up event gets lost in space (e.g. loosing focus through popup)
        if(!(e.buttons & 1))
            this.handlePointerUp(ref, e);

        const mouse = ref.getCanvasCoordinate(e);

        // draw line between last point and current point
        ref.drawPath(new Path(
            this.strokeStyle,
            [ this._lastPoint, mouse ]
        ));

        this._lastPoint = mouse;

        if (this.onPathPoint)
            this.onPathPoint(mouse);
    }


    handlePointerLeave(ref, e) {
        this.handlePointerUp(ref, e);
    }
}