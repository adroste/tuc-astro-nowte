import React, { Component } from 'react';
import {Provider} from 'react-redux';
import {store, history} from "./Redux";
import * as action from "./Actions";

import './App.css';

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
import ProjectsOverviewScreen from "./screens/ProjectsOverviewScreen";

class App extends Component {

    constructor(props){
        super(props);

        this.state = {
            session: undefined,
        };
    }

    componentWillMount() {
        store.subscribe(this.handleStoreChange);

        // load user login from local storage
        const userStore = JSON.parse(localStorage.getItem('user'));
        if (userStore !== null)
            store.dispatch(action.login(userStore.token, userStore.email, userStore.username, userStore.userId));
    }

    handleStoreChange = () => {
        const userStore = store.getState().user;

        // save user login to local storage
        localStorage.setItem('user', JSON.stringify(userStore));

        if(this.state.session !== userStore.token){
            this.setState({
                session: userStore.token
            });
        }
    };

    render() {
        return (
            <Provider store={store}>
                <Router history={history}>
                    <div>
                        <Route exact path="/" render={() => {
                            return this.state.session ? (
                                <Redirect to="/projects"/>
                            ) : (
                                <Redirect to="/login"/>
                            );
                        }}/>

                        <Route exact path="/projects" component={ProjectsOverviewScreen}/>
                        <Route exact path="/login" component={LoginScreen}/>
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
