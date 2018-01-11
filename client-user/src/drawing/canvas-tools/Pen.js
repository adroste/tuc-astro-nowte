import {Path} from "../../geometry/Path";

/**
 * @author Alexander Droste
 * @date 07.01.18
 */

let _lastEventBeforeLeave = null;
let _lastEvent = null;

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
     * @type {function(point: Point)}
     */
    onPathPoint = null;

    /**
     * onPathEnd callback
     * @type {function(path: Path)}
     */
    onPathEnd = null;

    /**
     * current path object
     * @type {Path}
     * @private
     */
    _currentPath = null;


    /**
     * @param {StrokeStyle} strokeStyle stroke style to use
     */
    constructor(strokeStyle) {
        this.strokeStyle = strokeStyle;
    }


    handlePointerDown(e, ref) {
        const mouse = ref.getCanvasCoordinate(e);

        this._currentPath = new Path(this.strokeStyle);
        this._currentPath.addPoint(mouse);

        (new Path(
            this.strokeStyle,
            [ mouse ]
        )).draw(ref.context);

        if (this.onPathBegin)
            this.onPathBegin();
        if (this.onPathPoint)
            this.onPathPoint(mouse);
        e.preventDefault();
    }


    handlePointerUp(e, ref) {
        if(this._currentPath === null)
            return; // line already finished

        // hit event before clearing path from working canvas
        if (this.onPathEnd)
            this.onPathEnd(this._currentPath);

        // clear rect with current path
        const bbox = this._currentPath.boundingBox;
        ref.context.clearRect(bbox.x1, bbox.y1, bbox.width, bbox.height);
        this._currentPath = null;

        e.preventDefault();
    }


    handlePointerMove(e, ref) {
        // drawing not required
        if(this._currentPath == null)
            return; // TODO maybe e.preventDefault missing here

        // check bit-flag 1 (primary button)
        // important if somehow mouse-up event gets lost in space (e.g. loosing focus through popup)
        // TODO touch input: this part could lead to errors with touch/pen
        if(!(e.buttons & 1)) {
            this.handlePointerUp(e, ref);
            return;
        }

        _lastEvent = e;

        const mouse = ref.getCanvasCoordinate(e);

        // draw line between last point and current point
        (new Path(
            this.strokeStyle,
            [ this._currentPath.points[this._currentPath.points.length - 1], mouse ]
        )).draw(ref.context);

        this._currentPath.addPoint(mouse);

        if (this.onPathPoint)
            this.onPathPoint(mouse);
        e.preventDefault();
    }


    handlePointerLeave(e, ref) {
        _lastEventBeforeLeave = _lastEvent;
        this.handlePointerMove(e, ref);
        this.handlePointerUp(e, ref);
        e.preventDefault();
    }


    handlePointerEnter(e, ref) {
        // primary button pressed
        if (e.buttons & 1) {
            // last event coords == this event coords => last event was definitive leave from other layer
            if (_lastEvent.clientX === e.clientX && _lastEvent.clientY === e.clientY) {
                // draw line beginning from last point in previous layer
                this.handlePointerDown(_lastEventBeforeLeave, ref);
                this.handlePointerMove(e, ref);
            }
            else {
                this.handlePointerDown(e, ref);
            }
        }
        e.preventDefault();
    }
}