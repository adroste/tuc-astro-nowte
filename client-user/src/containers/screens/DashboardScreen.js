import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import FileTree from "../../components/project/FileTree";
import ProjectFileTreeContainer from "../../components/project/ProjectFileTreeContainer";
import Button from "../../components/base/Button";
import * as API from '../../ServerApi';
import {store} from "../../Redux";
import * as UserActionCreators from '../../actions/user';
import * as ProjectActionsCreators from '../../actions/project';
import ProjectSelectContainer from "../../components/project/ProjectSelectContainer";
import {ModalContainer} from "react-modal-dialog";

class DashboardScreen extends React.Component {
    /**
     * propTypes
     */
    static get propTypes() {
        return {
            user: PropTypes.object.isRequired,
            userActions: PropTypes.object.isRequired,
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


    handleLogOutClick = () => {
        API.logOut(() => {
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


const mapStateToProps = (state) => {
    return {
        user: state.user
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        userActions: bindActionCreators(UserActionCreators, dispatch),
        projectActions: bindActionCreators(ProjectActionsCreators, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardScreen);