import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {Button} from "../../components/base/Button";
import * as API from '../../ServerApi';
import * as UserActionCreators from '../../actions/user';
import * as ProjectActionsCreators from '../../actions/project';
import * as AppActionsCreators from '../../actions/app';
import ProjectSelectContainer from "../../containers/ProjectSelectContainer";
import {Heading1, Heading2} from "../../components/base/Common";


const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
`;


const Header = styled.div`
    width: 100%;
    flex: 0 0 100px;
    display: flex;
    border-bottom: 1px solid #ccc;
`;


const HeaderInner = styled.div`
    flex: ${props => props.center ? '2': '1'};
    display: flex;
    align-items: center;
    margin: 10px 25px;
    justify-content: ${props => props.left ? 'flex-start' : ( props.right ? 'flex-end' : 'center' )};
`;


const Main = styled.div`
    flex: 1;
    width: 100%;
    position: relative;
`;


const ScrollContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: scroll;
    scroll-behavior: smooth;
    padding: 25px;
`;


const ProjectSelectionContentContainer = styled.div`
    max-width: 800px;
    margin: 25px auto;
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
            <Wrapper>
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
                    <ScrollContainer>
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
                    </ScrollContainer>
                </Main>
            </Wrapper>
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