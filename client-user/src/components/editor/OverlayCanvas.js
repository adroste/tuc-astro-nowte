import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {Canvas} from "./base/Canvas";
import {Pen} from "../../editor/drawing/canvas-tools/Pen";
import {StrokeStyle} from "../../editor/drawing/StrokeStyle";
import {Path} from "../../geometry/Path";
import {clamp} from "../../utilities/math";
import {Point} from "../../geometry/Point";



const FixedOverlay = styled.div.attrs({
    style: ({offsetTop}) => ({
        top: offsetTop
    }),
})`
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100vh; /* TODO do not hardcode this.. */
    z-index: 400;
    /*background: rgba(0, 255, 0, 0.75);*/
    ${props => !props.hasFocus && 'pointer-events: none;'}
`;


export class OverlayCanvas extends React.Component {
    /**
     * propTypes
     * @property {array} paths paths that should be drawn. [{userUniqueId, color, points: {point, alpha}}]
     *
     * @property {function()} onPathBegin indicates the start of a user drawn path
     * @property {function(Point)} onPathPoint indicates the addition of a new point to the current path
     * @property {function()} onPathEnd indicates that the user finished drawing
     */
    static get propTypes() {
        return {
            offset: PropTypes.number.isRequired,
            hasFocus: PropTypes.bool.isRequired,
            paths: PropTypes.array.isRequired,

            onPathBegin: PropTypes.func.isRequired,
            onPathPoint: PropTypes.func.isRequired,
            onPathEnd: PropTypes.func.isRequired,
        };
    }

    static get defaultProps() {
        return {};
    }

    constructor(props) {
        super(props);

        let pen = new Pen();
        pen.onPathBegin = this.props.onPathBegin;
        pen.onPathPoint = (point) => this.props.onPathPoint(new Point(point.x, point.y + this.props.offset));
        pen.onPathEnd = this.props.onPathEnd;

        //pen.onPathBegin = this.handlePathBegin;
        //pen.onPathPoint = this.handlePathPoint;
        //pen.onPathEnd = this.handlePathEnd;

        this.state = {
            pen:  pen,
        };
    }

    handlePathBegin = () => {
        this.lastPoint = null;
    };

    lastPoint = null;

    handlePathPoint = (point) => {
        if(this.lastPoint !== null){
            this.canvasRef.context2d.lineTo(point.x, point.y);
        } else {
            this.canvasRef.context2d.moveTo(point.x, point.y);
        }
        this.lastPoint = point;
    };

    handlePathEnd = () => {
        this.canvasRef.context2d.stroke();
    };

    componentDidMount() {
        this.renderPaths();
    }

    componentWillUpdate(nextProps, nextState) {
        this.renderPaths();
    }

    renderPaths = () => {
        if (!this.canvasRef)
            return;

        // clear entire screen
        const c = this.canvasRef.context2d;
        c.clearRect(0, 0, 1000, 2000);
        if (!this.props.paths.length)
            return;

        c.lineWidth = 3;
        c.lineJoin = 'round';
        c.lineCap = 'round';
        const offset = this.props.offset;

        // redraw all lines
        for(let path of this.props.paths) {
            //path = {color, points: {point, alpha}}
            // set color
            if(path.points.length === 0)
                continue;

            c.beginPath();

            // TODO draw single point

            // make gradient lines
            for(let i = 0; i < path.points.length - 1; ++i) {
                const p1 = Point.fromObject(path.points[i].point);
                const p2 = Point.fromObject(path.points[i + 1].point);
                let gradient = c.createLinearGradient(p1.x, p1.y - offset, p2.x, p2.y - offset);
                
                gradient.addColorStop(0, this.fadeColor(path.color, path.points[i].alpha));
                gradient.addColorStop(1, this.fadeColor(path.color, path.points[i].alpha));
                c.strokeStyle = gradient;

                // calculate catmull rom control points
                let t1 = p2.subtract(p1);
                let t2 = t1.clone();

                // take previous point for tangent
                if(i - 1 >= 0)
                    t1 = p2.subtract(path.points[i - 1].point).multiply(0.5);
                // take next point for tangent
                if(i + 2 < path.points.length)
                    t2 = Point.fromObject(path.points[i + 2].point).subtract(p1).multiply(0.5);

                // compute control points
                const c1 = p1.add(t1.multiply(1.0 / 3.0));
                const c2 = p2.subtract(t2.multiply(1.0 / 3.0));

                c.beginPath();
                c.moveTo(p1.x, p1.y - offset);
                //c.lineTo(p2.x, p2.y - offset);
                c.bezierCurveTo(c1.x, c1.y - offset, c2.x, c2.y - offset, p2.x, p2.y - offset);
                c.stroke();
            }
        }
    };

    /**
     * multipies a color with a certain factor
     * @param {string} color color in hex format (#ff00ff) must be length of 7
     * @param {number} factor scalar
     * @return {string} color in hex format
     */
    multiplyColor = (color, factor) => {
        return this.modifyColor(color, (color) => color * factor);
    };

    /**
     * mixed a color with a white line
     * @param color
     * @param factor
     * @return {string}
     */
    fadeColor = (color, factor) => {
        return this.modifyColor(color, (color) => color * factor + (1.0 - factor) * 255)
    };

    /**
     * modifies rgb values of a color
     * @param {string} color
     * @param {function(color: number)} callback this will be called for all rgb components of the color and the
     * return value of each component will be in the result
     * @return {string} color string after callback was applied on r g and b
     */
    modifyColor = (color, callback) => {
        let res = "#";
        for(let i = 0; i < 3; ++i){
            let val = parseInt(color[2 * i +1] + color[2 * i + 2], 16);
            val = Math.floor(clamp(callback(val), 0, 255));
            // convert to string
            val = val.toString(16);
            while (val.length < 2) val = "0" + val;

            res += val;
        }
        return res;
    };



    render() {
        return (
            <FixedOverlay
                hasFocus={this.props.hasFocus}
                offsetTop={this.props.offset}
            >
                <Canvas
                    ref={(ref) => this.canvasRef = ref}
                    resolutionX={1000}
                    resolutionY={2000}
                    tool={this.state.pen}
                    
                />
            </FixedOverlay>
        );
    }
}