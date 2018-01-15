import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {COLOR_CODES} from "../../Globals";


const LinkSpan = styled.span`
    text-decoration: underline;
    user-select: none;
    cursor: pointer;
    
    &:hover, 
    &:focus {
        user-select: none;
        cursor: pointer;
        outline: none;  
    }
    
    ${props => props.theme}
`;


export const greenUnderlineTheme = `
    text-decoration: underline;
    color: ${COLOR_CODES.GREEN};
    transition: color 0.2s;
    
    &:hover, 
    &:focus {
        color: ${COLOR_CODES.GREEN_LIGHTER};
    }
    
    &:active {
        color: ${COLOR_CODES.GREEN_DARKER};
    }
`;


export const greenHoverTheme = `
    text-decoration: none;
    color: #000;
    transition: color 0.2s;
    
    &:hover, 
    &:focus {
        color: ${COLOR_CODES.GREEN};
    }
    
    &:active {
        color: ${COLOR_CODES.GREEN_DARKER};
    }
`;


LinkSpan.defaultProps = {
    theme: greenUnderlineTheme
};


/**
 * text that looks like a link and can be clicked
 */
export class Link extends React.Component {
    /**
     * propTypes
     * @property {function(event: Object)} onClick callback when button was clicked
     */
    static get propTypes() {
        return {
            onClick: PropTypes.func.isRequired,
        };
    }

    static get defaultProps() {
        return {};
    }

    onClickHandler = (e) => {
        this.props.onClick(e);
        // TODO improve focusing
        this.ref.blur();
    };

    handleKeyPress = (e) => {
        if(e.key === "Enter" || e.key === " "){
            this.onClickHandler(e);
        }
    };


    render() {
        return (
            <LinkSpan
                className={this.props.className}
                onClick={this.onClickHandler}
                onKeyPress={this.handleKeyPress}
                tabIndex="0"
                theme={this.props.theme}
            >
                {this.props.children}
            </LinkSpan>
        );
    }
}