import React from 'react';
import PropTypes from 'prop-types';
import LabelledInputBox from "./base/LabelledInputBox";
import './UserLoginForm.css';
import Button from "./base/Button";
import LinkedText from "./base/LinkedText";
import * as utility from "../utility/LoginHelper"
import {verifyEmailField} from "../utility/LoginHelper";

export default class UserLoginForm extends React.Component {
    /**
     * propTypes
     * @property {function()} onCreateAccountClick callback when the user wants to create a new account
     * @property {function()} onForgotPasswordClick callback for the forgot password field
     */
    static get propTypes() {
        return {
            onCreateAccountClick: PropTypes.func.isRequired,
            onForgotPasswordClick: PropTypes.func.isRequired,
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

        // TODO fetch
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

    render() {

        return (
            <div className="UserLoginForm">
                <LabelledInputBox
                    label="Email"
                    name="email"
                    onChange={(value) => this.email = value}
                    child={this.state.emailChild}
                />
                <LabelledInputBox
                    label="Password"
                    name="password"
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