import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import UserRegistrationForm from "./ui/UserRegistrationForm";
import LoginScreen from "./screens/LoginScreen";
import RegistrationScreen from "./screens/RegistrationScreen";
import AwaitingValidationScreen from "./screens/AwaitingValidationScreen";
import EmailValidationScreen from "./screens/EmailValidationScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import RequestEmailValidationScreen from "./screens/RequestEmailValidationScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            curState: "login"
        };
    }

    onStateChangeHandler = (newState) => {
        this.lastState = newState;
        this.setState({
           curState: newState
        });
    };

    render() {
        switch (this.state.curState){
            case "login":
                return <LoginScreen onStateChange={this.onStateChangeHandler}/>;
            case "register":
                return <RegistrationScreen onStateChange={this.onStateChangeHandler}/>;
            case "awaiting_validation":
                return <AwaitingValidationScreen onStateChange={this.onStateChangeHandler}/>;
            case "email_validation":
                return <EmailValidationScreen onStateChange={this.onStateChangeHandler}/>;
            case "forgot_password":
                return <ForgotPasswordScreen onStateChange={this.onStateChangeHandler}/>;
            case "request_email_validation":
                return <RequestEmailValidationScreen onStateChange={this.onStateChangeHandler}/>;
            case "reset_password":
                return <ResetPasswordScreen onStateChange={this.onStateChangeHandler}/>;
            default:
                return <h1>Invalid State: {this.state.curState}</h1>;
        }
    }
}

export default App;
