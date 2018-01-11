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

export default class ProjectSelectContainer extends React.Component {
    /**
     * propTypes
     * showDialog {function(Dialog: object) callback when a dialog should be displayed
     * onProjectClick {function(id: string, title: string, permissions: number)} callback when a project should be opened
     */
    static get propTypes() {
        return {
            showDialog: PropTypes.func.isRequired,
            onProjectClick: PropTypes.func.isRequired,
        };
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
        this.projects = [];
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
        this.props.showDialog(<InputDialog
            title="Create Project"
            onCreate={(title) => {
                this.props.showDialog(null);
                this.handleCreateProject(title);
            }}
            onCancel={() => this.props.showDialog(null)}
        />);
    };

    handleCreateProject = (title) => {
        API.createProject(title, (body) => this.handleProjectCreated(title, body.projectId), this.handleError);
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

    handleProjectClick = (project) => {
        this.props.onProjectClick(project.id, project.title, project.permissions);
    };

    handleProjectDelete = (project) => {
        // TODO add yes no dialog
        API.deleteProject(project.id, () => this.handleProjectDeleted(project.id), this.handleError);
    };

    handleProjectDeleted = () => {
        API.getProjects(this.handleProjectsReceived, this.handleError);
    };

    handleProjectGetShares = (project) => {
        this.props.showDialog(<ShareDialog
            title="Share Project"
            projectId={project.id}
            onCancel={() => this.props.showDialog(null)}
        />);
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
                    <LinkedText label={p.title} onClick={() => this.handleProjectClick(p)}/>
                    From: {p.ownerEmail}
                    <Button label="Shares" onClick={() => this.handleProjectGetShares(p)} />
                    <Button label="Delete" onClick={() => this.handleProjectDelete(p)} />
                </div>
            );
        }

        return list;
    };

    render() {
        return (
            <div>
                <h3>Projects</h3>
                <Button label="Create Project" onClick={this.handleCreateProjectClick}/>
                {this.getProjectView()}
            </div>
        );
    }
}