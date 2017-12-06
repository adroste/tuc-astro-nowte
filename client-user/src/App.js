import React, { Component } from 'react';
import {Provider} from 'react-redux';
import {store, history} from "./Redux";

import './App.css';

import LoginScreen from "./screens/LoginScreen";
import RegistrationScreen from "./screens/RegistrationScreen";
import AwaitingValidationScreen from "./screens/AwaitingValidationScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import RequestEmailValidationScreen from "./screens/RequestEmailValidationScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import {BrowserRouter as Router, Route} from 'react-router-dom';

import EmailValidationDoneScreen from "./screens/EmailValidationDoneScreen";
import ResetPasswordDoneScreen from "./screens/ResetPasswordDoneScreen";
import AwaitingPasswordChangeScreen from "./screens/AwaitingPasswordChangeScreen";
import LoggedInScreen from "./screens/LoggedInScreen";

class App extends Component {

    constructor(props){
        super(props);

        this.state = {
            session: undefined,
        };

        store.subscribe(this.handleStoreChange);
    }

    handleStoreChange = () => {
        if(this.state.session !== store.getState().user.token){
            this.setState({
                session: store.getState().user.token
            });
        }
    };

    render() {
        return (
            <Provider store={store}>
                <Router history={history}>
                    <div>
                        <Route exact path="/" component={this.state.session? LoggedInScreen : LoginScreen}/>

                        <Route exact path="/register" component={RegistrationScreen}/>
                        <Route exact path="/awaiting-validation" component={AwaitingValidationScreen}/>
                        <Route exact path="/forgot-password" component={ForgotPasswordScreen}/>
                        <Route exact path="/request-email-validation" component={RequestEmailValidationScreen}/>
                        <Route path="/reset-password/:passwordResetToken" component={ResetPasswordScreen}/>
                        <Route exact path="/reset-password-done" component={ResetPasswordDoneScreen}/>
                        <Route path="/email-validation-done/:emailValidationToken" component={EmailValidationDoneScreen}/>
                        <Route exact path="/awaiting-password-change" component={AwaitingPasswordChangeScreen}/>
                    </div>
                </Router>
            </Provider>
        );
    }
}

export default App;
