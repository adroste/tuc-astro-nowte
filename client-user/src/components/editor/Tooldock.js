import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {CirclePicker} from 'react-color';
import {COLOR_RGBA, COLOR_CODES} from '../../Globals';
import {ToggleIcon} from '../base/ToggleIcon';
import { EditorToolsEnum } from '../../editor/EditorToolsEnum';
import { PopUpBox } from '../base/PopUpBox';


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
    display: flex; /* setting this to flex and ToggleIcons to inline-block disables wrap */
`;


export class Tooldock extends React.Component {
    /**
     * propTypes
     * @property {EditorToolsEnum} selectedTool defines selected tool
     * @property {boolean} collabCursorActive defines state of collab cursor button
     * @property {function(tool: number)} onToolChange callback if user switches active tool
     * @property {function(active: boolean)} onCollabCursorToggleChange callback if user toggles collaborative cursor tool
     * @property {object} strokeStyle current stroke styling
     * @property {function(strokeStyle: object)} onStrokeStyleChange callback if user changes stroke styling
     */
    static get propTypes() {
        return {
            selectedTool: PropTypes.number.isRequired,
            collabCursorActive: PropTypes.bool.isRequired,
            onToolChange: PropTypes.func.isRequired,
            onCollabCursorToggleChange: PropTypes.func.isRequired,
            strokeStyle: PropTypes.object.isRequired,
            onStrokeStyleChange: PropTypes.func.isRequired,
        };
    }

    static get defaultProps() {
        return {};
    }


    shouldComponentUpdate(nextProps) {
        return this.props.selectedTool !== nextProps.selectedTool
            || this.props.collabCursorActive !== nextProps.collabCursorActive;
    }


    handleToggle = (tool) => (toggled, e) => {
        this.props.onToolChange(tool);

        // only prevent bubble if button state goes from untoggled to toggled (toggled == true)
        if (toggled) {
            e.preventDefault();
            e.stopPropagation();
        }
    };


    handleCollabCursorToggle = () => {
        this.props.onCollabCursorToggleChange(!this.props.collabCursorActive);
    };


    handlePenColorChange = (color, e) => {
        console.log(color);
        this.props.onStrokeStyleChange(this.props.strokeStyle.set('color', color.hex));
    };


    render() {
        return (
            <Dock>
                <Category
                    color={COLOR_RGBA.BLUE}
                >
                    <PopUpBox
                        active={this.props.selectedTool !== EditorToolsEnum.PEN ? false : undefined}
                        activeOnHover={false}
                        below
                        content={
                            <CirclePicker
                                color={this.props.strokeStyle.get('color')}
                                onChange={this.handlePenColorChange}
                            />
                        }
                    >
                        <ToggleIcon 
                            imgSrc="/img/tools/draw_pen.svg"
                            label="Pen"
                            onToggle={this.handleToggle(EditorToolsEnum.PEN)}
                            toggled={this.props.selectedTool === EditorToolsEnum.PEN}
                        />
                    </PopUpBox>
                    <ToggleIcon 
                        imgSrc="/img/tools/draw_eraser.svg"
                        label="Eraser"
                        onToggle={this.handleToggle(EditorToolsEnum.ERASER)}
                        toggled={this.props.selectedTool === EditorToolsEnum.ERASER}
                    />
                    <ToggleIcon 
                        imgSrc="/img/tools/draw_lasso.svg"
                        label="Lasso"
                        onToggle={this.handleToggle(EditorToolsEnum.LASSO)}
                        toggled={this.props.selectedTool === EditorToolsEnum.LASSO}
                        disabled
                    />
                    <ToggleIcon 
                        imgSrc="/img/tools/draw_pen_review.svg"
                        label="Pen (Review)"
                        onToggle={this.handleToggle(EditorToolsEnum.PEN_REVIEW)}
                        toggled={this.props.selectedTool === EditorToolsEnum.PEN_REVIEW}
                        disabled
                    />
                </Category>
                <Category
                    color={COLOR_RGBA.RED}
                >
                    <ToggleIcon 
                        imgSrc="/img/tools/text.svg"
                        label="Text"
                        onToggle={this.handleToggle(EditorToolsEnum.TEXT)}
                        toggled={this.props.selectedTool === EditorToolsEnum.TEXT}
                    />
                    <ToggleIcon 
                        imgSrc="/img/tools/text_review.svg"
                        label="Text (Review)"
                        onToggle={this.handleToggle(EditorToolsEnum.TEXT_REVIEW)}
                        toggled={this.props.selectedTool === EditorToolsEnum.TEXT_REVIEW}
                        disabled                     
                    />
                </Category>
                <Category
                    color={COLOR_RGBA.YELLOW}
                >
                    <ToggleIcon 
                        imgSrc="/img/tools/brick_add.svg"
                        label="Add brick"
                        onToggle={this.handleToggle(EditorToolsEnum.BRICK_ADD)}
                        toggled={this.props.selectedTool === EditorToolsEnum.BRICK_ADD}
                    />
                    <ToggleIcon 
                        imgSrc="/img/tools/brick_delete.svg"
                        label="Delete brick"
                        onToggle={this.handleToggle(EditorToolsEnum.BRICK_DELETE)}
                        toggled={this.props.selectedTool === EditorToolsEnum.BRICK_DELETE}
                        disabled
                    />
                    <ToggleIcon 
                        imgSrc="/img/tools/brick_move.svg"
                        label="Move/resize brick"
                        onToggle={this.handleToggle(EditorToolsEnum.BRICK_MOVE)}
                        toggled={this.props.selectedTool === EditorToolsEnum.BRICK_MOVE}
                        disabled                                                
                    />
                </Category>
                <Category
                    color={COLOR_RGBA.TEAL}
                >
                    <ToggleIcon 
                        imgSrc="/img/tools/collab_cursor.svg"
                        label="Collaborative cursor"
                        onToggle={this.handleCollabCursorToggle}
                        toggled={this.props.collabCursorActive}
                    />
                    <ToggleIcon 
                        imgSrc="/img/tools/collab_magicpen.svg"
                        label="Disappearing magic pen"
                        onToggle={this.handleToggle(EditorToolsEnum.MAGICPEN)}
                        toggled={this.props.selectedTool === EditorToolsEnum.MAGICPEN}
                    />
                </Category>
            </Dock>
        );
    }
}
