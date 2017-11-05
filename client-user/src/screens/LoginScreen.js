import React from 'react';
import PropTypes from 'prop-types';
import UserLoginForm from "../ui/UserLoginForm";
import './UserForms.css';
import {store} from "../Redux";
import * as action from "../Actions"

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
        store.dispatch(action.stateChange("register"));
    };

    onForgotPasswordClickHandler = () => {
        store.dispatch(action.stateChange("forgot_password"));
    };

    render() {
        return (
            <div className="centered-form">
                <div className="centered-form-inner">
                    <UserLoginForm
                        onCreateAccountClick={this.onCreateAccountClickHandler}
                        onForgotPasswordClick={this.onForgotPasswordClickHandler}
                    />
                </div>
            </div>

        );
    }
}