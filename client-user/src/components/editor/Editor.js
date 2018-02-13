import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {DrawBrick} from "./bricks/DrawBrick";
import {Button, lightGreyRoundedTheme} from "../base/Button";
import {DropButton} from "./base/DropButton";
import {StrokeStyle} from "../../editor/drawing/StrokeStyle";
import {EditorToolsEnum} from "../../editor/EditorToolsEnum";
import {BrickTypesEnum} from "../../editor/BrickTypesEnum";
import {TextBrick} from "./bricks/TextBrick";
import {Tooldock} from "./Tooldock";
import {OverlayCanvas} from './OverlayCanvas';
import {UserSymbols} from './base/UserSymbols';
import {ClientPointers} from './base/ClientPointers';
import throttle from 'lodash/throttle';
import { COLOR_CODES } from '../../Globals';
import { InsertBrickButtonStrip } from './base/InsertBrickButtonStrip';



const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    overflow: scroll;
    scroll-behavior: smooth;
`;


const PageOuter = styled.div`
    width: 210mm; /* TODO do not hardcode format */
    background-color: white;
    margin: auto;
    padding-right: 20mm;
    padding-left: 20mm;
    padding-top: 15mm;
    padding-bottom: 10cm; /* scrolling dont stops at last element */
    box-shadow: 0px 0px 15px 0px #ddd;
    min-height: 100vh;
    position: relative;
`;


const PageInner = styled.div`
    height: 100%;
    /*border: #ddd 1px solid;*/
`;


const AppendBrickButton = styled(Button).attrs({
    large: true,
    theme: lightGreyRoundedTheme
})`
    display: inline-block;
    width: 200px;
    margin: 40px 20px;
`;


const AppendBrickButtonsContainer = styled.div`
    display: flex;
    justify-content: center;
