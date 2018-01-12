import React from 'react';
import PropTypes from 'prop-types';
import "./UserForms.css"
import ResetPasswordForm from "../../components/forms/ResetPasswordForm";

export default class ResetPasswordScreen extends React.Component {
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

    handleSuccessfulReset = () => {
        this.props.history.push("/reset-password-done");
    };

    render() {
        return (
            <div className="centered-form">
                <div className="centered-form-inner">
                    <ResetPasswordForm
                        passwordResetToken={this.props.match.params.passwordResetToken}
                        onSuccessfulReset={this.handleSuccessfulReset}
                    />
                </div>
            </div>
        );
    }
}