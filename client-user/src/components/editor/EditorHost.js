/**
 * @author Alexander Droste
 * @date 13.01.18
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import lookupSocket from 'socket.io-client';
import {Editor} from "./Editor";
import {ConnectionStateEnum} from "../../editor/ConnectionStateEnum";
import {Path} from "../../geometry/Path";
import {Spline} from "../../geometry/Spline";
import {StrokeStyle} from "../../editor/drawing/StrokeStyle";
import {Point} from "../../geometry/Point";
import {Capsule} from "../../geometry/Capsule";
import {BrickTypesEnum} from "../../editor/BrickTypesEnum";

const Host = styled.div`
    position: relative;
    width: 100%;
`;


const Overlay = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    z-index: 9999;
    font-size: 20px;    
`;


export class EditorHost extends React.Component {
    /**
     * propTypes
     */
    static get propTypes() {
        return {
            documentId: PropTypes.string.isRequired,
            user: PropTypes.object.isRequired,
            onStatsChange: PropTypes.func
        };
    }

    static get defaultProps() {
        return {};
    }


    /**
     * socket.io connection
     * @type {Object|null}
     * @private
     */
    _socket = null;


    /**
     * stats object
     * @type {Object}
     * @private
     */
    _stats = {};

    constructor(props) {
        super(props);

        this._bricks = [];
        this.state = {
            initialConnection: true,
            connectionState: ConnectionStateEnum.DISCONNECTED,
            bricks: [],
        };


        this.setStats({
            connectionRTT: -1
        });


        // create socket & bind listeners
        this._socket = lookupSocket('http://localhost:3210');
        this._socket.on('connect', this.handleConnect);
        this._socket.on('disconnect', this.handleDisconnect);
        this._socket.on('reconnecting', this.handleReconnecting);
        this._socket.on('echo', this.handleEcho);
        this._socket.on('initialize', this.handleInitialize);

        this._socket.on('insertedBrick', this.handleInsertedBrick);
        this._socket.on('removedBrick', this.handleRemovedBrickReceived);
        this._socket.on('movedBrick', this.handleMovedBrickReceived);

        this._socket.on('beginPath', this.handleBeginPathReceive);
        this._socket.on('addPathPoint', this.handleAddPathPointReceive);
        this._socket.on('endPath', this.handleEndPathReceive);
        this._socket.on('eraseSplines', this.handleEraseSplinesReceive);

        this._socket.on('textInserted', this.handleTextInsertReceive);
    }

    componentDidMount() {
        this.latencyInterval = setInterval(() => {
            if (this.state.connectionState !== ConnectionStateEnum.CONNECTED)
                return;
            this._socket.emit('echo', { timestamp: Date.now() });
        }, 5000);
    }

    componentWillUnmount() {
        clearInterval(this.latencyInterval);
    }

    getBrick = (brickId) => {
        // TODO user a better data structure
        for(let row of this._bricks){
            for(let brick of row){
                if(brick.id === brickId)
                    return brick;
            }
        }
        return null;
    };

    /**
     * returns the brick layout position
     * @param brickId
     * @return {{heightIndex: number, columnIndex: number}}
     */
    getBrickPosition = (brickId) => {
        let columnIndex = -1;
        let heightIndex = this._bricks.findIndex((row) => {
            return (columnIndex = row.findIndex((brick) => {
                return brick.id === brickId;
            })) !== -1;
        });
        return {heightIndex, columnIndex};
    };

    removeBrick = (brickId) => {
        const pos = this.getBrickPosition(brickId);
        if(pos.columnIndex === -1 || pos.heightIndex === -1)
            return;

        if(this._bricks[pos.heightIndex].length === 1){
            // remove entire row
            this._bricks = this._bricks.splice(pos.heightIndex, 1);
        } else {
            // remove column
            this._bricks[pos.heightIndex] =
                this._bricks[pos.heightIndex].splice(pos.columnIndex, 1);
        }

        this.setState({
            bricks: this._bricks,
        });
    };

    setStats = (stats) => {
        const prevStats = JSON.stringify(this._stats);
        Object.assign(this._stats, stats);
        if (this.props.onStatsChange && prevStats !== JSON.stringify(this._stats))
            this.props.onStatsChange(this._stats);
    };

    handleConnect = () => {
        this.setState({
            initialConnection: false,
            connectionState: ConnectionStateEnum.CONNECTED
        });
        console.log('connect');

        // send user information
        this._socket.emit('authentication', {
            userId: this.props.user.userId,
        });
    };

    handleDisconnect = () => {
        this.setState({
            connectionState: ConnectionStateEnum.DISCONNECTED
        });
        console.log('disconnect');
    };

    handleReconnecting = () => {
        this.setState({
            connectionState: ConnectionStateEnum.PENDING
        });
        console.log('reconnecting');
    };

    handleEcho = (data) => {
        if (data.hasOwnProperty('timestamp'))
            this.setStats({
                connectionRTT: Date.now() - data.timestamp
            });
    };

    handleInitialize = (data) => {
        // TODO add error handling
        this._bricks = [];
        if(data.bricks){
            for(let row of data.bricks){
                let curRow = [];
                for(let brick of row) {
                    const paths = [];
                    if(brick.paths){
                        for(let path of brick.paths){
                            paths.push({
                                id: ++this._localPathId,
                                path: Path.fromObject(path)
                            });
                        }
                    }

                    const splines = [];
                    if(brick.splines){
                        for(let spline of brick.splines){
                            splines.push({
                                id: spline.id,
                                spline: Spline.fromObject(spline.spline),
                            });
                        }
                    }

                    const newBrick = {
                        id: brick.id,
                        type: brick.type,
                        paths: paths,
                        splines: splines,
                    };

                    if(brick.type === BrickTypesEnum.TEXT){
                        newBrick.text = brick.text;
                    }

                    curRow.push(newBrick);
                }
                this._bricks.push(curRow);
            }
        }

        // schedule redraw
        this.setState({
            bricks: this._bricks,
        })
    };


    handleAddBrickClick = (brickType, heightIndex, columnIndex) => {
        this._socket.emit("insertBrick", {
            brickType,
            heightIndex,
            // TODO add column index handling
        });
    };


    handleInsertedBrick = (data) => {
        const heightIndex = data.heightIndex;
        const brickId = data.brickId;
        const brickType = data.brickType;

        // TODO type checking
        const newBrick =  {
            type: brickType,
            id: brickId,
            paths: [],
            splines: [],
        };
        if(brickType === BrickTypesEnum.TEXT){
            newBrick.text = "";
        }

        let bricks = this._bricks;

        // TODO add proper column index handling
        /*if(columnIndex){
            // insert next to another container
            bricks[heightIndex].splice(columnIndex, 0, newBrick);
        }
        else*/
        // insert at height index
        bricks.splice(heightIndex, 0, [newBrick]);


        this.forceUpdate();
    };

    handleRemoveBrickClick = (brickId) => {
        this._socket.emit("removeBrick", {
            brickId,
        });
    };

    handleRemovedBrickReceived = (data) => {
        const brickId = data.brickId;

        this.removeBrick(brickId);
    };

    handleMoveBrickClick = (brickId, heightIndex) => {
          this._socket.emit("moveBrick", {
              brickId,
              heightIndex,
              // TODO add column index
          });
    };

    handleMovedBrickReceived = (data) => {
        const brickId = data.brickId;
        let heightIndex = data.heightIndex;
        //const columnIndex = data.columnIndex;
        // TODO add column Index handling
        const pos = this.getBrickPosition(brickId);

        // get current row
        let row = this._bricks[pos.heightIndex];
        // remove old entry
        this._bricks = this._bricks.splice(pos.heightIndex, 1);
        if(heightIndex > pos.heightIndex)
            heightIndex--;
        // insert new entry
        this._bricks = this._bricks.splice(heightIndex, 0, row);

        this.setState({
            bricks: this._bricks,
        });
    };

    handleBeginPathReceive = (data) => {
        // update state
        const brickId = data.brickId;
        const userId = data.userId;
        const userUniqueId = data.userUniqueId;
        const strokeStyle = data.strokeStyle;
        // TODO check data types

        // obtain brick
        const brick = this.getBrick(brickId);
        if(!brick)
            return;

        brick.paths.push({
            id: ++this._localPathId,
            path: new Path(StrokeStyle.fromObject(strokeStyle)),
            userId: userId,
            userUniqueId: userUniqueId,
        });
    };

    _localPathId = 0;
    _currentUserPathId = null;
    handlePathBegin = (brick, strokeStyle) => {


        // update state
        brick.paths.push({
            id: ++this._localPathId,
            path: new Path(strokeStyle),
        });
        // remember that out user is drawing this line
        this._currentUserPathId = this._localPathId;

        // redrawing not required yet
        this._socket.emit("beginPath", {
            strokeStyle: strokeStyle.lean(),
            brickId: brick.id,
        });
    };

    handleAddPathPointReceive = (data) => {
        const brickId = data.brickId;
        const userUniqueId = data.userUniqueId;
        const points = data.points;

        // obtain brick
        const brick = this.getBrick(brickId);
        if(!brick)
            return;

        // get path
        let curPath = brick.paths.find(e => e.userUniqueId === userUniqueId);
        if(!curPath)
            return;

        for(let point of points){
            curPath.path.addPoint(Point.fromObject(point));
        }

        this.forceUpdate();
    };

    handlePathPoint = (brick, point) => {
        // add point to current path
        let curPath = brick.paths.find(e => e.id === this._currentUserPathId);
        if(!curPath)
            return;

        curPath.path.addPoint(point);

        // TODO send multiple points?
        this._socket.emit("addPathPoint", {
            points: [point.lean()],
        });

        // redraw
        this.forceUpdate();
    };

    handleEndPathReceive = (data) => {
        const brickId = data.brickId;
        const userUniqueId = data.userUniqueId;
        const spline = data.spline;
        const splineId = data.id;

        // obtain brick
        const brick = this.getBrick(brickId);
        if(!brick)
            return;

        // remove the path
        let idx = brick.paths.findIndex(e => e.userUniqueId === userUniqueId);
        if(idx >= 0){
            brick.paths.splice(idx, 1);
        }

        const convertedSpline = Spline.fromObject(spline);
        if(!convertedSpline)
            return;

        brick.splines.push({
            id: splineId,
            spline: convertedSpline,
        });

        this.forceUpdate();
    };

    handlePathEnd = (brick) => {
        // generate the spline
        let idx = brick.paths.findIndex(e => e.id === this._currentUserPathId);
        if(idx < 0)
            return;

        this._currentUserPathId = null;
        const spline = brick.paths[idx].path.toSpline();

        // remove path
        brick.paths.splice(idx, 1);

        if(!spline)
            return;

        // TODO @alex replace with unique id
        const splineId = Date.now().toString();

        this._socket.emit("endPath", {
            spline: spline.lean(),
            id: splineId,
        });

        // add spline
        // TODO generate unique spline id's
        brick.splines.push({
            id: splineId,
            spline: spline,
        });

        // force rerender
        this.forceUpdate();
    };

    handleEraseSplinesReceive = (data) => {
        const brickId = data.brickId;
        const ids = data.ids;

        // make ids to a dictionary for faster access
        const idDict = {};
        for(let id of ids){
            idDict[id] = true;
        }

        // obtain brick
        const brick = this.getBrick(brickId);
        if(!brick)
            return;

        brick.splines = brick.splines.filter((value => {
            return idDict[value.id] !== true;
        }));

        this.forceUpdate();
    };

    handleErase = (brick, point1, point2, thickness) => {
        const capsule = new Capsule(point1, point2, thickness / 2.0);

        // ids of the removed splines
        const removedSplines = [];

        // test intersection with other splines
        const prevLength = brick.splines.length;
        brick.splines = brick.splines.filter((value) => {
            if(!capsule.overlaps(value.spline))
                return true;
            // add to removed list
            removedSplines.push(value.id);
            return false;
        });

        if(prevLength !== brick.splines.length){
            // send removed list
            this._socket.emit('eraseSplines', {
                brickId: brick.id,
                ids: removedSplines,
            });

            this.forceUpdate();
        }
    };

    handleTextInsertReceive = (data) => {
        const brickId = data.brickId;
        const changes = data.changes;

        // obtain brick
        const brick = this.getBrick(brickId);
        if(!brick)
            return;

        // apply changes to the brick text
        let newText = "";
        let oldIdx = 0;
        for(let op of changes){
            if(op.r !== undefined) {
                // retain
                newText = newText + brick.text.substr(oldIdx, op.r);
                oldIdx += op.r;
            }
            else if(op.d !== undefined){
                // delete
                oldIdx += op.r;
            } else if (op.i !== undefined){
                // insert
                newText = newText + op.i;
            }
        }

        if(oldIdx < brick.text.length){
            // append remaining
            newText = newText + brick.text.substr(oldIdx);
        }

        // set new text
        brick.text = newText;

        this.forceUpdate();
    };

    handleTextChange = (brick, text) => {
        // use the text as it is
        if(brick.type !== BrickTypesEnum.TEXT){
            alert("wrong brick?");
        }

        // send
        // TODO make proper diff
        let ops = [];
        // delete the old text
        ops.push({'d': brick.text.length});
        // insert the new text
        ops.push({'i': text});

        // transmit
        this._socket.emit('textInsert', {
            brickId: brick.id,
            changes: ops,
        });

        // set local properties
        brick.text = text;

        this.forceUpdate();

    };

    render() {
        return (
            <Host>
                {this.state.connectionState !== ConnectionStateEnum.CONNECTED &&
                <Overlay>
                    Connecting...
                </Overlay>}
                {!this.state.initialConnection &&
                <Editor
                    user={this.props.user}
                    bricks={this.state.bricks}

                    onBrickAdd={this.handleAddBrickClick}
                    onBrickRemove={this.handleRemoveBrickClick}
                    onBrickMove={this.handleMoveBrickClick}

                    onPathBegin={this.handlePathBegin}
                    onPathPoint={this.handlePathPoint}
                    onPathEnd={this.handlePathEnd}

                    onErase={this.handleErase}

                    onTextChange={this.handleTextChange}
                />}
            </Host>
        );
    }
}