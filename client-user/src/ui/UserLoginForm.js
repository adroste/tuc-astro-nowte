import React from 'react';
import PropTypes from 'prop-types';
import LabelledInputBox from "./base/LabelledInputBox";
import './UserLoginForm.css';
import Button from "./base/Button";
import LinkedText from "./base/LinkedText";

export default class UserLoginForm extends React.Component {
    /**
     * propTypes
     * @property {function()} onCreateAccountClick callback when the user wants to create a new account
     * @property {function()} onForgotPasswordClick callback for the forgot password field
     */
    static get propTypes() {
        return {
            onCreateAccountClick: PropTypes.func.isRequired,
            onForgotPasswordClick: PropTypes.func.isRequired,
        };
    }

    static get defaultProps() {
        return {};
    }

    render() {

        return (
            <div className="UserLoginForm">
                <LabelledInputBox
                    label="Email"
                    name="email"
                    child={<br/>}
                />
                <LabelledInputBox
                    label="Password"
                    name="password"
                    child={<br/>}
                />
                <Button label="Login"/>
                <br/>
                <br/>
                <LinkedText label="forgot password" onClick={this.props.onForgotPasswordClick}/>
                <br/>
                <LinkedText label="create account" onClick={this.props.onCreateAccountClick}/>
            </div>
        );
    }
}