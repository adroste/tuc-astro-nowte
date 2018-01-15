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
     */
    static get propTypes() {
        return {
            user: PropTypes.object.isRequired,
            socket: PropTypes.object.isRequired
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


    handleAddBrick = (beforeId) => {
        let idx = this.state.bricks.length;
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
        });
    };


    renderBricks = () => {
        return this.state.bricks.map(id => {
            return (
                <div key={id}>
                    <InsertBrickButton onClick={() => this.handleAddBrick(id)}/>
                    <DrawBrick
                        widthCm={17}
                        heightPx={400}
                        socket={this.props.socket}
                        brickId={id.toString()}
                    />
                </div>
            );
        });
    };


    render() {
        return (
            <Wrapper className={this.props.className}>
                <PageOuter>
                    <PageInner>
                        {this.renderBricks()}
                        <AppendBrickButton onClick={() => this.handleAddBrick()}/>
                    </PageInner>
                </PageOuter>
            </Wrapper>
        );
    }
}