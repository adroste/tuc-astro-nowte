import React from 'react';
import PropTypes from 'prop-types';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import LabelledInputBox from "../base/LabelledInputBox";
import Button from "../base/Button";
import "./ShareDialog.css"
import * as API from '../../ServerApi'
import DropdownMenu from "../base/DropdownMenu";

export default class ShareDialog extends React.Component {
    /**
     * propTypes
     * @property {string} title title of the dialog
     * @property {function()} onCancel called when forcibly closed
     * @property {string} projectId id of the project
     * @property {object} user user state
     */
    static get propTypes() {
        return {
            title: PropTypes.string,
            onCancel: PropTypes.func.isRequired,
            projectId: PropTypes.string.isRequired,
            user: PropTypes.object.isRequired,
        };
    }

    static get defaultProps() {
        return {};
    }
    constructor(props){
        super(props);

        this.state = {
            users: [],
            inputChild: <br/>,
            inputText: "",
            inputPermission: 5, // TODO dropdown @Aaron
        };
    }

    componentDidMount() {
        // request share information

        API.getShares(this.props.user.token, this.props.projectId, this.handleShareList, this.handleError);
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
        if(this.state.inputText === "")
            return;

        API.share(this.props.user.token, this.props.projectId, this.state.inputText, this.state.inputPermission, this.handleShared, this.handleError);
    };

    handleShared = () => {
        // send new share info request
        API.getShares(this.props.user.token, this.props.projectId, this.handleShareList, this.handleError);
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
                <div key={user.email}>
                    name: {user.name} email: {user.email} permission: {user.permissions}
                </div>);
        }

        return shares;
    };

    render() {
        return (
            <ModalDialog className="dialog" onClose={this.props.onCancel}>
                <h1>{this.props.title}</h1>
                {this.getSharesView()}
                <br/>
                <LabelledInputBox
                    label="Share with you collaborators"
                    type="email"
                    placeholder="someone@example.com"
                    onChange={(value) => this.setState({inputText: value})}
                    child={this.state.inputChild}
                    value={this.state.inputText}
                />
                <DropdownMenu label="Permisson" entrys={["NONE","READ","ANNOTATE","EDIT","MANAGE","OWNER"]}/>
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