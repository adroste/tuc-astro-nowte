/**
 * @author Alexander Droste
 * @date 10.01.18
 */

import React from 'react';
import PropTypes from "prop-types";
import styled from 'styled-components';
import {DrawLayer} from "../layer/DrawLayer";


const BrickWrapper = styled.div`
    position: relative;
    width: ${props => props.width};
    height: ${props => props.height};
    overflow: hidden;
    
    &:after { 
        content: '' ; 
        display: block ; 
        position: absolute ; 
        top: 0 ; 
        bottom: 0 ; 
        left: 0 ; 
        right: 0 ; 
        border-radius: 5px ; 
        border: 1px transparent solid; 
        transition: border 0.2s;
        pointer-events: none;
    }
    
    &:hover:after {
        border-color: #ddd;
    }
`;


export class DrawBrick extends React.Component {
    /**
     * propTypes
     * @property {string} width width as css unit, e.g. "17cm"
     * @property {string} height height as css unit, e.g. "17cm"
     */
    static get propTypes() {
        return {
            width: PropTypes.string.isRequired,
            height: PropTypes.string.isRequired
        };
    }

    static get defaultProps() {
        return {};
    }


    render() {
        return (
            <BrickWrapper
                className={this.props.className}
                width={this.props.width}
                height={this.props.height}
            >
                <DrawLayer/>
            </BrickWrapper>
        );
    }
}