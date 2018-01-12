import React from 'react';
import PropTypes from 'prop-types';
import LabelledInputBox from "../../components/base/LabelledInputBox";
import Button from "../../components/base/Button";
import './UserForms.css';
import LinkedText from "../../components/base/LinkedText";
import {SERVER_URL} from "../../Globals";


export default class ForgotPasswordScreen extends React.Component {
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

    // Private Member
    email = "";

    handleLoginClick = () => {
        this.props.history.push("/");
    };

    handleResetClick = () => {
        // TODO verify email

        const url = SERVER_URL + '/api/user/request-password-reset';
        fetch(url, {
            method: "POST",
            headers: new Headers({
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                email: this.email
            })
        }).then(
            this.handleServerResponse,
            this.handleError
        );
    };

    handleServerResponse = (response) => {
        if(response.status === 204){
            // succesfully sent email
            this.props.history.push("awaiting-password-change");
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
            <div className="centered-form">
                <div className="centered-form-inner">
                    <LabelledInputBox
                        label="Email"
                        name="email"
                        onChange={(value) => this.email = value}
                    />
                    <br/>
                    <Button
                        label="Reset Password"
                        onClick={this.handleResetClick}
                    />
                    <br/>
                    <br/>
                    Remembered? <LinkedText label="Log in" onClick={this.handleLoginClick}/>
                </div>
            </div>
        );
    }
}