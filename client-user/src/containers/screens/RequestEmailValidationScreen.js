import React from 'react';
import PropTypes from 'prop-types';
import {Link} from "../../components/base/Link";
import {SERVER_URL} from "../../Globals";
import "./UserForms.css"
import {connect} from "react-redux";

class RequestEmailValidationScreen extends React.Component {
    /**
     * propTypes
     * @property {Object} user user-state
     */
    static get propTypes() {
        return {
            user: PropTypes.object.isRequired,
        };
    }

    static get defaultProps() {
        return {};
    }

    handleResendEmailClick = () => {
        const email = this.props.user.email;
        const url = SERVER_URL + '/api/user/resend-validation-email';
        fetch(url, {
            method: "POST",
            headers: new Headers({
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                email: email
            })
        }).then(
            this.handleServerResponse,
            this.handleError
        );
    };

    handleServerResponse = (response) => {
        if(response.status === 204){
            // succesfully sent email
            this.props.history.push("/awaiting-validation");
        }
        else{
            response.json().then(
                (data) => this.handleUnsuccesfullRegistration(response.status, data),
                this.handleError
            );
        }
    };

    /**
     * displays the error message for the user
     * @param message
     */
    handleError = (message) => {
        // TODO do something prettier?
        alert(message);
    };

    /**
     * this function will be called when the user tried to submit
     * his registration data but received an error from the server
     * @param code html status code
     * @param data response body
     */
    handleUnsuccesfullRegistration = (code, data) => {
        // extract error string
        const errmsg = "Error (" + code + "): " + data.error.message;
        // TODO do appropriate error display
        alert(errmsg);
    };

    handleLoginClick = () => {
        this.props.history.push("/");
    };

    render() {
        return (
            <div className="centered-form">
                <div className="centered-form-inner">
                    <h3>Please check your mailbox for the account validation email and validate your account</h3>
                    Account validated?
                    <Link onClick={this.handleLoginClick}>
                        login
                    </Link>
                    <br/>
                    Didn't receive the email?
                    <Link onClick={this.handleResendEmailClick}>
                        resend
                    </Link>
                </div>
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        user: state.user
    };
};

export default connect(mapStateToProps)(RequestEmailValidationScreen);