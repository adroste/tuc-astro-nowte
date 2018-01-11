import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';


const Wrapper = styled.div`
    ${props => props.center ? `
    display: block;
    text-align: center;
    ` : `
    display: inline-block;
    `};
    
`;


const ButtonInner = styled.div`
    background-color: white;
    color: black;
    padding: 5px 15px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: ${props => props.large ? '20px' : '16px'};
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


ButtonInner.defaultProps = {
    theme: `
        border: 2px solid #4CAF50;
        
        &:hover, 
        &:focus {
            background-color: #4CAF50;
            color: white;
        }
        
        &:active {
            background-color: white;
            color: black;
        }
    `
};


export const lightGreyRoundedTheme = `
    border: 1px solid #ccc;
    border-radius: 15px;
    color: #ccc;
    transition: color 0.3s;
    transition: border-color 0.3s;
    
    &:hover, 
    &:focus {
        background-color: #fff;
        border-color: #777;
        color: #777;
    }
`;





export class Button extends React.Component {
    /**
     * propTypes
     * @property {function()} onClick callback when button was clicked
     * @property {boolean} center if set button will be center inside block
     * @property {boolean} large if set text size will be bigger
     * @property {Object} theme theme-objects to apply
     */
    static get propTypes() {
        return {
            onClick: PropTypes.func.isRequired,
            center: PropTypes.bool,
            large: PropTypes.bool,
            theme: PropTypes.object
        };
    }

    static get defaultProps() {
        return {

        };
    }

    onClickHandler = (e) => {
        this.props.onClick();
        e.preventDefault();
    };

    handleKeyPress = (e) => {
        if(e.key === "Enter" || e.key === " "){
            this.onClickHandler(e);
        }
    };

    render() {
        return (
            <Wrapper center={this.props.center}>
                <ButtonInner
                    className={this.props.className}
                    large={this.props.large}
                    theme={this.props.theme}
                    onClick={this.onClickHandler}
                    onKeyPress={this.handleKeyPress}
                    tabIndex="0"
                >
                    {this.props.children}
                </ButtonInner>
            </Wrapper>
        );
    }
}