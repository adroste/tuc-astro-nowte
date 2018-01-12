import React from 'react';
import PropTypes from 'prop-types';
import './UserForms.css';
import Button from "../../components/base/Button";
import {SERVER_URL} from "../../Globals";

export default class EmailValidationDoneScreen extends React.Component {
    /**
     * propTypes
     */
    static get propTypes() {
        return {};
    }


    static get defaultProps() {
        return {};
    }


    constructor(props) {
        super(props);

        this.state = {
            text: "Awaiting validation..."
        }
    }


    componentWillMount() {
        // try to validate email via provided token
        const emailValidationToken = this.props.match.params.emailValidationToken;
        const url = SERVER_URL + '/api/user/validate-email';
        fetch(url, {
            method: "POST",
            headers: new Headers({
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                emailValidationToken: emailValidationToken
            })
        }).then(
            this.handleServerResponse,
            this.handleError
        );
    }


    handleServerResponse = (response) => {
        if(response.status === 204){
            this.setState({
                text: "Email has been validated successfully!"
            });
        }
        else{
            response.json().then(
                (data) => this.handleUnsuccessfulFetch(response.status, data),
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
    handleUnsuccessfulFetch = (code, data) => {
        if (code === 404 && data.error.message.indexOf('user not found') !== -1) {
            this.setState({
                text: "Invalid validation link"
            });
        }
        else if (code === 409 && data.error.message.indexOf('user already validated') !== -1) {
            this.setState({
                text: "Email already validated!"
            });
        }
        else {
            // extract error string
            const errmsg = "Error (" + code + "): " + data.error.message;
            // TODO do appropriate error display
            alert(errmsg);
        }
    };


    handleLoginClick = () => {
        this.props.history.push("/");
    };


    render() {
        const text = this.state.text;

        return (
            <div className="centered-form">
                <div className="centered-form-inner">
                    <h3>{text}</h3>
                    <Button label="Login" onClick={this.handleLoginClick}/>
                </div>
            </div>
        );
    }
}