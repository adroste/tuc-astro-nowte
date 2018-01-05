import React from 'react';
import PropTypes from 'prop-types';
import UserLoginForm from "../../components/forms/UserLoginForm";
import './UserForms.css';
import {bindActionCreators} from "redux/index";
import {connect} from "react-redux";
import * as UserActionCreators from '../../actions/user';


class LoginScreen extends React.Component {
    /**
     * propTypes
     * @property {Object} userActions bound action creators (user)
     */
    static get propTypes() {
        return {
            userActions: PropTypes.object.isRequired
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
        this.props.userActions.login(token, email, username, userId);
        this.props.history.push("/");
    };

    onUserNotValidatedHandler = (email) => {
        this.props.userActions.setEmail(email);
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


const mapDispatchToProps = (dispatch) => {
    return {
        userActions: bindActionCreators(UserActionCreators, dispatch)
    };
};

export default connect(null, mapDispatchToProps)(LoginScreen);