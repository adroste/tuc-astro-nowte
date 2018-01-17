/**
 * @author Alexander Droste
 * @date 14.01.18
 */


import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {clamp} from "../../utilities/math";


const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
`;


const Separator = styled.div`
    width: 15px;
    background: #f9f9f9;
    cursor: col-resize;
    position: relative;
    
    &:after {
        content: '...';
        display: block;
        position: absolute;
        font-size: 26px;
        width: 20px;
        top: calc(50% - 10px);
        left: 6px;
        transform: rotate(90deg);
        color: #777;
    }
`;


const DraggableOverlay = styled.div`
    position: absolute;
    width: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    bottom: 0;
    z-index: 10000;
`;


const Container = styled.div`
    flex: ${props => props.width ? '0 1 ' + props.width + 'px' : '1'};
    min-width: 0px;
`;


export class SplitPane extends React.Component {
    /**
     * propTypes
     * @property {function(dx)} onDrag callback for separator dragged with moved distance
     */
    static get propTypes() {
        return {
            defaultSizePxLeft: PropTypes.number.isRequired,
            minSizePxLeft: PropTypes.number,
            maxSizePxLeft: PropTypes.number,
        };
    }

    static get defaultProps() {
        return {
            minSizePxLeft: 0,
            maxSizePxLeft: Number.MAX_SAFE_INTEGER,
        };
    }


    _lastX = null;


    constructor(props) {
        super(props);

        this.state = {
            dragging: false,
            widthLeft: this.props.defaultSizePxLeft
        }
    }


    handleMouseDown = (e) => {
        this._lastX = e.clientX;
        this.setState({dragging: true});
        e.preventDefault();
    };


    handleMouseUp = (e) => {
        this.handleMouseMove(e);
        this._lastX = null;
        this.setState({dragging: false});
        e.preventDefault();
    };


    handleMouseMove = (e) => {
        if (this._lastX === null || !this.state.dragging)
            return;

        const dx = e.clientX - this._lastX;
        this._lastX = e.clientX;
        const newWidthLeft = clamp(this.state.widthLeft + dx, this.props.minSizePxLeft, this.props.maxSizePxLeft);
        this.setState({
            widthLeft: newWidthLeft
        });

        e.preventDefault();
    };

    handleMouseLeave = (e) => {
        this.handleMouseUp(e);
        e.preventDefault();
    };


    render() {
        return (
            <Wrapper className={this.props.className}>
                <Container
                    width={this.state.widthLeft}
                >
                    {this.props.children[0]}
                </Container>
                <Separator
                    onMouseDown={this.handleMouseDown}
                    onMouseUp={this.handleMouseUp}
                    onMouseMove={this.handleMouseMove}
                />
                <Container>
                    {this.props.children[1]}
                </Container>
                {this.state.dragging &&
                <DraggableOverlay
                    onMouseUp={this.handleMouseUp}
                    onMouseMove={this.handleMouseMove}
                    onMouseLeave={this.handleMouseLeave}
                />}
            </Wrapper>
        );
    }
}