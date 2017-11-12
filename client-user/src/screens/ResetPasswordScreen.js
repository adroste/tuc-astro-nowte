import React from 'react';
import PropTypes from 'prop-types';
import "./UserForms.css"
import ResetPasswordForm from "../ui/ResetPasswordForm";
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

    render() {
        return (
            <div className="centered-form">
                <div className="centered-form-inner">
                    <ResetPasswordForm/>
                </div>
            </div>
        );
    }
}