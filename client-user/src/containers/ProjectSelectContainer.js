import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import * as API from '../ServerApi'
import InputDialog from "../components/dialogs/InputDialog";
import ShareDialog from "../components/dialogs/ShareDialog";
import {Button, greenFilledTheme, greyBorderTheme, redBorderTheme, redFilledTheme} from "../components/base/Button";
import {Link, greenHoverTheme} from "../components/base/Link";
import {MessageBoxDialog} from "../components/dialogs/MessageBoxDialog";
import {DialogResultEnum, DialogButtonsEnum} from "../components/dialogs/Common";
import {COLOR_CODES, FONT_SIZES} from "../Globals";


const SubInfo = styled.div`
    font-size: ${FONT_SIZES.NORMAL};
    color: ${COLOR_CODES.GREY};
`;


const ProjectListItem = styled(Link).attrs({
    theme: greenHoverTheme
})`
    padding-top: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid ${COLOR_CODES.GREY_LIGHT};
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
     * @property {function(dialog: object)} pushDialog callback when a dialog should be displayed
     * @property [function()} popDialog callback to close a dialog
     * @property {function(projectId: string, title: string, permissions: number)} onProjectClick callback when a project should be opened
     * @property {object} user user information
     */
    static get propTypes() {
        return {
            pushDialog: PropTypes.func.isRequired,
            popDialog: PropTypes.func.isRequired,
            onProjectClick: PropTypes.func.isRequired,
            user: PropTypes.object.isRequired,
        };
    }

    static get defaultProps() {
        return {};
    }


    projects = [];


    constructor(props){
        super(props);

        this.state = {
            projects: []
        };
    }


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
        const handleResult = (result, inputText) => {
            this.props.popDialog();

            if (result === DialogResultEnum.OK_YES)
                API.createProject(this.props.user.token, inputText, (body) => this.handleProjectCreated(inputText, body.projectId), this.handleError);        
        };

        this.props.pushDialog(
            <InputDialog
                title="Create Project"
                placeholder="project name"
                onResult={handleResult}
                buttons={DialogButtonsEnum.OK}
                buttonOkYesText="Create"
                buttonOkYesTheme={greenFilledTheme}
            />
        );
    };


    handleCreateProject = (title) => {
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


    handleProjectClick = (project) => (e) => {
        this.props.onProjectClick(project.id, project.title, project.permissions);
        e.preventDefault();
    };


    handleProjectDeleteClick = (project) => (e) => {
        const handleResult = (result) => {
            this.props.popDialog();

            if (result === DialogResultEnum.OK_YES)
                API.deleteProject(this.props.user.token, project.id, () => this.handleProjectDeleted(project.id), this.handleError);
        };

        this.props.pushDialog(
            <MessageBoxDialog
                title="Delete Project"
                onResult={handleResult}
                buttons={DialogButtonsEnum.YES_NO}
                buttonOkYesText="Delete"
                buttonOkYesTheme={redFilledTheme}
                buttonCancelNoText="Cancel"
                buttonCancelNoTheme={greyBorderTheme}
            >
                Do you really want to delete "{project.title}"?
            </MessageBoxDialog>
        );

        e.preventDefault();
        e.stopPropagation();
    };


    handleProjectDeleted = () => {
        API.getProjects(this.props.user.token, this.handleProjectsReceived, this.handleError);
    };


    handleProjectShareClick = (project) => (e) => {
        this.props.pushDialog(<ShareDialog
            title="Share Project"
            projectId={project.id}
            onClose={() => this.props.popDialog()}
            user={this.props.user}
        />);
        e.preventDefault();
        e.stopPropagation();
    };


    handleError = (msg) => {
        alert(msg);
    };


    getProjectView = () => {
        let list = [];

        for (let p of this.state.projects) {
            list.push(
                <ProjectListItem
                    key={p.id}
                    onClick={this.handleProjectClick(p)}
                >
                    <ProjectListItemInner primary left>
                        <div>
                            <div>
                                {p.title}
                            </div>
                            <SubInfo>
                                Shared by: {p.ownerName} ({p.ownerEmail})
                            </SubInfo>
                        </div>
                    </ProjectListItemInner>
                    <ProjectListItemInner right>
                        <Button
                            onClick={this.handleProjectShareClick(p)}
                            marginLeft
                            marginRight
                        >
                            Share
                        </Button>
                        <Button
                            onClick={this.handleProjectDeleteClick(p)}
                            theme={redBorderTheme}
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
                <Button
                    onClick={this.handleCreateProjectClick}
                    theme={greenFilledTheme}
                >
                    Create Project
                </Button>
                {this.getProjectView()}
            </div>
        );
    }
}