import React from 'react';
import PropTypes from 'prop-types';
import LinkedText from "../ui/base/LinkedText";

export default class RequestEmailValidationScreen extends React.Component {
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

    handleResendEmailClick = () => {
        // TODO resend the email

        this.props.onStateChange("awaiting_validation");
    };

    render() {
        return (
            <div className="centered-form">
                <div className="centered-form-inner">
                    <h3>Please check your mailbox for the account validation email and validate your account</h3>
                    Account validated? <LinkedText label="Log in" onClick={() => this.props.onStateChange("login")}/>
                    <br/>
                    Didn't receive the email? <LinkedText label="Resend" onClick={this.handleResendEmailClick}/>
                </div>
            </div>
        );
    }
}