import React from 'react';
import PropTypes from 'prop-types';
import FileTree from "../../components/project/FileTree";
import ProjectFileTreeContainer from "../ProjectFileTreeContainer";
import Button from "../../components/base/Button";
import * as API from '../../ServerApi';
import {store} from "../../Redux";
import * as userActions from '../../actions/user';
import * as projectActions from '../../actions/project';
import ProjectSelectContainer from "../ProjectSelectContainer";
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
        // TODO does this work?
        API.logout(this.props.user.token ,() => {
            // reset data
            store.dispatch(userActions.logout());
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
        store.dispatch(projectActions.select(projectId, title, permissions));
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