import {Path} from "../../geometry/Path";

/**
 * @author Alexander Droste
 * @date 07.01.18
 */

let _lastEventBeforeLeave = null;
let _lastEvent = null;

export class Pen {

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
     * @type {function()}
     */
    onPathEnd = null;

    /**
     * indicates that a path is currently drawn
     * @type {boolean}
     * @private
     */
    _drawingPath = false;

    constructor() {
    }


    handlePointerDown(e, ref) {
        const mouse = ref.getCanvasCoordinate(e);
        this._drawingPath = true;


        this.onPathBegin();
        this.onPathPoint(mouse);
        e.preventDefault();
    }


    handlePointerUp(e, ref) {
        if(!this._drawingPath)
            return; // line already finished

        // hit event before clearing path from working canvas
        this.onPathEnd();

        this._drawingPath = false;
        e.preventDefault();
    }


    handlePointerMove(e, ref) {
        // drawing not required
        if(!this._drawingPath)
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