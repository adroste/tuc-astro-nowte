import React from 'react';
import PropTypes from "prop-types";
import "./DrawLayer.css"
import {Point} from "../../geometry/Point";

export class FinalDrawLayer extends React.Component {
    /**
     * propTypes
     * @property {number} width
     * @property {number} height
     * @property {array} paths array of path objects that should be drawn
     */
    static get propTypes() {
        return {
            width: PropTypes.number.isRequired,
            height: PropTypes.number.isRequired,
            paths: PropTypes.array.isRequired,
        };
    }

    static get defaultProps() {
        return {};
    }

    constructor(props) {
        super(props);
    }

    // variables
    context = null;
    canvas = null;

    componentDidMount() {

        //context.moveTo(0,0);
        //context.lineTo(100,100);
        //context.stroke();

    }

    applyStroke = (stroke) => {
        this.context.strokeStyle = stroke.color;
        this.context.lineWidth = stroke.thickness;
    };

    drawPath = (path) => {
        this.applyStroke(path.stroke);
        let prevPoint = null;
        for(let point of path.points){
            // TODO improve
            if(prevPoint){
                this.context.moveTo(prevPoint.x, prevPoint.y);
                this.context.lineTo(point.x, point.y);
            }
            prevPoint = point;
        }
        this.context.stroke();

        path.cached = true;
    };

    drawPaths = (paths) => {

        for(let path of paths){
            if(!path.cached)
            {
                this.drawPath(path);
            }
        }
    };

    initContext = (canvas) => {
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");
    };

    render() {
        return (
            <div className="size">

                <canvas
                    id="canvas"
                    ref={this.initContext}
                    className="canvas"

                    width={180}
                    height={180}
                />
                {}
                {this.drawPaths(this.props.paths)}
            </div>
        );
    }
}