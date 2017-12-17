import React from 'react';
import PropTypes from 'prop-types';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import LabelledInputBox from "./base/LabelledInputBox";
import Button from "./base/Button";
import "./ShareDialog.css"
import * as API from '../ServerApi'

export default class ShareDialog extends React.Component {
    /**
     * propTypes
     * title {string} title of the dialog
     * onCancel {function()} called when forcibly closed
     * projectId {string} id of the project
     */
    static get propTypes() {
        return {
            title: PropTypes.string,
            onCancel: PropTypes.func.isRequired,
            projectId: PropTypes.string.isRequired,
        };
    }

    static get defaultProps() {
        return {};
    }

    email = "";
    permission = 5;

    constructor(props){
        super(props);

        this.state = {
            users: [],
            inputChild: <br/>
        };
    }

    componentDidMount() {
        // request share information
        API.getShares(this.props.projectId, this.handleShareList, this.handleError);
    }

    handleShareList = (body) => {
        let users = [];
        for(let share of body){
            users.push({
                name: share.user.name,
                email: share.user.email,
                permissions: share.permissions,
            });
        }

        this.setState({
            users: users,
            inputChild: <br/>,
        })
    };

    handleShareClick = () => {
        if(this.email === "")
            return;

        API.share(this.props.projectId, this.email, this.permission, this.handleShared, this.handleError);
        this.props.onShare(this.email, this.permission);
    };

    handleShared = () => {
        // send new share info request
        API.getShares(this.props.projectId, this.handleShareList, this.handleError);
    };

    handleError = (error) => {
        this.setState({
            inputChild: <div className="error-text">{error}<br/></div>
        });
    };

    getSharesView = () => {
        let shares = [];

        for(let user of this.state.users){
            shares.push(
                <div>
                    name: {user.name} email: {user.email} permission: {user.permissions}
                </div>);
        }

        return shares;
    };

    render() {
        return (
            <ModalDialog width="600" onClose={this.props.onCancel}>
                <h1>{this.props.title}</h1>
                {this.getSharesView()}
                <br/>
                <LabelledInputBox
                    label="Share with you collaborators"
                    type="email"
                    placeholder="someone@example.com"
                    onChange={(value) => this.email = value}
                    child={this.state.inputChild}
                />
                <div className="align-right">
                    <Button
                        label="Cancel"
                        onClick={this.props.onCancel}
                    />
                    <Button
                        label="Share"
                        onClick={this.handleShareClick}
                    />
                </div>
            </ModalDialog>
        );
    }
}