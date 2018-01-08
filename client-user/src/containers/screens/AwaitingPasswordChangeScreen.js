import React from 'react';
import './UserForms.css';
import Button from "../../components/base/Button";


export default class AwaitingPasswordChangeScreen extends React.Component {
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
                    <h3>An email to reset your password has been sent. Please check your inbox.</h3>
                    <Button label="Login" onClick={this.handleLoginClick}/>
                </div>
            </div>
        );
    }
}