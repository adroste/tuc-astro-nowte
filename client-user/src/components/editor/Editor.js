import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {DrawLayer} from "./layer/DrawLayer";
import {StrokeStyle} from "../../drawing/StrokeStyle";
import {Path} from "../../geometry/Path";
import {Pen} from "../../drawing/canvas-tools/Pen";
import {DrawBrick} from "./bricks/DrawBrick";
import {Button, lightGreyRoundedTheme} from "../base/Button";


const Wrapper = styled.div`
    display: block;
    width: 100%;
`;


const PageOuter = styled.div`
    width: 210mm;
    height: 100%;
    background-color: white;
    margin: auto;
    padding-right: 20mm;
    padding-left: 20mm;
    padding-top: 15mm;
    padding-bottom: 10cm; /* scrolling dont stops at last element */
    box-shadow: 0px 0px 15px 0px #ddd;
`;


const PageInner = styled.div`
    /*border: #ddd 1px solid;*/
`;


const AppendBrickButton = styled(Button).attrs({
    center: true,
    large: true,
    theme: lightGreyRoundedTheme,
    children: '+'
})`
    width: 50%;
    margin: 40px 0;
`;


export class Editor extends React.Component {
    /**
     * propTypes
     */
    static get propTypes() {
        return {
            socketUrl: PropTypes.string,
            user: PropTypes.object.isRequired,
        };
    }

    static get defaultProps() {
        return {};
    }


    constructor(props) {
        super(props);
    }


    handleAddBrick = () => {
        alert('pressed');
    };


    render() {
        return (
            <Wrapper className={this.props.className}>
                <PageOuter>
                    <PageInner>
                        This is a fancy editor
                        <DrawBrick width="17cm" height="400px"/>
                        <DrawBrick width="17cm" height="400px"/>
                        <DrawBrick width="17cm" height="400px"/>
                        <AppendBrickButton onClick={this.handleAddBrick}/>
                    </PageInner>
                </PageOuter>
            </Wrapper>
        );
    }
}