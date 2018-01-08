import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Button from "../../components/base/Button";
import * as API from '../../ServerApi';
import * as UserActionCreators from '../../actions/user';
import * as ProjectActionsCreators from '../../actions/project';
import * as AppActionsCreators from '../../actions/app';
import ProjectSelectContainer from "../../containers/ProjectSelectContainer";


class DashboardScreen extends React.Component {
    /**
     * propTypes
     * @property {Object} user user-state
     * @property {Object} userActions bound action creators (user)
     * @property {Object} projectActions bound action creators (project)
     * @property {Object} appActions bound action creators (app)
     */
    static get propTypes() {
        return {
            user: PropTypes.object.isRequired,
            userActions: PropTypes.object.isRequired,
            projectActions: PropTypes.object.isRequired,
            appActions: PropTypes.object.isRequired,
        };
    }

    static get defaultProps() {
        return {};
    }

    handleLogOutClick = () => {
        API.logout(this.props.user.token ,() => {
            // reset data
            this.props.userActions.logout();
            this.props.history.push("/");
        }, this.handleError);
    };


    handleShowDialog = (dialog) => {
        this.props.appActions.showDialog(dialog);
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
                    user={this.props.user}
                />


                <Button
                    label="Logout"
                    onClick={this.handleLogOutClick}
                />
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        user: state.user,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        userActions: bindActionCreators(UserActionCreators, dispatch),
        projectActions: bindActionCreators(ProjectActionsCreators, dispatch),
        appActions: bindActionCreators(AppActionsCreators, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardScreen);