/**
 * @author progmem
 * @date 02.01.18
 */

import React from 'react';
import PropTypes from 'prop-types';
import ProjectFileTreeContainer from "../ProjectFileTreeContainer";
import Button from "../../components/base/Button";
import { ModalContainer } from "react-modal-dialog";
import * as UserActionCreators from "../../actions/user";
import {bindActionCreators} from "redux/index";
import {connect} from "react-redux";
import * as ProjectActionsCreators from "../../actions/project";


class ProjectScreen extends React.Component {
    /**
     * propTypes
     * @property {Object} project project-state
     * @property {Object} projectActions bound action creators (project)
     */
    static get propTypes() {
        return {
            project: PropTypes.object.isRequired,
            projectActions: PropTypes.object.isRequired
        };
    }

    static get defaultProps() {
        return {};
    }


    constructor(props){
        super(props);

        this.state = {
            activeDialog: null,
        }
    }


    handleShowDialog = (dialog) => {
        this.setState({
            activeDialog: dialog,
        })
    };


    handleDeselectProject = () => {
        this.props.projectActions.deselect();
        this.props.history.push("/dashboard");
    };


    render() {
        // TODO go back to dashboard if unset

        return (
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
                />

                {this.state.activeDialog &&
                    <ModalContainer>
                        {this.state.activeDialog}
                    </ModalContainer>}
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        project: state.project
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        projectActions: bindActionCreators(ProjectActionsCreators, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectScreen);