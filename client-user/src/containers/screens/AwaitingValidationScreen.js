import React from 'react';
import './UserForms.css';
import {Link} from "../../components/base/Link";


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
                    <Link onClick={this.handleLoginClick}>
                        login
                    </Link>
                </div>
            </div>
        );
    }
}