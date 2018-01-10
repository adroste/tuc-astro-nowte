import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {DrawLayer} from "./layer/DrawLayer";
import {StrokeStyle} from "../../drawing/StrokeStyle";
import {Path} from "../../geometry/Path";
import {Pen} from "../../drawing/canvas-tools/Pen";
import {DrawBrick} from "./bricks/DrawBrick";


const Wrapper = styled.div`
    display: block;
    width: 100%;
    min-height: 100vh;
    height: 100%;
    background-color: #8e908c;
`;


const PageOuter = styled.div`
    width: 210mm;
    height: 100%;
    background-color: white;
    margin: auto;
    padding-right: 20mm;
    padding-left: 20mm;
    padding-top: 15mm;
`;


const PageInner = styled.div`
    border: #ddd 1px solid;
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


    render() {
        return (
            <Wrapper>
                <PageOuter>
                    <PageInner>
                        This is a fancy editor
                        <DrawBrick width="17cm" height="400px"/>
                    </PageInner>
                </PageOuter>
            </Wrapper>
        );
    }
}