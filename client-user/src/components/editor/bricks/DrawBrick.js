/**
 * @author Alexander Droste
 * @date 10.01.18
 */

import React from 'react';
import PropTypes from "prop-types";
import {DrawLayer} from "../layer/DrawLayer";
import {BrickWrapper} from "./Common";


export class DrawBrick extends React.Component {
    /**
     * propTypes
     * @property {number} width width as css px
     * @property {number} height height as css px
     * @property {array} paths temporary user paths that are currently drawn. wrapped with {id: number, path: Path}
     * @property {array} splines finished splines. wrapped with {id: number, spline: Spline}
     *
     * @property {function()} onPathBegin indicates the start of a user drawn path
     * @property {function(Point)} onPathPoint indicates the addition of a new point to the current path
     * @property {function()} onPathEnd indicates that the user finished drawing
     */
    static get propTypes() {
        return {
            width: PropTypes.number.isRequired,
            height: PropTypes.number.isRequired,
            paths: PropTypes.array.isRequired,
            splines: PropTypes.array.isRequired,

            onPathBegin: PropTypes.func.isRequired,
            onPathPoint: PropTypes.func.isRequired,
            onPathEnd: PropTypes.func.isRequired,
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
                width={this.props.width}
                height={this.props.height}
                tabIndex="0"
                onClick={() => {
                    this.wrapperRef.focus();
                    // this.wrapperRef.scrollIntoView({
                    //     behavior: "smooth"
                    // });
                    //const rect = this.wrapperRef.getBoundingClientRect();
                    //alert(rect.top);
                    //window.scrollBy(rect.left / 2, rect.top - (window.innerHeight / 2));
                }}
            >
                <DrawLayer
                    width={this.props.width}
                    height={this.props.height}
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