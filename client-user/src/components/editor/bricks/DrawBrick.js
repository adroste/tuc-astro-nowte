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
`;


export class DrawBrick extends React.Component {
    static get propTypes() {
        return {
            height: PropTypes.string.isRequired,
            width: PropTypes.string
        };
    }

    static get defaultProps() {
        return {
            width: "100%"
        };
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