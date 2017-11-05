import React from 'react';
import PropTypes from 'prop-types';
import './UserForms.css';
import LinkedText from "../ui/base/LinkedText";
import {store} from "../Redux";
import * as action from "../Actions"

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
        store.dispatch(action.stateChange("login"));
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