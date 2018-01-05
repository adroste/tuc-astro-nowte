import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

export default class Button extends React.Component {
    /**
     * propTypes
     * @property {string} label text on the button
     * @property {function()} onClick callback when button was clicked
     */
    static get propTypes() {
        return {
            label: PropTypes.string.isRequired,
            onClick: PropTypes.func.isRequired
        };
    }

    static get defaultProps() {
        return {

        };
    }

    onClickHandler = (e) => {
        this.props.onClick();
        e.preventDefault();
    };

    handleKeyPress = (e) => {
        if(e.key === "Enter" || e.key === " "){
            this.onClickHandler(e);
        }
    };

    render() {
        return (
            <div className="button" onClick={this.onClickHandler} onKeyPress={this.handleKeyPress} tabIndex="0">
                {this.props.label}
            </div>
        );
    }
}