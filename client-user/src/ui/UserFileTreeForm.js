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
        if(data.docs) {
            for(let child of data.docs) {
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

        for(let user of data.users)
        {
            const folderData = this.convertServerFolderData(user);
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

    getSharedFiles = () => {
        let rows = [];
        for(let user of this.state.users){
            const username = "Shared by " + user.name;
            rows.push(
                <FileTree
                    label={username}
                    data={user.children}
                />
            );
        }
        return rows;
    };

    render() {
        return (
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