import React from 'react';
import './UserForms.css';
import {Button} from "../../components/base/Button";


export default class ResetPasswordDoneScreen extends React.Component {
    /**
     * propTypes
     */
    static get propTypes() {
        return {};
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
                    <h3>Password has been changed!</h3>
                    <Button onClick={this.handleLoginClick}>
                        Login
                    </Button>
                </div>
            </div>
        );
    }
}