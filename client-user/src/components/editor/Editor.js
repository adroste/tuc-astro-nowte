import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {DrawBrick} from "./bricks/DrawBrick";
import {Button, lightGreyRoundedTheme} from "../base/Button";
import {DropButton} from "./base/DropButton";
import {StrokeStyle} from "../../drawing/StrokeStyle";


const Wrapper = styled.div`
    display: block;
    width: 100%;
`;


const PageOuter = styled.div`
    width: 210mm;
    height: 100%;
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
     * @property {function(rowIndex: number, columnIndex: number)} onBrickAdd requests brick creation.
     *           columnIndex = undefined => use the whole row. columnIndex = 0 => insert as left brick. columnIndex = 1 => insert as right brick.
     *
     * @property {function(brick, strokeStyle)} onPathBegin indicates the start of a user drawn path. brick is the reference to the brick which was passed in this.props.bricks
     * @property {function(brick, Point)} onPathPoint indicates the addition of a new point to the current path
     * @property {function(brick)} onPathEnd indicates that the user finished drawing
     */
    static get propTypes() {
        return {
            user: PropTypes.object.isRequired,
            bricks: PropTypes.array.isRequired,
            onBrickAdd: PropTypes.func.isRequired,

            onPathBegin: PropTypes.func.isRequired,
            onPathPoint: PropTypes.func.isRequired,
            onPathEnd: PropTypes.func.isRequired,
        };
    }

    static get defaultProps() {
        return {};
    }


    constructor(props) {
        super(props);

        this.state = {
            bricks: []
        };

        this.curStrokeStyle = new StrokeStyle({color: 'red', thickness: 3});
    }


    handleAddBrickClick = (heightIndex) => {
        if(heightIndex === undefined)
            heightIndex = this.props.bricks.length;

        this.props.onBrickAdd(heightIndex);
    };


    renderBricks = () => {
        let bricks = [];
        let curHeight = 0;

        // concatenate the id's of the row bricks
        const getRowId = (row) => row.reduce((brick1, brick2) => (brick1.id?brick1.id:"") + "#" + brick2.id, "-");

        const listRowItems = (row) => {
            return row.map(brick =>
                (<DrawBrick
                    key={brick.id}
                    widthCm={17}
                    heightPx={400}
                    paths={brick.paths}
                    splines={brick.splines}

                    onPathBegin={() => this.props.onPathBegin(brick, this.curStrokeStyle)}
                    onPathPoint={(point) => this.props.onPathPoint(brick, point)}
                    onPathEnd={() => this.props.onPathEnd(brick)}
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


    render() {
        return (
            <Wrapper className={this.props.className}>
                <PageOuter>
                    <PageInner>
                        {this.renderBricks()}
                        <AppendBrickButton onClick={() => this.handleAddBrickClick()}/>
                    </PageInner>
                </PageOuter>
            </Wrapper>
        );
    }
}