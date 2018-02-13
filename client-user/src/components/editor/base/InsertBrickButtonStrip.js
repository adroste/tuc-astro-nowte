/**
 * @author Alexander Droste
 * @date 12.01.18
 */


import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { COLOR_CODES } from '../../../Globals';
import { BrickTypesEnum } from '../../../editor/BrickTypesEnum';
import { PopUpBox } from '../../base/PopUpBox';
import { ButtonIcon } from '../../base/ButtonIcon';


const Wrapper = styled.div`
    height: 0;
    position: relative;
    left: 0;
    top: 0;
    right: 0;

    &:after { 
        content: '' ; 
        display: block ; 
        position: absolute;
        height: 1px;
        top: 0; 
        bottom: 0; 
        left: 0; 
        right: 0; 
        background: ${COLOR_CODES.GREY};
        transition: background 0.3s;
        pointer-events: none;
    }
    
    &:hover:after {
        background: ${COLOR_CODES.GREY_DARKER};
    }
`;

const AlignedContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const VertButtonSeparator = styled.div`
    display: inline-block;
    width: 1px;
    height: 25px;
    margin: 0 2.5px;
    background: ${COLOR_CODES.GREY};
`;


export class InsertBrickButtonStrip extends React.Component {
    /**
     * propTypes
     * @property {string} className used for styling
     * @property {function(type: BrickTypesEnum)} onBrickAdd callback when button was clicked to create a brick
     */
    static get propTypes() {
        return {
            className: PropTypes.string,
            onBrickAdd: PropTypes.func.isRequired,
        };
    }

    static get defaultProps() {
        return {
        };
    }


    shouldComponentUpdate(nextProps) {
        return this.props.className !== nextProps.className;
    }


    onClickTextBrickAdd = (e) => {
        this.props.onBrickAdd(BrickTypesEnum.TEXT);
    };


    onClickDrawBrickAdd = (e) => {
        this.props.onBrickAdd(BrickTypesEnum.DRAW);
    };


    render() {
        return (
            <Wrapper 
                className={this.props.className}
            >
                <PopUpBox
                    right
                    active
                    content={
                        <AlignedContainer>
                            <ButtonIcon
                                imgSrc="/img/tools/draw_pen.svg"
                                label="Drawing"
                                onClick={this.onClickDrawBrickAdd}
                            />
                            <VertButtonSeparator/>
                            <ButtonIcon
                                imgSrc="/img/tools/text.svg"
                                label="Text"
                                onClick={this.onClickTextBrickAdd}
                            />
                        </AlignedContainer>
                    }
                >
                </PopUpBox>
            </Wrapper>
        );
    }
}