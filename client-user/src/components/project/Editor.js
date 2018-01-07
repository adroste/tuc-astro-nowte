import React from 'react';
import PropTypes from 'prop-types';
import './Editor.css';
import {DrawLayer} from "../editor/DrawLayer";
import {StrokeStyle} from "../../drawing/StrokeStyle";
import {Path} from "../../drawing/Path";
import {Pen} from "../../drawing/tools/Pen";

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


    /**
     * All paths to render
     * @type {Array<Path>}
     */
    paths = [];

    /**
     * Current path
     * @type {Path}
     */
    currentPath = null;

    /**
     * Stroke styling
     * @type {StrokeStyle}
     */
    strokeStyle = null;


    constructor(props) {
        super(props);

        this.strokeStyle = new StrokeStyle();
        let penTool = new Pen(this.strokeStyle);
        penTool.onPathBegin = this.handleUserPathBegin;
        penTool.onPathEnd = this.handleUserPathEnd;
        penTool.onPathPoint = this.handleUserPathPoint;

        this.state = {
            tool: penTool
        };
    }


    handleUserPathBegin = () => {
        this.currentPath = new Path(this.strokeStyle);
    };


    handleUserPathEnd = () => {
        this.paths.push(this.currentPath);

        let spline = this.currentPath.toSpline();

        if (this.finalDrawLayer)
            //this.finalDrawLayer.drawPath(this.currentPath);
            this.finalDrawLayer.drawSpline(spline);

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
                            resolutionX={1200}
                            resolutionY={400}
                            tool={this.state.tool}
                        />
                        <DrawLayer
                            ref={ref => this.finalDrawLayer = ref}
                            resolutionX={1200}
                            resolutionY={400}
                        />
                    </div>
                </div>
            </div>
        );
    }
}