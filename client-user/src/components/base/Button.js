import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {COLOR_CODES} from "../../Globals";


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
    margin-top: ${props => props.marginTop ? '10px' : '0'};
    margin-bottom: ${props => props.marginBottom ? '10px' : '0'};
    margin-left: ${props => props.marginLeft ? '10px' : '0'};
    margin-right: ${props => props.marginRight ? '10px' : '0'};
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: ${props => props.large ? '18px' : '14px'};
    user-select: none;
    cursor: pointer;
    
    &:hover, 
    &:focus {
        user-select: none;
        cursor: pointer;
        outline: none;  
    }
    
    &[disabled] {
        cursor: not-allowed;
        color: ${COLOR_CODES.GREY_LIGHT};
        border: 1px dashed ${COLOR_CODES.GREY_LIGHT};
        background: white;
    }  

    ${props => props.theme}
`;


const createBorderTheme = (c1, c2, c3) => {
    return `
        border: 1px solid ${c1};
        border-radius: 5px;
        color: ${c1};
        transition: color 0.2s, border-color 0.2s;
        
        &:hover, 
        &:focus {
            border-color: ${c2};
            color: ${c2};
        }
        
        &:active {
            border-color: ${c3};
            color: ${c3};
        }
    `;
};

export const greenBorderTheme = createBorderTheme(COLOR_CODES.GREY, COLOR_CODES.GREEN, COLOR_CODES.GREEN_DARKER);
export const greyBorderTheme = createBorderTheme(COLOR_CODES.GREY, COLOR_CODES.GREY_DARKER, COLOR_CODES.GREY_DARK);
export const redBorderTheme = createBorderTheme(COLOR_CODES.GREY, COLOR_CODES.RED, COLOR_CODES.RED_DARKER);
export const whiteBorderTheme = createBorderTheme('white', COLOR_CODES.GREY_LIGHT, COLOR_CODES.GREY);



const createFilledTheme = (c1, c2, c3) => {
    return `
        background-color: ${c1};
        border-radius: 5px;
        color: white;
        transition: background-color 0.2s;
        
        &:hover, 
        &:focus {
            background-color: ${c2};
        }
        
        &:active {
            background-color: ${c3};
        }
    `;
};

export const greenFilledTheme = createFilledTheme(COLOR_CODES.GREEN, COLOR_CODES.GREEN_LIGHTER, COLOR_CODES.GREEN_DARKER);
export const redFilledTheme = createFilledTheme(COLOR_CODES.RED, COLOR_CODES.RED_LIGHTER, COLOR_CODES.RED_DARKER);


export const lightGreyRoundedTheme = `
    border: 1px solid ${COLOR_CODES.GREY_LIGHT};
    border-radius: 15px;
    color: ${COLOR_CODES.GREY_LIGHT};
    transition: color 0.2s, border-color 0.2s;
    
    &:hover, 
    &:focus {
        background-color: #fff;
        border-color: ${COLOR_CODES.GREY};
        color: ${COLOR_CODES.GREY};
    }
    
    &:active {
        border-color: ${COLOR_CODES.GREY_DARKER};
        color: ${COLOR_CODES.GREY_DARKER};
    }
`;


export class Button extends React.Component {
    /**
     * propTypes
     * @property {string} className used for styling
     * @property {function(event: Object)} onClick callback when button was clicked
     * @property {boolean} [center=false] if set button will be center inside block
     * @property {boolean} [large=false] if set text size will be bigger
     * @property {string} [theme] theme-template to apply
     * @property {boolean} [focusable=true] determines if button is focusable
     * @property {boolean} [disabled=false] determines if button is disabled
     * @property {boolean} [marginLeft=false] if set button will have left margin
     * @property {boolean} [marginRight=false] if set button will have right margin
     * @property {boolean} [marginTop=false] if set button will have top margin
     * @property {boolean} [marginBottom=false] if set button will have bottom margin
     */
    static get propTypes() {
        return {
            className: PropTypes.string,
            onClick: PropTypes.func.isRequired,
            center: PropTypes.bool,
            large: PropTypes.bool,
            theme: PropTypes.string,
            focusable: PropTypes.bool,
            disabled: PropTypes.bool,
            marginLeft: PropTypes.bool,
            marginRight: PropTypes.bool,
            marginTop: PropTypes.bool,
            marginBottom: PropTypes.bool,
        };
    }

    static get defaultProps() {
        return {
            center: false,
            large: false,
            focusable: true,
            disabled: false,
            marginLeft: false,
            marginRight: false,
            marginTop: false,
            marginBottom: false,
            theme: greenBorderTheme
        };
    }


    shouldComponentUpdate(nextProps) {
        return this.props.className !== nextProps.className
            || this.props.center !== nextProps.center
            || this.props.large !== nextProps.large
            || this.props.theme !== nextProps.theme
            || this.props.focusable !== nextProps.focusable
            || this.props.disabled !== nextProps.disabled
            || this.props.marginLeft !== nextProps.marginLeft
            || this.props.marginRight !== nextProps.marginRight            
            || this.props.marginTop !== nextProps.marginTop
            || this.props.marginBottom !== nextProps.marginBottom;
    }


    onClickHandler = (e) => {
        if (!this.props.disabled)
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
            <Wrapper center={this.props.center}>
                <ButtonInner
                    innerRef={ref => this.ref = ref}
                    className={this.props.className}
                    large={this.props.large}
                    theme={this.props.theme}
                    marginTop={this.props.marginTop}
                    marginBottom={this.props.marginBottom}
                    marginLeft={this.props.marginLeft}
                    marginRight={this.props.marginRight}
                    onClick={this.onClickHandler}
                    onKeyPress={this.handleKeyPress}
                    tabIndex={this.props.focusable ? "0" : undefined}
                    disabled={this.props.disabled}
                >
                    {this.props.children}
                </ButtonInner>
            </Wrapper>
        );
    }
}