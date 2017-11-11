import React, { Component } from 'react';
import './App.css';

import LoginScreen from "./screens/LoginScreen";
import RegistrationScreen from "./screens/RegistrationScreen";
import AwaitingValidationScreen from "./screens/AwaitingValidationScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import RequestEmailValidationScreen from "./screens/RequestEmailValidationScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import {BrowserRouter as Router, Route} from 'react-router-dom'

import {store} from "./Redux";
import EmailValidationDoneScreen from "./screens/EmailValidationDoneScreen";
import ResetPasswordDoneScreen from "./screens/ResetPasswordDoneScreen";
import AwaitingPasswordChangeScreen from "./screens/AwaitingPasswordChangeScreen";

class App extends Component {

    render() {
        return (
        <Router>
            <div>
                <Route exact path="/" component={LoginScreen}/>
                <Route exact path="/register" component={RegistrationScreen}/>
                <Route exact path="/awaiting-validation" component={AwaitingValidationScreen}/>
                <Route exact path="/forgot-password" component={ForgotPasswordScreen}/>
                <Route exact path="/request-email-validation" component={RequestEmailValidationScreen}/>
                <Route exact path="/reset-password" component={ResetPasswordScreen}/>
                <Route exact path="/reset-password-done" component={ResetPasswordDoneScreen}/>
                <Route exact path="/email-validation-done" component={EmailValidationDoneScreen}/>
                <Route exact path="/awaiting-password-change" component={AwaitingPasswordChangeScreen}/>
            </div>
        </Router>
        );
    }
}

export default App;
