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
     * @property {string} className used for styling
     * @property {number} resolutionX bitmap resolution in pixel (width)
     * @property {number} resolutionY bitmap resolution in pixel (height)
     * @property {function()} onNeedsRedraw callback if canvas needs a full redraw
     * @property {Object} [tool] specific tool that controls canvas
     */
    static get propTypes() {
        return {
            className: PropTypes.string,
            resolutionX: PropTypes.number.isRequired,
            resolutionY: PropTypes.number.isRequired,
            onNeedsRedraw: PropTypes.func.isRequired,
            tool: PropTypes.object
        };
    }

    static get defaultProps() {
        return {};
    }

    /**
     * canvas object
     * @type {Object}
     * @private
     */
    _canvas = null;


    get context2d() {
        // _context could be defined as empty object (if context gets lost)
        // therefore you must check if api functions (like beginPath) are defined
        return this._canvas.getContext("2d");
    }


    componentDidMount() {
        // pointer-events api
        if (this.props.tool) {
            this._canvas.addEventListener('pointerdown', this._handlePointerDown);
            this._canvas.addEventListener('pointerup', this._handlePointerUp);
            this._canvas.addEventListener('pointermove', this._handlePointerMove);
            this._canvas.addEventListener('pointerleave', this._handlePointerLeave);
            this._canvas.addEventListener('pointerenter', this._handlePointerEnter);
        }
    }


    componentDidUpdate(prevProps) {
        if (this.props.resolutionX !== prevProps.resolutionX || this.props.resolutionY !== prevProps.resolutionY)
            // componentDidUpdate is called before refs are set, to fix this, we wrap the method call in a small timeout
            setTimeout(() => {
                this.props.onNeedsRedraw();
            }, 1);
    }


    shouldComponentUpdate(nextProps) {
        return this.props.className !== nextProps.className
            || this.props.resolutionX !== nextProps.resolutionX
            || this.props.resolutionY !== nextProps.resolutionY;
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
            (event.clientX - rect.left) * scaleX,
            (event.clientY - rect.top) * scaleY
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


    _handlePointerEnter = (e) => {
        if (this.props.tool && this.props.tool.handlePointerEnter)
            this.props.tool.handlePointerEnter(e, this);
    };


    render() {
        // TODO improve focusing (make canvas focusable and listen for focusin to style brick)
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