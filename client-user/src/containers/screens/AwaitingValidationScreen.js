import React from 'react';
import './UserForms.css';
import LinkedText from "../../components/base/LinkedText";


export default class AwaitingValidationScreen extends React.Component {
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

    handleLoginClick = () => {
        this.props.history.push("/");
    };

    render() {
        return (
            <div className="centered-form">
                <div className="centered-form-inner">
                    <h3>Please check your mailbox and confirm your email</h3>
                    <LinkedText label="Log in" onClick={this.handleLoginClick}/>
                </div>
            </div>
        );
    }
}