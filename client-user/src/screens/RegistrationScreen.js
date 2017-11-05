import React from 'react';
import PropTypes from 'prop-types';
import UserRegistrationForm from "../ui/UserRegistrationForm";
import './UserForms.css';
import {store} from "../Redux";

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
        store.dispatch({type: "STATE_CHANGE", state: "awaiting_validation"});
    };

    render() {
        return (
            <div className="centered-form">
                <div className="centered-form-inner">
                    <UserRegistrationForm
                        onSuccesfullRegistration={this.handleSuccesfullRegistration}
                        onLoginClick={() => this.props.onStateChange("login")}
                    />
                </div>
            </div>
        );
    }
}