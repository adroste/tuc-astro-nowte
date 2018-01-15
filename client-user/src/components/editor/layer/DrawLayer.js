/**
 * @author Alexander Droste
 * @date 06.01.18
 */

import React from 'react';
import styled from 'styled-components';
import {Canvas} from "../base/Canvas";
import {Pen} from "../../../drawing/canvas-tools/Pen";
import {StrokeStyle} from "../../../drawing/StrokeStyle";
import PropTypes from 'prop-types';

const LayerWrapper = styled.div`
    position: relative;
    width: 100%;
    height: 100%
`;


const CanvasLayer = styled(Canvas)`
    position: absolute;
    top: 0;
    left: 0;
`;


export class DrawLayer extends React.Component {
    /**
     * propTypes
     * @property {object} socket web socket for the server
     * @property {string} brickId id of the underlying brick
     */
    static get propTypes() {
        return {
            socket: PropTypes.object.isRequired,
            brickId: PropTypes.string.isRequired,
        };
    }

    static get defaultProps() {
        return {};
    }


    /**
     * layer for previewing, working, temporary content
     * @type {CanvasLayer}
     */
    workingLayer = null;

    /**
     * layer for rendering persistent content
     * @type {CanvasLayer}
     */
    contentLayer = null;
    currentStrokeStyle = new StrokeStyle({color: 'red', thickness: 3});

    constructor(props) {
        super(props);

        const pen = new Pen(this.currentStrokeStyle);
        pen.onPathBegin = this.penHandlePathBegin;
        pen.onPathPoint = this.penHandlePathPoint;
        pen.onPathEnd = this.penHandlePathEnd;

        this.state = {
            activeTool: pen
        }
    }


    penHandlePathBegin = () => {
        this.props.socket.emit("beginPath", {
            strokeStyle: this.currentStrokeStyle.lean(),
            brickId: this.props.brickId,
        });
    };

    penHandlePathPoint = (point) => {
        // TODO buffer multiple points?

        this.props.socket.emit("addPathPoint", {
            points: [point.lean()],
        });
    };

    penHandlePathEnd = (path) => {
        const spline = path.toSpline();

        this.props.socket.emit("endPath", {
            spline: spline.lean(),
        });

        spline.draw(this.contentLayer.context);
    };


    componentDidMount() {

    }


    render() {
        return (
            <LayerWrapper className={this.props.className}>
                {/* Working layer for user tool*/}
                <CanvasLayer
                    innerRef={(ref) => this.contentLayer = ref}
                    resolutionX={1200}
                    resolutionY={800}
                />
                {/* TODO working layers for remote users */}
                {/* layer for persistent content */}
                <CanvasLayer
                    innerRef={(ref) => this.workingLayer = ref}
                    resolutionX={1200}
                    resolutionY={800}
                    tool={this.state.activeTool}
                />
            </LayerWrapper>
        );
    }
}