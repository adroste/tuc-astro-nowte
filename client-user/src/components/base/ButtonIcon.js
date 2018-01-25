import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {COLOR_CODES} from "../../Globals";
import {Button, whiteBorderTheme} from './Button';


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
     * @property {string} [theme] theme-template to apply
     */
    static get propTypes() {
        return {
            imgSrc: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            onClick: PropTypes.func.isRequired,
            theme: PropTypes.string
        };
    }

    static get defaultProps() {
        return {
            theme: whiteBorderTheme
        };
    }


    onClickHandler = (e) => {
        this.props.onClick(e);
    };


    render() {
        return (
            <ButtonFixedSize 
                className={this.props.className}
                onClick={this.onClickHandler}
                theme={this.props.theme}
            >
                <Icon src={this.props.imgSrc} title={this.props.label} alt={this.props.label}/>
            </ButtonFixedSize>
        );
    }
}