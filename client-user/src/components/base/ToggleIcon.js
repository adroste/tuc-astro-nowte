import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {COLOR_CODES, COLOR_RGBA} from "../../Globals";
import {ButtonIcon} from './ButtonIcon';


export const topBorderGrowUntoggledTheme = `
    background: none;
    padding: 10px;
    width: 40px;
    height: 40px;
    position: relative;
    border-radius: 0 0 5px 5px;
    transition: background 0.2s;

    &:after { 
        content: '' ; 
        display: block ; 
        position: absolute ; 
        height: 0px;
        top: -2px; 
        left: 0; 
        right: 0; 
        background: rgba(255, 255, 255, 0.5);
        transition: height 0.1s;
        pointer-events: none;
    }
    
    &:hover:after {
        height: 2px;
    }

    &[disabled] {
        background: none;
    }
`;


export const topBorderGrowToggledTheme = `
    ${topBorderGrowUntoggledTheme}
    background: ${COLOR_CODES.GREY_LIGHT};
    
    &:after { 
        height: 4px;
        top: -4px; 
        left: 0; 
        right: 0; 
        background: ${COLOR_CODES.GREY_DARK};
    }

    &:hover:after {
        height: 4px;
    }
`;


export class ToggleIcon extends React.Component {
    /**
     * propTypes
     * @property {string} imgSrc, path to source of icon picture
     * @property {string} label description of icon
     * @property {function(toggled: boolean, event: Object)} onToggle callback when button was clicked
     * @property {boolean} toggled defines toggled status
     * @property {string} [themeUntoggled] theme-template to apply in untoggled state
     * @property {string} [themeToggled] theme-template to apply in toggled state
     */
    static get propTypes() {
        return {
            imgSrc: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            onToggle: PropTypes.func.isRequired,
            toggled: PropTypes.bool.isRequired,
            themeUntoggled: PropTypes.string,
            themeToggled: PropTypes.string
        };
    }

    static get defaultProps() {
        return {
            themeUntoggled: topBorderGrowUntoggledTheme,
            themeToggled: topBorderGrowToggledTheme,
            toggled: true
        };
    }


    get activeTheme() {
        return this.props.toggled ? this.props.themeToggled : this.props.themeUntoggled;
    }


    onClickHandler = (e) => {
        this.props.onToggle(!this.props.toggled, e);
    };


    render() {
        return (
            <ButtonIcon 
                className={this.props.className}
                onClick={this.onClickHandler}
                label={this.props.label}
                imgSrc={this.props.imgSrc}
                theme={this.activeTheme}
            />
        );
    }
}