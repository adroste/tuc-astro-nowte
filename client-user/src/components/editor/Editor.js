import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {DrawBrick} from "./bricks/DrawBrick";
import {Button, lightGreyRoundedTheme} from "../base/Button";
import {DropButton} from "./base/DropButton";


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
     */
    static get propTypes() {
        return {
            user: PropTypes.object.isRequired,
            socket: PropTypes.object.isRequired,
            bricks: PropTypes.array.isRequired,
            onBrickAdd: PropTypes.func.isRequired,
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
    }


    handleAddBrickClick = (heightIndex) => {
        if(heightIndex === undefined)
            heightIndex = 0;

        this.props.onBrickAdd(heightIndex);

        /*let idx = this.state.bricks.length;
        let s = this.state.bricks.slice();
        if (beforeId)
            idx = this.state.bricks.findIndex(x => x === beforeId);
        const brickId = s.length + 1;
        s.splice(idx, 0, brickId);
        this.setState({
            bricks: s
        });

        this.props.socket.emit("insertBrick", {
            heightIndex: idx,
            id: brickId.toString(),
        });*/
    };


    renderBricks = () => {
        let bricks = [];
        let curHeight = 0;

        // concatenate the id's of the row bricks
        const getRowId = (row) => row.reduce((brick1, brick2) => brick1.id + brick2.id, "#");

        const listRowItems = (row) => {
            return row.map(brick =>
                (<DrawBrick
                    key={brick.id}
                    widthCm={17}
                    heightPx={400}
                    socket={this.props.socket}
                    brickId={brick.id}
                    paths={brick.paths}
                    splines={brick.splines}
                />)
            );
        };

        for(let row of this.props.bricks){
            bricks.push(
                <div key={getRowId(row)}>
                    <InsertBrickButton onClick={() => this.handleAddBrickClick(curHeight)}/>
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