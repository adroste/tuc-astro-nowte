import React from 'react';
import PropTypes from 'prop-types';
import UserRegistrationForm from "../ui/UserRegistrationForm";
import './UserForms.css';
import {store} from "../Redux";
import * as action from "../Actions"

export default class RegistrationScreen extends React.Component {
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

    handleSuccesfullRegistration = () => {
        this.props.history.push("/awaiting-validation");
    };

    handleLoginClick = () => {
        this.props.history.push("/");
    };

    render() {
        return (
            <div className="centered-form">
                <div className="centered-form-inner">
                    <UserRegistrationForm
                        onSuccesfullRegistration={this.handleSuccesfullRegistration}
                        onLoginClick={this.handleLoginClick}
                    />
                </div>
            </div>
        );
    }
}