import React from 'react';
import PropTypes from 'prop-types';
import styled, {css} from 'styled-components';
import * as API from '../ServerApi'
import InputDialog from "../components/dialogs/InputDialog";
import ShareDialog from "../components/dialogs/ShareDialog";
import {Button} from "../components/base/Button";
import LinkedText from "../components/base/LinkedText";
import ButtonIcon from "../components/base/ButtonIcon";


const SubInfo = styled.div`
    font-size: 14px;
    color: #666;
`;


const ProjectListItem = styled.div`
    padding-top: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
`;


const ProjectListItemInner = styled.div`
    flex: ${props => props.primary ? '3': '1'};
    display: flex;
    align-items: center;
    justify-content: ${props => props.left ? 'flex-start' : ( props.right ? 'flex-end' : 'center' )};
`;


export default class ProjectSelectContainer extends React.Component {
    /**
     * propTypes
     * @property {function(dialog: object) showDialog callback when a dialog should be displayed
     * @property {function(projectId: string, title: string, permissions: number)} onProjectClick callback when a project should be opened
     * @property {object} user user information
     */
    static get propTypes() {
        return {
            showDialog: PropTypes.func.isRequired,
            onProjectClick: PropTypes.func.isRequired,
            user: PropTypes.object.isRequired,
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
        API.getProjects(this.props.user.token ,this.handleProjectsReceived, this.handleError);
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
        API.createProject(this.props.user.token, title, (body) => this.handleProjectCreated(title, body.projectId), this.handleError);
    };

    handleProjectCreated = (title, id) => {
        // add project to projects list
        const ownerName = this.props.user.username;
        const ownerEmail = this.props.user.email;

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
        API.deleteProject(this.props.user.token, project.id, () => this.handleProjectDeleted(project.id), this.handleError);
    };

    handleProjectDeleted = () => {
        API.getProjects(this.props.user.token, this.handleProjectsReceived, this.handleError);
    };

    handleProjectGetShares = (project) => {
        this.props.showDialog(<ShareDialog
            title="Share Project"
            projectId={project.id}
            onCancel={() => this.props.showDialog(null)}
            user={this.props.user}
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
                <ProjectListItem key={p.id}>
                    <ProjectListItemInner primary left>
                        <div>
                            <div>
                                <LinkedText label={p.title} onClick={() => this.handleProjectClick(p)}/>
                            </div>
                            <SubInfo>
                                Shared by: {p.ownerName} ({p.ownerEmail})
                            </SubInfo>
                        </div>
                    </ProjectListItemInner>
                    <ProjectListItemInner right>
                        <Button
                            onClick={() => this.handleProjectGetShares(p)}
                            marginLeft
                            marginRight
                        >
                            Shares
                        </Button>
                        <Button
                            onClick={() => this.handleProjectDelete(p)}
                        >
                            Delete
                        </Button>
                    </ProjectListItemInner>
                </ProjectListItem>
            );
        }

        return list;
    };

    render() {
        return (
            <div>
                <Button onClick={this.handleCreateProjectClick}>
                    Create Project
                </Button>
                {this.getProjectView()}
            </div>
        );
    }
}