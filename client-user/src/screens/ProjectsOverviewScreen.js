import React from 'react';
import PropTypes from 'prop-types';
import FileTree from "../ui/FileTree";
import ProjectFileTreeContainer from "../ui/ProjectFileTreeContainer";
import Button from "../ui/base/Button";
import * as API from '../ServerApi'
import {store} from "./../Redux";
import * as action from './../Actions'
import ProjectSelectContainer from "../ui/ProjectSelectContainer";
import {ModalContainer} from "react-modal-dialog";

export default class ProjectsOverviewScreen extends React.Component {
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
            project: null,
        }
    }

    handleLogOutClick = () => {
        API.logOut(() => {
            // reset data
            store.dispatch(action.logOut());
            this.props.history.push("/");
        }, this.handleError);
    };

    handleShowDialog = (dialog) => {
        this.setState({
            activeDialog: dialog,
        })
    };

    handleProjectClick = (id, title, permissions) => {
        // open the project
        this.setState({
            project: {
                id: id,
                title: title,
                permissions: permissions,
            }
        });
    };

    handleProjectDeselect = () => {
        this.setState({
            project: null,
        });
    };

    handleError = (err) => {
        alert(err);
    };

    render() {
        return (
            <div>
                {this.state.project?
                    // display project tree
                    <ProjectFileTreeContainer
                        projectId={this.state.project.id}
                        projectTitle={this.state.project.title}
                        permissions={this.state.project.permissions}
                        showDialog={this.handleShowDialog}
                        onProjectDeselect={this.handleProjectDeselect}
                    />:

                    // select project
                    <ProjectSelectContainer
                        showDialog={this.handleShowDialog}
                        onProjectClick={this.handleProjectClick}
                    />
                }


                <Button
                    label="Log out"
                    onClick={this.handleLogOutClick}
                />

                {this.state.activeDialog?
                    <ModalContainer>
                        {this.state.activeDialog}
                    </ModalContainer>:''}
            </div>
        );
    }
}