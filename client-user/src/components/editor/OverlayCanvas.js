import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {Canvas} from "./base/Canvas";
import {Pen} from "../../editor/drawing/canvas-tools/Pen";
import {StrokeStyle} from "../../editor/drawing/StrokeStyle";
import {Path} from "../../geometry/Path";



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
        //c.clearRect(0, 0, this.canvasRef.width, this.canvasRef.height);
        if (!this.props.paths.length)
            return;

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

            // draw the line
            c.moveTo(path.points[0].point.x, path.points[0].point.y);
            for(let i = 1; i < path.points.length; ++i) {
                c.lineTo(path.points[i].point.x, path.points[i].point.y);
            }
            c.stroke();
        }
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