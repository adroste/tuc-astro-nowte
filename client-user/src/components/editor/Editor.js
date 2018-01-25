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


const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    overflow: scroll;
    scroll-behavior: smooth;
`;


const PageOuter = styled.div`
    width: 210mm;
    background-color: white;
    margin: auto;
    padding-right: 20mm;
    padding-left: 20mm;
    padding-top: 15mm;
    padding-bottom: 10cm; /* scrolling dont stops at last element */
    box-shadow: 0px 0px 15px 0px #ddd;
    min-height: 100vh;
`;


const PageInner = styled.div`
    height: 100%;
    /*border: #ddd 1px solid;*/
`;


const AppendBrickButton = styled(Button).attrs({
    center: true,
    large: true,
    theme: lightGreyRoundedTheme,
    children: '+'
})`
    width: 50%;
    margin: 40px 0;
`;


const InsertBrickButton = styled(DropButton)`
    height: 0;
    position: relative;
    left: -60px;
    top: -23px;
    
    &:after { 
        content: '' ; 
        display: block ; 
        position: absolute;
        height: 1px;
        top: 23px; 
        bottom: 0; 
        left: 60px; 
        right: -60px; 
        background: transparent;
        transition: background 0.3s;
        pointer-events: none;
    }
    
    &:hover:after {
        background: #ccc;
    }
`;


export class Editor extends React.Component {
    /**
     * propTypes
     * @property {array} bricks brick layout [[brick1, brick2], [brick3], ...]. brick1 and brick2 are in the same row. brick3 is in the next row.
     * @property {object} clients other clients that are currently connected (dictionary: key=userUniqueId value={id, name, color})
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
     */
    static get propTypes() {
        return {
            user: PropTypes.object.isRequired,
            bricks: PropTypes.array.isRequired,
            clients: PropTypes.object.isRequired,

            onBrickAdd: PropTypes.func.isRequired,

            onPathBegin: PropTypes.func.isRequired,
            onPathPoint: PropTypes.func.isRequired,
            onPathEnd: PropTypes.func.isRequired,

            onErase: PropTypes.func.isRequired,

            onTextChange: PropTypes.func.isRequired,
        };
    }

    static get defaultProps() {
        return {};
    }


    constructor(props) {
        super(props);

        this.state = {
            bricks: [],
            activeTool: EditorToolsEnum.NONE,
        };

        this.curStrokeStyle = new StrokeStyle({color: 'red', thickness: 3});
        this.curEraserThickness = 5;
        this.lastEraserPoint = null;
    }


    handleToolChange = (tool) => {
        this.setState({activeTool: tool});
    };


    handleAddBrickClick = (brickType, heightIndex = this.props.bricks.length) => {
        this.props.onBrickAdd(brickType, heightIndex);
    };


    handlePathBegin = (brick) => {
        switch (this.state.activeTool){
            case EditorToolsEnum.PEN:
                this.props.onPathBegin(brick, this.curStrokeStyle);
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
                    widthCm={17}
                    heightPx={400}
                    paths={brick.paths}
                    splines={brick.splines}

                    onPathBegin={() => this.handlePathBegin(brick)}
                    onPathPoint={(point) => this.handlePathPoint(brick, point)}
                    onPathEnd={() => this.handlePathEnd(brick)}
                />)
                    :
                (<TextBrick
                    key={brick.id}
                    widthCm={17}
                    heightPx={400}
                    paths={brick.paths}
                    splines={brick.splines}
                    text={brick.text}

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
                    <InsertBrickButton onClick={() => this.handleAddBrickClick(leHeight)}/>
                    {listRowItems(row)}
                </div>
            );

            ++curHeight;
        }

        return bricks;
    };

    renderClients = () => {
        // TODO render the clients
        for(let uniqueId of Object.keys(this.props.clients)){
            alert(JSON.stringify(this.props.clients[uniqueId]));
        }
    };

    render() {
        return (
            <Wrapper className={this.props.className}>
                {this.renderClients()}
                <Tooldock
                    onToolChange={this.handleToolChange}
                    selectedTool={this.state.activeTool}
                />
                <PageOuter>
                    <PageInner>
                        {this.renderBricks()}
                        <AppendBrickButton onClick={() => this.handleAddBrickClick(BrickTypesEnum.DRAW)}/>
                        <AppendBrickButton onClick={() => this.handleAddBrickClick(BrickTypesEnum.TEXT)}/>
                    </PageInner>
                </PageOuter>
            </Wrapper>
        );
    }
}