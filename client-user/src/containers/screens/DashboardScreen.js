import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Button from "../../components/base/Button";
import * as API from '../../ServerApi';
import * as UserActionCreators from '../../actions/user';
import * as ProjectActionsCreators from '../../actions/project';
import ProjectSelectContainer from "../../components/project/ProjectSelectContainer";
import {ModalContainer} from "react-modal-dialog";

class DashboardScreen extends React.Component {
    /**
     * propTypes
     * @property {Object} user user-state
     * @property {Object} userActions bound action creators (user)
     * @property {Object} projectActions bound action creators (project)
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
        API.logout(this.props.user.token ,() => {
            // reset data
            this.props.userActions.logout();
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
        this.props.projectActions.select(projectId, title, permissions);
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