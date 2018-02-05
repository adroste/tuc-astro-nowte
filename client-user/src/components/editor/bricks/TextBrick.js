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
     * @property {number} width width as css px
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
            width: PropTypes.number.isRequired,
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


    constructor(props) {
        super(props);
        this.state = {
            height: 0
        };
    }


    handleResize = (boundingRect) => {
        this.setState({
            height: boundingRect.height
        });
    };


    render() {
        return (
            <BrickWrapper
                innerRef={ref => this.wrapperRef = ref}
                className={this.props.className}
                width={this.props.width}
                height={this.state.height}
                tabIndex="0"
                onClick={() => {
                    //this.wrapperRef.focus();
                }}
            >
                <TextLayer
                    onChange={this.props.onTextChange}
                    text={this.props.text}
                    onResize={this.handleResize}
                />
                <FocusableDrawLayer
                    hasFocus={this.props.mayDraw}
                    width={this.props.width}
                    height={this.state.height}
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