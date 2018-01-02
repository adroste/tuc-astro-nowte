import React from 'react';
import PropTypes from 'prop-types';
import UserLoginForm from "../ui/UserLoginForm";
import './UserForms.css';
import {store} from "../Redux";
import * as action from "../Actions";

export default class LoginScreen extends React.Component {
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

    onCreateAccountClickHandler = () => {
        this.props.history.push("/register");
    };

    onForgotPasswordClickHandler = () => {
        this.props.history.push("/forgot-password");
    };

    onUserLoggedInHandler = (token, email, username, userId) => {
        store.dispatch(action.login(token, email, username, userId));
        this.props.history.push("/");
    };

    onUserNotValidatedHandler = (email) => {
        store.dispatch(action.requestValidation(email));
        this.props.history.push("/request-email-validation");
    };

    render() {
        return (
            <div className="centered-form">
                <div className="centered-form-inner">
                    <UserLoginForm
                        onCreateAccountClick={this.onCreateAccountClickHandler}
                        onForgotPasswordClick={this.onForgotPasswordClickHandler}
                        onUserLoggedIn={this.onUserLoggedInHandler}
                        onUserNotValidated={this.onUserNotValidatedHandler}
                    />
                </div>
            </div>

        );
    }
}