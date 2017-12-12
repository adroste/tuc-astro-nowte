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
     */
    static get propTypes() {
        return {};
    }

    static get defaultProps() {
        return {};
    }

    constructor(props){
        super(props);

        this.state = {
            projects: []
        };
    }

    projects = [];

    componentDidMount() {
        API.getProjects(this.handleProjectsReceived, this.handleError);
    }

    handleProjectsReceived = (body) => {
        // add to projects list
        for(let project of body){
            this.projects.push({
                id: project.id,
                title: project.title,
                permissions: project.access.permissions,
                ownerName: project.access.grantedBy.name,
                ownerEmail: project.access.grantedBy.email,
            });
        }

        this.setState({
            projects: this.projects
        });
    };

    handleCreateProjectClick = () => {
        API.createProject("dummy", (body) => this.handleProjectCreated("dummy", body.projectId), this.handleError);
    };

    handleProjectCreated = (title, id) => {
        // add project to projects list
        const ownerName = store.getState().user.username;
        const ownerEmail = store.getState().user.email;

        this.projects.push({
            id: id,
            title: title,
            permissions: 5, // owner
            ownerName: ownerName,
            ownerEmail: ownerEmail,
        });

        this.setState({
            projects: this.projects,
        })
    };



    handleError = (msg) => {
        alert(msg);
    };

    getProjectView = () => {
        let list = [];
        // TODO make cool styling
        for (let p of this.state.projects) {
            list.push(
                <div>
                    <LinkedText label={p.title} onClick={() => {
                    }}/>
                    From: {p.ownerEmail}
                </div>
            );
        }

        return list;
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
                <h3>Projects</h3>
                <Button label="Create Project" onClick={this.handleCreateProjectClick}/>
                {this.getProjectView()}
            </div>
        );
    }
}