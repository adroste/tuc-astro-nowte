import React from 'react';
import PropTypes from 'prop-types';
import LabelledInputBox from "../base/LabelledInputBox";
import './UserRegistrationForm.css';
import {Button} from "../base/Button";
import LinkedText from "../base/LinkedText";
import { SERVER_URL } from "../../Globals";
import * as utility from "../../utilities/login"

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


    constructor(props) {
        super(props);

        this.state = {
            name: '',
            email: '',
            password: '',
            passwordConfirm: '',
            nameChild: <br/>,
            emailChild: <br/>,
            passwordChild: <br/>
        }
    }


    /*
     * handler for the submit button
     */
    onClickHandler = () => {
        let success = true;

        // verify parameters (+ display message when invalid)
        if(!this.verifyName())
            success = false;

        if(!this.verifyEmail())
            success = false;

        if(!this.verifyPassword())
            success = false;

        if(!success)
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

    /**
     * verifies this.name and sets an error message if invalid
     * @returns {boolean} true if the username was correct
     */
    verifyName = () => {
        if(this.state.name.length === 0){
            this.onNameError("this field is required");
            return false;
        }

        // name is correct
        this.onNameError("");
        return true;
    };

    /**
     * verifies this.email and sets an error message if invalid
     * @returns {boolean} true if the email was correct
     */
    verifyEmail = () => {
        const res = utility.verifyEmailField(this.state.email);
        this.onEmailError(res);
        return res === "";
    };

    /**
     * sets the red error text below the email box
     * @param message message that will appear (may be "")
     */
    onEmailError = (message) => {
        this.setState({
            emailChild: <div className="ErrorText">{message}<br/></div>
        });
    };

    /**
     * sets the red error text below the username box
     * @param message message that will appear (may be "")
     */
    onNameError = (message) => {
        this.setState({
            nameChild: <div className="ErrorText">{message}<br/></div>
        });
    };

    /**
     * verifies this.password and this.password2 and sets an error message if invalid
     * @returns {boolean} true if password is correct
     */
    verifyPassword = () => {
        const res = utility.verifyPasswordFields(this.state.password, this.state.passwordConfirm);
        this.onPasswordError(res);
        return res === "";
    };

    /**
     * sets a red error text below the password box
     * @param message
     */
    onPasswordError = (message) => {
        this.setState({
            passwordChild: <div className="ErrorText">{message}<br/></div>
        });
    };

    handleKeyPress = (e) => {
        if(e.key === "Enter"){
            this.onClickHandler();
        }
    };

    render(){
        return (
            <div className="UserRegistrationForm" onKeyPress={this.handleKeyPress}>
                <LabelledInputBox
                    label="Name"
                    name="name"
                    onChange={(name) => this.setState({name})}
                    child={this.state.nameChild}
                    value={this.state.name}
                />
                <LabelledInputBox
                    label="Email"
                    name="email"
                    onChange={(email) => this.setState({email})}
                    child={this.state.emailChild}
                    value={this.state.email}
                />
                <LabelledInputBox
                    label="Password"
                    name="password"
                    type="password"
                    onChange={(password) => this.setState({password})}
                    child={this.state.passwordChild}
                    value={this.state.password}
                />
                <LabelledInputBox
                    label="Confirm Password"
                    name="password2"
                    type="password"
                    onChange={(passwordConfirm) => this.setState({passwordConfirm})}
                    value={this.state.passwordConfirm}
                />
                <br/>
                <Button onClick={this.onClickHandler}>
                    Submit
                </Button>
                <br/>
                <br/>
                Already have an account?
                <LinkedText
                    label="Log in"
                    onClick={this.props.onLoginClick}
                />
            </div>
        )
    }
}