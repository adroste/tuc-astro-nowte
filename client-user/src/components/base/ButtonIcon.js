import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {COLOR_CODES} from "../../Globals";
import {Button, whiteBorderTheme} from './Button';
import { PopUpBox } from './PopUpBox';


const ButtonFixedSize = styled(Button)`
    padding: 10px;
    width: 40px;
    height: 40px;
`;


const Icon = styled.img`
    width: 100%;
    height: 100%;
    pointer-events: none;    
`;


export class ButtonIcon extends React.Component {
    /**
     * propTypes
     * @property {string} imgSrc, path to source of icon picture
     * @property {string} label description of icon
     * @property {function(event: Object)} onClick callback when button was clicked     
     * @property {boolean} [disabled=false] determines if button is disabled
     * @property {string} [theme] theme-template to apply
     */
    static get propTypes() {
        return {
            imgSrc: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            onClick: PropTypes.func.isRequired,
            disabled: PropTypes.bool,
            theme: PropTypes.string
        };
    }

    static get defaultProps() {
        return {
            disabled: false,
            theme: whiteBorderTheme
        };
    }


    onClickHandler = (e) => {
        this.props.onClick(e);
    };


    render() {
        const {className, theme, disabled, imgSrc, label} = this.props;

        return (
            <PopUpBox
                inline
                below
                activeOnClick={false}
                content={
                    <span>
                        {label}
                    </span>
                }
            >
                <ButtonFixedSize 
                    className={className}
                    onClick={this.onClickHandler}
                    theme={theme}
                    disabled={disabled}
                >
                    <Icon src={imgSrc} alt={label}/>
                </ButtonFixedSize>
            </PopUpBox>
        );
    }
}