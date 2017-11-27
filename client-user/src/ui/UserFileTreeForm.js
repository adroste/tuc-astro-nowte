import React from 'react';
import PropTypes from 'prop-types';
import FileTree from "./FileTree";
import * as API from '../ServerApi'

/**
 * this renders the file tree of the user as well as files shared for him
 */
export default class UserFileTreeForm extends React.Component {
    /**
     * propTypes
     */
    static get propTypes() {
        return {};
    }

    static get defaultProps() {
        return {};
    }

    constructor(props){
        super(props);


        const userRootFolderID = 0;
        this.state = {
            // own root folder
            root: {
                name: 'root',
                id: userRootFolderID,
                toggled: false,
                children: [],
            },
            // users that shared something with me
            users: []
        };

        // request root folder and shares
        // TODO replace
        API.getFolder(userRootFolderID, (data) => this.handleFolderReceive(data, this.state.root), this.handleRequestError);
        API.getShares(userRootFolderID, this.handleUserShares, this.handleRequestError);
    }

    /**
     * converts data received from the server into
     * a format that the file tree understands.
     * returns the children of the folder
     * @param data data from API.getFolder.
     */
    convertServerFolderData = (data, parent) => {
        let children = [];

        // add children
        // folder
        if(data.folder) {
            for(let child of data.folder) {
                children.push({
                    name: child.name,
                    id: child.id,
                    toggled: false,
                    children: [],
                    parent: parent,
                });
            }
        }

        // files
        if(data.docs) {
            for(let child of data.docs) {
                children.push({
                    name: child.name,
                    id: child.id,
                    parent: parent,
                });
            }
        }

        return children;
    };

    handleFolderReceive = (data, folderNode) => {
        // set the root tree
        folderNode.children = this.convertServerFolderData(data, folderNode);
        folderNode.toggled = true;


    };

    handleUserShares = (data) => {
        if(!data.users)
            return;

        for(let user of data.users)
        {
            const folderData = this.convertServerFolderData(user, null);
            this.state.users.push({
                name: user.name,
                email: user.email,
                id: user.id,
                // actual data
                children: folderData,
            });
        }
    };

    handleRequestError = (error) => {
        // TODO make prettier
        alert(error);
    };

    getFileTree = (label, root) => {
        return (
            <FileTree
                label={label}
                data={root.children}
                onFolderLoad={this.handleFolderLoad}
                onFileLoad={this.handleFileLoad}
                onFileCreateClick={this.handleFileCreateClick}
                onFolderCreateClick={this.handleFolderCreateClick}
                onDeleteClick={this.handleDeleteClick}
            />
        );
    };

    getSharedFiles = () => {
        let rows = [];
        for(let user of this.state.users){
            const username = "Shared by " + user.name;
            rows.push(
                this.getFileTree(username, user)
            );
        }
        return rows;
    };

    removeNode = (node) => {
        if(!node.parent)
            return;
        // remove link from parent
        const children = node.parent.children;
        let index = -1;
        for(let i = 0; i < children.length; ++i) {
            if(children[i].id === node.id) {
                if(children[i].children === node.children){
                    index = i;
                    break;
                }
            }
        }
        if(index !== -1) {
            children.splice(index, 1);
            this.forceUpdate();
        }
    };

    handleFolderLoad = (node) => {
        // TODO add text for loading
        API.getFolder(node.id, (data) => this.handleFolderReceive(data, node), this.handleRequestError);
    };

    handleFileLoad = (file) => {
        alert("opening file: " + file.name);
    };

    handleFileCreateClick = (folderNode) => {
        alert("creating in: " + folderNode.name);
    };

    handleFolderCreateClick = (folderNode) => {
        alert("creating folder in: " + folderNode.name);
    };

    handleDeleteClick = (node) => {
        if(node.children) {
            API.removeFolder(node.id, () => this.removeNode(node), this.handleRequestError);
        } else {
            API.removeFile(node.id, () => this.removeNode(node), this.handleRequestError);
        }
    };

    render() {
        return (
            <div>
                {this.getFileTree("My Files", this.state.root)}
                {this.getSharedFiles()}
            </div>
        );
    }
}