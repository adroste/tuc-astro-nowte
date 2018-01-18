/**
 * @author Alexander Droste
 * @date 06.01.18
 */

import React from 'react';
import styled from 'styled-components';
import {Canvas} from "../base/Canvas";
import {Pen} from "../../../drawing/canvas-tools/Pen";
import PropTypes from 'prop-types';

const LayerWrapper = styled.div`
    position: relative;
    width: 100%;
    height: 100%
`;


const CanvasLayer = styled(Canvas)`
    position: absolute;
    top: 0;
    left: 0;
`;


export class DrawLayer extends React.Component {
    /**
     * propTypes
     * @property {array} paths temporary user paths that are currently drawn. wrapped with {id: number, path: Path}
     * @property {array} splines finished splines. wrapped with {id: number, spline: Spline}
     *
     * @property {function()} onPathBegin indicates the start of a user drawn path
     * @property {function(Point)} onPathPoint indicates the addition of a new point to the current path
     * @property {function()} onPathEnd indicates that the user finished drawing
     */
    static get propTypes() {
        return {
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


    /**
     * layer for previewing, working, temporary content
     * @type {CanvasLayer}
     */
    workingLayer = null;

    /**
     * layer for rendering persistent content
     * @type {CanvasLayer}
     */
    contentLayer = null;

    constructor(props) {
        super(props);

        const pen = new Pen();
        pen.onPathBegin = this.props.onPathBegin;
        pen.onPathPoint = this.props.onPathPoint;
        pen.onPathEnd = this.props.onPathEnd;

        // path and spline drawing accelerators
        // dictionary with drawn path: key = pathid, value = {drawnSegments: number, path: Path}
        this.drawnPaths = {};

        // array of drawn splines id's: {id: number, spline: Spline}. order = order the splines were added
        this.drawnSplines = [];

        this.state = {
            activeTool: pen
        }
    }


    componentDidMount() {
        this.updatePathAndSpline(this.props.paths, this.props.splines);
    }

    componentWillUpdate(nextProps, nextState) {
        this.updatePathAndSpline(nextProps.paths, nextProps.splines);
    }

    /**
     * draws paths and splines that are not already drawn and erases deleted paths/splines
     */
    updatePathAndSpline = (paths, splines) => {
        this.updatePaths(paths);
        this.updateSplines(splines);
    };

    updatePaths = (paths) => {
        this.removeDeletedPaths(paths);
        this.drawNewPaths(paths);
    };

    removeDeletedPaths = (paths) => {
        const deletedPaths = [];

        for(let drawnPathId of Object.keys(this.drawnPaths)){

            // if id is no longer in paths it was deleted
            // uage of == instead of === because the dictionary converts numbers to a string and drawnPathId has become a string..
            if(!paths.some(path => path.id.toString() === drawnPathId)){
                deletedPaths.push(drawnPathId);
            }
        }

        if(deletedPaths.length === 0)
            return;

        // delete the paths and indicate which paths should be redrawn
        for(let pathId of deletedPaths) {
            const bbox = this.drawnPaths[pathId].path.boundingBox;
            // delete reference to path
            delete this.drawnPaths[pathId];

            if(!bbox)
                return;
            // clear bounding box
            this.workingLayer.context.clearRect(bbox.x1, bbox.y1, bbox.width, bbox.height);

            // determine which paths needed to be redrawn due to the clear rect
            for(let otherPathId of Object.keys(this.drawnPaths)) {
                const otherPath = this.drawnPaths[otherPathId];

                // test if already drawn and boudning boxes overlap
                if(otherPath.drawnSegments !== 0 &&
                    bbox.overlaps(otherPath.path.boundingBox)) {

                    // reset drawn segments to force redraw
                    otherPath.drawnSegments = 0;
                }
            }
        }
    };

    drawNewPaths = (paths) => {
        // every path from this.drawnPaths should be in pahts as well (other ones were deleted)
        for(let path of paths) {
            // search drawn path
            let drawnPath = this.drawnPaths[path.id];
            if(!drawnPath) {
                // insert the new path
                drawnPath = {drawnSegments: 0, path: path.path};
                this.drawnPaths[path.id] = drawnPath;
            }

            // draw the remaining segments
            drawnPath.path.draw(this.workingLayer.context, drawnPath.drawnSegments);
            // indicate which segments were drawn
            drawnPath.drawnSegments = drawnPath.path.points.length - 1;
        }
    };

    updateSplines = (splines) => {
        this.removeDeletedSplines(splines);
        this.drawNewSplines(splines);
    };

    removeDeletedSplines = (splines) => {
        // early out test
        if(this.drawnSplines.length === 0)
            return;
        const lastDrawnIdx = this.drawnSplines.length - 1;
        if(this.drawnSplines.length <= splines.length
        && this.drawnSplines[lastDrawnIdx].id === splines[lastDrawnIdx].id)
            return; // the first part of the list remains unchanged => no deletions


        // splines that were deleted
        const deletedSplines = [];
        // splines that are still available
        const preservedSplines = [];

        // splines should have the same ordering as this.drawnSplines
        // until the point new splines were added.
        // if splines were removed this.drawnSplines should have id's which
        // are not present in splines

        let idxOld = 0;
            for(let idxNew = 0;
            idxOld < this.drawnSplines.length && idxNew < splines.length;
            ++idxOld) {

            // is the id consistent?
            if(this.drawnSplines[idxOld].id === splines[idxNew].id) {
                // the spline is still there
                preservedSplines.push(this.drawnSplines[idxOld]);
                ++idxNew;
            } else {
                // the spline was deleted
                deletedSplines.push(this.drawnSplines[idxOld]);
            }
        }

        // the following splines were deleted (end of splines was reached before end of this.drawnSplines)
        for(; idxOld < this.drawnSplines.length; ++idxOld) {
            deletedSplines.push(this.drawnSplines[idxOld]);
        }

        if(deletedSplines.length === 0)
            return; // nothing was deleted (preserved === this.drawnSplines)

        this.drawnSplines = preservedSplines;
        // clear deleted

        // dictionary of splines that should be redrawn key = splineid, value = spline
        const redrawSplines = {};

        for(let spline of deletedSplines){
            const bbox = spline.spline.boundingBox;

            // clear area
            this.contentLayer.context.clearRect(bbox.x1, bbox.y1, bbox.width, bbox.height);

            // determine splines that needed to be redrawn due to the clear rect
            for(let otherSpline of this.drawnSplines) {
                if(otherSpline.spline.boundingBox.overlaps(bbox)){

                    // redraw this spline. usage of dictionary to prevent redrawing the spline multiple times
                    redrawSplines[otherSpline.id] = otherSpline.spline;
                }
            }
        }

        // redraw some splines
        for(let splineId in redrawSplines) {
            redrawSplines[splineId].draw(this.contentLayer.context);
        }
    };

    drawNewSplines = (splines) => {
        // all splines in this.drawnSplines should be rendered
        // this.drawnSplines and splines should have the same splines until this.drawnSplines.length
        for(let idx = this.drawnSplines.length; idx < splines.length; ++idx){
            const curSpline = splines[idx];

            // draw spline
            curSpline.spline.draw(this.contentLayer.context);

            // add spline to drawnSplines list
            this.drawnSplines.push(curSpline);
        }
    };

    render() {
        return (
            <LayerWrapper className={this.props.className}>
                {/* Working layer for user tool*/}
                <CanvasLayer
                    innerRef={(ref) => this.contentLayer = ref}
                    resolutionX={1200}
                    resolutionY={800}
                />
                {/* layer for persistent content */}
                <CanvasLayer
                    innerRef={(ref) => this.workingLayer = ref}
                    resolutionX={1200}
                    resolutionY={800}
                    tool={this.state.activeTool}
                />
            </LayerWrapper>
        );
    }
}