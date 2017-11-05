import React, { Component } from 'react';
import './App.css';

import LoginScreen from "./screens/LoginScreen";
import RegistrationScreen from "./screens/RegistrationScreen";
import AwaitingValidationScreen from "./screens/AwaitingValidationScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import RequestEmailValidationScreen from "./screens/RequestEmailValidationScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";

import {store} from "./Redux";

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            curState: "login"
        };

        store.subscribe(() => this.onStateChange(store.getState()))
    }

    /**
     * called when the application state changed
     */
    onStateChange = (state) => {
        if(state.state !== this.state.curState){
            this.setState({
                curState: state.state
            });
        }
    };

    render() {
        switch (this.state.curState){
            case "login":
                return <LoginScreen/>;
            case "register":
                return <RegistrationScreen/>;
            case "awaiting_validation":
                return <AwaitingValidationScreen/>;
            case "forgot_password":
                return <ForgotPasswordScreen/>;
            case "request_email_validation":
                return <RequestEmailValidationScreen/>;
            case "reset_password":
                return <ResetPasswordScreen/>;
            default:
                return <h1>Invalid State: {this.state.curState}</h1>;
        }
    }
}

export default App;
