/**
 * @author Alexander Droste
 * @date 12.01.18
 */


import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {Button} from "../../base/Button";
import { COLOR_CODES } from '../../../Globals';


const ContentWrapper = styled.div`
    
    transform: rotateZ(-45deg);
`;


const greyDropTheme = `
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    width: 45px;
    height: 45px;
    border: 1px solid ${COLOR_CODES.GREY};
    border-radius: 50% 0 50% 50% / 50% 0 50% 50%;
    color: ${COLOR_CODES.GREY};
    transition: color 0.3s, border-color 0.3s;
    transform: rotateZ(+45deg);
    font-size: 28px;
    
    &:hover, 
    &:focus {
        background-color: #fff;
        border-color: ${COLOR_CODES.GREY_DARKER};
        color: ${COLOR_CODES.GREY_DARKER};
    }
`;


export class DropButton extends React.Component {
    /**
     * propTypes
     * @property {string} className used for styling
     * @property {function(event: Object)} onClick callback when button was clicked
     */
    static get propTypes() {
        return {
            className: PropTypes.string,
            onClick: PropTypes.func.isRequired,
        };
    }

    static get defaultProps() {
        return {
        };
    }


    shouldComponentUpdate(nextProps) {
        return this.props.className !== nextProps.className;
    }


    onClickHandler = (e) => {
        this.props.onClick(e);
    };


    render() {
        return (
            <div className={this.props.className}>
                <Button large focusable={false} theme={greyDropTheme} onClick={this.onClickHandler}>
                    <ContentWrapper>
                        +
                    </ContentWrapper>
                </Button>
            </div>
        );
    }
}