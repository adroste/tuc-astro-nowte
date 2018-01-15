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
    margin-top: 10px;
    margin-bottom: 10px;
    margin-left: ${props => props.marginLeft ? '10px' : '0'};
    margin-right: ${props => props.marginRight ? '10px' : '0'};
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: ${props => props.large ? '20px' : '14px'};
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
        border: 1px solid #4CAF50;
        border-radius: 5px;
        color: #222;
        
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
    transition: color 0.3s, border-color 0.3s;
    
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
     * @property {boolean} [center=false] if set button will be center inside block
     * @property {boolean} [large=false] if set text size will be bigger
     * @property {string} [theme] theme-template to apply
     * @property {boolean} [focusable=true] determines if button is focusable
     * @property {boolean} [marginLeft=false] if set button will have left margin
     * @property {boolean} [marginRight=false] if set button will have right margin
     */
    static get propTypes() {
        return {
            onClick: PropTypes.func.isRequired,
            center: PropTypes.bool,
            large: PropTypes.bool,
            theme: PropTypes.string,
            focusable: PropTypes.bool,
            marginLeft: PropTypes.bool,
            marginRight: PropTypes.bool,
        };
    }

    static get defaultProps() {
        return {
            center: false,
            large: false,
            focusable: true,
            marginLeft: false,
            marginRight: false,
        };
    }

    onClickHandler = (e) => {
        this.props.onClick();
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
            <Wrapper center={this.props.center}>
                <ButtonInner
                    innerRef={ref => this.ref = ref}
                    className={this.props.className}
                    large={this.props.large}
                    theme={this.props.theme}
                    marginLeft={this.props.marginLeft}
                    marginRight={this.props.marginRight}
                    onClick={this.onClickHandler}
                    onKeyPress={this.handleKeyPress}
                    tabIndex={this.props.focusable ? "0" : undefined}
                >
                    {this.props.children}
                </ButtonInner>
            </Wrapper>
        );
    }
}