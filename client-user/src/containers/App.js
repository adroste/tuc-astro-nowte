import React, { Component } from 'react';
import {connect} from 'react-redux';
import {history} from "../Redux";
import throttle from 'lodash/throttle';
import { loadState, saveState } from "../utilities/storage";

import LoginScreen from "./screens/LoginScreen";
import RegistrationScreen from "./screens/RegistrationScreen";
import AwaitingValidationScreen from "./screens/AwaitingValidationScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import RequestEmailValidationScreen from "./screens/RequestEmailValidationScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
// TODO fix BrowserRouter ignoring history property => only using Router causes blocked updates on redirects
import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom';

import EmailValidationDoneScreen from "./screens/EmailValidationDoneScreen";
import ResetPasswordDoneScreen from "./screens/ResetPasswordDoneScreen";
import AwaitingPasswordChangeScreen from "./screens/AwaitingPasswordChangeScreen";
import DashboardScreen from "./screens/DashboardScreen";
import ProjectScreen from "./screens/ProjectScreen";
import {ModalContainer} from "react-modal-dialog";

class App extends Component {
    componentWillMount() {
        //store.subscribe(throttle(this.handleStoreChange, 1000));

        // load user login from local storage
        //const userStore = JSON.parse(localStorage.getItem('user'));
        //if (userStore !== null)
        //    store.dispatch(action.login(userStore.token, userStore.email, userStore.username, userStore.userId));
    }

    handleStoreChange = () => {
        //const userStore = store.getState().user;

        // save user login to local storage
        //localStorage.setItem('user', JSON.stringify(userStore));
    };

    render() {
        return (
            <Router history={history}>
                <div>
                    <Route exact path="/" render={() => {
                        return this.props.user.token ? (
                            <Redirect to="/dashboard"/>
                        ) : (
                            <Redirect to="/login"/>
                        );
                    }}/>

                    <Route exact path="/project" component={ProjectScreen}/>
                    <Route exact path="/dashboard" component={DashboardScreen}/>
                    <Route exact path="/login" component={LoginScreen}/>
                    <Route exact path="/register" component={RegistrationScreen}/>
                    <Route exact path="/awaiting-validation" component={AwaitingValidationScreen}/>
                    <Route exact path="/forgot-password" component={ForgotPasswordScreen}/>
                    <Route exact path="/request-email-validation" component={RequestEmailValidationScreen}/>
                    <Route path="/reset-password/:passwordResetToken" component={ResetPasswordScreen}/>
                    <Route exact path="/reset-password-done" component={ResetPasswordDoneScreen}/>
                    <Route path="/email-validation-done/:emailValidationToken" component={EmailValidationDoneScreen}/>
                    <Route exact path="/awaiting-password-change" component={AwaitingPasswordChangeScreen}/>

                    {this.props.app.activeDialog &&
                    <ModalContainer>
                        {this.props.app.activeDialog}
                    </ModalContainer>}
                </div>
            </Router>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        app: state.app,
        user: state.user,
    };
};

export default connect(mapStateToProps)(App);
