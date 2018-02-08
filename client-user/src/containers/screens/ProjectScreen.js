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
import { FONT_SIZES } from '../../Globals';


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


const HugeCenteredText = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${FONT_SIZES.HUGE};
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


    constructor(props) {
        super(props);

        this.state = {
            selectedDocumentId: null
        };
    }


    handlePushDialog = (dialog) => {
        this.props.appActions.pushDialog(dialog);
    };


    handlePopDialog = () => {
        this.props.appActions.popDialog();
    };


    handleDeselectProject = () => {
        this.props.projectActions.deselect();
        this.props.history.push("/dashboard");
    };


    handleDocumentSelect = (title, documentId) => {
        // TODO title param unused atm
        this.setState({
            selectedDocumentId: documentId
        });
    };


    render() {
        // TODO go back to dashboard if unset

        return (
            <Wrapper>
                <SplitPane defaultSizePxLeft={250} minSizePxLeft={200} maxSizePxLeft={450}>
                    <div>
                        <HeaderLeftPane>
                            <Button onClick={this.handleDeselectProject}>
                                {"<"} Workspaces
                            </Button>
                        </HeaderLeftPane>
                        <ScrollContainer padded>
                            <ProjectFileTreeContainer
                                projectId={this.props.project.projectId}
                                projectTitle={this.props.project.title}
                                permissions={this.props.project.permissions}
                                pushDialog={this.handlePushDialog}
                                popDialog={this.handlePopDialog}
                                user={this.props.user}
                                onDocumentSelected={this.handleDocumentSelect}
                            />
                        </ScrollContainer>
                    </div>
                    
                    {!this.state.selectedDocumentId ? (
                    <HugeCenteredText>
                        Please select a document
                    </HugeCenteredText>
                    ) : (
                    <EditorHost
                        projectId={this.props.project.projectId}
                        documentId={this.state.selectedDocumentId}
                        user={this.props.user}
                        onStatsChange={this.handleEditorStatsChange}
                    />
                    )}
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