import React from 'react';
import PropTypes from 'prop-types';
import {Button} from "../base/Button";
import {SERVER_URL} from "../../Globals";
import {validatePassword, validatePasswordConfirm} from "../../utilities/inputFieldValidators";
import {INPUT_TYPES} from "../base/InputField";
import {ValidatedInputField} from "../base/ValidatedInputField";

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


    constructor(props) {
        super(props);

        this.state = {
            newPassword: '',
            newPasswordConfirm: '',
            newPasswordValidation: false,
            newPasswordConfirmValidation: false
        }
    }


    handleSubmitClick = () => {
        if(!this.state.newPasswordValidation || !this.state.newPasswordConfirmValidation)
            return;

        // try to reset the password
        const url = SERVER_URL + '/api/user/change-password';
        fetch(url, {
            method: "PUT",
            headers: new Headers({
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                passwordResetToken: this.props.passwordResetToken,
                newPassword: this.state.newPassword
            })
        }).then(
            this.handleServerResponse,
            this.handleError
        );
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


    render() {
        return (
            <div>
                <ValidatedInputField
                    label="New password"
                    type={INPUT_TYPES.PASSWORD}
                    onInputChange={(newPassword) => this.setState({newPassword})}
                    onValidationResultChange={(success) => this.setState({newPasswordValidation: success})}
                    value={this.state.newPassword}
                    placeholder="choose new password"
                    validator={validatePassword}
                />
                <ValidatedInputField
                    label="Confirm new password"
                    type={INPUT_TYPES.PASSWORD}
                    onInputChange={(newPasswordConfirm) => this.setState({newPasswordConfirm})}
                    onValidationResultChange={(success) => this.setState({newPasswordConfirmValidation: success})}
                    value={this.state.newPasswordConfirm}
                    placeholder="re-enter new password"
                    validator={validatePasswordConfirm(this.state.newPassword)}
                />
                <Button
                    onClick={this.handleSubmitClick}
                    disabled={!this.state.newPasswordValidation || !this.state.newPasswordConfirmValidation}
                >
                    Submit
                </Button>
            </div>
        );
    }
}