`;


export class Editor extends React.Component {
    /**
     * propTypes
     * @property {array} bricks brick layout [[brick1, brick2], [brick3], ...]. brick1 and brick2 are in the same row. brick3 is in the next row.
     * @property {object} clients other clients that are currently connected (dictionary: key=userUniqueId value={id, name, color})
     * @property {array} magicPaths collaboration paths [{userUniqueId, color, points: {point, alpha}}]
     *
     * @property {function(brickType: BrickTypesEnum, rowIndex: number, columnIndex: number)} onBrickAdd requests brick creation.
     *           columnIndex = undefined => use the whole row. columnIndex = 0 => insert as left brick. columnIndex = 1 => insert as right brick.
     * @property {function(brickId: number)} onBrickRemove deletes the brick
     * @property {function(brickId: number, heightIndex)} onBrickMove changes the height of the brick to heightIndex
     *
     * @property {function(brick, strokeStyle)} onPathBegin indicates the start of a user drawn path. brick is the reference to the brick which was passed in this.props.bricks
     * @property {function(brick, Point)} onPathPoint indicates the addition of a new point to the current path
     * @property {function(brick)} onPathEnd indicates that the user finished drawing
     *
     * @property {function(brick, point, point, eraserThickness)} onErase indicates that all splines between the two points should be erase with respect to the eraser thickness
     *
     * @property {function(brick, text)} onTextChange indicates that the text in a text brick has changed
     *
     * @property {function()} onMagicBegin indicates the start of a user drawn magic path.
     * @property {function(Point)} onMagicPoint indicates the addition of a new point to the current magic path
     * @property {function()} onMagicEnd indicates that the user finished drawing
     *
     * @property {function(point)} onPointerMove supplies client mouse coordinates
     */
    static get propTypes() {
        return {
            user: PropTypes.object.isRequired,
            bricks: PropTypes.array.isRequired,
            clients: PropTypes.object.isRequired,
            magicPaths: PropTypes.array.isRequired,

            onBrickAdd: PropTypes.func.isRequired,
            onBrickRemove: PropTypes.func.isRequired,
            onBrickMove: PropTypes.func.isRequired,

            onPathBegin: PropTypes.func.isRequired,
            onPathPoint: PropTypes.func.isRequired,
            onPathEnd: PropTypes.func.isRequired,

            onErase: PropTypes.func.isRequired,

            onTextChange: PropTypes.func.isRequired,

            onMagicBegin: PropTypes.func.isRequired,
            onMagicPoint: PropTypes.func.isRequired,
            onMagicEnd: PropTypes.func.isRequired,

            onPointerMove: PropTypes.func.isRequired,
        };
    }

    static get defaultProps() {
        return {};
    }


    constructor(props) {
        super(props);

        this.state = {
            bricks: [],
            activeTool: EditorToolsEnum.TEXT,
            strokeStyle: new StrokeStyle({color: '#f44336', thickness: 3}),
            collabCursorActive: false,
            offset: 0
        };

        this.curEraserThickness = 5;
        this.lastEraserPoint = null;
    }


    handleToolChange = (tool) => {
        this.setState({activeTool: tool});
    };


    handleCollabCursorChange = (active) => {
        this.setState({collabCursorActive: active});
    };


    handleStrokeStyleChange = (strokeStyle) => {
        this.setState({strokeStyle});
    };


    handleAddBrickClick = (brickType, heightIndex = this.props.bricks.length) => {
        this.props.onBrickAdd(brickType, heightIndex);
    };


    handlePathBegin = (brick) => {
        switch (this.state.activeTool){
            case EditorToolsEnum.PEN:
                this.props.onPathBegin(brick, this.state.strokeStyle);
                break;
            case EditorToolsEnum.ERASER:
                // reset eraser
                this.lastEraserPoint = null;
                break;
            default:
        }
    };

    handlePathPoint = (brick, point) => {
        switch (this.state.activeTool){
            case EditorToolsEnum.PEN:
                this.props.onPathPoint(brick, point);
                break;
            case EditorToolsEnum.ERASER:
                if(this.lastEraserPoint){
                    this.props.onErase(brick, this.lastEraserPoint, point, this.curEraserThickness);
                } else {
                    // erase around current point
                    this.props.onErase(brick, point, point, this.curEraserThickness);
                }
                this.lastEraserPoint = point;
                break;
            default:
        }
    };

    handlePathEnd = (brick) => {
        switch (this.state.activeTool){
            case EditorToolsEnum.PEN:
                this.props.onPathEnd(brick);
                break;
            case EditorToolsEnum.ERASER:
                // reset eraser
                this.lastEraserPoint = null;
                break;
            default:
        }
    };

    mayBrickDraw = () => {
        return (this.state.activeTool === EditorToolsEnum.PEN) ||
            (this.state.activeTool === EditorToolsEnum.ERASER);
    };


    // TODO remove this stupid js-scroll bs
    handleWrapperScroll = () => {
        this.setState({
            offset: this.wrapperRef.scrollTop
        });
    };


    sendPointerMoveThrottled = throttle((point) => {
        // console.log(JSON.stringify(point));
        this.props.onPointerMove(point);
    }, 100);


    handleMouseMove = (e) => {
        const x = e.pageX - this.pageOuterRef.getBoundingClientRect().x;
        const y = e.pageY + this.wrapperRef.scrollTop;
        this.sendPointerMoveThrottled({x, y});
    };


    renderBricks = () => {
        let bricks = [];
        let curHeight = 0;

        // concatenate the id's of the row bricks
        const getRowId = (row) => row.reduce((brick1, brick2) => (brick1.id?brick1.id:"") + "#" + brick2.id, "-");

        const listRowItems = (row) => {
            return row.map(brick =>
                brick.type === BrickTypesEnum.DRAW?
                (<DrawBrick
                    key={brick.id}
                    width={17 * 37.8}
                    height={400}
                    paths={brick.paths}
                    splines={brick.splines}

                    onPathBegin={() => this.handlePathBegin(brick)}
                    onPathPoint={(point) => this.handlePathPoint(brick, point)}
                    onPathEnd={() => this.handlePathEnd(brick)}
                />)
                    :
                (<TextBrick
                    key={brick.id}
                    width={17 * 37.8}
                    paths={brick.paths}
                    splines={brick.splines}
                    text={brick.text}
                    mayDraw={this.mayBrickDraw()}

                    onPathBegin={() => this.handlePathBegin(brick)}
                    onPathPoint={(point) => this.handlePathPoint(brick, point)}
                    onPathEnd={() => this.handlePathEnd(brick)}

                    onTextChange={(text) => this.props.onTextChange(brick, text)}
                />)
            );
        };

        for(let row of this.props.bricks){
            // this is needed for the lambda to work
            const leHeight = curHeight;
            bricks.push(
                <div key={getRowId(row)}>
                    {this.state.activeTool === EditorToolsEnum.BRICK_ADD && (
                        <InsertBrickButtonStrip onBrickAdd={(type) => this.handleAddBrickClick(type, leHeight)}/>
                    )}
                    {listRowItems(row)}
                </div>
            );

            ++curHeight;
        }

        return bricks;
    };


    render() {
        return (
            <Wrapper 
                innerRef={(ref) => this.wrapperRef = ref}
                className={this.props.className}
                onScroll={this.handleWrapperScroll}
                onMouseMove={this.handleMouseMove}
            >
                
                <UserSymbols
                    clients={this.props.clients}
                />
                <Tooldock
                    onToolChange={this.handleToolChange}
                    selectedTool={this.state.activeTool}
                    collabCursorActive={this.state.collabCursorActive}
                    onCollabCursorToggleChange={this.handleCollabCursorChange}
                    strokeStyle={this.state.strokeStyle}
                    onStrokeStyleChange={this.handleStrokeStyleChange}
                />
                <PageOuter
                    innerRef={(ref) => this.pageOuterRef = ref}
                >
                    {this.state.collabCursorActive &&
                        <ClientPointers
                            clients={this.props.clients}
                        />
                    }
                    <PageInner>
                        {this.renderBricks()}
                        <AppendBrickButtonsContainer>
                            <AppendBrickButton onClick={() => this.handleAddBrickClick(BrickTypesEnum.DRAW)}>
                                Append Draw-Brick
                            </AppendBrickButton>
                            <AppendBrickButton onClick={() => this.handleAddBrickClick(BrickTypesEnum.TEXT)}>
                                Append Text-Brick
                            </AppendBrickButton>         
                        </AppendBrickButtonsContainer>          
                    </PageInner>
                    <OverlayCanvas
                        offset={this.state.offset}
                        hasFocus={(this.state.activeTool === EditorToolsEnum.MAGICPEN)}
                        paths={this.props.magicPaths}

                        onPathBegin={this.props.onMagicBegin}
                        onPathPoint={this.props.onMagicPoint}
                        onPathEnd={this.props.onMagicEnd}
                    />
                </PageOuter>
            </Wrapper>
        );
    }
}