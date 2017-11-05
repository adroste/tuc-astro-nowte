import React from 'react';
import PropTypes from 'prop-types';
import LabelledInputBox from "../ui/base/LabelledInputBox";
import Button from "../ui/base/Button";
import './UserForms.css';
import LinkedText from "../ui/base/LinkedText";
import {store} from "../Redux";
import * as action from "../Actions"
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

    handleLoginClick = () => {
        store.dispatch(action.stateChange("login"));
    };

    handleResetClick = () => {
        // TODO
    };

    render() {
        return (
            <div className="centered-form">
                <div className="centered-form-inner">
                    <LabelledInputBox
                        label="Email"
                        name="email"
                        onClick={this.handleResetClick}
                    />
                    <br/>
                    <Button label="Reset Password"/>
                    <br/>
                    <br/>
                    Remembered? <LinkedText label="Log in" onClick={this.handleLoginClick}/>
                </div>
            </div>
        );
    }
}