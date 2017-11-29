import React from 'react';
import PropTypes from 'prop-types';
import FileTree from "./FileTree";
import * as API from '../ServerApi'
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import InputDialog from "./InputDialog";
import ShareDialog from "./ShareDialog";

// helper
const copy = (object) => {
    return JSON.parse(JSON.stringify(object));
};

const user_share_root_prefix = "#shareRoot";

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


        // TODO set correct user root folder and user id
        this.root = 0;
        this.userId = 0;
        this.state = {
            // user root folder
            root: {
                children: [],
            },

            // shared by other users
            shares: [],

            // a modal window that should be shown
            activeDialog: null,
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
        owner: null,
    };

    componentDidMount() {
        // request root folder and shares
        API.getFolder(this.root, (data) => this.handleFolderReceive(data, this.root), this.handleRequestError);
        API.getShares(this.userId, this.handleUserShares, this.handleRequestError);
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

    handleUserShares = (data) => {
        if(!data.users)
            return;

        this.users = [];
        for(let user of data.users)
        {
            // create unique root id
            const rootId = user_share_root_prefix + user.id;
            // set users
            this.users.push({
                id: user.id,
                name: user.name,
                email: user.email,
                root: rootId,
            });

            // add pseudo root
            this.folder[rootId] = this.makeUnloadedFolder("user_share_" + user.id, rootId, null);

            // load folder data
            this.loadServerFolderData(user, rootId, this.folder, this.docs);
        }

        this.recomputeFolderViews();
    };

    handleRequestError = (error) => {
        // TODO make prettier
        alert(error);
    };

    // error caused by the user (like creating two files with the same name)
    handleUserError = (error) => {
        alert(error);
    };

    getFileTree = (label, root, userId) => {
        return (
            <FileTree
                label={label}
                data={root.children}
                onFolderLoad={this.handleFolderLoad}
                onFolderClose={this.handleFolderClose}
                onFileLoad={this.handleFileLoad}
                onFileCreateClick={(node) => this.handleFileCreateClick(node, userId, false)}
                onFolderCreateClick={(node) => this.handleFileCreateClick(node, userId, true)}
                onDeleteClick={this.handleDeleteClick}
                onShareClick={this.handleShareClick}
                displayButtons="true"
            />
        );
    };

    handleShareClick = (node) => {
        this.setState({
           activeDialog: <ShareDialog
                title={"Share " + node.name}
                onCancel={this.closeDialog}
                onShare={this.closeDialog}
                    />
        });
    };

    handleFolderLoad = (node) => {

        // set folder to load
        let folderDict = this.folder;
        folderDict[node.id].toggled = true;

        this.activeNode.id = node.id;
        this.activeNode.isFolder = true;
        this.activeNode.owner = node.ownerId;

        this.recomputeFolderViews();

        // request content if not loaded
        if(this.folder[node.id].loading)
            API.getFolder(node.id, (data) => this.handleFolderReceive(data, node.id));
    };

    handleFolderClose = (node) => {
        // just set toggled to false
        let folderDict = this.folder;

        folderDict[node.id].toggled = false;

        this.activeNode.id = node.id;
        this.activeNode.isFolder = true;
        this.activeNode.owner = node.ownerId;

        this.recomputeFolderViews();
    };

    handleFileLoad = (file) => {
        this.activeNode.id = file.id;
        this.activeNode.isFolder = false;
        this.activeNode.owner = file.ownerId;

        this.recomputeFolderViews();

        alert("opening file: " + file.name);
    };

    handleFileCreateClick = (folderNode, ownerId, isFolder) => {
        let folderId = null;
        if(folderNode === null){
            // clicked from button
            // is active node from the current owner?
            if(this.activeNode.owner === ownerId){
                // take own root folder
                folderId = this.activeNode.id;
                // is the active node a folder? if not set to parent folder
                if(!this.activeNode.isFolder)
                    folderId = this.docs[folderId].parent;
            } else if (ownerId === this.userId) {
                // not set to anything yet => place in user root
                folderId = this.root;
            }

        } else {
            folderId = folderNode.id;
        }

        // check it is not a root id of another user
        if(folderId && folderId.length >= user_share_root_prefix.length && folderId.startsWith(user_share_root_prefix))
            folderId = null;

        if(folderId === null) {
            // you are not allowed to write here
            alert("insufficient permission");
            return;
        }

        // TODO check permission level if shared folder

        // create placeholder file or open dialog
        this.setState({
           activeDialog: <InputDialog
               title={"New " + (isFolder?"Folder":"File")}
               onCreate={isFolder? (folder) => this.handleFolderCreate(folderId, folder) :(filename) => this.handleFileCreate(folderId, filename)}
               onCancel={this.closeDialog}
           />
        });
        //alert("file/folder may be created in " + this.folder[folderId].name);
    };

    handleFileCreate = (folderId, filename) => {
        // name collision
        const parent = this.folder[folderId];
        for(let fileId of parent.docs){
            if(this.docs[fileId].name === filename){
                // file already exists
                this.handleUserError("a file with the same name already exists");
                this.closeDialog();
                return;
            }
        }

        // server request
        API.createFile(folderId, filename, (data) => this.handleFileCreated(data.id, folderId, filename),
            (error) => {this.closeDialog(); this.handleRequestError(error);});
    };

    handleFileCreated = (fileId, parentId, filename) => {
        this.closeDialog();
        // add doc
        this.docs[fileId] = this.makeDocument(filename, fileId, parentId);

        // add file
        this.folder[parentId].docs.push(fileId);

        this.recomputeFolderViews();
    };

    handleFolderCreate = (folderId, foldername) => {
        // name collision
        const parent = this.folder[folderId];
        for(let fid of parent.folder){
            if(this.folder[fid].name === foldername){
                // file already exists
                this.handleUserError("a folder with the same name already exists");
                this.closeDialog();
                return;
            }
        }

        // TODO check if folder already exists etc.
        API.createFolder(folderId, foldername, (data) => this.handleFolderCreated(data.id, folderId, foldername),
            (error) => {this.closeDialog(); this.handleRequestError(error);});
    };

    handleFolderCreated = (folderId, parentId, foldername) => {
        this.closeDialog();

        this.folder[folderId] = this.makeUnloadedFolder(foldername, folderId, parentId);
        // set the folder to loaded since it was just created
        this.folder[folderId].loading = false;

        this.folder[parentId].folder.push(folderId);

        this.recomputeFolderViews();
    };

    closeDialog = () => {
        this.setState({
           activeDialog: null,
        });
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

            // compare with active thingy
            if(this.activeNode.id === id && this.activeNode.isFolder === isFolder){
                this.activeNode.id = null;
                this.activeNode.owner = null;
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
        let userTree = this.loadFolderView(this.root, null, this.userId);

        let shareTrees = [];
        for(let user of this.users){
            shareTrees.push({
                name: user.name,
                id: user.id,
                root: this.loadFolderView(user.root, null, user.id),
            });
        }

        this.setState({
            root: userTree,
            shares: shareTrees,
        });
    };

    getSharedFiles = () => {
        let rows = [];
        for(let user of this.state.shares){
            const username = "Shared by " + user.name;
            rows.push(
                this.getFileTree(username, user.root, user.id)
            );
        }
        return rows;
    };

    loadFolderView = (folderId, parent, ownerId) => {
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
            ownerId: ownerId,
        };

        // load children
        for(let folderId of node.folder) {
            view.children.push(this.loadFolderView(folderId, view, ownerId));
        }
        // TODO sort alphanumeric


        for(let docId of node.docs) {
            view.children.push(this.loadDocView(docId, view, ownerId));
        }

        return view;
    };

    loadDocView = (docId, parent, ownerId) => {
        const node = this.docs[docId];

        return {
            name: node.name,
            id: node.id,
            active: (!this.activeNode.isFolder && this.activeNode.id === docId),
            parent: parent,
            ownerId: ownerId,
        };
    };

    //  {this.state.activeDialog !== null? this.state.activeDialog : ""}
    render() {
        return (
            <div>
                {this.getFileTree("My Files", this.state.root, this.userId)}
                {this.getSharedFiles()}
                {this.state.activeDialog?
                    <ModalContainer onClose={() => {}}>
                        {this.state.activeDialog}
                    </ModalContainer>:''}

            </div>
        );
    }
}