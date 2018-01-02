import React from 'react';
import PropTypes from 'prop-types';
import FileTree from "../ui/FileTree";
import ProjectFileTreeContainer from "../ui/ProjectFileTreeContainer";
import Button from "../ui/base/Button";
import * as API from '../ServerApi';
import {store} from "../redux/Redux";
import * as userActions from '../redux/userActions';
import * as projectActions from '../redux/projectActions';
import ProjectSelectContainer from "../ui/ProjectSelectContainer";
import {ModalContainer} from "react-modal-dialog";

export class DashboardScreen extends React.Component {
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
            activeDialog: null,
        }
    }


    handleLogOutClick = () => {
        API.logOut(() => {
            // reset data
            store.dispatch(userActions.logOut());
            this.props.history.push("/");
        }, this.handleError);
    };


    handleShowDialog = (dialog) => {
        this.setState({
            activeDialog: dialog,
        })
    };


    handleProjectClick = (projectId, title, permissions) => {
        // open the project
        store.dispatch(projectActions.selectProject(projectId, title, permissions));
        this.props.history.push("/project");
    };


    handleError = (err) => {
        alert(err);
    };


    render() {
        return (
            <div>
                <ProjectSelectContainer
                    showDialog={this.handleShowDialog}
                    onProjectClick={this.handleProjectClick}
                />


                <Button
                    label="Log out"
                    onClick={this.handleLogOutClick}
                />

                {this.state.activeDialog &&
                    <ModalContainer>
                        {this.state.activeDialog}
                    </ModalContainer>}
            </div>
        );
    }
}