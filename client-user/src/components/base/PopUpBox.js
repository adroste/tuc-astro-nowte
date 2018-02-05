import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { COLOR_CODES } from '../../Globals';


const Wrapper = styled.div`
    position: relative;
    width: 100%;
    height: 100%;

    &:hover, 
    &:focus {
        cursor: pointer;
        outline: none;  
    }
`;


const Box = styled.div`
    position: absolute;
    background: white;
    top: 50%;
    left: calc(100% + 15px);
    transform: translateY(-50%);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px;
    min-width: 30px;
    min-height: 30px;
    white-space: pre;
    background: #FFFFFF;
    border: 1px solid ${COLOR_CODES.GREY};
    border-radius: 5px;
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.2s, visibility 0.2s;    

    ${props => props.active && `
        visibility: visible;
        opacity: 1;
    `}

    &:after 
    {
        position: absolute;
        border-style: solid;
        display: block;
        width: 0;
        z-index: 1;
    }

    &:before 
    {
        position: absolute;
        border-style: solid;
        display: block;
        width: 0;
        z-index: 0;
    }

    ${props => props.left && `
        &:after 
        {
            content: '';            
            border-width: 10px 10px 10px 0;
            border-color: transparent #FFFFFF; 
            margin-top: -10px;
            left: -10px;
            top: 50%;
        }

        &:before 
        {
            content: '';            
            border-width: 10px 10px 10px 0;
            border-color: transparent ${COLOR_CODES.GREY};
            margin-top: -10px;
            left: -11px;
            top: 50%;
        }`
    }

    ${props => props.top && `
        &:after 
        {
            content: '';            
            border-width: 0 10px 10px;
            border-color: #FFFFFF transparent; 
            margin-left: -10px;
            top: -10px;
            left: 50%;
        }

        &:before 
        {
            content: '';            
            border-width: 0 10px 10px;
            border-color: ${COLOR_CODES.GREY} transparent;
            margin-left: -10px;
            top: -11px;
            left: 50%;
        }`
    }
`;


export class PopUpBox extends React.Component {
    /**
     * propTypes
     * @property {object} content content to render in the popup
     * @property {boolean} [active=null] overrides active state
     * @property {boolean} [activeOnClick=true] indicates if popup is toggable by clicking
     * @property {boolean} [activeOnHover=true] indicates whether popup should be displayed while hovering
     */
    static get propTypes() {
        return {
            content: PropTypes.object.isRequired,
            active: PropTypes.bool,
            activeOnClick: PropTypes.bool,
            activeOnHover: PropTypes.bool
        };
    }

    static get defaultProps() {
        return {
            active: null,
            activeOnClick: true,
            activeOnHover: true
        };
    }


    constructor(props) {
        super(props);
        this.state = {
            active: false,
            hovering: false
        }
    }


    handleMouseHover = (hovering) => () => {
        this.setState({
            hovering
        });
    };


    handleClick = () => {
        this.setState((prevState) => ({
            active: !prevState.active
        }));
    };


    handleFocusLoss = () => {
        this.setState({
            active: false
        });
    };


    render() {
        const {active, activeOnClick, activeOnHover} = this.props;
        const onMouseOver = activeOnHover ? this.handleMouseHover(true) : null;
        const onMouseOut = activeOnHover ? this.handleMouseHover(false) : null;
        const onClick = activeOnClick ? this.handleClick : null;
        const onBlur = activeOnClick ? this.handleFocusLoss : null;
        const activeState = active !== null ? active : (this.state.active || this.state.hovering);

        return (
            <Wrapper
                className={this.props.className}
                onMouseOver={onMouseOver}
                onMouseOut={onMouseOut}
                onClick={onClick}
                tabIndex="0"
                onBlur={onBlur}
            >
                {this.props.children}
                <Box
                    left
                    active={activeState}
                >
                    {this.props.content}
                </Box>
            </Wrapper>
        );
    }
}