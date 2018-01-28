import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {Canvas} from "./base/Canvas";
import {Pen} from "../../editor/drawing/canvas-tools/Pen";
import {StrokeStyle} from "../../editor/drawing/StrokeStyle";
import {Path} from "../../geometry/Path";
import {clamp} from "../../utilities/math";



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
        pen.onPathPoint = this.props.onPathPoint;
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
            this.canvasRef.context.lineTo(point.x, point.y);
        } else {
            this.canvasRef.context.moveTo(point.x, point.y);
        }
        this.lastPoint = point;
    };

    handlePathEnd = () => {
        this.canvasRef.context.stroke();
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
        const c = this.canvasRef.context;
        c.clearRect(0, 0, 1000, 2000);
        if (!this.props.paths.length)
            return;

        c.lineWidth = 3;
        c.lineJoin = 'round';
        c.lineCap = 'round';
        // alpha blending

        // redraw all lines
        for(let path of this.props.paths) {
            //path = {color, points: {point, alpha}}
            // set color
            if(path.points.length === 0)
                continue;

            c.beginPath();

            const s = new StrokeStyle({
                color: path.color,
                thickness: 3,
            });
            s.apply(c);

            // TODO draw single point
            // make gradient lines
            for(let i = 0; i < path.points.length - 1; ++i) {
                const p1 = path.points[i].point;
                const p2 = path.points[i + 1].point;
                let gradient = c.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
                //gradient.addColorStop(0, 'rgba(0,0,0,' + path.points[i].alpha + ')');
                //gradient.addColorStop(1, 'rgba(0,0,0,' + path.points[i + 1].alpha + ')');

                gradient.addColorStop(0, this.fadeColor(path.color, path.points[i].alpha));
                gradient.addColorStop(1, this.fadeColor(path.color, path.points[i].alpha));
                c.strokeStyle = gradient;

                c.beginPath();
                c.moveTo(p1.x, p1.y);
                c.lineTo(p2.x, p2.y);
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

    fadeColor = (color, factor) => {
        return this.modifyColor(color, (color) => color * factor + (1.0 - factor) * 255)
    };

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