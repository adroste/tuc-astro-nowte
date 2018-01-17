import React from 'react';
import PropTypes from 'prop-types';
import {Button} from "../base/Button";
import {Link} from "../base/Link";
import {SERVER_URL} from "../../Globals";
import {INPUT_TYPES} from "../base/InputField";
import {
    validateEmail, validateName, validatePassword,
    validatePasswordConfirm
} from "../../utilities/inputFieldValidators";
import {ValidatedInputField} from "../base/ValidatedInputField";


export default class UserRegistrationForm extends React.Component {
    /**
     * propTypes
     * @property {function()} onSuccesfullRegistration callback when a succesfull registration was sent to the server
     * @property {function()} onLoginClick callback when the user clicks the "Log in" Link
     */
    static get propTypes() {
        return {
            onSuccesfullRegistration: PropTypes.func.isRequired,
            onLoginClick: PropTypes.func.isRequired,
        };
    }


    static get defaultProps(){
        return {

        };
    }


    get validationSuccess() {
        return this.state.nameValidation && this.state.emailValidation
            && this.state.passwordValidation && this.state.passwordConfirmValidation;
    }


    constructor(props) {
        super(props);

        this.state = {
            name: '',
            email: '',
            password: '',
            passwordConfirm: '',
            nameValidation: false,
            emailValidation: false,
            passwordValidation: false,
            passwordConfirmValidation: false
        }
    }


    /*
     * handler for the submit button
     */
    onClickHandler = () => {
        if(!this.validationSuccess)
            return;

        //send registration request
        const url = SERVER_URL + '/api/user/create';
        fetch(url, {
            method: "POST",
            headers: new Headers({
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                name: this.state.name,
                email: this.state.email,
                password: this.state.password
            })
        }).then(
            this.handleServerResponse,
            this.handleError
        );
    };

    handleServerResponse = (response) => {
        if(response.status === 204){
            this.handleSuccesfullRegistration();
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
     * this function will be called when the user succesfully sent a
     * registration to the server
     */
    handleSuccesfullRegistration = () => {
        this.props.onSuccesfullRegistration();
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


    handleKeyPress = (e) => {
        if(e.key === "Enter"){
            this.onClickHandler();
        }
    };


    render(){
        return (
            <div
                className={this.props.className}
                onKeyPress={this.handleKeyPress}
            >
                <ValidatedInputField
                    label="Name"
                    name="name"
                    type={INPUT_TYPES.TEXT}
                    onInputChange={(name) => this.setState({name})}
                    onValidationResultChange={(success) => this.setState({nameValidation: success})}
                    value={this.state.name}
                    placeholder="display name"
                    validator={validateName}
                />
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
                <ValidatedInputField
                    label="Password"
                    name="password"
                    type={INPUT_TYPES.PASSWORD}
                    onInputChange={(password) => this.setState({password})}
                    onValidationResultChange={(success) => this.setState({passwordValidation: success})}
                    value={this.state.password}
                    placeholder="choose password"
                    validator={validatePassword}
                />
                <ValidatedInputField
                    label="Confirm password"
                    name="password2"
                    type={INPUT_TYPES.PASSWORD}
                    onInputChange={(passwordConfirm) => this.setState({passwordConfirm})}
                    onValidationResultChange={(success) => this.setState({passwordConfirmValidation: success})}
                    value={this.state.passwordConfirm}
                    placeholder="re-enter password"
                    validator={validatePasswordConfirm(this.state.password)}
                />
                <Button
                    onClick={this.onClickHandler}
                    disabled={!this.validationSuccess}
                >
                    Register
                </Button>
                <br/>
                <br/>
                Already have an account?&nbsp;
                <Link onClick={this.props.onLoginClick}>
                    login
                </Link>
            </div>
        )
    }
}