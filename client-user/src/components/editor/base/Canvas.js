/**
 * @author Alexander Droste
 * @date 06.01.18
 */

import React from 'react';
import PropTypes from "prop-types";
import styled from 'styled-components';
import {Point} from "../../../geometry/Point";


const CanvasInner = styled.canvas`
    display: block;
    width: 100%;
    height: 100%;
`;


export class Canvas extends React.Component {
    /**
     * propTypes
     * @property {number} resolutionX bitmap resolution in pixel (width)
     * @property {number} resolutionY bitmap resolution in pixel (height)
     * @property {Object} [tool] specific tool that controls canvas
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
     * canvas 2d context
     * @type {Object}
     */
    context = null;

    /**
     * canvas object
     * @type {Object}
     * @private
     */
    _canvas = null;


    componentDidMount() {
        this.context = this._canvas.getContext("2d");

        // pointer-events api
        this._canvas.addEventListener('pointerdown', this._handlePointerDown);
        this._canvas.addEventListener('pointerup', this._handlePointerUp);
        this._canvas.addEventListener('pointermove', this._handlePointerMove);
        this._canvas.addEventListener('pointerleave', this._handlePointerLeave);
    }


    /**
     * Calculates coordinates inside canvas bitmap from mouseEvent
     * @param {Object} event pointer-event
     * @return {Point} coordinates relative to canvas origin, scaled by resolution
     */
    getCanvasCoordinate = (event) => {
        let rect = this._canvas.getBoundingClientRect();
        let scaleX = this._canvas.width / rect.width;
        let scaleY = this._canvas.height / rect.height;

        return new Point(
            Math.round((event.clientX - rect.left) * scaleX),
            Math.round((event.clientY - rect.top) * scaleY)
        );
    };


    _handlePointerDown = (e) => {
        if (this.props.tool && this.props.tool.handlePointerDown)
            this.props.tool.handlePointerDown(e, this);
    };


    _handlePointerUp = (e) => {
        if (this.props.tool && this.props.tool.handlePointerUp)
            this.props.tool.handlePointerUp(e, this);
    };


    _handlePointerMove = (e) => {
        if (this.props.tool && this.props.tool.handlePointerMove)
            this.props.tool.handlePointerMove(e, this);
    };


    _handlePointerLeave = (e) => {
        if (this.props.tool && this.props.tool.handlePointerLeave)
            this.props.tool.handlePointerLeave(e, this);
    };


    render() {
        return (
            <CanvasInner
                className={this.props.className}
                innerRef={(canvas) => this._canvas = canvas }
                width={this.props.resolutionX}
                height={this.props.resolutionY}
            />
        );
    }
}