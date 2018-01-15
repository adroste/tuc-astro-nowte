import React from 'react';
import PropTypes from 'prop-types';
import styled, {css} from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {Button} from "../../components/base/Button";
import * as API from '../../ServerApi';
import * as UserActionCreators from '../../actions/user';
import * as ProjectActionsCreators from '../../actions/project';
import * as AppActionsCreators from '../../actions/app';
import ProjectSelectContainer from "../../containers/ProjectSelectContainer";


const Heading1 = styled.h1`
    font-size: 24px;
    font-weight: normal;
`;


const Heading2 = styled.h1`
    font-size: 20px;
    font-weight: normal;
`;


const Header = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100px;
    display: flex;
`;


const HeaderInner = styled.div`
    flex: ${props => props.center ? '2': '1'};
    display: flex;
    align-items: center;
    margin: 10px 25px;
    justify-content: ${props => props.left ? 'flex-start' : ( props.right ? 'flex-end' : 'center' )};
`;


// TODO fix overflow scroll
const Main = styled.div`
    margin-top: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    overflow: scroll !important;
`;


const ProjectSelectionContentContainer = styled.div`
    flex: 1;
    max-width: 800px;
`;


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
                <Header>
                    <HeaderInner left>
                        <Heading1>
                            Dashboard
                        </Heading1>
                    </HeaderInner>
                    <HeaderInner right>
                        <Button onClick={this.handleLogOutClick}>
                            Logout
                        </Button>
                    </HeaderInner>
                </Header>
                <Main>
                    <ProjectSelectionContentContainer>
                        <Heading2>
                            Projects
                        </Heading2>
                        <ProjectSelectContainer
                            showDialog={this.handleShowDialog}
                            onProjectClick={this.handleProjectClick}
                            user={this.props.user}
                        />
                    </ProjectSelectionContentContainer>
                </Main>
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