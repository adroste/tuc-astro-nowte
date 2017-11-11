import React from 'react';
import PropTypes from 'prop-types';
import './UserForms.css';
import Button from "../ui/base/Button";

export default class ResetPasswordDoneScreen extends React.Component {
    /**
     * propTypes
     */
    static get propTypes() {
        return {};
    }

    static get defaultProps() {
        return {};
    }

    handleLoginClick = () => {
        this.props.history.push("/");
    };

    render() {
        return (
            <div className="centered-form">
                <div className="centered-form-inner">
                    <h3>Password has been changed!</h3>
                    <Button label="Login" onClick={this.handleLoginClick}/>
                </div>
            </div>
        );
    }
}