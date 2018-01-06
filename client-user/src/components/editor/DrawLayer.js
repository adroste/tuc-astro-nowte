/**
 * @author Alexander Droste
 * @date 06.01.18
 */

import React from 'react';
import PropTypes from "prop-types";
import "./DrawLayer.css"
import {Point} from "../../geometry/Point";

export class DrawLayer extends React.Component {
    /**
     * propTypes
     * @property {number} width
     * @property {number} height
     * @property {object} stroke currently used stroke
     * @property {function()} onPathBegin indicates the start of a new line
     * @property {function(Point)} onPathPoint a new point should be added to the current line
     * @property {function()} onPathEnd the path is finished
     */
    static get propTypes() {
        return {
            width: PropTypes.number.isRequired,
            height: PropTypes.number.isRequired,
            stroke: PropTypes.object.isRequired,
            onPathBegin: PropTypes.func.isRequired,
            onPathPoint: PropTypes.func.isRequired,
            onPathEnd: PropTypes.func.isRequired,
        };
    }

    static get defaultProps() {
        return {};
    }

    // variables
    lastPoint = null;
    context = null;
    canvas = null;

    componentDidMount() {
        this.context = this.canvas.getContext("2d");
        //context.moveTo(0,0);
        //context.lineTo(100,100);
        //context.stroke();


    }

    /**
     * @param mouseEvent event with pageX and pageY
     * @return {Point} coordinates relative to canvas origin
     */
    getMouseCoordinate = (mouseEvent) => {
        return new Point(
            mouseEvent.pageX - this.canvas.offsetLeft,
            mouseEvent.pageY - this.canvas.offsetTop
        );
    };

    applyStroke = (stroke) => {
        this.context.strokeStyle = stroke.color;
        this.context.lineWidth = stroke.thickness;
    };

    handleMouseDown = (e) => {
        const mouse = this.getMouseCoordinate(e);

        // draw a pixel
        this.applyStroke(this.props.stroke);
        this.context.rect(mouse.x, mouse.y, 1, 1);
        this.context.stroke();

        this.lastPoint = mouse;

        this.props.onPathBegin();
        this.props.onPathPoint(mouse);
    };

    handleMouseUp = (e) => {
        if(this.lastPoint === null)
            return; // line already finished
        //const mouse = this.getMouseCoordinate(e);

        this.props.onPathEnd();
        // stop drawing
        this.lastPoint = null;
    };

    handleMouseMove = (e) => {
        // drawing not required
        if(this.lastPoint == null)
            return;

        const mouse = this.getMouseCoordinate(e);

        // draw line between points
        this.applyStroke(this.props.stroke);
        this.context.moveTo(this.lastPoint.x, this.lastPoint.y);
        this.context.lineTo(mouse.x, mouse.y);
        this.context.stroke();


        this.lastPoint = mouse;
        this.props.onPathPoint(mouse);
    };

    handleMouseLeave = (e) => {
        if(this.lastPoint === null)
            return; // line already finished

        this.props.onPathEnd();
        this.lastPoint = null;
    };

    render() {
        return (
            <div className="size">

                <canvas
                    id="canvas"
                    ref={(canvas) => this.canvas = canvas }
                    className="canvas"
                    onMouseDown={this.handleMouseDown}
                    onMouseMove={this.handleMouseMove}
                    onMouseUp={this.handleMouseUp}
                    onMouseLeave={this.handleMouseLeave}

                    width={180}
                    height={180}
                />

            </div>
        );
    }
}