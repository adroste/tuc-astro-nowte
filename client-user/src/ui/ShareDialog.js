import React from 'react';
import PropTypes from 'prop-types';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import LabelledInputBox from "./base/LabelledInputBox";
import Button from "./base/Button";
import "./ShareDialog.css"

export default class ShareDialog extends React.Component {
    /**
     * propTypes
     * title {string} title of the dialog
     * onShare {function(email: string, permission: string)  called when object should be shared. email of the user to share with and permission level the user should have
     * onCancel {function()} called when forcibly closed
     */
    static get propTypes() {
        return {
            title: PropTypes.string,
            onShare: PropTypes.func.isRequired,
            onCancel: PropTypes.func.isRequired,
        };
    }

    static get defaultProps() {
        return {};
    }

    email = "";
    permission = "";

    constructor(props){
        super(props);

        this.state = {
            inputChild: <br/>
        };
    }

    handleShareClick = () => {
        if(this.email === "")
            return;

        this.props.onShare(this.email, this.permission);
    };

    handleError = (error) => {
        this.setState({
            inputChild: <div className="error-text">{error}<br/></div>
        });
    };

    render() {
        return (
            <ModalDialog width="400" onClose={this.props.onCancel}>
                <h1>{this.props.title}</h1>

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