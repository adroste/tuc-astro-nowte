import React from 'react';
import PropTypes from 'prop-types';
import './LinkedText.css';

/**
 * text that looks like a link and can be clicked
 */
export default class LinkedText extends React.Component {
    /**
     * propTypes
     * @property {string} label text on the button
     * @property {function()} onClick callback when button was clicked
     */
    static get propTypes() {
        return {
            label: PropTypes.string.isRequired,
            onClick: PropTypes.func.isRequired,
        };
    }

    static get defaultProps() {
        return {};
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
            <span onClick={this.onClickHandler} onKeyPress={this.handleKeyPress} className="linked-text" tabIndex="0">
                {this.props.label}
            </span>
        );
    }
}