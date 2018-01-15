/**
 * @author progmem
 * @date 02.01.18
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled, {css} from 'styled-components';
import {SplitPane} from "../../components/base/SplitPane";
import ProjectFileTreeContainer from "../ProjectFileTreeContainer";
import {Button} from "../../components/base/Button";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as ProjectActionsCreators from "../../actions/project";
import * as AppActionsCreators from "../../actions/app";
import {EditorHost} from "../../components/editor/EditorHost";


const Header = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    grid-row: 1;
    grid-column: 1 / 3;
    align-items: center;
    justify-content: center;
    box-shadow: 0 1px #ddd;
    position: relative;
    z-index: 100;
`;


const HeaderInner = styled.div`
    flex: ${props => props.center ? '2': '1'};
    display: flex;
    align-items: center;
    justify-content: ${props => props.left ? 'flex-start' : ( props.right ? 'flex-end' : 'center' )};
`;


const marginTopElectronMacFrameless = css`
    margin-top: 15px;
`;


const paddingStyle = css`
    padding: 10px;
`;


const HeaderLeftPane = styled.div`
    border-bottom: 1px solid #ccc;
    ${paddingStyle}
    ${marginTopElectronMacFrameless}
`;


const Wrapper = styled.div`
    width: 100vw;
    height: 100vh;
`;


const ScrollContainer = styled.div`
    height: 100%;
    width: 100%;
    overflow: scroll;
    scroll-behavior: smooth;
    ${props => props.padded && paddingStyle}
`;


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
            <Wrapper>
                <SplitPane defaultSizePxLeft={250} minSizePxLeft={200} maxSizePxLeft={450}>
                    <div>
                        <HeaderLeftPane>
                            <Button onClick={this.handleDeselectProject}>
                                {"<"} Projects
                            </Button>
                        </HeaderLeftPane>
                        <ScrollContainer padded>
                            <ProjectFileTreeContainer
                                projectId={this.props.project.projectId}
                                projectTitle={this.props.project.title}
                                permissions={this.props.project.permissions}
                                showDialog={this.handleShowDialog}
                                onProjectDeselect={this.handleDeselectProject}
                                user={this.props.user}
                            />
                        </ScrollContainer>
                    </div>

                    <ScrollContainer>
                        <EditorHost
                            documentId={null}
                            user={this.props.user}
                            onStatsChange={this.handleEditorStatsChange}
                        />
                    </ScrollContainer>
                </SplitPane>
            </Wrapper>
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