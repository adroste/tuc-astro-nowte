import React from 'react';
import PropTypes from 'prop-types';
import UserRegistrationForm from "../ui/UserRegistrationForm";
import './UserForms.css';

export default class RegistrationScreen extends React.Component {
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

    render() {
        return (
            <div className="centered-form">
                <div className="centered-form-inner">
                    <UserRegistrationForm/>
                </div>
            </div>
        );
    }
}