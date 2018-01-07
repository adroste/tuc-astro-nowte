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
     * @property {number} resolutionX bitmap resolution in pixel (width)
     * @property {number} resolutionY bitmap resolution in pixel (height)
     * @property {Object} tool specific tool
     */
    static get propTypes() {
        return {
            resolutionX: PropTypes.number.isRequired,
            resolutionY: PropTypes.number.isRequired,
            tool: PropTypes.object
        };
    }

    static get defaultProps() {
        return {};
    }


    /**
     * canvas object
     * @type {Object}
     */
    canvas = null;

    /**
     * canvas 2d context
     * @type {Object}
     */
    context = null;


    componentDidMount() {
        this.context = this.canvas.getContext("2d");

        // pointer-events api
        this.canvas.addEventListener('pointerdown', this._handlePointerDown);
        this.canvas.addEventListener('pointerup', this._handlePointerUp);
        this.canvas.addEventListener('pointermove', this._handlePointerMove);
        this.canvas.addEventListener('pointerleave', this._handlePointerLeave);
    }


    /**
     * Calculates coordinates inside canvas bitmap from mouseEvent
     * @param {Object} event pointer-event
     * @return {Point} coordinates relative to canvas origin, scaled by resolution
     */
    getCanvasCoordinate = (event) => {
        let rect = this.canvas.getBoundingClientRect();
        let scaleX = this.canvas.width / rect.width;
        let scaleY = this.canvas.height / rect.height;

        return new Point(
            Math.round((event.clientX - rect.left) * scaleX),
            Math.round((event.clientY - rect.top) * scaleY)
        );
    };


    /**
     * Draws supplied path to canvas
     * @param {Path} path path to draw (needs to be valid)
     */
    drawPath = (path) => {
        if (!path.isValid())
            throw new Error('invalid paths can not be drawn');

        this.context.beginPath();
        path.strokeStyle.apply(this.context);

        // start point
        this.context.moveTo(path.points[0].x, path.points[0].y);

        for(let i = 1; i < path.points.length; i++) {
            this.context.lineTo(path.points[i].x, path.points[i].y);
        }
        this.context.stroke();
    };


    /**
     * Draw supplied spline to canvas
     * @param {Spline} spline spline to draw
     */
    drawSpline = (spline) => {
        // TODO check if spline is valid

        this.context.beginPath();
        spline.strokeStyle.apply(this.context);

        // start point
        this.context.moveTo(spline.spoints[0].point.x, spline.spoints[0].point.y);

        for(let i = 1; i < spline.spoints.length; i++) {
            // draw cubic spline
            const c1 = spline.spoints[i - 1].getOutPoint();
            const c2 = spline.spoints[i].getInPoint();
            this.context.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, spline.spoints[i].point.x, spline.spoints[i].point.y);
        }
        this.context.stroke();
    };


    _handlePointerDown = (e) => {
        if (this.props.tool && this.props.tool.handlePointerDown)
            this.props.tool.handlePointerDown(this, e);
        e.preventDefault();
    };


    _handlePointerUp = (e) => {
        if (this.props.tool && this.props.tool.handlePointerUp)
            this.props.tool.handlePointerUp(this, e);
        e.preventDefault();
    };


    _handlePointerMove = (e) => {
        if (this.props.tool && this.props.tool.handlePointerMove)
            this.props.tool.handlePointerMove(this, e);
        e.preventDefault();
    };


    _handlePointerLeave = (e) => {
        if (this.props.tool && this.props.tool.handlePointerLeave)
            this.props.tool.handlePointerLeave(this, e);
        e.preventDefault();
    };


    render() {
        return (
            <div className="size">
                <canvas
                    id="canvas"
                    ref={(canvas) => this.canvas = canvas }
                    className="canvas"
                    width={this.props.resolutionX}
                    height={this.props.resolutionY}
                />
            </div>
        );
    }
}