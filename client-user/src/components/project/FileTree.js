import React from 'react';
import PropTypes from 'prop-types';
import {Treebeard, decorators} from "react-treebeard"
import "./FileTree.css"
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import {  } from "react-contextmenu";
import {getFolder} from "../../ServerApi";
import Button from "../base/Button";

let uniqueContextId = 0;





/**
 * this is a simple file tree
 */
export default class FileTree extends React.Component {
    /**
     * propTypes
     * @property {string} tlabel title of the file tree
     * @property {array} data file structure
     * @property {function(folder: object)} onFolderLoad called when a folder should be retrieved (folder is the folder node)
     * @property {function(folder: object)} onFolderClose called when a folder should be closed (folder is the folder node)
     * @property {function(file: object)} onFileLoad called when a file should be opened (file is the file node)
     * @property {function(folder: object)} onFileCreateClick called when the user wants to create a new file (folder is the parent folder of the file which should be created or null for root parent)
     * @property {function(folder: object)} onFolderCreateClick called when the user wants to create a new folder (folder is the parent folder of the folder which should be created or null for root parent)
     * @property {function()} onFolderButtonClick called when the folder button was clicked
     * @property {function()} onFileButtonClick called when the file button was clicked
     * @property {function(node: object)} onDeleteClick called when the user wants to delete a file/folder
     * @property {function()} onShareClick called when the share button was clicked
     * @property {boolean} displayButtons true if helper buttons for folder and document creation should be displayed
     * @property {boolean} displayShared if true displays people symbol if a file/folder is marked as shared (isShared = true)
     */
    static get propTypes() {
        return {
            label: PropTypes.string.isRequired,
            data: PropTypes.array.isRequired,
            onFolderLoad: PropTypes.func.isRequired,
            onFolderClose: PropTypes.func.isRequired,
            onFileLoad: PropTypes.func.isRequired,
            onFileCreateClick: PropTypes.func.isRequired,
            onFolderCreateClick: PropTypes.func.isRequired,
            onFolderButtonClick: PropTypes.func,
            onFileButtonClick: PropTypes.func,
            onDeleteClick: PropTypes.func.isRequired,
            onShareClick: PropTypes.func.isRequired,
            displayButtons: PropTypes.bool,
        };
    }

    static get defaultProps() {
        return {
            displayButtons: true,
        };
    }

    handleToggle = (node, toggled) => {
        // disable the last element that was clicked

        const isFolder = node.children !== undefined;
        if(isFolder){
            if(toggled){
                this.props.onFolderLoad(node);
            }
            else{
                this.props.onFolderClose(node);
            }
        }
        else{
            this.props.onFileLoad(node);
        }
    };

    /**
     * returns the folder of the node
     * @param node file tree node
     * @returns node if node is a folder, node.parent of node is a file, null if it is a file without parent
     */
    getFolder = (node) => {
        if(node.children)
            return node;
        if(node.parent !== undefined && node.parent !== null)
            return node.parent;
        return null;
    };

    onCreateFileClick = (node) => {
        if(node === null){
            // button click
            if(this.props.onFileButtonClick)
                this.props.onFileButtonClick();
            return;
        }

        const folder = this.getFolder(node);
        this.props.onFileCreateClick(folder);
    };

    onCreateFolderClick = (node) => {
        if(node === null){
            // button click
            if(this.props.onFolderButtonClick)
                this.props.onFolderButtonClick();
            return;
        }

        const folder = this.getFolder(node);
        this.props.onFolderCreateClick(folder);
    };

    onDeleteClick = (node) => {
        this.props.onDeleteClick(node);
    };

    onRenameClick = (node) => {
        alert("rename");
    };

