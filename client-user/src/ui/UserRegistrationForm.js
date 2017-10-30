import React from 'react';
import PropTypes from 'prop-types';
import LabelledInputBox from "./base/LabelledInputBox";
import './UserRegistrationForm.css';

export default class UserRegistrationForm extends React.Component {
    /**
     * propTypes
     */
    static get propTypes() {
        return {

        };
    }


    static get defaultProps(){
        return {

        };
    }

    name = "";
    email = "";
    password = "";
    password2 = "";

    constructor(props) {
        super(props);

        this.state = {
            nameChild: <br/>,
            emailChild: <br/>,
            passwordChild: <br/>
        }
    }

    /*
     * handler for the submit button
     * @param event click event
     */
    onClickHandler = (event) => {
        let success = true;

        if(!this.verifyName())
            success = false;

        if(!this.verifyEmail())
            success = false;

        if(!this.verifyPassword())
            success = false;

        // TODO success
    };

    /**
     * verifies this.name and sets an error message if invalid
     * @returns {boolean} true if the username was correct
     */
    verifyName = () => {
        if(this.name.length === 0){
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
        if(this.email.length === 0){
            this.onEmailError("this field is required");
            return false;
        }

        this.onEmailError("");
        return true;
    };

    /**
     * sets the red error text below the email box
     * @param message message that will appear (may be "")
     */
    onEmailError = (message) => {
        this.setState({
            emailChild: <div className="ErrorText">{message}</div>
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
        if(this.password.length === 0)
        {
            this.onPasswordError("this field is required");
            return false;
        }

        if(this.password2.length === 0)
        {
            this.onPasswordError("please reenter the password below");
            return false;
        }

        if(this.password2 !== this.password) {
            this.onPasswordError("passwords don't match");
            return false;
        }

        this.onPasswordError("");
        return true;
    };

    /**
     * sets a red error text below the password box
     * @param message
     */
    onPasswordError = (message) => {
        this.setState({
            passwordChild: <div className="ErrorText">{message}</div>
        });
    };

    render(){
        return (
            <div className="UserRegistrationForm">
                <LabelledInputBox
                    label="Username"
                    name="name"
                    onChange={(value) => this.name = value}
                    child={this.state.nameChild}
                />
                <LabelledInputBox
                    label="Email"
                    name="email"
                    onChange={(value) => this.email = value}
                    child={this.state.emailChild}
                />
                <LabelledInputBox
                    label="Password"
                    name="password"
                    type="password"
                    onChange={(value) => this.password = value}
                    child={this.state.passwordChild}
                />
                <LabelledInputBox
                    label="Confirm Password"
                    name="password2"
                    type="password"
                    onChange={(value) => this.password2 = value}
                />
                <br/>
                <input
                    type="submit"
                    value="Submit"
                    onClick={this.onClickHandler}
                />
            </div>
        )
    }
}