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
    width: ${props => props.widthCm}cm;
    height: ${props => props.heightPx}px;
    overflow: hidden;
    
    &:focus {
        outline: none;
    }
    
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
    
    &:focus:after {
        border-color: #999;
        outline: none;
    }
`;


export class DrawBrick extends React.Component {
    /**
     * propTypes
     * @property {number} width width as css unit cm, e.g. 17 => "17cm"
     * @property {number} height height as css unit px, e.g. 100 => "100px"
     */
    static get propTypes() {
        return {
            widthCm: PropTypes.number.isRequired,
            heightPx: PropTypes.number.isRequired
        };
    }

    static get defaultProps() {
        return {};
    }


    render() {
        return (
            <BrickWrapper
                innerRef={ref => this.wrapperRef = ref}
                className={this.props.className}
                widthCm={this.props.widthCm}
                heightPx={this.props.heightPx}
                tabIndex="0"
                onClick={() => {
                    this.wrapperRef.focus();
                    this.wrapperRef.scrollIntoView({
                        behavior: "smooth"
                    });
                }}
            >
                <DrawLayer/>
            </BrickWrapper>
        );
    }
}