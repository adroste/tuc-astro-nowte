import React from 'react';
import PropTypes from "prop-types";
import styled from 'styled-components';
import {BrickWrapper} from "./Common";
import {TextLayer} from "../layer/TextLayer";
import {DrawLayer} from "../layer/DrawLayer";


const FocusableDrawLayer = styled(DrawLayer)`
    ${props => !props.hasFocus && 'pointer-events: none;'}
`;



export class TextBrick extends React.Component {
    /**
     * propTypes
     * @property {number} widthCm width as css unit cm, e.g. 17 => "17cm"
     * @property {array} paths temporary user paths that are currently drawn. wrapped with {id: number, path: Path}
     * @property {array} splines finished splines. wrapped with {id: number, spline: Spline}
     * @property {string} text text for the text editor
     *
     * @property {function()} onPathBegin indicates the start of a user drawn path
     * @property {function(Point)} onPathPoint indicates the addition of a new point to the current path
     * @property {function()} onPathEnd indicates that the user finished drawing
     *
     * @property {function(string)} onTextChange indicates that the text was changed by the user
     * @property {bool} mayDraw indicates if the draw layer should have focus
     */
    static get propTypes() {
        return {
            widthCm: PropTypes.number.isRequired,
            paths: PropTypes.array.isRequired,
            splines: PropTypes.array.isRequired,
            text: PropTypes.string.isRequired,

            onPathBegin: PropTypes.func.isRequired,
            onPathPoint: PropTypes.func.isRequired,
            onPathEnd: PropTypes.func.isRequired,

            onTextChange: PropTypes.func.isRequired,
            mayDraw: PropTypes.bool.isRequired,
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
                tabIndex="0"
                onClick={() => {
                    //this.wrapperRef.focus();
                }}
            >
                <TextLayer
                    onChange={this.props.onTextChange}
                    text={this.props.text}
                />
                <FocusableDrawLayer
                    hasFocus={this.props.mayDraw}
                    paths={this.props.paths}
                    splines={this.props.splines}

                    onPathBegin={this.props.onPathBegin}
                    onPathPoint={this.props.onPathPoint}
                    onPathEnd={this.props.onPathEnd}
                />

            </BrickWrapper>
        );
    }
}