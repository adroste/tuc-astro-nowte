import React from 'react';
import PropTypes from 'prop-types';
import FileTree from "./FileTree";
import * as API from '../ServerApi'

// helper
const copy = (object) => {
    return JSON.parse(JSON.stringify(object));
};

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


        // TODO set correct user root folder
        this.root = 0;
        this.state = {
            // user root folder
            root: {
                children: [],
            },

            // shared by other users
            users: []
        };

        // add root folder entry
        this.folder[this.root] = this.makeUnloadedFolder("root", this.root, null);
    }

    // own root folder
    root = undefined;
    // users that shared something with me
    users = [];

    // folders dictionary
    folder = {};

    // documents dictionary
    docs = {};

    // the node with focus
    activeNode = {
        id: null,
        isFolder: false,
    };

    componentDidMount() {
        // request root folder and shares
        // TODO replace
        API.getFolder(this.root, (data) => this.handleFolderReceive(data, this.root), this.handleRequestError);
        //API.getShares(userRootFolderID, this.handleUserShares, this.handleRequestError);
    }



    makeUnloadedFolder = (name, folderId, parentId) => {
        return {
            name: name,
            id: folderId,
            toggled: false,
            loading: true,
            folder: [],
            docs: [],
            parent: parentId
        }
    };

    makeDocument = (name, docId, parentId) => {
        return {
            name: name,
            id: docId,
            parent: parentId,
        }
    };

    /**
     * converts data received from the server into
     * a format that the file tree understands.
     * returns the children of the folder
     * @param data data from API.getFolder.
     * @param parentId id of the parent folder
     * @param folderDict dictionary with folders that should be updated
     * @param docsDict dictionary with documents that should be updated
     */
    loadServerFolderData = (data, parentId, folderDict, docsDict) => {

        let parentNode = folderDict[parentId];
        parentNode.loading = false;
        parentNode.toggled = true;

        // add children
        // folder
        if(data.folder) {
            for(let child of data.folder) {
                // TODO maybe not overwrite if an entry exists?
                folderDict[child.id] = this.makeUnloadedFolder(child.name, child.id, parentId);
                parentNode.folder.push(child.id);
            }
        }

        // files
        if(data.docs) {
            for(let child of data.docs) {
                docsDict[child.id] = this.makeDocument(child.name, child.id, parentId);
                parentNode.docs.push(child.id);
            }
        }
    };

    handleFolderReceive = (data, folderId) => {
        // set the root tree
        const folderDict = this.folder;
        const docsDict = this.docs;

        this.loadServerFolderData(data, folderId, folderDict, docsDict);

        this.recomputeFolderViews();
    };

    /*handleUserShares = (data) => {
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
    };*/

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
                onFolderClose={this.handleFolderClose}
                onFileLoad={this.handleFileLoad}
                onFileCreateClick={this.handleFileCreateClick}
                onFolderCreateClick={this.handleFolderCreateClick}
                onDeleteClick={this.handleDeleteClick}
                displayButtons="true"
            />
        );
    };

    getSharedFiles = () => {
        // TODO update
        let rows = [];
        for(let user of this.state.users){
            const username = "Shared by " + user.name;
            rows.push(
                this.getFileTree(username, user)
            );
        }
        return rows;
    };

    handleFolderLoad = (node) => {
        // TODO add text for loading

        // set folder to load
        let folderDict = this.folder;
        folderDict[node.id].toggled = true;

        this.activeNode.id = node.id;
        this.activeNode.isFolder = true;

        this.recomputeFolderViews();

        // request content if not loaded
        if(this.folder[node.id].loading)
            API.getFolder(node.id, (data) => this.handleFolderReceive(data, node.id), this.handleRequestError);
    };

    handleFolderClose = (node) => {
        // just set toggled to false
        let folderDict = this.folder;
        folderDict[node.id].toggled = false;

        this.activeNode.id = node.id;
        this.activeNode.isFolder = true;

        this.recomputeFolderViews();
    };

    handleFileLoad = (file) => {
        this.activeNode.id = file.id;
        this.activeNode.isFolder = false;

        alert("opening file: " + file.name);
    };

    handleFileCreateClick = (folderNode) => {
        alert("creating in: " + folderNode.name);
    };

    handleFolderCreateClick = (folderNode) => {
        alert("creating folder in: " + folderNode.name);
    };

    removeNode = (id, isFolder) => {
        const node =
            isFolder? this.folder[id] : this.docs[id];
        // remove link from parent
        let folderDict = this.folder;
        let parent = folderDict[node.parent];
        const idx = isFolder?
            parent.folder.indexOf(id) : parent.docs.indexOf(id);

        if(idx !== -1){
            if(isFolder){
                parent.folder.splice(idx, 1);
            } else {
                parent.docs.splice(idx, 1);
            }

            this.recomputeFolderViews();
        }
    };

    handleDeleteClick = (node) => {
        if(node.children) {
            API.removeFolder(node.id, () => this.removeNode(node.id, true), this.handleRequestError);
        } else {
            API.removeFile(node.id, () => this.removeNode(node.id, false), this.handleRequestError);
        }
    };

    recomputeFolderViews = () => {
        // for the user
        let userTree = this.loadFolderView(this.root, null);

        // TODO shared thingies

        this.setState({
            root: userTree,
        });
    };

    loadFolderView = (folderId, parent) => {
        // find node
        const node = this.folder[folderId];

        let view = {
            name: node.name,
            id: node.id,
            toggled: node.toggled,
            loading: node.loading,
            active: (this.activeNode.isFolder && this.activeNode.id === folderId),
            children: [],
            parent: parent,
        };

        // load children
        for(let folderId of node.folder) {
            view.children.push(this.loadFolderView(folderId, view));
        }

        for(let docId of node.docs) {
            view.children.push(this.loadDocView(docId, view));
        }

        return view;
    };

    loadDocView = (docId, parent) => {
        const node = this.docs[docId];

        return {
            name: node.name,
            id: node.id,
            active: (!this.activeNode.isFolder && this.activeNode.id === docId),
            parent: parent,
        };
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