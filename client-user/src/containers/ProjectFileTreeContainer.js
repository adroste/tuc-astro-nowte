import React from 'react';
import PropTypes from 'prop-types';
import FileTree from "../components/project/FileTree";
import * as API from '../ServerApi'
import InputDialog from "../components/dialogs/InputDialog";
import {DialogResultEnum, DialogButtonsEnum} from "../components/dialogs/Common";
import {greenFilledTheme} from "../components/base/Button";


/**
 * this renders the file tree of the user as well as files shared for him
 */
export default class ProjectFileTreeContainer extends React.Component {

    /**
     * propTypes
     * @property {function(Dialog: object)} pushDialog callback when a dialog should be displayed
     * @property {function()} popDialog callback when a dialog should be closed
     * @property {object} user user state
     * @property {function(title: string, documentId: string)} onDocumentSelected callback when user selects a file/document
     */
    static get propTypes() {
        return {
            pushDialog: PropTypes.func.isRequired,
            popDialog: PropTypes.func.isRequired,
            projectId: PropTypes.string.isRequired,
            projectTitle: PropTypes.string.isRequired,
            permissions: PropTypes.number.isRequired,
            user: PropTypes.object.isRequired,
            onDocumentSelected: PropTypes.func.isRequired,
        };
    }

    static get defaultProps() {
        return {};
    }

    constructor(props){
        super(props);

        this.state = {
            root: {
                name: 'root',
                children: [],
                toggled: true,
            },

        };
    }

    root = {
        name: 'root',
        folder: [],
        docs: [],
    };

    // id = null => it is a folder
    activeNode = {
        path: null,
        id: null,
    };

    componentDidMount() {
        API.getFileTree(this.props.user.token, this.props.projectId, this.handleFileTreeReceive, this.handleError);
    }

    getFolder = (path, create) => {
        const folders = path.split("/");
        let curFolder = this.root;
        for(let i = 1; i < folders.length; ++i){
            if(folders[i] !== ""){
                let idx = curFolder.folder.findIndex((obj) => { return folders[i] === obj.name; } );
                if(idx === -1){
                    if(create) {
                        // create new folder
                        idx = curFolder.folder.push({
                            name: folders[i],
                            folder: [],
                            docs: [],
                            toggled: false,
                        }) - 1;
                    }
                    else return null;
                }
                curFolder = curFolder.folder[idx];
            }
        }
        return curFolder;
    };

    insertFolder = (path, children) => {
        let folder = this.getFolder(path, true);

        // add children
        if(children){
            for(let doc of children)
            folder.docs.push({
                name: doc.title,
                id: doc.documentId,
            });
        }
    };

    handleFileTreeReceive = (body) => {
        for(let obj of body){
            this.insertFolder(obj.path, obj.children);
        }
        this.recalcTreeView();
    };

    handleError = (msg) => {
        alert(msg);
    };

    getNodePath = (node) => {
        let path = "/";

        while (node.parent){
            node = node.parent;
            path = "/" + node.name + path;
        }
        return path;
    };

    ///////////////
    /// FOLDER CREATE
    ///////////////

    handleFolderButtonClick = () => {
        let path = "/";
        if(this.activeNode.path)
            path = this.activeNode.path;

        this.handleFolderCreate(path);
    };

    handleFolderCreateClick = (node) => {
        let path = "/";
        if(node){

            path = this.getNodePath(node) + node.name + "/";
            // TODO only do this if folder creation was not cancelled?
            if(!node.toggled){
                this.getFolder(path).toggled = true;
                this.recalcTreeView();
            }
        }

        this.handleFolderCreate(path);
    };

    handleFolderCreate = (path) => {
        const handleResult = (result, inputText) => {
            this.props.popDialog();

            if (result === DialogResultEnum.OK_YES)
                API.createFolder(this.props.user.token, this.props.projectId, path + inputText + "/", () => this.handleFolderCreated(path + inputText + "/"), this.handleError);
        };

        this.props.pushDialog(
            <InputDialog
                title="Create folder"
                placeholder="folder name"
                onResult={handleResult}
                buttons={DialogButtonsEnum.OK}
                buttonOkYesText="Create"
                buttonOkYesTheme={greenFilledTheme}
            />
        );
    };

    handleFolderCreated = (path) => {
        // insert path
        this.insertFolder(path, []);

        this.recalcTreeView();
    };

    ///////////////
    /// FILE CREATE
    ///////////////

    handleFileButtonClick = (node) => {
        let path = "/";
        if(this.activeNode.path)
            path = this.activeNode.path;

        this.handleFileCreate(path);
    };

    handleFileCreateClick = (node) => {
        let path = "/";
        if(node){
            path = this.getNodePath(node) + node.name + "/";
        }

        this.handleFileCreate(path);
    };