    render() {
        // helper to stop bubbling event from context menu
        const stopEvent = e => {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
        };

        // custom header decoration
        decorators.Header = (props) => {

            const iconPath = props.node.children ? (
                props.node.toggled? '/img/folder_open.svg' : '/img/folder_close.svg') : '/img/file.svg';

            // TODO put context menu in a container and implement drag and drop as well
            const contextID = (uniqueContextId++).toString();
            return (
                <div style={props.style.base} className="no-select">
                    <div style={props.style.title}>
                        <ContextMenuTrigger id={contextID}>
                            <div>
                                <img src={iconPath} className="header-icon"/>
                                {props.node.name}
                            </div>

                        </ContextMenuTrigger>


                    </div>
                    <ContextMenu id={contextID}>
                        <MenuItem onClick={(e) => { this.onCreateFileClick(props.node); stopEvent(e);}}>
                            <img src={"/img/file_add.svg"} className="header-icon"/> New Document
                        </MenuItem>
                        <MenuItem onClick={(e) => { this.onCreateFolderClick(props.node); stopEvent(e);}}>
                            <img src={"/img/folder_add.svg"} className="header-icon"/> New Folder
                        </MenuItem>
                        <MenuItem className="no-select" onClick={(e) => stopEvent(e)} divider/>
                        <MenuItem onClick={(e) => { this.onDeleteClick(props.node); stopEvent(e);}}>
                            <img src={"/img/trash.svg"} className="header-icon"/> Delete
                        </MenuItem>
                        <MenuItem onClick={(e) => { this.onRenameClick(props.node); stopEvent(e);}}>
                            <img src={"/img/label.svg"} className="header-icon"/> Rename
                        </MenuItem>
                    </ContextMenu>
                </div>
            );
        };

        decorators.Loading = (props) => {
            return (
              <div style={props.style}>
                  loading...
              </div>
            );
        };

        const displayHelperButtons = () => {
            return (
                /*<div>
                    <img src="/img/file_add.svg" className="header-icon" onClick={() => this.onCreateFileClick(null)}/>
                    <img src="/img/folder_add.svg" className="header-icon" onClick={() => this.onCreateFolderClick(null)}/>
                </div>*/
                <div>
                    <Button label="doc" onClick={() => this.onCreateFileClick(null)}/>
                    <Button label="folder" onClick={() => this.onCreateFolderClick(null)}/>
                    <Button label="share" onClick={this.props.onShareClick}/>
                </div>
            );
        };

        return (
            <div>
                <h3 className="no-select no-margin">{this.props.label}</h3>
                {this.props.displayButtons? displayHelperButtons(): ''}
                <Treebeard
                    data={this.props.data}
                    onToggle={this.handleToggle}
                    decorators = {decorators}
                    style = {styles}
                />
            </div>
        );
    }
}


// styles
const styles = {
    tree: {
        base: {
            listStyle: 'none',
            backgroundColor: '#fff',
            margin: 0,
            padding: 0,
            color: '#9DA5AB',
            fontFamily: 'lucida grande ,tahoma,verdana,arial,sans-serif',
            fontSize: '14px'
        },
        node: {
            base: {
                position: 'relative'
            },
            link: {
                cursor: 'pointer',
                position: 'relative',
                padding: '0px 5px',
                display: 'block'
            },
            activeLink: {
                background: '#eee'
            },
            toggle: {
                base: {
                    position: 'relative',
                    display: 'inline-block',
                    verticalAlign: 'top',
                    marginLeft: '-5px',
                    height: '24px',
                    width: '24px'
                },
                wrapper: {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    margin: '-7px 0 0 -7px',
                    height: '14px'
                },
                height: 14,
                width: 14,
                arrow: {
                    fill: '#9DA5AB',
                    strokeWidth: 0
                }
            },
            header: {
                base: {
                    display: 'inline-block',
                    verticalAlign: 'top',
                    color: '#000'
                },
                connector: {
                    width: '2px',
                    height: '12px',
                    borderLeft: 'solid 2px black',
                    borderBottom: 'solid 2px black',
                    position: 'absolute',
                    top: '0px',
                    left: '-21px'
                },
                title: {
                    lineHeight: '24px',
                    verticalAlign: 'middle'
                }
            },
            subtree: {
                listStyle: 'none',
                paddingLeft: '19px'
            },
            loading: {
                color: '#111'
            }
        }
    }
};