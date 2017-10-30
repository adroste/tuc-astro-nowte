import React from 'react';
import PropTypes from 'prop-types';
import UserLoginForm from "../ui/UserLoginForm";
import './UserForms.css';

export default class LoginScreen extends React.Component {
    /**
     * propTypes
     * @property {function(state: string)} onStateChange function to set the app state
     */
    static get propTypes() {
        return {
            onStateChange: PropTypes.func.isRequired
        };
    }

    static get defaultProps() {
        return {};
    }

    onCreateAccountClickHandler = () => {
        this.props.onStateChange("register");
    };

    onForgotPasswordClickHandler = () => {
        this.props.onStateChange("forgot_password");
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