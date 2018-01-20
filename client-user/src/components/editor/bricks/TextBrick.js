import React from 'react';
import PropTypes from "prop-types";
import styled from 'styled-components';
import {BrickWrapper} from "./Common";
import {TextLayer} from "../layer/TextLayer";


export class TextBrick extends React.Component {
    /**
     * propTypes
     * @property {number} width width as css unit cm, e.g. 17 => "17cm"
     * @property {number} height height as css unit px, e.g. 100 => "100px"
     */
    static get propTypes() {
        return {
            widthCm: PropTypes.number.isRequired,
            heightPx: PropTypes.number.isRequired,
        };
    }

    static get defaultProps() {
        return {};
    }


    render() {
        return (
            <BrickWrapper
                innerRef={ref => this.wrapperRef = ref}
                className={this.props.className}
                widthCm={this.props.widthCm}
                heightPx={this.props.heightPx}
                tabIndex="0"
                onClick={() => {
                    this.wrapperRef.focus();
                }}
            >
                <TextLayer

                />
            </BrickWrapper>
        );
    }
}