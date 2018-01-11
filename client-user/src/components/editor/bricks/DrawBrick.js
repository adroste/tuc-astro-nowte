/**
 * @author Alexander Droste
 * @date 10.01.18
 */

import React from 'react';
import PropTypes from "prop-types";
import styled from 'styled-components';
import {DrawLayer} from "../layer/DrawLayer";


const BrickWrapper = styled.div`
    width: ${props => props.width};
    height: ${props => props.height};
    overflow: hidden;
    border: 1px transparent solid;
    border-radius: 5px;
    transition: border 0.2s;
    
    &:hover {
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