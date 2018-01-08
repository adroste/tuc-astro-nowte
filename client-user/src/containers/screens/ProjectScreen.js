/**
 * @author progmem
 * @date 02.01.18
 */

import React from 'react';
import PropTypes from 'prop-types';
import ProjectFileTreeContainer from "../ProjectFileTreeContainer";
import Button from "../../components/base/Button";
import { ModalContainer } from "react-modal-dialog";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as ProjectActionsCreators from "../../actions/project";
import * as AppActionsCreators from "../../actions/app";
import {Editor} from "../../components/editor/Editor";
import "./ProjectScreen.css";

class ProjectScreen extends React.Component {
    /**
     * propTypes
     * @property {Object} project project-state
     * @property {Object} user user-state
     * @property {Object} projectActions bound action creators (project)
     * @property {Object} appActions bound action creators (app)
     */
    static get propTypes() {
        return {
            project: PropTypes.object.isRequired,
            user: PropTypes.object.isRequired,
            projectActions: PropTypes.object.isRequired,
            appActions: PropTypes.object.isRequired,
        };
    }

    static get defaultProps() {
        return {};
    }

    handleShowDialog = (dialog) => {
        this.props.appActions.showDialog(dialog);
    };


    handleDeselectProject = () => {
        this.props.projectActions.deselect();
        this.props.history.push("/dashboard");
    };


    render() {
        // TODO go back to dashboard if unset

        return (
            <div className="container">
                <div>
                    <Button
                        label="Back to Projects"
                        onClick={this.handleDeselectProject}
                    />

                    <ProjectFileTreeContainer
                        projectId={this.props.project.projectId}
                        projectTitle={this.props.project.title}
                        permissions={this.props.project.permissions}
                        showDialog={this.handleShowDialog}
                        onProjectDeselect={this.handleDeselectProject}
                        user={this.props.user}
                    />
                </div>

                <Editor
                    user={this.props.user}
                />
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        project: state.project,
        user: state.user,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        projectActions: bindActionCreators(ProjectActionsCreators, dispatch),
        appActions: bindActionCreators(AppActionsCreators, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectScreen);