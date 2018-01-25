import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {COLOR_RGBA, COLOR_CODES} from '../../Globals';
import {ToggleIcon} from '../base/ToggleIcon';
import { EditorToolsEnum } from '../../editor/EditorToolsEnum';


const Dock = styled.div`
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, 0);
    /*width: 400px;
    height: 40px;*/
    z-index: 1000;
    background: white;
    border: 1px solid ${COLOR_RGBA.GREY};
    border-top: none;
    border-radius: 0 0 10px 10px;
    display: flex;
    flex-direction: row;
    padding: 2.5px;
`;

const Category = styled.div`
    border-top: 2px solid ${props => props.color};
    /*border-radius: 10px;*/
    margin: 2.5px;
`;


export class Tooldock extends React.Component {
    /**
     * propTypes
     */
    static get propTypes() {
        return {
            
        };
    }

    static get defaultProps() {
        return {};
    }


    constructor(props) {
        super(props);

        this.state = {
            activeTool: EditorToolsEnum.NONE
        };
    }


    handleToggle = (tool) => () => {
        this.setState({activeTool: tool});
    };


    render() {
        return (
            <Dock>
                <Category
                    color={COLOR_RGBA.BLUE}
                >
                    <ToggleIcon 
                        imgSrc="/img/tools/draw_pen.svg"
                        label="Pen"
                        onToggle={this.handleToggle(EditorToolsEnum.PEN)}
                        toggled={this.state.activeTool === EditorToolsEnum.PEN}
                    />
                    <ToggleIcon 
                        imgSrc="/img/tools/draw_eraser.svg"
                        label="Eraser"
                        onToggle={this.handleToggle(EditorToolsEnum.ERASER)}
                        toggled={this.state.activeTool === EditorToolsEnum.ERASER}
                    />
                    <ToggleIcon 
                        imgSrc="/img/tools/draw_lasso.svg"
                        label="Lasso"
                        onToggle={this.handleToggle(EditorToolsEnum.LASSO)}
                        toggled={this.state.activeTool === EditorToolsEnum.LASSO}
                    />
                    <ToggleIcon 
                        imgSrc="/img/tools/draw_pen_review.svg"
                        label="Pen (Review)"
                        onToggle={this.handleToggle(EditorToolsEnum.PEN_REVIEW)}
                        toggled={this.state.activeTool === EditorToolsEnum.PEN_REVIEW}
                    />
                </Category>
                <Category
                    color={COLOR_RGBA.RED}
                >
                    <ToggleIcon 
                        imgSrc="/img/tools/text.svg"
                        label="Text"
                        onToggle={this.handleToggle(EditorToolsEnum.TEXT)}
                        toggled={this.state.activeTool === EditorToolsEnum.TEXT}
                    />
                    <ToggleIcon 
                        imgSrc="/img/tools/text_review.svg"
                        label="Text (Review)"
                        onToggle={this.handleToggle(EditorToolsEnum.TEXT_REVIEW)}
                        toggled={this.state.activeTool === EditorToolsEnum.TEXT_REVIEW}
                    />
                </Category>
                <Category
                    color={COLOR_RGBA.YELLOW}
                >
                    <ToggleIcon 
                        imgSrc="/img/tools/brick_add.svg"
                        label="Add brick"
                        onToggle={this.handleToggle(EditorToolsEnum.BRICK_ADD)}
                        toggled={this.state.activeTool === EditorToolsEnum.BRICK_ADD}
                    />
                    <ToggleIcon 
                        imgSrc="/img/tools/brick_delete.svg"
                        label="Delete brick"
                        onToggle={this.handleToggle(EditorToolsEnum.BRICK_DELETE)}
                        toggled={this.state.activeTool === EditorToolsEnum.BRICK_DELETE}
                    />
                    <ToggleIcon 
                        imgSrc="/img/tools/brick_move.svg"
                        label="Move/resize brick"
                        onToggle={this.handleToggle(EditorToolsEnum.BRICK_MOVE)}
                        toggled={this.state.activeTool === EditorToolsEnum.BRICK_MOVE}
                    />
                </Category>
                <Category
                    color={COLOR_RGBA.TEAL}
                >
                    <ToggleIcon 
                        imgSrc="/img/tools/collab_cursor.svg"
                        label="Collaborative cursor"
                        onToggle={this.handleToggle(EditorToolsEnum.COLLAB_CURSOR)}
                        toggled={this.state.activeTool === EditorToolsEnum.COLLAB_CURSOR}
                    />
                    <ToggleIcon 
                        imgSrc="/img/tools/collab_magicpen.svg"
                        label="Disappearing magic pen"
                        onToggle={this.handleToggle(EditorToolsEnum.MAGICPEN)}
                        toggled={this.state.activeTool === EditorToolsEnum.MAGICPEN}
                    />
                </Category>
            </Dock>
        );
    }
}
