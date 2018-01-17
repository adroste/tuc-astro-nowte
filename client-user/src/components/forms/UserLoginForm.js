import React from 'react';
import PropTypes from 'prop-types';
import {Button} from "../base/Button";
import {Link} from "../base/Link";
import { SERVER_URL } from "../../Globals";
import {INPUT_TYPES} from "../base/InputField";
import {ValidatedInputField} from "../base/ValidatedInputField";
import {validateEmail, validatePassword} from "../../utilities/inputFieldValidators";

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
            email: '',
            password: '',
            emailValidation: false,
            passwordValidation: false,
        }
    }


    handleLoginClick = () => {
        if (!this.state.emailValidation || !this.state.passwordValidation)
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
                email: this.state.email,
                password: this.state.password
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
        this.props.onUserLoggedIn(body.sessionToken, this.state.email, body.name, body.userId);
    };


    handleUnsuccesfullRegistration = (code, data) => {
        // email not aouthorized?
        if(code === 401)
        {
            if(data.error.message === "user account not validated")
            {
                this.props.onUserNotValidated(this.state.email);
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


    handleKeyPress = (e) => {
        if(e.key === "Enter"){
            this.handleLoginClick();
            e.preventDefault();
        }
    };


    render() {
        return (
            <div
                className={this.props.className}
                onKeyPress={this.handleKeyPress}
            >
                <ValidatedInputField
                    label="Email"
                    name="email"
                    type={INPUT_TYPES.EMAIL}
                    onInputChange={(email) => this.setState({email})}
                    onValidationResultChange={(success) => this.setState({emailValidation: success})}
                    value={this.state.email}
                    placeholder="you@example.de"
                    validator={validateEmail}
                />
                <ValidatedInputField
                    label="Password"
                    name="password"
                    type={INPUT_TYPES.PASSWORD}
                    onInputChange={(password) => this.setState({password})}
                    onValidationResultChange={(success) => this.setState({passwordValidation: success})}
                    value={this.state.password}
                    placeholder="your secret password"
                    validator={validatePassword}
                />
                <Button
                    onClick={this.handleLoginClick}
                    disabled={!this.state.emailValidation || !this.state.passwordValidation}
                >
                    Login
                </Button>
                <br/>
                <br/>
                <Link onClick={this.props.onForgotPasswordClick}>
                    forgot password
                </Link>
                <br/>
                <Link onClick={this.props.onCreateAccountClick}>
                    create account
                </Link>
            </div>
        );
    }
}