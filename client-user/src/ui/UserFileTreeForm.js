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
    convertServerFolderData = (data) => {
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
                });
            }
        }

        // files
        if(data.files) {
            for(let child of data.files) {
                children.push({
                    name: child.name,
                    id: child.id
                });
            }
        }

        return children;
    };

    handleFolderReceive = (data, folderNode) => {
        // set the root tree
        folderNode.children = this.convertServerFolderData(data);
        folderNode.toggled = true;


    };

    handleUserShares = (data) => {
        if(!data.users)
            return;

        for(let user in data.users)
        {
            this.state.users.push({
                name: user.name,
                email: user.email,
                id: user.id,
                
            });
        }
    };

    handleRequestError = (error) => {
        // TODO make prettier
        alert(error);
    };

    // member variables
    sharedNames = ["Peter", "Günther"];

    getSingleFileTree = (name) => {
        return (
          <FileTree
            label={name}
            data={{}}
          />
        );
    };

    getSharedFiles = () => {
        let rows = [];
        for(let i = 0; i < this.sharedNames.length; ++i){
            rows.push(this.getSingleFileTree("Shared by " + this.sharedNames[i]));
        }
        return rows;
    };

    render() {
        return (
            // TODO center
            <div>
                <FileTree
                    label="My Files"
                    data={this.state.root.children}
                />
                {this.getSharedFiles()}
            </div>
        );
    }
}