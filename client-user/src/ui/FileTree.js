import React from 'react';
import PropTypes from 'prop-types';
import {Treebeard, decorators} from "react-treebeard"
import "./FileTree.css"
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import {  } from "react-contextmenu";

let uniqueContextId = 0;





/**
 * this is a simple file tree
 */
export default class FileTree extends React.Component {
    /**
     * propTypes
     * label {string} title of the file tree
     * data {object} file structure
     * onFolderLoad {function(folder: object)} called when a folder should be retrieved (folder is the folder node)
     * onFileLoad {function(file: object)} called when a file should be opened (file is the file node)
     * onFileCreateClick {function(folder: object)} called when the user wants to create a new file (folder is the parent folder of the file which should be created)
     */
    static get propTypes() {
        return {
            label: PropTypes.string.isRequired,
            data: PropTypes.object.isRequired,
            onFolderLoad: PropTypes.func.isRequired,
            onFileLoad: PropTypes.func.isRequired,
            onFileCreateClick: PropTypes.func.isRequired
        };
    }

    static get defaultProps() {
        return {};
    }

    constructor(props)
    {
        super(props);

        this.state = {
            files: {
                name: 'root',
                toggled: true,
                children: [
                    {
                        name: 'folder1',
                        toggled: true,
                        children: [
                            {name: 'file2'}
                        ]
                    },
                    { name: 'file1' }
                ]
            }
        }
    }


    handleToggle = (node, toggled) => {
        // disable the last element that was clicked
        if(this.state.cursor){
            this.state.cursor.active = false;
        }

        node.active = true;
        let isFolder = false;
        if(node.children){
            node.toggled = toggled;
            isFolder = true;
        }
        this.setState({cursor: node});

        if(this.props.onFolderLoad && isFolder && toggled)
            this.props.onFolderLoad(node);

        if(this.props.onFileLoad && !isFolder)
            this.props.onFileLoad(node);
    };

    onCreateFileClick = (node) => {
        if(node.children)
        {
            // folder was selected
            this.props.onFileCreateClick(node);
        }
        else
        {
            // search the parent
            if(node.parent !== undefined && node.parent !== null) {
                this.props.onFileCreateClick(node.parent);
            }
            else {
                alert("cannot identify parent folder");
            }
        }
    };

    onCreateFolderClick = (node) => {
        alert("new folder");
    };

    onDeleteClick = (node) => {
        alert("delete");
    };

    onRenameClick = (node) => {
        alert("rename");
    };

    onShareClick = (node) => {
        alert("share");
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
            const contextID = uniqueContextId++;
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
                        <MenuItem onClick={(e) => { this.onShareClick(props.node); stopEvent(e);}}>
                            <img src={"/img/people.svg"} className="header-icon"/> Share
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

        return (
            <div>
                <h3 className="no-select">{this.props.label}</h3>
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
                color: '#ff0000'
            }
        }
    }
};