    handleFileCreate = (path) => {
        const handleResult = (result, inputText) => {
            this.props.popDialog();

            if (result === DialogResultEnum.OK_YES)
            API.createDocument(this.props.user.token, this.props.projectId, path, inputText, false, (body) => this.handleFileCreated(path, inputText, body.documentId), this.handleError);
        };

        this.props.pushDialog(
            <InputDialog
                title="Create document"
                placeholder="document name"
                onResult={handleResult}
                buttons={DialogButtonsEnum.OK}
                buttonOkYesText="Create"
                buttonOkYesTheme={greenFilledTheme}
            />
        );
    };

    handleFileCreated = (path, filename, id) => {
        // insert file
        let folder = this.getFolder(path, false);
        // insert file
        folder.docs.push({
            name: filename,
            id: id,
        });

        this.activeNode.id = id;
        this.activeNode.path = path;

        this.recalcTreeView();
    };

    ///////////////
    /// FOLDER CLICK
    ///////////////

    handleFolderLoad = (node) => {
        // open folder
        let path = this.getNodePath(node);
        let folder = this.getFolder(path + node.name, false);
        folder.toggled = true;

        this.activeNode.path = path + node.name + "/";
        this.activeNode.id = null;

        this.recalcTreeView();
    };

    handleFolderClose = (node) => {
        // close folder
        let path = this.getNodePath(node);
        let folder = this.getFolder(path + node.name, false);
        folder.toggled = false;

        this.activeNode.path = path + node.name + "/";
        this.activeNode.id = null;

        this.recalcTreeView();
    };

    ///////////////
    /// FILE CLICK
    ///////////////

    handleFileLoad = (node) => {
        const path = this.getNodePath(node);

        this.activeNode.path = path;
        this.activeNode.id = node.id;

        this.recalcTreeView();

        //alert(node.name + ": " + node.id); //debug
        this.props.onDocumentSelected(node.name, node.id);
    };

    ///////////////
    /// DELETION
    ///////////////

    handleDeleteClick = (node) => {
        let path = this.getNodePath(node);

        if(node.children){
            // folder
            API.deleteFolder(this.props.user.token, this.props.projectId, path + node.name + "/", () => this.handleFolderDeleted(node.name, path), this.handleError);
        }
        else {
            // file
            API.deleteDocument(this.props.user.token, this.props.projectId, path, node.id, () => this.handleFileDeleted(path, node.id), this.handleError);
        }
    };

    handleFolderDeleted = (name, parentPath) => {
        let parent = this.getFolder(parentPath, false);
        if(!parent)
            return;

        // delete folder
        const idx = parent.folder.findIndex((obj) => {return obj.name === name;});
        if(idx === -1)
            return;

        parent.folder.splice(idx, 1);

        // reset active element (it was deleted)
        this.activeNode.id = null;
        this.activeNode.path = null;

        this.recalcTreeView();
    };

    handleFileDeleted = (path, documentId) => {
        //remove document from list
        const folder = this.getFolder(path, false);
        if(!folder)
            return;

        const idx = folder.docs.findIndex((obj) => { return obj.id === documentId;});
        if(idx === -1)
            return;

        folder.docs.splice(idx, 1);

        // reset active element (it was deleted)
        this.activeNode.id = null;
        this.activeNode.path = null;

        this.recalcTreeView();
    };

    ///////////////
    /// VIEW
    ///////////////

    createFolderView = (folder, parent, isRoot, path) => {
        let res = {
            name: folder.name,
            children: [],
            toggled: folder.toggled,
            parent: parent,
            active: (this.activeNode.id === null) && (this.activeNode.path === path + folder.name + "/"),
        };

        for(let f of folder.folder){
            res.children.push(this.createFolderView(f, isRoot?null:res, false, isRoot?"/":(path + folder.name + "/")));
        }

        for(let d of folder.docs){
            res.children.push(this.createDocView(d, isRoot?null:res, isRoot?"/":(path + folder.name + "/")));
        }

        return res;
    };

    createDocView = (doc, parent, path) => {
        return {
            name: doc.name,
            id: doc.id,
            parent: parent,
            active: (this.activeNode.path === path) && (this.activeNode.id === doc.id),
        };
    };

    recalcTreeView = () => {

        let root = this.createFolderView(this.root, null, true, "/");
        this.setState({
            root: root,
        });
    };

    render() {
        return (
            <div>
                <FileTree
                    label={this.props.projectTitle}
                    data={this.state.root.children}
                    onFileCreateClick={this.handleFileCreateClick}
                    onFolderCreateClick={this.handleFolderCreateClick}
                    onFolderLoad={this.handleFolderLoad}
                    onFolderClose={this.handleFolderClose}
                    onFileLoad={this.handleFileLoad}

                    onFolderButtonClick={this.handleFolderButtonClick}
                    onFileButtonClick={this.handleFileButtonClick}

                    onDeleteClick={this.handleDeleteClick}
                />
            </div>
        );
    }
}