import React from 'react';
import UserRegistrationForm from "../../components/forms/UserRegistrationForm";
import './UserForms.css';


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