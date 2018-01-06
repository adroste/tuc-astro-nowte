import React from 'react';
import PropTypes from 'prop-types';
import './Editor.css';
import {DrawLayer} from "../editor/DrawLayer";
import {Stroke} from "../../drawing/Stroke";
import {FinalDrawLayer} from "../editor/FinalDrawLayer";
import {Path} from "../../drawing/Path";

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

        this.state = {
            paths: [],
        };
    }

    currentStroke = new Stroke("#F0F000", 2);
    // path that is currently drawn
    currentPath = null;

    handleUserPathBegin = () => {
        // create empty path
        this.currentPath = new Path(this.currentStroke);
    };

    handleUserPathEnd = () =>{
        // TODO fix this
        let paths = this.state.paths;
        paths.push(this.currentPath);

        this.setState({
            paths: paths,
        });

        // reset path
        this.currentPath = null;
    };

    handleUserPathPoint = (point) => {
        this.currentPath.addPoint(point);
    };

    render() {
        return (
            <div className="wrapper">
                <div className="outer-page">
                    <div className="inner-page">
                        This is a fancy editor
                        <DrawLayer
                            width={200}
                            height={200}
                            stroke={this.currentStroke}
                            onPathBegin={this.handleUserPathBegin}
                            onPathPoint={this.handleUserPathPoint}
                            onPathEnd={this.handleUserPathEnd}
                        />

                        <FinalDrawLayer
                            width={200}
                            height={200}
                            paths={this.state.paths}
                            ref={(layer) => this.finalDrawLayer = layer}
                        />
                    </div>
                </div>
            </div>
        );
    }
}