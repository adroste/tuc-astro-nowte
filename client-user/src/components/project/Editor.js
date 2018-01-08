import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {DrawLayer} from "../editor/DrawLayer";
import {StrokeStyle} from "../../drawing/StrokeStyle";
import {Path} from "../../geometry/Path";
import {Pen} from "../../drawing/tools/Pen";


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


const LayerStack = styled.div`
    position: relative;
    width: 600px;
    height: 400px;
`;


const DrawLayer600x400 = styled(DrawLayer)`
    position: absolute;
    width: 600px;
    height: 400px;
    z-index: ${props => props.zIndex};
    border: #f00 1px dashed;
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

        this.strokeStyle = new StrokeStyle({
            color: 'yellow',
            thickness: 3
        });
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
        spline.strokeStyle = new StrokeStyle({
            ...spline.strokeStyle.toObject(),
            thickness: 6,
            color: 'red'
        });

        if (this.finalDrawLayer)
            this.finalDrawLayer.drawSpline(spline);

        // reset path
        this.currentPath = null;
    };


    handleUserPathPoint = (point) => {
        this.currentPath.addPoint(point);
    };


    render() {
        return (
            <Wrapper>
                <PageOuter>
                    <PageInner>
                        This is a fancy editor
                        <LayerStack>
                            <DrawLayer600x400
                                resolutionX={1200}
                                resolutionY={800}
                                tool={this.state.tool}
                                zIndex={100}
                            />
                            <DrawLayer600x400
                                innerRef={ref => this.finalDrawLayer = ref}
                                resolutionX={1200}
                                resolutionY={800}
                                zIndex={1}
                            />
                        </LayerStack>
                    </PageInner>
                </PageOuter>
            </Wrapper>
        );
    }
}