import React from 'react';
import PropTypes from 'prop-types';
import LabelledInputBox from "./base/LabelledInputBox";
import './UserLoginForm.css';
import Button from "./base/Button";
import LinkedText from "./base/LinkedText";
import * as utility from "../utility/LoginHelper"
import { SERVER_URL } from "../Globals";
import {store} from "../Redux";
import * as action from "../Actions"

export default class UserLoginForm extends React.Component {
    /**
     * propTypes
     * @property {function()} onCreateAccountClick callback when the user wants to create a new account
     * @property {function()} onForgotPasswordClick callback for the forgot password field
     * @property {function(token: string, email: string)} onUserLoggedIn callback when the user successfully logged in
     * @property {function(email: string)} onUserNotValidated callback when the user who tried to lock in has not verified his email yet
     */
    static get propTypes() {
        return {
            onCreateAccountClick: PropTypes.func.isRequired,
            onForgotPasswordClick: PropTypes.func.isRequired,
            onUserLoggedIn: PropTypes.func.isRequired,
            onUserNotValidated: PropTypes.func.isRequired
        };
    }

    static get defaultProps() {
        return {};
    }

    constructor(props){
        super(props);

        this.state = {
            emailChild: <br/>,
            passwordChild: <br/>
        }
    }

    email = "";
    password = "";

    handleLoginClick = () => {
        if(!this.verifyEmailField())
            return;

        if(!this.verifyPasswordField())
            return;

        // send login request
        const url = SERVER_URL + '/api/user/login';
        fetch(url, {
            method: "POST",
            headers: new Headers({
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                email: this.email,
                password: this.password
            })
        }).then(
            this.handleServerResponse,
            this.handleError
        );
    };

    handleServerResponse = (response) => {
        if(response.status === 201){
            response.json().then(this.handleSuccesfullRegistration, this.handleError);
        }
        else {
            response.json().then((data) => this.handleUnsuccesfullRegistration(response.status, data), this.handleError);
        }
    };

    handleSuccesfullRegistration = (body) => {
        // retrieve session token
        this.props.onUserLoggedIn(body.sessionToken, this.email);
    };

    handleUnsuccesfullRegistration = (code, data) => {

        // email not aouthorized?
        if(code === 401)
        {
            if(data.error.message === "user account not validated")
            {
                this.props.onUserNotValidated(this.email);
                return;
            }
        }
        this.handleError("Error (" + code + "): " + data.error.message);
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
     * verifies if the password field was filled with a syntacticly correct password
     * @returns {boolean} true if correct
     */
    verifyPasswordField = () => {
        if(this.password.length === 0){
            this.onPasswordError("this field is required");
            return false;
        }

        this.onPasswordError("");
        return true;
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

    /**
     * verifies this.email and sets an error message if invalid
     * @returns {boolean} true if the email was correct (valid syntax)
     */
    verifyEmailField = () => {
        const res = utility.verifyEmailField(this.email);
        this.onEmailError(res);
        return res === "";
    };

    /**
     * sets the red error text below the email box
     * @param message message that will appear (may be "")
     */
    onEmailError = (message) => {
        this.setState({
            emailChild: <div className="ErrorText">{message}<br/></div>
        });
    };

    handleKeyPress = (e) => {
        if(e.key === "Enter"){
            this.handleLoginClick();
        }
    };

    render() {

        return (
            <div className="UserLoginForm" onKeyPress={this.handleKeyPress}>
                <LabelledInputBox
                    label="Email"
                    name="email"
                    onChange={(value) => this.email = value}
                    child={this.state.emailChild}
                />
                <LabelledInputBox
                    label="Password"
                    name="password"
                    type="password"
                    onChange={(value) => this.password = value}
                    child={this.state.passwordChild}
                />
                <Button
                    label="Login"
                    onClick={this.handleLoginClick}
                />
                <br/>
                <br/>
                <LinkedText label="forgot password" onClick={this.props.onForgotPasswordClick}/>
                <br/>
                <LinkedText label="create account" onClick={this.props.onCreateAccountClick}/>
            </div>
        );
    }
}