import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {Canvas} from "./base/Canvas";
import {Pen} from "../../editor/drawing/canvas-tools/Pen";



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
     */
    static get propTypes() {
        return {
            offset: PropTypes.number.isRequired,
            hasFocus: PropTypes.bool.isRequired,
        };
    }

    static get defaultProps() {
        return {};
    }

    constructor(props) {
        super(props);

        let pen = new Pen();
        pen.onPathBegin = this.handlePathBegin;
        pen.onPathPoint = this.handlePathPoint;
        pen.onPathEnd = this.handlePathEnd;

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