import React from 'react';
import {Button} from "../../components/base/Button";
import './UserForms.css';
import {Link} from "../../components/base/Link";
import {SERVER_URL} from "../../Globals";
import {INPUT_TYPES} from "../../components/base/InputField";
import {validateEmail} from "../../utilities/inputFieldValidators";
import {ValidatedInputField} from "../../components/base/ValidatedInputField";


export default class ForgotPasswordScreen extends React.Component {
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


    constructor(props) {
        super(props);

        this.state = ({
            email: '',
            emailValidation: false
        });
    }


    handleLoginClick = () => {
        this.props.history.push("/");
    };


    handleResetClick = () => {
        if (!this.state.emailValidation)
            return;

        const url = SERVER_URL + '/api/user/request-password-reset';
        fetch(url, {
            method: "POST",
            headers: new Headers({
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                email: this.state.email
            })
        }).then(
            this.handleServerResponse,
            this.handleError
        );
    };


    handleServerResponse = (response) => {
        if(response.status === 204){
            // succesfully sent email
            this.props.history.push("awaiting-password-change");
        }
        else{
            response.json().then(
                (data) => this.handleUnsuccesfullFetch(response.status, data),
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
     * this function will be called when the fetch failed
     * but received an error from the server
     * @param code html status code
     * @param data response body
     */
    handleUnsuccesfullFetch = (code, data) => {
        // extract error string
        const errmsg = "Error (" + code + "): " + data.error.message;
        // TODO do appropriate error display
        alert(errmsg);
    };


    render() {
        return (
            <div className="centered-form">
                <div className="centered-form-inner">
                    <ValidatedInputField
                        label="Email"
                        name="email"
                        type={INPUT_TYPES.EMAIL}
                        onInputChange={(email) => this.setState({email})}
                        onValidationResultChange={(success) => this.setState({emailValidation: success})}
                        value={this.state.email}
                        placeholder="you@example.de"
                        validator={validateEmail}
                    />
                    <Button
                        onClick={this.handleResetClick}
                        disabled={!this.state.emailValidation}
                    >
                        Reset Password
                    </Button>
                    <br/>
                    <br/>
                    Remembered?&nbsp;
                    <Link onClick={this.handleLoginClick}>
                        login
                    </Link>
                </div>
            </div>
        );
    }
}