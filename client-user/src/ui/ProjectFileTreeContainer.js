import React from 'react';
import PropTypes from 'prop-types';
import FileTree from "./FileTree";
import * as API from '../ServerApi'
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import InputDialog from "./InputDialog";
import ShareDialog from "./ShareDialog";
import {store} from "../Redux";
import Button from "./base/Button";
import LinkedText from "./base/LinkedText";
import {createFolder} from "../ServerApi";

// helper
const copy = (object) => {
    return JSON.parse(JSON.stringify(object));
};

/**
 * this renders the file tree of the user as well as files shared for him
 */
export default class ProjectFileTreeContainer extends React.Component {

    /**
     * propTypes
     * showDialog {function(Dialog: object) callback when a dialog should be displayed
     */
    static get propTypes() {
        return {
            showDialog: PropTypes.func.isRequired,
            projectId: PropTypes.string.isRequired,
            projectTitle: PropTypes.string.isRequired,
            permissions: PropTypes.number.isRequired,
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

    // name = null => it is a folder
    activeNode = {
        path: null,
        name: null,
    };

    componentDidMount() {
        API.getFileTree(this.props.projectId, this.handleFileTreeReceive, this.handleError);
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
    };

    handleFileTreeReceive = (body) => {
        for(let obj of body){
            this.insertFolder(obj.path, obj.children);
        }
        this.recalcTreeView();
    };

    handleFolderCreated = (path) => {
        // insert path
        this.insertFolder(path, []);

        this.recalcTreeView();
    };

    handleFileCreateClick = (node) => {
        let path = "/";
        if(node === null){
            // button click
            return;
        }
        else {
            path = this.getNodePath(node) + node.name + "/";
        }

        this.props.showDialog(<InputDialog
            title="Create File"
            onCreate={(title) => {
                this.props.showDialog(null);
                this.handleFileCreate(path, title);
            }}
            onCancel={() => this.props.showDialog(null)}
        />);
    };

    handleFileCreate = (path, filename) => {
        API.createDocument(this.props.projectId, path, filename, false, (body) => this.handleFileCreated(path, filename, body.id), this.handleError);
    };

    handleFileCreated = (path, filename, id) => {
        // insert file
        let folder = this.getFolder(path, false);
        // insert file
        folder.docs.push({
            name: filename,
            id: id,
        });

        this.activeNode.name = filename;
        this.activeNode.path = path;

        this.recalcTreeView();
    };

    handleFolderCreateClick = (node) => {
        let path = "/dummy/";
        if(node === null){
            // button click
            return;
        }
        else {
            path = this.getNodePath(node) + node.name + "/";
            // TODO only do this if folder creation was not cancelled?
            if(!node.toggled){
                this.getFolder(path).toggled = true;
                this.recalcTreeView();
            }
        }

        // open modal dialog
        this.props.showDialog(<InputDialog
            title="Create Folder"
            onCreate={(title) => {
                this.props.showDialog(null);
                this.handleFolderCreate(path + title + "/");
            }}
            onCancel={() => this.props.showDialog(null)}
        />);


    };

    handleFolderCreate = (path) => {
        API.createFolder(this.props.projectId, path, () => this.handleFolderCreated(path), this.handleError);
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

    handleFolderLoad = (node) => {
        // open folder
        let path = this.getNodePath(node);
        let folder = this.getFolder(path + node.name, false);
        folder.toggled = true;

        this.activeNode.path = path + node.name + "/";
        this.activeNode.name = null;

        this.recalcTreeView();
    };

    handleFolderClose = (node) => {
        // close folder
        let path = this.getNodePath(node);
        let folder = this.getFolder(path + node.name, false);
        folder.toggled = false;

        this.activeNode.path = path + node.name + "/";
        this.activeNode.name = null;

        this.recalcTreeView();
    };



    createFolderView = (folder, parent, isRoot, path) => {
        let res = {
            name: folder.name,
            children: [],
            toggled: folder.toggled,
            parent: parent,
            active: (this.activeNode.name === null) && (this.activeNode.path === path + folder.name + "/"),
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
            parent: parent,
            active: (this.activeNode.path === path) && (this.activeNode.name === doc.name),
        };
    };

    recalcTreeView = () => {

        let root = this.createFolderView(this.root, null, true, "/");
        this.setState({
            root: root,
        });
    };

    render() {
        /*return (
            <div>
                {this.getFileTree("My Files", this.state.root, this.userId)}
                {this.state.activeDialog?
                    <ModalContainer onClose={() => {}}>
                        {this.state.activeDialog}
                    </ModalContainer>:''}

            </div>
        );*/
        return (
            <div>
                <FileTree
                    label={this.props.projectTitle}
                    data={this.state.root.children}
                    onFileCreateClick={this.handleFileCreateClick}
                    onFolderCreateClick={this.handleFolderCreateClick}
                    onFolderLoad={this.handleFolderLoad}
                    onFolderClose={this.handleFolderClose}
                />
            </div>
        );
    }

    /*
            onFolderLoad: PropTypes.func.isRequired,
            onFolderClose: PropTypes.func.isRequired,
            onFileLoad: PropTypes.func.isRequired,
            onFolderCreateClick: PropTypes.func.isRequired,
            onDeleteClick: PropTypes.func.isRequired,
            onShareClick: PropTypes.func.isRequired,
            displayButtons: PropTypes.bool,
            displayShared: PropTypes.bool,
     */
}