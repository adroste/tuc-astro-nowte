import React from 'react';
import PropTypes from 'prop-types';
import LinkedText from "../ui/base/LinkedText";
import {store} from "../Redux";
import * as action from "../Actions"
import {SERVER_URL} from "../Globals";

export default class RequestEmailValidationScreen extends React.Component {
    /**
     * propTypes
     */
    static get propTypes() {
        return {
        };
    }

    static get defaultProps() {
        return {};
    }

    handleResendEmailClick = () => {
        const email = store.getState().email;
        alert(email);
        const url = SERVER_URL + '/api/user/resend-validation-email';
        fetch(url, {
            method: "POST",
            headers: new Headers({
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                email: email
            })
        }).then(
            this.handleServerResponse,
            this.handleError
        );
    };

    handleServerResponse = (response) => {
        if(response.status === 204){
            // succesfully sent email
            store.dispatch(action.stateChange("awaiting_validation"));
        }
        else{
            response.json().then(
                (data) => this.handleUnsuccesfullRegistration(response.status, data),
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
     * this function will be called when the user tried to submit
     * his registration data but received an error from the server
     * @param code html status code
     * @param data response body
     */
    handleUnsuccesfullRegistration = (code, data) => {
        // extract error string
        const errmsg = "Error (" + code + "): " + data.error.message;
        // TODO do appropriate error display
        alert(errmsg);
    };

    handleLoginClick = () => {
        store.dispatch(action.stateChange("login"));
    }
    ;

    render() {
        return (
            <div className="centered-form">
                <div className="centered-form-inner">
                    <h3>Please check your mailbox for the account validation email and validate your account</h3>
                    Account validated? <LinkedText label="Log in" onClick={this.handleLoginClick}/>
                    <br/>
                    Didn't receive the email? <LinkedText label="Resend" onClick={this.handleResendEmailClick}/>
                </div>
            </div>
        );
    }
}