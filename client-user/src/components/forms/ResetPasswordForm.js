import React from 'react';
import PropTypes from 'prop-types';
import LabelledInputBox from "../base/LabelledInputBox";
import Button from "../base/Button";
import * as utility from "../../utilities/login";
import {SERVER_URL} from "../../Globals";

export default class ResetPasswordForm extends React.Component {
    /**
     * propTypes
     * @property {function()} onSuccessfulReset callback when the password was sucesfully reset
     * @property {string} passwordResetToken token that can be used to reset the password
     */
    static get propTypes() {
        return {
            onSuccessfulReset: PropTypes.func.isRequired,
            passwordResetToken: PropTypes.string.isRequired,
        };
    }

    static get defaultProps() {
        return {};
    }

    // Private member
    newPassword = "";
    newPassword2 = "";

    constructor(props) {
        super(props);

        this.state = {
            passwordChild: <br/>
        }
    }


    handleSubmitClick = () => {
        if(!this.verifyPassword())
            return;

        // try to reset the password
        const resetToken = this.obtainToken();
        const url = SERVER_URL + '/api/user/change-password';
        fetch(url, {
            method: "PUT",
            headers: new Headers({
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                passwordResetToken: resetToken,
                newPassword: this.newPassword
            })
        }).then(
            this.handleServerResponse,
            this.handleError
        );
    };

    obtainToken = () => {
        return this.props.passwordResetToken;
    };

    handleServerResponse = (response) => {
        if(response.status === 204){
            // successfully sent email
            this.props.onSuccessfulReset();
        }
        else{
            response.json().then(
                (data) => this.handleUnsuccesfullFetch(response.status, data),
                this.handleError
            );
        }
    };

    /**
     * displays the error message for the user
     * @param message
     */
    handleError = (message) => {
        // TODO do something prettier?
        alert(message);
    };

    /**
     * this function will be called when the fetch failed
     * but received an error from the server
     * @param code html status code
     * @param data response body
     */
    handleUnsuccesfullFetch = (code, data) => {
        // extract error string
        const errmsg = "Error (" + code + "): " + data.error.message;
        // TODO do appropriate error display
        alert(errmsg);
    };

    /**
     * verifies this.password and this.password2 and sets an error message if invalid
     * @returns {boolean} true if password is correct
     */
    verifyPassword = () => {
        const res = utility.verifyPasswordFields(this.newPassword, this.newPassword2);
        this.onPasswordError(res);
        return res === "";
    };

    /**
     * sets a red error text below the password box
     * @param message
     */
    onPasswordError = (message) => {
        this.setState({
            passwordChild: <div className="ErrorText">{message}<br/></div>
        });
    };

    render() {
        return (
            <div>
                <LabelledInputBox
                    label="New password"
                    onChange={(value) => this.newPassword = value}
                    child={this.state.passwordChild}
                    type="password"
                />
                <LabelledInputBox
                    label="Confirm new password"
                    onChange={(value) => this.newPassword2 = value}
                    child={<br/>}
                    type="password"
                />
                <Button
                    label="Submit"
                    onClick={this.handleSubmitClick}
                />
            </div>
        );
    }
}