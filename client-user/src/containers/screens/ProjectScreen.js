/**
 * @author progmem
 * @date 02.01.18
 */

import React from 'react';
import PropTypes from 'prop-types';
import ProjectFileTreeContainer from "../ProjectFileTreeContainer";
import Button from "../../components/base/Button";
import { store } from "../../Redux";
import { ModalContainer } from "react-modal-dialog";
import * as projectActions from '../../actions/project';


export class ProjectScreen extends React.Component {
    /**
     * propTypes
     */
    static get propTypes() {
        return {
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
        store.dispatch(projectActions.deselect());
        this.props.history.push("/dashboard");
    };


    render() {
        const projectStore = store.getState().project;

        // TODO go back to dashboard if unset

        return (
            <div>
                <Button
                    label="Back to Projects"
                    onClick={this.handleDeselectProject}
                />

                <ProjectFileTreeContainer
                    projectId={projectStore.projectId}
                    projectTitle={projectStore.title}
                    permissions={projectStore.permissions}
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